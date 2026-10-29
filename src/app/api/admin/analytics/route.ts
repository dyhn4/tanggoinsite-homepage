import { NextRequest, NextResponse } from "next/server";
import { checkAdmin } from "@/lib/adminAuth";
import { GaError, gaConfig, runRealtimeReport, runReport } from "@/lib/ga";

const RANGES: Record<string, number> = { "7": 7, "30": 30, "90": 90 };

export async function GET(req: NextRequest) {
  const denied = checkAdmin(req);
  if (denied) return denied;

  if (!gaConfig()) {
    return NextResponse.json({ configured: false });
  }

  const days = RANGES[req.nextUrl.searchParams.get("range") ?? "30"] ?? 30;
  const range = [{ startDate: `${days - 1}daysAgo`, endDate: "today" }];
  const metricsBase = [{ name: "activeUsers" }, { name: "sessions" }, { name: "screenPageViews" }, { name: "averageSessionDuration" }];

  try {
    const [summary, today, daily, pages, channels, devices, countries, realtime] = await Promise.all([
      runReport({ dateRanges: range, metrics: metricsBase }),
      runReport({ dateRanges: [{ startDate: "today", endDate: "today" }], metrics: [{ name: "activeUsers" }, { name: "screenPageViews" }] }),
      runReport({
        dateRanges: range,
        dimensions: [{ name: "date" }],
        metrics: [{ name: "activeUsers" }, { name: "screenPageViews" }],
        orderBys: [{ dimension: { dimensionName: "date" } }],
      }),
      runReport({
        dateRanges: range,
        dimensions: [{ name: "pagePath" }],
        metrics: [{ name: "screenPageViews" }, { name: "activeUsers" }],
        orderBys: [{ metric: { metricName: "screenPageViews" }, desc: true }],
        limit: 10,
      }),
      runReport({
        dateRanges: range,
        dimensions: [{ name: "sessionDefaultChannelGroup" }],
        metrics: [{ name: "sessions" }],
        orderBys: [{ metric: { metricName: "sessions" }, desc: true }],
        limit: 8,
      }),
      runReport({
        dateRanges: range,
        dimensions: [{ name: "deviceCategory" }],
        metrics: [{ name: "activeUsers" }],
        orderBys: [{ metric: { metricName: "activeUsers" }, desc: true }],
      }),
      runReport({
        dateRanges: range,
        dimensions: [{ name: "country" }],
        metrics: [{ name: "activeUsers" }],
        orderBys: [{ metric: { metricName: "activeUsers" }, desc: true }],
        limit: 8,
      }),
      runRealtimeReport({ metrics: [{ name: "activeUsers" }] }),
    ]);

    const s = summary[0]?.metrics ?? [0, 0, 0, 0];
    return NextResponse.json(
      {
        configured: true,
        days,
        summary: { users: s[0], sessions: s[1], pageViews: s[2], avgDuration: s[3] },
        today: { users: today[0]?.metrics[0] ?? 0, pageViews: today[0]?.metrics[1] ?? 0 },
        realtimeUsers: realtime[0]?.metrics[0] ?? 0,
        daily: daily.map((r) => ({ date: r.dims[0], users: r.metrics[0], pageViews: r.metrics[1] })),
        pages: pages.map((r) => ({ path: r.dims[0], views: r.metrics[0], users: r.metrics[1] })),
        channels: channels.map((r) => ({ name: r.dims[0], sessions: r.metrics[0] })),
        devices: devices.map((r) => ({ name: r.dims[0], users: r.metrics[0] })),
        countries: countries.map((r) => ({ name: r.dims[0], users: r.metrics[0] })),
      },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (e) {
    if (e instanceof GaError) {
      return NextResponse.json({ configured: true, error: e.message, kind: e.kind }, { status: 502 });
    }
    console.error("Analytics API error:", e);
    return NextResponse.json({ configured: true, error: "방문자 통계를 불러오는 중 오류가 발생했습니다." }, { status: 500 });
  }
}
