// 메인 페이지의 섹션 단위 스크롤 계산.
// 섹션 높이가 화면 높이와 달라도(내용이 길어진 섹션) 위치가 어긋나지 않도록
// "인덱스 × 화면 높이"가 아니라 각 섹션의 실제 위치를 기준으로 계산합니다.

export function getSections(main: HTMLElement) {
  return Array.from(main.querySelectorAll<HTMLElement>(":scope > section"));
}

function topOf(main: HTMLElement, section: HTMLElement) {
  return section.getBoundingClientRect().top - main.getBoundingClientRect().top + main.scrollTop;
}

// 화면에 가장 많이 보이는 섹션의 인덱스
export function activeIndex(main: HTMLElement) {
  const sections = getSections(main);
  const st = main.scrollTop;
  const vh = main.clientHeight;
  let best = 0;
  let bestOverlap = -1;
  sections.forEach((s, i) => {
    const top = topOf(main, s);
    const overlap = Math.min(st + vh, top + s.offsetHeight) - Math.max(st, top);
    if (overlap > bestOverlap) {
      bestOverlap = overlap;
      best = i;
    }
  });
  return best;
}

// 화면 위쪽에서 offset 만큼 내려간 지점에 있는 섹션의 인덱스 (헤더 글자색 판단용)
export function sectionAt(main: HTMLElement, offset = 40) {
  const sections = getSections(main);
  const y = main.scrollTop + offset;
  let idx = 0;
  sections.forEach((s, i) => {
    if (topOf(main, s) <= y) idx = i;
  });
  return idx;
}

export function scrollToSection(main: HTMLElement, idx: number) {
  const s = getSections(main)[idx];
  if (!s) return;
  main.scrollTo({ top: topOf(main, s), behavior: "smooth" });
}

// 멈출 위치 목록: 각 섹션의 맨 위, 그리고 화면보다 긴 섹션은 맨 아래가 보이는 위치
function stops(main: HTMLElement) {
  const vh = main.clientHeight;
  const max = main.scrollHeight - vh;
  const list: number[] = [];
  getSections(main).forEach((s) => {
    const top = topOf(main, s);
    list.push(Math.min(top, max));
    if (s.offsetHeight > vh + 4) {
      const bottom = top + s.offsetHeight - vh;
      // 아주 긴 섹션은 화면의 85%씩 나눠서 내용을 건너뛰지 않도록 중간 지점도 추가
      for (let p = top + vh * 0.85; p < bottom - vh * 0.2; p += vh * 0.85) list.push(Math.min(p, max));
      list.push(Math.min(bottom, max));
    }
  });
  list.push(max);
  return Array.from(new Set(list.map((n) => Math.round(n)))).sort((a, b) => a - b);
}

// 한 칸 아래(dir > 0) 또는 위(dir < 0)로 이동
export function stepScroll(main: HTMLElement, dir: number) {
  const st = main.scrollTop;
  const list = stops(main);
  const target =
    dir > 0
      ? list.find((p) => p > st + 4) ?? list[list.length - 1]
      : [...list].reverse().find((p) => p < st - 4) ?? 0;
  main.scrollTo({ top: target, behavior: "smooth" });
}
