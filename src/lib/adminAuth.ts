import { timingSafeEqual } from "crypto";
import { NextRequest, NextResponse } from "next/server";

// 관리자 API 공통 인증: 요청 헤더 x-admin-password 를 ADMIN_PASSWORD 환경변수와 비교
export function checkAdmin(req: NextRequest): NextResponse | null {
  // 붙여넣을 때 섞여 들어가기 쉬운 앞뒤 공백·줄바꿈·따옴표는 무시
  const expected = process.env.ADMIN_PASSWORD?.trim().replace(/^(["'])(.*)\1$/, "$2");
  if (!expected) {
    return NextResponse.json(
      { error: "서버에 ADMIN_PASSWORD 환경변수가 설정되어 있지 않습니다." },
      { status: 503 }
    );
  }
  let given = req.headers.get("x-admin-password") ?? "";
  try {
    given = decodeURIComponent(given);
  } catch {
    /* 그대로 사용 */
  }
  given = given.trim();
  const a = Buffer.from(given);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  return null;
}
