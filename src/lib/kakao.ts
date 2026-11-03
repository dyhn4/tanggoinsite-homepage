// 카카오톡 "나에게 보내기" 알림 (서버 전용)
// 받을 사람이 /admin 에서 한 번 카카오 로그인으로 연결해 두면, 문의가 들어올 때마다 그 사람의 "나와의 채팅"으로 알림을 보냅니다.
import { createHmac, timingSafeEqual } from "crypto";
import { neon } from "@neondatabase/serverless";

const AUTH_URL = "https://kauth.kakao.com/oauth/authorize";
const TOKEN_URL = "https://kauth.kakao.com/oauth/token";
const API = "https://kapi.kakao.com";

export const SITE_URL = (process.env.SITE_URL || "https://www.tangoinsight.co.kr").replace(/\/$/, "");
export const REDIRECT_URI = process.env.KAKAO_REDIRECT_URI || `${SITE_URL}/api/kakao/callback`;

export function kakaoConfigured() {
  return Boolean(process.env.KAKAO_REST_API_KEY && process.env.DATABASE_URL);
}

const sql = () => neon(process.env.DATABASE_URL as string);

let ready: Promise<void> | null = null;
function ensureTable() {
  if (!ready) {
    ready = sql()`
      CREATE TABLE IF NOT EXISTS kakao_tokens (
        kakao_id TEXT PRIMARY KEY,
        nickname TEXT,
        access_token TEXT NOT NULL,
        access_expires_at TIMESTAMPTZ NOT NULL,
        refresh_token TEXT NOT NULL,
        refresh_expires_at TIMESTAMPTZ NOT NULL,
        needs_reauth BOOLEAN NOT NULL DEFAULT false,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now()
      )
    `.then(() => undefined);
    ready.catch(() => {
      ready = null;
    });
  }
  return ready;
}

/* ── 연결 시작 주소 / 보안 state ── */
function stateSecret() {
  return (process.env.ADMIN_PASSWORD || "").trim();
}
function sign(ts: string) {
  return createHmac("sha256", stateSecret()).update(`kakao:${ts}`).digest("hex");
}
export function makeState() {
  const ts = String(Date.now());
  return `${ts}.${sign(ts)}`;
}
export function verifyState(state: string | null) {
  if (!state || !stateSecret()) return false;
  const [ts, sig] = state.split(".");
  if (!ts || !sig) return false;
  if (Date.now() - Number(ts) > 10 * 60 * 1000) return false;
  const a = Buffer.from(sig);
  const b = Buffer.from(sign(ts));
  return a.length === b.length && timingSafeEqual(a, b);
}
export function authorizeUrl() {
  const p = new URLSearchParams({
    client_id: process.env.KAKAO_REST_API_KEY as string,
    redirect_uri: REDIRECT_URI,
    response_type: "code",
    scope: "talk_message",
    state: makeState(),
  });
  return `${AUTH_URL}?${p.toString()}`;
}

/* ── 토큰 ── */
type TokenRes = {
  access_token: string;
  expires_in: number;
  refresh_token?: string;
  refresh_token_expires_in?: number;
  error?: string;
  error_description?: string;
};

async function tokenRequest(params: Record<string, string>): Promise<TokenRes> {
  const body = new URLSearchParams({ client_id: process.env.KAKAO_REST_API_KEY as string, ...params });
  if (process.env.KAKAO_CLIENT_SECRET) body.set("client_secret", process.env.KAKAO_CLIENT_SECRET);
  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded;charset=utf-8" },
    body,
    cache: "no-store",
  });
  return (await res.json()) as TokenRes;
}

const addSec = (s: number) => new Date(Date.now() + s * 1000).toISOString();

// 로그인 후 돌아온 code 를 토큰으로 바꿔 저장
export async function connectWithCode(code: string) {
  await ensureTable();
  const t = await tokenRequest({ grant_type: "authorization_code", redirect_uri: REDIRECT_URI, code });
  if (!t.access_token || !t.refresh_token) {
    throw new Error(`토큰 발급 실패: ${t.error_description || t.error || "알 수 없는 오류"}`);
  }
  const me = await fetch(`${API}/v2/user/me`, { headers: { Authorization: `Bearer ${t.access_token}` }, cache: "no-store" });
  const meJson = (await me.json()) as { id?: number; properties?: { nickname?: string }; kakao_account?: { profile?: { nickname?: string } } };
  if (!meJson.id) throw new Error("카카오 사용자 정보를 가져오지 못했습니다.");
  const kakaoId = String(meJson.id);
  const nickname = meJson.kakao_account?.profile?.nickname || meJson.properties?.nickname || `카카오 사용자 ${kakaoId.slice(-4)}`;
  await sql()`
    INSERT INTO kakao_tokens (kakao_id, nickname, access_token, access_expires_at, refresh_token, refresh_expires_at, needs_reauth)
    VALUES (${kakaoId}, ${nickname}, ${t.access_token}, ${addSec(t.expires_in)}, ${t.refresh_token}, ${addSec(t.refresh_token_expires_in ?? 5183999)}, false)
    ON CONFLICT (kakao_id) DO UPDATE SET
      nickname = EXCLUDED.nickname,
      access_token = EXCLUDED.access_token,
      access_expires_at = EXCLUDED.access_expires_at,
      refresh_token = EXCLUDED.refresh_token,
      refresh_expires_at = EXCLUDED.refresh_expires_at,
      needs_reauth = false
  `;
  return nickname;
}

export type KakaoPerson = { id: string; nickname: string; needsReauth: boolean; refreshExpiresAt: string };

export async function listPeople(): Promise<KakaoPerson[]> {
  await ensureTable();
  const rows = await sql()`SELECT kakao_id, nickname, needs_reauth, refresh_expires_at FROM kakao_tokens ORDER BY created_at`;
  return rows.map((r) => ({
    id: r.kakao_id as string,
    nickname: (r.nickname as string) || "",
    needsReauth: r.needs_reauth as boolean,
    refreshExpiresAt: new Date(r.refresh_expires_at as string).toISOString(),
  }));
}

export async function removePerson(id: string) {
  await ensureTable();
  await sql()`DELETE FROM kakao_tokens WHERE kakao_id = ${id}`;
}

type Row = {
  kakao_id: string;
  access_token: string;
  access_expires_at: string;
  refresh_token: string;
};

// 만료가 가까우면 갱신해서 쓸 수 있는 access token 을 돌려줌
async function freshAccessToken(r: Row): Promise<string | null> {
  if (new Date(r.access_expires_at).getTime() - Date.now() > 5 * 60 * 1000) return r.access_token;
  const t = await tokenRequest({ grant_type: "refresh_token", refresh_token: r.refresh_token });
  if (!t.access_token) {
    await sql()`UPDATE kakao_tokens SET needs_reauth = true WHERE kakao_id = ${r.kakao_id}`;
    return null;
  }
  await sql()`
    UPDATE kakao_tokens SET
      access_token = ${t.access_token},
      access_expires_at = ${addSec(t.expires_in)},
      refresh_token = ${t.refresh_token ?? r.refresh_token},
      refresh_expires_at = COALESCE(${t.refresh_token_expires_in ? addSec(t.refresh_token_expires_in) : null}::timestamptz, refresh_expires_at),
      needs_reauth = false
    WHERE kakao_id = ${r.kakao_id}
  `;
  return t.access_token;
}

async function sendMemo(accessToken: string, text: string, link: string, buttonTitle: string) {
  const template = {
    object_type: "text",
    text: text.slice(0, 190),
    link: { web_url: link, mobile_web_url: link },
    button_title: buttonTitle,
  };
  const res = await fetch(`${API}/v2/api/talk/memo/default/send`, {
    method: "POST",
    headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/x-www-form-urlencoded;charset=utf-8" },
    body: new URLSearchParams({ template_object: JSON.stringify(template) }),
    cache: "no-store",
  });
  return res.ok;
}

// 연결된 모든 사람에게 알림 전송. 성공한 인원수를 돌려줍니다.
export async function notifyAll(text: string, link = `${SITE_URL}/admin`, buttonTitle = "관리자에서 보기") {
  if (!kakaoConfigured()) return 0;
  await ensureTable();
  const rows = (await sql()`SELECT kakao_id, access_token, access_expires_at, refresh_token FROM kakao_tokens WHERE needs_reauth = false`) as unknown as Row[];
  const results = await Promise.all(
    rows.map(async (r) => {
      try {
        const token = await freshAccessToken(r);
        return token ? await sendMemo(token, text, link, buttonTitle) : false;
      } catch (e) {
        console.error("Kakao notify error:", e);
        return false;
      }
    })
  );
  return results.filter(Boolean).length;
}

// 문의 알림 문구 (개인정보는 일부만)
export function inquiryText(d: { name: string; company?: string; service?: string; message: string }) {
  const kind = d.message.trim().startsWith("[") ? "서비스 신청" : "문의";
  const first = d.message.replace(/^\[[^\]]*\]\s*/, "").replace(/\s+/g, " ").trim();
  return [
    `[홈페이지 ${kind}] 새 ${kind}가 도착했습니다`,
    `이름: ${d.name}${d.company ? ` (${d.company})` : ""}`,
    d.service ? `관심: ${d.service}` : null,
    `내용: ${first.slice(0, 70)}${first.length > 70 ? "…" : ""}`,
  ]
    .filter(Boolean)
    .join("\n");
}
