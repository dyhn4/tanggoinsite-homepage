import { NextRequest, NextResponse } from "next/server";
import { checkAdmin } from "@/lib/adminAuth";

// 관리자 비밀번호 확인용
export async function GET(req: NextRequest) {
  const denied = checkAdmin(req);
  if (denied) return denied;
  return NextResponse.json({ ok: true });
}
