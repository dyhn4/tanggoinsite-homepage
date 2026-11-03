import { NextRequest, NextResponse } from "next/server";
import { SITE_URL, connectWithCode, kakaoConfigured, verifyState } from "@/lib/kakao";

// 카카오 로그인이 끝나면 돌아오는 주소
export async function GET(req: NextRequest) {
  const back = (status: string, detail?: string) => {
    const u = new URL("/admin", SITE_URL);
    u.searchParams.set("kakao", status);
    if (detail) u.searchParams.set("msg", detail.slice(0, 120));
    return NextResponse.redirect(u);
  };

  const p = req.nextUrl.searchParams;
  if (!kakaoConfigured()) return back("error", "카카오 설정이 없습니다.");
  if (p.get("error")) return back("error", p.get("error_description") || p.get("error") || "연결이 취소되었습니다.");
  if (!verifyState(p.get("state"))) return back("error", "연결 요청이 만료되었거나 올바르지 않습니다. 다시 시도해 주세요.");
  const code = p.get("code");
  if (!code) return back("error", "인증 코드가 없습니다.");

  try {
    const nickname = await connectWithCode(code);
    return back("ok", nickname);
  } catch (e) {
    console.error("Kakao callback error:", e);
    return back("error", e instanceof Error ? e.message : "연결에 실패했습니다.");
  }
}
