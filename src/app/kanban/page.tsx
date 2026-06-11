'use client';

import Link from 'next/link';
import { useState } from 'react';

// ── 타입 ─────────────────────────────────────────────────
type ColId = 'backlog' | 'todo' | 'inprogress' | 'review' | 'done';
type Priority = '높음' | '중간' | '낮음';

interface Card {
  id: string;
  title: string;
  tag: string;
  priority: Priority;
  assignee: string;
  col: ColId;
}

// ── 컬럼 정의 ─────────────────────────────────────────────
const COLUMNS: { id: ColId; label: string; color: string; bg: string }[] = [
  { id: 'backlog',    label: '백로그',  color: '#ABABAB', bg: '#F5F5F5' },
  { id: 'todo',       label: '할 일',   color: '#1A6FC4', bg: '#EBF5FF' },
  { id: 'inprogress', label: '진행중',  color: '#D95B00', bg: '#FFF0E6' },
  { id: 'review',     label: '검토중',  color: '#7B3FC4', bg: '#F3ECFF' },
  { id: 'done',       label: '완료',    color: '#1A7A47', bg: '#EAFAF1' },
];

// ── 목업 카드 ─────────────────────────────────────────────
const INIT_CARDS: Card[] = [
  { id: 'c1',  title: '사용자 인증 API 설계',     tag: '백엔드',  priority: '높음', assignee: '김개발', col: 'backlog' },
  { id: 'c2',  title: '로그인 화면 UI',           tag: '프론트',  priority: '중간', assignee: '이디자인', col: 'backlog' },
  { id: 'c3',  title: 'DB 스키마 최종 확정',       tag: '인프라',  priority: '높음', assignee: '박DBA',  col: 'backlog' },
  { id: 'c4',  title: '프로젝트 목록 컴포넌트',   tag: '프론트',  priority: '중간', assignee: '이디자인', col: 'todo' },
  { id: 'c5',  title: 'JWT 토큰 갱신 로직',       tag: '백엔드',  priority: '높음', assignee: '김개발', col: 'todo' },
  { id: 'c6',  title: '알림 센터 설계',           tag: '기획',    priority: '낮음', assignee: '최기획', col: 'todo' },
  { id: 'c7',  title: '칸반 보드 드래그 앤 드롭', tag: '프론트',  priority: '높음', assignee: '이디자인', col: 'inprogress' },
  { id: 'c8',  title: 'WebSocket 채팅 서버',      tag: '백엔드',  priority: '높음', assignee: '김개발', col: 'inprogress' },
  { id: 'c9',  title: 'CI/CD 파이프라인 구축',    tag: '인프라',  priority: '중간', assignee: '박DBA',  col: 'inprogress' },
  { id: 'c10', title: '3D 허브 씬 최적화',        tag: '프론트',  priority: '중간', assignee: '이디자인', col: 'review' },
  { id: 'c11', title: 'API 통합 테스트',          tag: '백엔드',  priority: '높음', assignee: '김개발', col: 'review' },
  { id: 'c12', title: '와이어프레임 확정',        tag: '기획',    priority: '낮음', assignee: '최기획', col: 'done' },
  { id: 'c13', title: '기술 스택 선정',           tag: '기획',    priority: '중간', assignee: '최기획', col: 'done' },
  { id: 'c14', title: '개발 환경 세팅',           tag: '인프라',  priority: '중간', assignee: '박DBA',  col: 'done' },
];

const PRIORITY_STYLE: Record<Priority, { bg: string; text: string }> = {
  '높음': { bg: '#FDECEA', text: '#C0392B' },
  '중간': { bg: '#FFF0E6', text: '#D95B00' },
  '낮음': { bg: '#F5F5F5', text: '#6B6B6B' },
};

const TAG_COLORS: Record<string, { bg: string; text: string }> = {
  '프론트': { bg: '#EBF5FF', text: '#1A6FC4' },
  '백엔드': { bg: '#F3ECFF', text: '#7B3FC4' },
  '기획':   { bg: '#EAFAF1', text: '#1A7A47' },
  '인프라': { bg: '#FFF8E6', text: '#A07000' },
  '디자인': { bg: '#FFF0E6', text: '#D95B00' },
};

const INITIALS: Record<string, string> = {
  '김개발':  '김',
  '이디자인': '이',
  '박DBA':   '박',
  '최기획':  '최',
};

const AVATAR_COLOR: Record<string, string> = {
  '김개발':  '#1A6FC4',
  '이디자인': '#D95B00',
  '박DBA':   '#7B3FC4',
  '최기획':  '#1A7A47',
};

// ── 사이드바 ──────────────────────────────────────────────
const NAV_ITEMS = [
  { href: '/projects', label: '📋 프로젝트' },
  { href: '/kanban',   label: '📊 칸반 보드', active: true },
  { href: '/sprint',   label: '🏃 스프린트' },
  { href: '/docs',     label: '📄 문서' },
];

function Sidebar() {
  return (
    <aside
      className="flex flex-col w-52 shrink-0 h-full border-r pt-5 pb-6 px-3 gap-1"
      style={{ background: 'var(--color-near-white)', borderColor: 'var(--color-light-gray)' }}
    >
      <p className="text-xs font-semibold px-3 mb-2" style={{ color: 'var(--color-gray)' }}>워크스페이스</p>
      {NAV_ITEMS.map(({ href, label, active }) => (
        <Link
          key={href}
          href={href}
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium"
          style={{
            background: active ? 'var(--color-accent-bg)' : 'transparent',
            color: active ? 'var(--color-accent)' : 'var(--color-dark-text)',
          }}
        >
          {label}
        </Link>
      ))}
      <div className="flex-1" />
      <Link href="/hub" className="px-3 py-2 rounded-lg text-sm" style={{ color: 'var(--color-mid-gray)' }}>
        ← 메인 허브로
      </Link>
    </aside>
  );
}

// ── 카드 컴포넌트 ─────────────────────────────────────────
function KanbanCard({
  card,
  onMove,
}: {
  card: Card;
  onMove: (id: string, dir: -1 | 1) => void;
}) {
  const pStyle = PRIORITY_STYLE[card.priority];
  const tStyle = TAG_COLORS[card.tag] ?? { bg: '#F5F5F5', text: '#5C5C5C' };
  const colIdx = COLUMNS.findIndex((c) => c.id === card.col);

  return (
    <div
      className="rounded-xl border p-4 select-none"
      style={{ background: 'var(--color-near-white)', borderColor: 'var(--color-light-gray)' }}
    >
      {/* 태그 + 우선순위 */}
      <div className="flex items-center justify-between mb-2.5">
        <span
          className="text-xs font-medium px-2 py-0.5 rounded"
          style={{ background: tStyle.bg, color: tStyle.text }}
        >
          {card.tag}
        </span>
        <span
          className="text-xs font-semibold px-2 py-0.5 rounded"
          style={{ background: pStyle.bg, color: pStyle.text }}
        >
          {card.priority}
        </span>
      </div>

      {/* 제목 */}
      <p className="text-sm font-semibold leading-snug mb-3" style={{ color: 'var(--color-black)' }}>
        {card.title}
      </p>

      {/* 담당자 + 이동 버튼 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <div
            className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white"
            style={{ background: AVATAR_COLOR[card.assignee] ?? '#ABABAB' }}
          >
            {INITIALS[card.assignee] ?? '?'}
          </div>
          <span className="text-xs" style={{ color: 'var(--color-mid-gray)' }}>{card.assignee}</span>
        </div>

        {/* 좌우 이동 */}
        <div className="flex gap-1">
          {colIdx > 0 && (
            <button
              onClick={() => onMove(card.id, -1)}
              className="w-5 h-5 rounded text-xs flex items-center justify-center transition-colors"
              style={{ color: 'var(--color-gray)', background: 'var(--color-panel-bg)' }}
              title="이전 단계로"
            >
              ‹
            </button>
          )}
          {colIdx < COLUMNS.length - 1 && (
            <button
              onClick={() => onMove(card.id, 1)}
              className="w-5 h-5 rounded text-xs flex items-center justify-center transition-colors"
              style={{ color: 'var(--color-accent)', background: 'var(--color-accent-bg)' }}
              title="다음 단계로"
            >
              ›
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ── 컬럼 컴포넌트 ─────────────────────────────────────────
function KanbanColumn({
  col,
  cards,
  onMove,
}: {
  col: (typeof COLUMNS)[number];
  cards: Card[];
  onMove: (id: string, dir: -1 | 1) => void;
}) {
  return (
    <div className="flex flex-col w-64 shrink-0">
      {/* 컬럼 헤더 */}
      <div
        className="flex items-center justify-between px-3 py-2.5 rounded-xl mb-3"
        style={{ background: col.bg }}
      >
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full" style={{ background: col.color }} />
          <span className="text-sm font-bold" style={{ color: col.color }}>
            {col.label}
          </span>
        </div>
        <span
          className="text-xs font-bold px-1.5 py-0.5 rounded-full"
          style={{ background: col.color, color: '#fff', opacity: 0.9 }}
        >
          {cards.length}
        </span>
      </div>

      {/* 카드 목록 */}
      <div className="flex flex-col gap-3 flex-1 min-h-[120px]">
        {cards.map((card) => (
          <KanbanCard key={card.id} card={card} onMove={onMove} />
        ))}

        {/* 카드 추가 버튼 */}
        <button
          className="flex items-center justify-center gap-1 py-2 rounded-xl text-sm border-2 border-dashed transition-colors"
          style={{
            borderColor: 'var(--color-light-gray)',
            color: 'var(--color-gray)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = col.color;
            e.currentTarget.style.color = col.color;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'var(--color-light-gray)';
            e.currentTarget.style.color = 'var(--color-gray)';
          }}
        >
          + 카드 추가
        </button>
      </div>
    </div>
  );
}

// ── 메인 페이지 ───────────────────────────────────────────
export default function KanbanPage() {
  const [cards, setCards] = useState<Card[]>(INIT_CARDS);
  const [activeProject, setActiveProject] = useState('CoWork 웹 플랫폼');

  function moveCard(id: string, dir: -1 | 1) {
    setCards((prev) =>
      prev.map((c) => {
        if (c.id !== id) return c;
        const idx = COLUMNS.findIndex((col) => col.id === c.col);
        const next = COLUMNS[idx + dir];
        return next ? { ...c, col: next.id } : c;
      })
    );
  }

  const projects = ['CoWork 웹 플랫폼', 'UI/UX 리디자인', 'API 서버 v2'];

  return (
    <div className="flex flex-col h-screen" style={{ background: 'var(--color-card-bg)' }}>

      {/* ── 상단 앱바 ── */}
      <header
        className="flex items-center justify-between px-6 h-14 shrink-0 border-b"
        style={{ background: 'var(--color-near-white)', borderColor: 'var(--color-light-gray)' }}
      >
        <Link href="/hub" className="text-lg font-bold tracking-tight" style={{ color: 'var(--color-black)' }}>
          ● CoWork
        </Link>
        <nav className="flex items-center gap-1">
          {['/notifications', '/chat', '/company'].map((href, i) => (
            <Link key={href} href={href} className="w-9 h-9 flex items-center justify-center rounded-lg text-lg hover:opacity-70" style={{ color: 'var(--color-dark-text)' }}>
              {['🔔', '💬', '👤'][i]}
            </Link>
          ))}
        </nav>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <Sidebar />

        {/* ── 칸반 콘텐츠 ── */}
        <div className="flex flex-col flex-1 overflow-hidden">

          {/* 서브헤더 */}
          <div
            className="flex items-center justify-between px-7 py-4 border-b"
            style={{ background: 'var(--color-near-white)', borderColor: 'var(--color-light-gray)' }}
          >
            <div className="flex items-center gap-4">
              <h1 className="text-xl font-bold" style={{ color: 'var(--color-black)' }}>
                칸반 보드
              </h1>
              {/* 프로젝트 탭 */}
              <div className="flex items-center gap-1">
                {projects.map((p) => (
                  <button
                    key={p}
                    onClick={() => setActiveProject(p)}
                    className="px-3 py-1 rounded-lg text-xs font-medium transition-all"
                    style={{
                      background: activeProject === p ? 'var(--color-accent)' : 'transparent',
                      color: activeProject === p ? '#fff' : 'var(--color-mid-gray)',
                    }}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs" style={{ color: 'var(--color-gray)' }}>
                총 {cards.length}개 · 완료 {cards.filter(c => c.col === 'done').length}개
              </span>
              <button
                className="px-3 py-1.5 rounded-lg text-xs font-bold transition-opacity hover:opacity-90"
                style={{ background: 'var(--color-accent)', color: '#fff' }}
              >
                + 새 카드
              </button>
            </div>
          </div>

          {/* ── 보드 영역 (가로 스크롤) ── */}
          <div className="flex-1 overflow-x-auto overflow-y-auto">
            <div className="flex gap-5 p-7 min-w-max">
              {COLUMNS.map((col) => (
                <KanbanColumn
                  key={col.id}
                  col={col}
                  cards={cards.filter((c) => c.col === col.id)}
                  onMove={moveCard}
                />
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
