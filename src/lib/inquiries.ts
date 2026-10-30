// 문의 저장소 (Neon Postgres). 별도 마이그레이션 없이 처음 사용할 때 표를 자동으로 만듭니다.
import { neon } from "@neondatabase/serverless";

export type Inquiry = {
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
};

export function dbConfigured() {
  return Boolean(process.env.DATABASE_URL);
}

function client() {
  return neon(process.env.DATABASE_URL as string);
}

let ready: Promise<void> | null = null;

function ensureTable() {
  if (!ready) {
    const sql = client();
    ready = sql`
      CREATE TABLE IF NOT EXISTS inquiries (
        id BIGSERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        phone TEXT,
        company TEXT,
        service TEXT,
        assignee TEXT,
        message TEXT NOT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        is_read BOOLEAN NOT NULL DEFAULT false
      )
    `.then(() => undefined);
    ready.catch(() => {
      ready = null; // 실패하면 다음 요청에서 다시 시도
    });
  }
  return ready;
}

export async function saveInquiry(d: {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  service?: string;
  assignee?: string;
  message: string;
}) {
  await ensureTable();
  const sql = client();
  await sql`
    INSERT INTO inquiries (name, email, phone, company, service, assignee, message)
    VALUES (${d.name}, ${d.email}, ${d.phone || null}, ${d.company || null}, ${d.service || null}, ${d.assignee || null}, ${d.message})
  `;
}

export async function listInquiries(): Promise<Inquiry[]> {
  await ensureTable();
  const sql = client();
  const rows = await sql`
    SELECT id::text AS id, name, email, phone, company, service, assignee, message,
           created_at, is_read
    FROM inquiries
    ORDER BY created_at DESC
    LIMIT 500
  `;
  return rows.map((r) => ({
    id: r.id as string,
    name: r.name as string,
    email: r.email as string,
    phone: (r.phone as string | null) ?? undefined,
    company: (r.company as string | null) ?? undefined,
    service: (r.service as string | null) ?? undefined,
    assignee: (r.assignee as string | null) ?? undefined,
    message: r.message as string,
    createdAt: new Date(r.created_at as string).toISOString(),
    isRead: r.is_read as boolean,
  }));
}

export async function markRead(id: string) {
  await ensureTable();
  const sql = client();
  await sql`UPDATE inquiries SET is_read = true WHERE id = ${id}::bigint`;
}
