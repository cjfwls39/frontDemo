'use client';

import Link from 'next/link';
import { useState } from 'react';

// ── 타입 ─────────────────────────────────────────────────
type Status = '진행중' | '완료' | '대기중' | '보류';

interface Project {
  id: string;
  name: string;
  desc: string;
  status: Status;
  progress: number;
  members: number;
  updated: string;
  tag: string;
}

// ── 목업 데이터 ───────────────────────────────────────────
const MOCK: Project[] = [
  { id: 'p1', name: 'CoWork 웹 플랫폼', desc: '메인 서비스 프론트엔드 및 백엔드 개발', status: '진행중', progress: 68, members: 5, updated: '오늘', tag: '개발' },
  { id: 'p2', name: 'UI/UX 리디자인', desc: '전체 화면 디자인 시스템 구축 및 개선', status: '진행중', progress: 42, members: 3, updated: '어제', tag: '디자인' },
  { id: 'p3', name: 'API 서버 v2', desc: 'REST → GraphQL 마이그레이션 및 성능 최적화', status: '대기중', progress: 12, members: 4, updated: '2일 전', tag: '백엔드' },
  { id: 'p4', name: '모바일 앱 MVP', desc: 'iOS / Android 크로스플랫폼 첫 출시 버전', status: '보류', progress: 5, members: 2, updated: '1주 전', tag: '모바일' },
  { id: 'p5', name: 'Q1 마케팅 캠페인', desc: '신규 사용자 유입을 위한 온라인 마케팅 기획', status: '완료', progress: 100, members: 3, updated: '3일 전', tag: '마케팅' },
  { id: 'p6', name: '데이터 분석 대시보드', desc: '사용자 행동 데이터 시각화 및 인사이트 도출', status: '진행중', progress: 55, members: 2, updated: '오늘', tag: '데이터' },
];

const STATUS_STYLE: Record<Status, { bg: string; text: string; dot: string }> = {
  '진행중': { bg: '#EBF5FF', text: '#1A6FC4', dot: '#1A6FC4' },
  '완료':   { bg: '#EAFAF1', text: '#1A7A47', dot: '#1A7A47' },
  '대기중': { bg: '#FFF8E6', text: '#A07000', dot: '#E6A800' },
  '보류':   { bg: '#F5F5F5', text: '#6B6B6B', dot: '#ABABAB' },
};

const FILTER_OPTIONS: Array<Status | '전체'> = ['전체', '진행중', '완료', '대기중', '보류'];

// ── 사이드바 네비 ─────────────────────────────────────────
const NAV_ITEMS = [
  { href: '/projects', label: '📋 프로젝트',  active: true },
  { href: '/kanban',   label: '📊 칸반 보드', active: false },
  { href: '/sprint',   label: '🏃 스프린트',  active: false },
  { href: '/docs',     label: '📄 문서',       active: false },
];

// ── 컴포넌트 ─────────────────────────────────────────────

function Sidebar() {
  return (
    <aside
      className="flex flex-col w-56 shrink-0 h-full border-r pt-5 pb-6 px-3 gap-1"
      style={{ background: 'var(--color-near-white)', borderColor: 'var(--color-light-gray)' }}
    >
      <p className="text-xs font-semibold px-3 mb-2" style={{ color: 'var(--color-gray)' }}>
        워크스페이스
      </p>
      {NAV_ITEMS.map(({ href, label, active }) => (
        <Link
          key={href}
          href={href}
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
          style={{
            background: active ? 'var(--color-accent-bg)' : 'transparent',
            color: active ? 'var(--color-accent)' : 'var(--color-dark-text)',
          }}
        >
          {label}
        </Link>
      ))}

      <div className="flex-1" />

      <Link
        href="/hub"
        className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors"
        style={{ color: 'var(--color-mid-gray)' }}
      >
        ← 메인 허브로
      </Link>
    </aside>
  );
}

function StatusBadge({ status }: { status: Status }) {
  const s = STATUS_STYLE[status];
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold"
      style={{ background: s.bg, color: s.text }}
    >
      <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: s.dot }} />
      {status}
    </span>
  );
}

function ProgressBar({ value }: { value: number }) {
  const isComplete = value === 100;
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--color-light-gray)' }}>
        <div
          className="h-full rounded-full transition-all"
          style={{
            width: `${value}%`,
            background: isComplete ? '#1A7A47' : 'var(--color-accent)',
          }}
        />
      </div>
      <span className="text-xs tabular-nums" style={{ color: 'var(--color-gray)', minWidth: '2.5rem', textAlign: 'right' }}>
        {value}%
      </span>
    </div>
  );
}

function ProjectCard({ project, onClick }: { project: Project; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="text-left rounded-xl p-5 border transition-all hover:shadow-md group"
      style={{
        background: 'var(--color-near-white)',
        borderColor: 'var(--color-light-gray)',
      }}
      onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--color-accent)')}
      onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--color-light-gray)')}
    >
      {/* 태그 + 상태 */}
      <div className="flex items-center justify-between mb-3">
        <span
          className="text-xs font-medium px-2 py-0.5 rounded"
          style={{ background: 'var(--color-panel-bg)', color: 'var(--color-mid-gray)' }}
        >
          {project.tag}
        </span>
        <StatusBadge status={project.status} />
      </div>

      {/* 제목 */}
      <h3 className="text-base font-bold mb-1.5 leading-snug" style={{ color: 'var(--color-black)' }}>
        {project.name}
      </h3>

      {/* 설명 */}
      <p className="text-xs mb-4 leading-relaxed line-clamp-2" style={{ color: 'var(--color-mid-gray)' }}>
        {project.desc}
      </p>

      {/* 진행률 */}
      <ProgressBar value={project.progress} />

      {/* 하단 메타 */}
      <div className="flex items-center justify-between mt-3 pt-3 border-t" style={{ borderColor: 'var(--color-light-gray)' }}>
        <div className="flex items-center gap-1" style={{ color: 'var(--color-gray)' }}>
          <span className="text-xs">👤 {project.members}명</span>
        </div>
        <span className="text-xs" style={{ color: 'var(--color-gray)' }}>
          {project.updated} 업데이트
        </span>
      </div>
    </button>
  );
}

// ── 메인 페이지 ───────────────────────────────────────────
export default function ProjectsPage() {
  const [filter, setFilter] = useState<Status | '전체'>('전체');
  const [search, setSearch] = useState('');

  const filtered = MOCK.filter((p) => {
    const matchStatus = filter === '전체' || p.status === filter;
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
                        p.desc.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

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
          {[
            { href: '/notifications', icon: '🔔' },
            { href: '/chat', icon: '💬' },
            { href: '/company', icon: '👤' },
          ].map(({ href, icon }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center justify-center w-9 h-9 rounded-lg text-lg transition-colors hover:opacity-70"
              style={{ color: 'var(--color-dark-text)' }}
            >
              {icon}
            </Link>
          ))}
        </nav>
      </header>

      {/* ── 본문 ── */}
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />

        <main className="flex-1 overflow-y-auto px-8 py-7">

          {/* 페이지 헤더 */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold" style={{ color: 'var(--color-black)' }}>
                프로젝트 목록
              </h1>
              <p className="text-sm mt-0.5" style={{ color: 'var(--color-mid-gray)' }}>
                총 {MOCK.length}개 프로젝트 · 진행중 {MOCK.filter(p => p.status === '진행중').length}개
              </p>
            </div>
            <button
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-opacity hover:opacity-90"
              style={{ background: 'var(--color-accent)', color: 'var(--color-near-white)' }}
            >
              + 새 프로젝트
            </button>
          </div>

          {/* 검색 + 필터 */}
          <div className="flex items-center gap-3 mb-6">
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm" style={{ color: 'var(--color-gray)' }}>🔍</span>
              <input
                type="text"
                placeholder="프로젝트 검색..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 pr-4 py-2 rounded-lg text-sm outline-none w-56"
                style={{
                  background: 'var(--color-near-white)',
                  border: '1px solid var(--color-light-gray)',
                  color: 'var(--color-dark-text)',
                }}
                onFocus={(e) => (e.target.style.borderColor = 'var(--color-accent)')}
                onBlur={(e) => (e.target.style.borderColor = 'var(--color-light-gray)')}
              />
            </div>

            <div className="flex items-center gap-1.5">
              {FILTER_OPTIONS.map((opt) => (
                <button
                  key={opt}
                  onClick={() => setFilter(opt)}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                  style={{
                    background: filter === opt ? 'var(--color-accent)' : 'var(--color-near-white)',
                    color: filter === opt ? 'var(--color-near-white)' : 'var(--color-mid-gray)',
                    border: `1px solid ${filter === opt ? 'var(--color-accent)' : 'var(--color-light-gray)'}`,
                  }}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          {/* 프로젝트 그리드 */}
          {filtered.length > 0 ? (
            <div className="grid grid-cols-3 gap-4">
              {filtered.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  onClick={() => {/* 상세 페이지 (추후 구현) */}}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-24" style={{ color: 'var(--color-gray)' }}>
              <div className="text-4xl mb-3">📋</div>
              <p className="text-sm">검색 결과가 없습니다</p>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}
