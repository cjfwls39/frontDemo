# CoWork — Agile Collaboration Platform Demo

> Jira + Confluence + Slack을 하나로 통합한 경량 애자일 협업 플랫폼 프론트엔드 데모

<br/>

## 화면 구성

| # | 화면 | 라우트 |
|---|------|--------|
| 01 | 로그인 | `/login` |
| 02 | 회원가입 | `/signup` |
| 03 | 3D 사무실 허브 | `/hub` |
| 04 | 프로젝트 목록 | `/projects` |
| 05 | 칸반 보드 | `/kanban` |
| 06 | 스프린트 / 백로그 | `/sprint` |
| 07 | 문서 · 회의록 목록 (그래프 뷰 포함) | `/docs` |
| 08 | 문서 편집기 | `/docs/[id]` |
| 09 | 채팅 (DM · 채널) | `/chat` |
| 10 | 스레드 | `/chat/thread` |
| 11 | 알림 | `/notifications` |
| 12 | 프로젝트 설정 | `/projects/settings` |
| 13 | 회사 관리 | `/company` |
| 14 | 구성원 · 권한 관리 | `/company/members` |
| 15 | 플랫폼 관리자 대시보드 | `/admin` |

<br/>

## 주요 기능

- **3D 사무실 허브** — Three.js 기반 인터랙티브 3D 공간에서 각 기능으로 이동
- **칸반 보드** — 5단계 컬럼, 카드 이동, 프로젝트 탭 전환
- **스프린트 관리** — 진행률 바, 스토리 포인트 추적, 백로그 이월
- **문서 그래프 뷰** — Obsidian 스타일 force-directed 그래프로 문서 간 연결 시각화
- **실시간 채팅** — DM · 채널 · 스레드 · 이모지 리액션
- **알림 센터** — 타입별 필터, 읽음 처리
- **권한 매트릭스** — 오너 / 관리자 / 편집자 / 뷰어 역할별 권한 표
- **관리자 대시보드** — 워크스페이스 현황, MRR, API 호출 차트, 서버 로그

<br/>

## 기술 스택

- **Next.js 16** (App Router, Turbopack)
- **React 19 + TypeScript**
- **Tailwind CSS 4**
- **Three.js + React Three Fiber** (3D 허브)
- **react-force-graph-2d** (문서 그래프 뷰)

<br/>

## 시작하기

```bash
npm install
npm run dev
```

`http://localhost:3000` 접속 후 로그인 화면에서 **데모 로그인** 버튼으로 시작.

<br/>

## 참고

- 현재 버전은 **UI 데모**로, 모든 데이터는 목업입니다.
- 백엔드(Spring Boot) 연동 및 실제 기능 구현은 추후 진행 예정입니다.
