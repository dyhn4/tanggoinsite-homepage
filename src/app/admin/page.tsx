"use client";

import { useState, useCallback } from "react";
import AdminAnalytics from "@/components/AdminAnalytics";
import { Mail, Building2, Phone, Tag } from "lucide-react";

interface Contact {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  service?: string;
  assignee?: string;
  message: string;
  createdAt: string;
  isRead: boolean;
}

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [authed, setAuthed] = useState(false);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<Contact | null>(null);

  const [tab, setTab] = useState<"visitors" | "contacts">("visitors");
  const [contactsError, setContactsError] = useState("");

  const fetchContacts = useCallback(async (pw: string) => {
    setContactsError("");
    try {
      const res = await fetch("/api/contact", { headers: { "x-admin-password": encodeURIComponent(pw) } });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        setContactsError(`${j.error ?? "문의 목록을 불러올 수 없습니다."} 문의는 접수 이메일로도 확인할 수 있습니다.`);
        return;
      }
      setContacts(await res.json());
    } catch {
      setContactsError("문의 목록을 불러올 수 없습니다. 문의는 접수 이메일로 확인해 주세요.");
    }
  }, []);

  const selectContact = (c: Contact) => {
    setSelected(c);
    if (!c.isRead) {
      setContacts((prev) => prev.map((x) => (x.id === c.id ? { ...x, isRead: true } : x)));
      fetch("/api/contact", {
        method: "PATCH",
        headers: { "x-admin-password": encodeURIComponent(password), "Content-Type": "application/json" },
        body: JSON.stringify({ id: c.id }),
      }).catch(() => {});
    }
  };

  const login = useCallback(
    async (pw: string) => {
      setLoading(true);
      setError("");
      try {
        const res = await fetch("/api/admin/verify", { headers: { "x-admin-password": encodeURIComponent(pw) } });
        if (res.status === 401) {
          setError("비밀번호가 올바르지 않습니다.");
          return;
        }
        if (!res.ok) {
          const j = await res.json().catch(() => ({}));
          setError(j.error ?? "로그인에 실패했습니다.");
          return;
        }
        setAuthed(true);
        fetchContacts(pw);
      } catch {
        setError("서버에 연결하지 못했습니다.");
      } finally {
        setLoading(false);
      }
    },
    [fetchContacts]
  );

  if (!authed) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 w-full max-w-sm">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-700 to-sky-500 flex items-center justify-center">
              <span className="text-white font-bold text-sm">T</span>
            </div>
            <span className="font-bold text-slate-900">관리자 페이지</span>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                관리자 비밀번호
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && login(password)}
                placeholder="비밀번호를 입력하세요"
                className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition text-sm"
              />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button
              onClick={() => login(password)}
              disabled={loading || !password}
              className="w-full py-2.5 rounded-lg bg-blue-700 hover:bg-blue-800 text-white font-medium transition-colors disabled:opacity-60"
            >
              {loading ? "로그인 중..." : "로그인"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-100 px-4 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-700 to-sky-500 flex items-center justify-center">
              <span className="text-white font-bold text-xs">T</span>
            </div>
            <span className="font-bold text-slate-900 text-sm">
              탱고인사이트 — 관리자
            </span>
          </div>
          <div className="flex gap-1">
            {([
              ["visitors", "방문자"],
              ["contacts", `문의 (${contacts.length}${contacts.some((c) => !c.isRead) ? ` · 새 글 ${contacts.filter((c) => !c.isRead).length}` : ""})`],
            ] as const).map(([k, label]) => (
              <button
                key={k}
                onClick={() => setTab(k)}
                className={`px-3.5 py-1.5 rounded-lg text-sm font-semibold transition-colors ${
                  tab === k ? "bg-blue-50 text-blue-700" : "text-slate-500 hover:text-slate-800"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {tab === "visitors" && <AdminAnalytics password={password} />}

        {tab === "contacts" && contactsError && (
          <div className="bg-amber-50 border border-amber-100 text-amber-800 text-sm rounded-xl p-4 mb-5">{contactsError}</div>
        )}

        {tab === "contacts" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 목록 */}
          <div className="lg:col-span-1 space-y-3">
            {contacts.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-100 p-8 text-center text-slate-500 text-sm">
                접수된 문의가 없습니다.
              </div>
            ) : (
              contacts.map((c) => (
                <button
                  key={c.id}
                  onClick={() => selectContact(c)}
                  className={`w-full text-left p-4 rounded-xl border transition-all ${
                    selected?.id === c.id
                      ? "bg-blue-50 border-blue-200"
                      : "bg-white border-slate-100 hover:border-slate-200"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <span className="font-medium text-slate-900 text-sm">{c.name}</span>
                    {!c.isRead && (
                      <span className="flex-shrink-0 w-2 h-2 rounded-full bg-blue-500 mt-1.5" />
                    )}
                  </div>
                  <div className="text-slate-500 text-xs mb-1">{c.email}</div>
                  {c.company && (
                    <div className="text-slate-400 text-xs">{c.company}</div>
                  )}
                  <div className="text-slate-400 text-xs mt-2">
                    {new Date(c.createdAt).toLocaleDateString("ko-KR")}
                  </div>
                </button>
              ))
            )}
          </div>

          {/* 상세 */}
          <div className="lg:col-span-2">
            {selected ? (
              <div className="bg-white rounded-2xl border border-slate-100 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-bold text-slate-900 text-lg">{selected.name}</h2>
                  <span className="text-slate-400 text-xs">
                    {new Date(selected.createdAt).toLocaleString("ko-KR")}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  {[
                    { icon: Mail, label: "이메일", value: selected.email },
                    { icon: Phone, label: "연락처", value: selected.phone || "—" },
                    { icon: Building2, label: "회사명", value: selected.company || "—" },
                    { icon: Tag, label: "관심 서비스", value: selected.service || "—" },
                    { icon: Mail, label: "담당자 요청", value: selected.assignee || "—" },
                  ].map((item) => (
                    <div key={item.label} className="flex items-start gap-3">
                      <item.icon size={16} className="text-slate-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <div className="text-xs text-slate-400 mb-0.5">{item.label}</div>
                        <div className="text-sm text-slate-900">{item.value}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="bg-slate-50 rounded-xl p-4">
                  <div className="text-xs text-slate-500 mb-2">문의 내용</div>
                  <p className="text-slate-900 text-sm leading-relaxed whitespace-pre-wrap">
                    {selected.message}
                  </p>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-slate-100 p-8 text-center text-slate-500 text-sm flex flex-col items-center justify-center h-64">
                <Mail size={32} className="text-slate-300 mb-3" />
                왼쪽에서 문의를 선택하면 상세 내용을 확인할 수 있습니다.
              </div>
            )}
          </div>
        </div>
        )}
      </div>
    </div>
  );
}
