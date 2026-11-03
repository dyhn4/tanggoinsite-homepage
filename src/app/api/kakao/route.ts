import { NextRequest, NextResponse } from "next/server";
import { checkAdmin } from "@/lib/adminAuth";
import { REDIRECT_URI, authorizeUrl, kakaoConfigured, listPeople, notifyAll, removePerson } from "@/lib/kakao";

// 연결 현황 조회 + 연결 시작 주소
export async function GET(req: NextRequest) {
  const denied = checkAdmin(req);
  if (denied) return denied;
  if (!kakaoConfigured()) {
    return NextResponse.json({ configured: false, redirectUri: REDIRECT_URI });
  }
  try {
    return NextResponse.json(
      { configured: true, redirectUri: REDIRECT_URI, people: await listPeople(), connectUrl: authorizeUrl() },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (e) {
    console.error("Kakao status error:", e);
    return NextResponse.json({ configured: true, error: "카카오 연결 정보를 불러오지 못했습니다." }, { status: 500 });
  }
}

// 테스트 알림 보내기
export async function POST(req: NextRequest) {
  const denied = checkAdmin(req);
  if (denied) return denied;
  if (!kakaoConfigured()) return NextResponse.json({ error: "카카오 설정이 아직 없습니다." }, { status: 503 });
  try {
    const sent = await notifyAll("[테스트] 탱고인사이트 홈페이지 알림이 정상적으로 연결되었습니다.");
    return NextResponse.json({ sent });
  } catch (e) {
    console.error("Kakao test error:", e);
    return NextResponse.json({ error: "테스트 알림을 보내지 못했습니다." }, { status: 500 });
  }
}

// 연결 해제
export async function DELETE(req: NextRequest) {
  const denied = checkAdmin(req);
  if (denied) return denied;
  try {
    const { id } = (await req.json()) as { id?: string };
    if (!id || !/^\d+$/.test(id)) return NextResponse.json({ error: "잘못된 요청입니다." }, { status: 400 });
    await removePerson(id);
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("Kakao remove error:", e);
    return NextResponse.json({ error: "연결을 해제하지 못했습니다." }, { status: 500 });
  }
}
