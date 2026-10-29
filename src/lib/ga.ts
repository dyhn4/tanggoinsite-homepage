// Google Analytics 4 Data API 호출 (서버 전용)
// 서비스 계정으로 인증하며, 별도 패키지 없이 Node 내장 crypto 로 JWT 를 서명합니다.
import { createSign } from "crypto";

const SCOPE = "https://www.googleapis.com/auth/analytics.readonly";
const TOKEN_URL = "https://oauth2.googleapis.com/token";

export function gaConfig() {
  const propertyId = process.env.GA_PROPERTY_ID?.trim();
  const email = process.env.GA_CLIENT_EMAIL?.trim();
  const rawKey = process.env.GA_PRIVATE_KEY;
  if (!propertyId || !email || !rawKey) return null;
  return { propertyId, email, privateKey: normalizePrivateKey(rawKey) };
}

// 붙여넣은 방식(실제 줄바꿈, \n 글자, 줄바꿈이 공백으로 바뀐 경우, 따옴표 포함)과 상관없이 올바른 PEM 으로 복원
function normalizePrivateKey(raw: string) {
  const body = raw
    .replace(/-----BEGIN [A-Z ]*PRIVATE KEY-----/, "")
    .replace(/-----END [A-Z ]*PRIVATE KEY-----/, "")
    .replace(/\\n/g, "")
    .replace(/["'\s]/g, "");
  const lines = body.match(/.{1,64}/g) ?? [];
  return `-----BEGIN PRIVATE KEY-----\n${lines.join("\n")}\n-----END PRIVATE KEY-----\n`;
}

const b64u = (v: string | Buffer) => Buffer.from(v).toString("base64url");

let cached: { token: string; exp: number } | null = null;

async function getAccessToken(cfg: NonNullable<ReturnType<typeof gaConfig>>) {
  const now = Math.floor(Date.now() / 1000);
  if (cached && cached.exp - 60 > now) return cached.token;

  const header = b64u(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const claim = b64u(
    JSON.stringify({ iss: cfg.email, scope: SCOPE, aud: TOKEN_URL, iat: now, exp: now + 3600 })
  );
  let signature: string;
  try {
    signature = createSign("RSA-SHA256").update(`${header}.${claim}`).sign(cfg.privateKey).toString("base64url");
  } catch {
    throw new GaError("auth", "GA_PRIVATE_KEY 형식이 올바르지 않습니다. JSON 파일의 private_key 값 전체를 다시 붙여넣어 주세요.");
  }

  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: `${header}.${claim}.${signature}`,
    }),
    cache: "no-store",
  });
  if (!res.ok) {
    throw new GaError("auth", `구글 인증에 실패했습니다 (${res.status}). 서비스 계정 이메일과 키를 확인해 주세요.`);
  }
  const json = (await res.json()) as { access_token: string; expires_in: number };
  cached = { token: json.access_token, exp: now + json.expires_in };
  return json.access_token;
}

export class GaError extends Error {
  constructor(public kind: "auth" | "permission" | "api", message: string) {
    super(message);
  }
}

export type GaRow = { dims: string[]; metrics: number[] };

type RawReport = {
  rows?: { dimensionValues?: { value: string }[]; metricValues?: { value: string }[] }[];
};

async function call(path: string, body: unknown): Promise<GaRow[]> {
  const cfg = gaConfig();
  if (!cfg) throw new GaError("auth", "GA 환경변수가 설정되지 않았습니다.");
  const token = await getAccessToken(cfg);
  const res = await fetch(`https://analyticsdata.googleapis.com/v1beta/properties/${cfg.propertyId}:${path}`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify(body),
    cache: "no-store",
  });
  if (!res.ok) {
    if (res.status === 403) {
      throw new GaError(
        "permission",
        "GA 속성에 접근할 권한이 없습니다. GA 관리 → 속성 액세스 관리에 서비스 계정 이메일이 뷰어로 추가되어 있고, Google Analytics Data API가 사용 설정되어 있는지 확인해 주세요."
      );
    }
    throw new GaError("api", `GA 데이터를 불러오지 못했습니다 (${res.status}).`);
  }
  const json = (await res.json()) as RawReport;
  return (json.rows ?? []).map((r) => ({
    dims: (r.dimensionValues ?? []).map((d) => d.value),
    metrics: (r.metricValues ?? []).map((m) => Number(m.value)),
  }));
}

export type ReportBody = {
  dateRanges?: { startDate: string; endDate: string }[];
  dimensions?: { name: string }[];
  metrics: { name: string }[];
  orderBys?: unknown[];
  limit?: number;
};

export const runReport = (body: ReportBody) => call("runReport", body);
export const runRealtimeReport = (body: Omit<ReportBody, "dateRanges">) => call("runRealtimeReport", body);
