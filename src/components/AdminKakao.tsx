"use client";

import { useCallback, useEffect, useState } from "react";
import { MessageCircle, Trash2, Send, Plus } from "lucide-react";

type Person = { id: string; nickname: string; needsReauth: boolean; refreshExpiresAt: string };
type Status = { configured: boolean; redirectUri?: string; people?: Person[]; connectUrl?: string; error?: string };

export default function AdminKakao({ password }: { password: string }) {
  const [data, setData] = useState<Status | null>(null);
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);

  const headers = { "x-admin-password": encodeURIComponent(password) };

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/kakao", { headers: { "x-admin-password": encodeURIComponent(password) }, cache: "no-store" });
      setData((await res.json()) as Status);
    } catch {
      setMsg("연결 정보를 불러오지 못했습니다.");
    }
  }, [password]);

  useEffect(() => {
    load();
    const q = new URLSearchParams(window.location.search);
    if (q.get("kakao") === "ok") setMsg(`연결되었습니다${q.get("msg") ? ` (${q.get("msg")})` : ""}. 아래 "테스트 알림 보내기"로 확인해 보세요.`);
    if (q.get("kakao") === "error") setMsg(`연결에 실패했습니다: ${q.get("msg") ?? ""}`);
  }, [load]);

  const test = async () => {
    setBusy(true);
    setMsg("");
    try {
      const res = await fetch("/api/kakao", { method: "POST", headers });
      const j = await res.json();
      setMsg(
        res.ok
          ? j.sent > 0
            ? `${j.sent}명에게 테스트 알림을 보냈습니다. 카카오톡 "나와의 채팅"을 확인해 보세요.`
            : "보낼 수 있는 연결이 없습니다. 먼저 카카오톡을 연결해 주세요."
          : j.error
      );
    } catch {
      setMsg("테스트 알림을 보내지 못했습니다.");
    } finally {
      setBusy(false);
    }
  };

  const remove = async (id: string) => {
    if (!confirm("이 사람의 카카오톡 연결을 해제할까요?")) return;
    await fetch("/api/kakao", { method: "DELETE", headers: { ...headers, "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
    load();
  };

  return (
    <div className="max-w-2xl">
      <div className="bg-white rounded-2xl border border-slate-100 p-6">
        <div className="flex items-center gap-2 mb-1">
          <MessageCircle size={18} className="text-yellow-500" />
          <h2 className="font-bold text-slate-900">카카오톡 알림</h2>
        </div>
        <p className="text-sm text-slate-500 mb-5 leading-relaxed">
          문의나 서비스 신청이 들어오면, 연결한 사람의 카카오톡 &quot;나와의 채팅&quot;으로 알림이 갑니다. 알림을 받을 사람이 각자 한 번씩 연결하면 됩니다.
        </p>

        {msg && <div className="mb-4 rounded-xl bg-slate-50 border border-slate-100 text-sm text-slate-700 p-3 leading-relaxed">{msg}</div>}

        {data && !data.configured && (
          <div className="rounded-xl bg-amber-50 border border-amber-100 text-amber-800 text-sm p-4 leading-relaxed">
            아직 카카오 설정이 되어 있지 않습니다. Vercel 환경변수에 <b>KAKAO_REST_API_KEY</b>를 넣고 다시 배포해 주세요.
            {data.redirectUri && (
              <div className="mt-2 text-xs">
                카카오 개발자 설정에 등록할 Redirect URI: <code className="bg-white px-1.5 py-0.5 rounded">{data.redirectUri}</code>
              </div>
            )}
          </div>
        )}

        {data?.configured && (
          <>
            <ul className="flex flex-col gap-2 mb-5">
              {(data.people ?? []).length === 0 && <li className="text-sm text-slate-400">아직 연결된 사람이 없습니다.</li>}
              {(data.people ?? []).map((p) => (
                <li key={p.id} className="flex items-center justify-between gap-3 rounded-xl border border-slate-100 px-4 py-3">
                  <div>
                    <div className="text-sm font-semibold text-slate-900">{p.nickname}</div>
                    <div className={`text-xs ${p.needsReauth ? "text-red-500" : "text-slate-400"}`}>
                      {p.needsReauth ? "다시 연결이 필요합니다" : "연결됨"}
                    </div>
                  </div>
                  <button onClick={() => remove(p.id)} className="text-slate-400 hover:text-red-500" aria-label="연결 해제">
                    <Trash2 size={16} />
                  </button>
                </li>
              ))}
            </ul>

            <div className="flex flex-wrap gap-2">
              <a href={data.connectUrl} className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#FEE500] text-slate-900 text-sm font-semibold hover:brightness-95">
                <Plus size={15} />
                내 카카오톡 연결하기
              </a>
              <button onClick={test} disabled={busy} className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-slate-200 text-sm font-semibold text-slate-700 hover:border-blue-300 disabled:opacity-50">
                <Send size={15} />
                테스트 알림 보내기
              </button>
            </div>
            <p className="text-xs text-slate-400 mt-3 leading-relaxed">
              &quot;내 카카오톡 연결하기&quot;는 지금 로그인한 카카오 계정이 연결됩니다. 다른 사람은 본인 컴퓨터에서 이 페이지에 들어와 직접 눌러야 합니다.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
