// src/app/page.tsx 의 <section> 순서와 반드시 일치해야 함 (헤더 글자색·사이드 내비가 이 인덱스를 사용)
export const homeSections = [
  { ko: "홈",           en: "Home",              dark: true,  nav: true  },
  { ko: "실적",         en: "Track Record",      dark: true,  nav: true  },
  { ko: "대표 구축 사례", en: "Featured Case",     dark: false, nav: true  },
  { ko: "수행 사례",     en: "Case Studies",      dark: false, nav: true  },
  { ko: "회사 소개",     en: "About Us",          dark: false, nav: true  },
  { ko: "핵심 기능",     en: "Core Features",     dark: false, nav: true  },
  { ko: "물리자료 처리", en: "Document Handling", dark: false, nav: true  },
  { ko: "솔루션",       en: "Solutions",         dark: false, nav: true  },
  { ko: "프로세스",     en: "Process",           dark: true,  nav: true  },
  { ko: "고객 평가",     en: "Reviews",           dark: false, nav: true  },
  { ko: "푸터",         en: "Footer",            dark: true,  nav: false },
] as const;
