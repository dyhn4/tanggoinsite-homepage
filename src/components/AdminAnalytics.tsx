"use client";

import { useCallback, useEffect, useState } from "react";
import { Users, Activity, Eye, Clock, Radio, RefreshCw } from "lucide-react";

type Data = {
  configured: boolean;
  days?: number;
  error?: string;
  summary?: { users: number; sessions: number; pageViews: number; avgDuration: number };
  today?: { users: number; pageViews: number };
  realtimeUsers?: number;
  daily?: { date: string; users: number; pageViews: number }[];
  pages?: { path: string; views: number; users: number }[];
  channels?: { name: string; sessions: number }[];
  devices?: { name: string; users: number }[];
  countries?: { name: string; users: number }[];
};

const nf = (n: number) => Math.round(n).toLocaleString("ko-KR");
const dur = (sec: number) => {
  const s = Math.round(sec);
  return s >= 60 ? `${Math.floor(s / 60)}분 ${s % 60}초` : `${s}초`;
};
const fmtDate = (d: string) => `${Number(d.slice(4, 6))}/${Number(d.slice(6, 8))}`;

const CHANNEL_KO: Record<string, string> = {
  "Organic Search": "검색 (자연 유입)",
  Direct: "직접 입력·북마크",
  Referral: "다른 사이트",
  "Organic Social": "SNS",
  "Paid Search": "유료 검색 광고",
  Email: "이메일",
  Unassigned: "분류 안 됨",
  "Cross-network": "교차 네트워크",
  Display: "디스플레이 광고",
};
const DEVICE_KO: Record<string, string> = { desktop: "PC", mobile: "모바일", tablet: "태블릿" };

function Card({ icon: Icon, label, value, sub }: { icon: typeof Users; label: string; value: string; sub?: string }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-4">
      <div className="flex items-center gap-2 text-slate-400 text-xs mb-2">
        <Icon size={14} />
        {label}
      </div>
      <div className="text-2xl font-black text-slate-900 tabular-nums">{value}</div>
      {sub && <div className="text-xs text-slate-400 mt-1">{sub}</div>}
    </div>
  );
}

function BarList({ title, rows, unit }: { title: string; rows: { name: string; value: number }[]; unit: string }) {
  const max = Math.max(1, ...rows.map((r) => r.value));
  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-5">
      <h3 className="font-bold text-slate-900 text-sm mb-3">{title}</h3>
      {rows.length === 0 ? (
        <p className="text-slate-400 text-sm">데이터가 없습니다.</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {rows.map((r) => (
            <li key={r.name}>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-600 truncate pr-2">{r.name}</span>
                <span className="text-slate-900 font-semibold tabular-nums">{nf(r.value)}{unit}</span>
              </div>
              <div className="h-1.5 rounded-full bg-slate-100">
                <div className="h-1.5 rounded-full bg-gradient-to-r from-blue-700 to-sky-500" style={{ width: `${(r.value / max) * 100}%` }} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function AdminAnalytics({ password }: { password: string }) {
  const [range, setRange] = useState("30");
  const [data, setData] = useState<Data | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/admin/analytics?range=${range}`, { headers: { "x-admin-password": encodeURIComponent(password) }, cache: "no-store" });
      const json = (await res.json()) as Data;
      if (!res.ok) {
        setError(json.error ?? "방문자 통계를 불러오지 못했습니다.");
        setData(null);
      } else {
        setData(json);
      }
    } catch {
      setError("방문자 통계를 불러오지 못했습니다.");
    } finally {
      setLoading(false);
    }
  }, [range, password]);

  useEffect(() => {
    load();
  }, [load]);

  const maxDaily = Math.max(1, ...(data?.daily ?? []).map((d) => d.users));

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <div className="flex gap-1.5">
          {[
            ["7", "최근 7일"],
            ["30", "최근 30일"],
            ["90", "최근 90일"],
          ].map(([v, label]) => (
            <button
              key={v}
              onClick={() => setRange(v)}
              className={`px-3.5 py-1.5 rounded-full text-sm font-semibold border transition-colors ${
                range === v ? "bg-blue-700 border-blue-700 text-white" : "bg-white border-slate-200 text-slate-600 hover:border-blue-300"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        <button onClick={load} disabled={loading} className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-blue-700 disabled:opacity-50">
          <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
          새로고침
        </button>
      </div>

      {error && <div className="bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl p-4 mb-5 leading-relaxed">{error}</div>}

      {data && !data.configured && (
        <div className="bg-amber-50 border border-amber-100 text-amber-800 text-sm rounded-xl p-5 leading-relaxed">
          아직 구글 애널리틱스가 연결되지 않았습니다. Vercel 환경변수에 <b>GA_PROPERTY_ID</b>, <b>GA_CLIENT_EMAIL</b>, <b>GA_PRIVATE_KEY</b>를 넣고 다시 배포하면 이곳에 방문자 통계가 표시됩니다.
        </div>
      )}

      {data?.configured && data.summary && (
        <div className="flex flex-col gap-5">
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
            <Card icon={Radio} label="지금 접속 중 (30분)" value={nf(data.realtimeUsers ?? 0)} sub="실시간" />
            <Card icon={Users} label="오늘 방문자" value={nf(data.today?.users ?? 0)} sub={`오늘 페이지뷰 ${nf(data.today?.pageViews ?? 0)}`} />
            <Card icon={Users} label={`최근 ${data.days}일 방문자`} value={nf(data.summary.users)} sub={`방문 ${nf(data.summary.sessions)}회`} />
            <Card icon={Eye} label="페이지뷰" value={nf(data.summary.pageViews)} />
            <Card icon={Clock} label="평균 체류 시간" value={dur(data.summary.avgDuration)} />
          </div>

          <div className="bg-white rounded-2xl border border-slate-100 p-5">
            <div className="flex items-center gap-2 mb-4">
              <Activity size={16} className="text-slate-400" />
              <h3 className="font-bold text-slate-900 text-sm">일별 방문자</h3>
            </div>
            <div className="flex items-end gap-[3px] h-40">
              {(data.daily ?? []).map((d) => (
                <div key={d.date} className="flex-1 min-w-[2px] flex flex-col justify-end h-full group relative">
                  <div
                    className="w-full rounded-t bg-gradient-to-t from-blue-700 to-sky-400 group-hover:from-blue-800 group-hover:to-sky-500 transition-colors"
                    style={{ height: `${Math.max(2, (d.users / maxDaily) * 100)}%` }}
                    title={`${fmtDate(d.date)} · 방문자 ${nf(d.users)} · 페이지뷰 ${nf(d.pageViews)}`}
                  />
                </div>
              ))}
            </div>
            <div className="flex justify-between text-[11px] text-slate-400 mt-2">
              <span>{data.daily?.[0] ? fmtDate(data.daily[0].date) : ""}</span>
              <span>{data.daily?.length ? fmtDate(data.daily[data.daily.length - 1].date) : ""}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <div className="bg-white rounded-2xl border border-slate-100 p-5">
              <h3 className="font-bold text-slate-900 text-sm mb-3">인기 페이지</h3>
              {(data.pages ?? []).length === 0 ? (
                <p className="text-slate-400 text-sm">데이터가 없습니다.</p>
              ) : (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-xs text-slate-400 text-left">
                      <th className="font-medium pb-2">페이지</th>
                      <th className="font-medium pb-2 text-right">조회</th>
                      <th className="font-medium pb-2 text-right">방문자</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.pages!.map((p) => (
                      <tr key={p.path} className="border-t border-slate-50">
                        <td className="py-2 pr-2 text-slate-700 truncate max-w-[220px]">{p.path}</td>
                        <td className="py-2 text-right tabular-nums font-semibold text-slate-900">{nf(p.views)}</td>
                        <td className="py-2 text-right tabular-nums text-slate-500">{nf(p.users)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            <BarList title="어디서 들어왔나요 (유입 경로)" unit="회" rows={(data.channels ?? []).map((c) => ({ name: CHANNEL_KO[c.name] ?? c.name, value: c.sessions }))} />
            <BarList title="접속 기기" unit="명" rows={(data.devices ?? []).map((d) => ({ name: DEVICE_KO[d.name] ?? d.name, value: d.users }))} />
            <BarList title="접속 국가" unit="명" rows={(data.countries ?? []).map((c) => ({ name: c.name, value: c.users }))} />
          </div>

          <p className="text-xs text-slate-400">※ 구글 애널리틱스(GA4) 기준 수치입니다. 최신 데이터는 반영까지 몇 시간 걸릴 수 있습니다.</p>
        </div>
      )}

      {loading && !data && !error && <div className="text-center text-slate-400 text-sm py-16">불러오는 중...</div>}
    </div>
  );
}
