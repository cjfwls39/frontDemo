'use client';

import Link from 'next/link';
import { useState, lazy, Suspense, useEffect } from 'react';

const DocGraph = lazy(() => import('./components/DocGraph'));

type DocType = '문서' | '회의록' | '기획서' | '가이드';

interface Doc {
  id: string;
  title: string;
  type: DocType;
  project: string;
  author: string;
  updatedAt: string;
  excerpt: string;
  emoji: string;
  pinned?: boolean;
}

const DOCS: Doc[] = [
  { id: 'd1',  title: 'CoWork 서비스 기획서 v2',       type: '기획서',  project: 'CoWork 웹 플랫폼', author: '최기획',   updatedAt: '오늘 14:32',  excerpt: '서비스 전반의 기능 정의 및 사용자 흐름 설계. 로그인부터 대시보드까지 전체 UX 명세 포함.', emoji: '📋', pinned: true },
  { id: 'd2',  title: '2026-06-10 스프린트 3 킥오프 회의', type: '회의록', project: 'CoWork 웹 플랫폼', author: '김개발', updatedAt: '오늘 10:00',  excerpt: '스프린트 목표 공유, 태스크 분배, 리스크 논의. 참석: 김개발, 이디자인, 최기획, 박DBA.', emoji: '📝', pinned: true },
  { id: 'd3',  title: '프론트엔드 컴포넌트 가이드',     type: '가이드',  project: 'UI/UX 리디자인',   author: '이디자인', updatedAt: '어제 18:21',  excerpt: 'Tailwind CSS 4.x 기반 디자인 시스템. 색상 팔레트, 타이포그래피, 공통 컴포넌트 규칙.', emoji: '🎨' },
  { id: 'd4',  title: 'API 설계 문서 — 인증 모듈',     type: '문서',    project: 'API 서버 v2',      author: '김개발',   updatedAt: '어제 09:15',  excerpt: 'JWT 기반 인증 플로우. 액세스 토큰 / 리프레시 토큰 전략 및 엔드포인트 명세.', emoji: '🔑' },
  { id: 'd5',  title: 'DB 스키마 설계 — 최종본',       type: '문서',    project: 'API 서버 v2',      author: '박DBA',    updatedAt: '2일 전',      excerpt: '사용자, 프로젝트, 태스크, 채팅 테이블 ERD. 인덱스 전략 및 마이그레이션 가이드 포함.', emoji: '🗄️' },
  { id: 'd6',  title: '2026-06-08 디자인 리뷰',        type: '회의록', project: 'UI/UX 리디자인',   author: '이디자인', updatedAt: '3일 전',      excerpt: '3D 허브 씬 피드백 반영사항 정리. 조명, 그림자, 내비게이션 개선 결정사항.', emoji: '📝' },
  { id: 'd7',  title: '배포 파이프라인 가이드',        type: '가이드',  project: 'CoWork 웹 플랫폼', author: '박DBA',    updatedAt: '4일 전',      excerpt: 'GitHub Actions → Vercel 자동 배포 설정. 환경변수 관리 및 프리뷰 URL 전략.', emoji: '🚀' },
  { id: 'd8',  title: 'Q2 로드맵',                    type: '기획서',  project: 'CoWork 웹 플랫폼', author: '최기획',   updatedAt: '1주 전',      excerpt: '2026 Q2 마일스톤. 모바일 대응, 플러그인 시스템, 엔터프라이즈 기능 우선순위.', emoji: '🗺️' },
  { id: 'd9',  title: '칸반 보드 기능 명세',           type: '기획서',  project: 'CoWork 웹 플랫폼', author: '최기획',   updatedAt: '1주 전',      excerpt: '드래그앤드롭, 필터, WIP 제한, 스윔레인 기능 정의. MVP 범위 및 추후 확장 구분.', emoji: '📌' },
];

const TYPE_STYLE: Record<DocType, { bg: string; color: string; icon: string }> = {
  '문서':  { bg: '#EBF5FF', color: '#1A6FC4', icon: '📄' },
  '회의록': { bg: '#F3ECFF', color: '#7B3FC4', icon: '📝' },
  '기획서': { bg: '#FFF0E6', color: '#D95B00', icon: '📋' },
  '가이드': { bg: '#EAFAF1', color: '#1A7A47', icon: '📚' },
};

const AVATAR_COLOR: Record<string, string> = {
  '김개발': '#1A6FC4', '이디자인': '#D95B00', '박DBA': '#7B3FC4', '최기획': '#1A7A47',
};

const NAV_ITEMS = [
  { href: '/projects', label: '📋 프로젝트' },
  { href: '/kanban',   label: '📊 칸반 보드' },
  { href: '/sprint',   label: '🏃 스프린트' },
  { href: '/docs',     label: '📄 문서', active: true },
];

function Sidebar() {
  return (
    <aside className="flex flex-col w-52 shrink-0 h-full border-r pt-5 pb-6 px-3 gap-1"
      style={{ background: 'var(--color-near-white)', borderColor: 'var(--color-light-gray)' }}>
      <p className="text-xs font-semibold px-3 mb-2" style={{ color: 'var(--color-gray)' }}>워크스페이스</p>
      {NAV_ITEMS.map(({ href, label, active }) => (
        <Link key={href} href={href}
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium"
          style={{ background: active ? 'var(--color-accent-bg)' : 'transparent', color: active ? 'var(--color-accent)' : 'var(--color-dark-text)' }}>
          {label}
        </Link>
      ))}
      <div className="flex-1" />
      <Link href="/hub" className="px-3 py-2 rounded-lg text-sm" style={{ color: 'var(--color-mid-gray)' }}>← 메인 허브로</Link>
    </aside>
  );
}

export default function DocsPage() {
  const [viewMode, setViewMode] = useState<'list' | 'graph'>('list');
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<DocType | '전체'>('전체');
  const [graphReady, setGraphReady] = useState(false);

  // 그래프 탭 클릭 시 마운트 준비
  useEffect(() => {
    if (viewMode === 'graph') setGraphReady(true);
  }, [viewMode]);

  const filtered = DOCS.filter(d => {
    const matchType = typeFilter === '전체' || d.type === typeFilter;
    const matchSearch = d.title.toLowerCase().includes(search.toLowerCase()) ||
                        d.excerpt.toLowerCase().includes(search.toLowerCase());
    return matchType && matchSearch;
  });

  const pinned = filtered.filter(d => d.pinned);
  const rest    = filtered.filter(d => !d.pinned);

  return (
    <div className="flex flex-col h-screen" style={{ background: 'var(--color-card-bg)' }}>
      <header className="flex items-center justify-between px-6 h-14 shrink-0 border-b"
        style={{ background: 'var(--color-near-white)', borderColor: 'var(--color-light-gray)' }}>
        <Link href="/hub" className="text-lg font-bold tracking-tight" style={{ color: 'var(--color-black)' }}>● CoWork</Link>
        <nav className="flex items-center gap-1">
          {['/notifications','/chat','/company'].map((href, i) => (
            <Link key={href} href={href} className="w-9 h-9 flex items-center justify-center rounded-lg text-lg hover:opacity-70"
              style={{ color: 'var(--color-dark-text)' }}>{['🔔','💬','👤'][i]}</Link>
          ))}
        </nav>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <Sidebar />

        <div className="flex flex-col flex-1 overflow-hidden">
          {/* 서브헤더 */}
          <div className="flex items-center justify-between px-8 pt-6 pb-0 shrink-0">
            <div>
              <h1 className="text-2xl font-bold" style={{ color: 'var(--color-black)' }}>문서 · 회의록</h1>
              <p className="text-sm mt-0.5" style={{ color: 'var(--color-mid-gray)' }}>총 {DOCS.length}개 문서</p>
            </div>
            <div className="flex items-center gap-2">
              {/* 뷰 전환 */}
              <div className="flex items-center rounded-lg overflow-hidden border"
                style={{ borderColor: 'var(--color-light-gray)' }}>
                <button onClick={() => setViewMode('list')}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold transition-all"
                  style={{ background: viewMode === 'list' ? 'var(--color-accent)' : 'var(--color-near-white)', color: viewMode === 'list' ? '#fff' : 'var(--color-mid-gray)' }}>
                  ☰ 목록
                </button>
                <button onClick={() => setViewMode('graph')}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold transition-all"
                  style={{ background: viewMode === 'graph' ? 'var(--color-accent)' : 'var(--color-near-white)', color: viewMode === 'graph' ? '#fff' : 'var(--color-mid-gray)' }}>
                  🕸️ 그래프
                </button>
              </div>
              <Link href="/docs/new"
                className="px-4 py-2 rounded-lg text-sm font-bold hover:opacity-90"
                style={{ background: 'var(--color-accent)', color: '#fff' }}>
                + 새 문서
              </Link>
            </div>
          </div>

          {/* 목록 뷰 */}
          {viewMode === 'list' && (
            <main className="flex-1 overflow-y-auto px-8 py-5">
              {/* 검색 + 타입 필터 */}
              <div className="flex items-center gap-3 mb-7">
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm" style={{ color: 'var(--color-gray)' }}>🔍</span>
                  <input type="text" placeholder="문서 검색..." value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="pl-9 pr-4 py-2 rounded-lg text-sm outline-none w-56"
                    style={{ background: 'var(--color-near-white)', border: '1px solid var(--color-light-gray)', color: 'var(--color-dark-text)' }}
                    onFocus={e => e.target.style.borderColor = 'var(--color-accent)'}
                    onBlur={e => e.target.style.borderColor = 'var(--color-light-gray)'} />
                </div>
                <div className="flex items-center gap-1.5">
                  {(['전체', '문서', '회의록', '기획서', '가이드'] as const).map(t => (
                    <button key={t} onClick={() => setTypeFilter(t)}
                      className="px-3 py-1.5 rounded-lg text-xs font-medium"
                      style={{
                        background: typeFilter === t ? 'var(--color-accent)' : 'var(--color-near-white)',
                        color: typeFilter === t ? '#fff' : 'var(--color-mid-gray)',
                        border: `1px solid ${typeFilter === t ? 'var(--color-accent)' : 'var(--color-light-gray)'}`,
                      }}>{t}</button>
                  ))}
                </div>
              </div>

              {pinned.length > 0 && (
                <section className="mb-7">
                  <p className="text-xs font-semibold mb-3 flex items-center gap-1.5"
                    style={{ color: 'var(--color-gray)' }}>📌 고정 문서</p>
                  <div className="grid grid-cols-2 gap-3">
                    {pinned.map(doc => <DocCard key={doc.id} doc={doc} />)}
                  </div>
                </section>
              )}

              <section>
                <p className="text-xs font-semibold mb-3" style={{ color: 'var(--color-gray)' }}>최근 문서</p>
                <div className="flex flex-col gap-2">
                  {rest.map(doc => <DocRow key={doc.id} doc={doc} />)}
                </div>
              </section>

              {filtered.length === 0 && (
                <div className="flex flex-col items-center py-24" style={{ color: 'var(--color-gray)' }}>
                  <div className="text-4xl mb-3">📄</div>
                  <p className="text-sm">검색 결과가 없습니다</p>
                </div>
              )}
            </main>
          )}

          {/* 그래프 뷰 */}
          {viewMode === 'graph' && (
            <div className="flex-1 overflow-hidden">
              {graphReady && (
                <Suspense fallback={
                  <div className="flex items-center justify-center h-full" style={{ color: 'var(--color-gray)' }}>
                    <div className="text-center">
                      <div className="text-3xl mb-2">🕸️</div>
                      <p className="text-sm">그래프 로딩 중...</p>
                    </div>
                  </div>
                }>
                  <DocGraph />
                </Suspense>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function DocCard({ doc }: { doc: Doc }) {
  const ts = TYPE_STYLE[doc.type];
  return (
    <Link href={`/docs/${doc.id}`}
      className="rounded-xl border p-5 hover:shadow-md transition-all group"
      style={{ background: 'var(--color-near-white)', borderColor: 'var(--color-light-gray)' }}
      onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--color-accent)')}
      onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--color-light-gray)')}>
      <div className="flex items-start gap-3 mb-3">
        <span className="text-2xl">{doc.emoji}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs px-2 py-0.5 rounded font-semibold"
              style={{ background: ts.bg, color: ts.color }}>{doc.type}</span>
            <span className="text-xs" style={{ color: 'var(--color-gray)' }}>{doc.project}</span>
          </div>
          <h3 className="text-sm font-bold leading-snug" style={{ color: 'var(--color-black)' }}>{doc.title}</h3>
        </div>
      </div>
      <p className="text-xs leading-relaxed mb-3 line-clamp-2" style={{ color: 'var(--color-mid-gray)' }}>{doc.excerpt}</p>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <div className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold text-white"
            style={{ background: AVATAR_COLOR[doc.author] ?? '#ABABAB' }}>{doc.author[0]}</div>
          <span className="text-xs" style={{ color: 'var(--color-gray)' }}>{doc.author}</span>
        </div>
        <span className="text-xs" style={{ color: 'var(--color-gray)' }}>{doc.updatedAt}</span>
      </div>
    </Link>
  );
}

function DocRow({ doc }: { doc: Doc }) {
  const ts = TYPE_STYLE[doc.type];
  return (
    <Link href={`/docs/${doc.id}`}
      className="flex items-center gap-4 px-5 py-3.5 rounded-xl border hover:shadow-sm transition-all"
      style={{ background: 'var(--color-near-white)', borderColor: 'var(--color-light-gray)' }}
      onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--color-accent)')}
      onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--color-light-gray)')}>
      <span className="text-xl shrink-0">{doc.emoji}</span>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <h3 className="text-sm font-semibold truncate" style={{ color: 'var(--color-black)' }}>{doc.title}</h3>
          <span className="text-xs px-2 py-0.5 rounded font-semibold shrink-0"
            style={{ background: ts.bg, color: ts.color }}>{doc.type}</span>
        </div>
        <p className="text-xs truncate" style={{ color: 'var(--color-mid-gray)' }}>{doc.excerpt}</p>
      </div>
      <div className="flex items-center gap-3 shrink-0">
        <span className="text-xs" style={{ color: 'var(--color-gray)' }}>{doc.project}</span>
        <div className="flex items-center gap-1.5">
          <div className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold text-white"
            style={{ background: AVATAR_COLOR[doc.author] ?? '#ABABAB' }}>{doc.author[0]}</div>
          <span className="text-xs" style={{ color: 'var(--color-gray)' }}>{doc.author}</span>
        </div>
        <span className="text-xs w-20 text-right" style={{ color: 'var(--color-gray)' }}>{doc.updatedAt}</span>
      </div>
    </Link>
  );
}
