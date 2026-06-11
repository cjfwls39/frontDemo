'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useParams } from 'next/navigation';

const DOC_CONTENT: Record<string, { title: string; emoji: string; author: string; updatedAt: string; project: string; body: string }> = {
  d1: {
    title: 'CoWork 서비스 기획서 v2', emoji: '📋', author: '최기획',
    updatedAt: '2026-06-11 14:32', project: 'CoWork 웹 플랫폼',
    body: `# CoWork 서비스 개요

CoWork는 **프로젝트 관리 + 문서 협업 + 실시간 채팅**을 하나로 통합한 경량 애자일 플랫폼입니다.

## 핵심 가치

- **단일 워크스페이스**: Jira, Confluence, Slack을 하나로
- **3D 허브**: 팀원 간 공간감을 살린 직관적 내비게이션
- **실시간 협업**: WebSocket 기반 즉각적 동기화

## 주요 기능 모듈

### 1. 프로젝트 관리
칸반 보드, 스프린트 계획, 백로그 관리, 번다운 차트 지원.

### 2. 문서 시스템
마크다운 에디터, 회의록 템플릿, 버전 히스토리, 멘션 기능.

### 3. 커뮤니케이션
DM, 채널, 스레드, 파일 공유, 알림 센터.

## 사용자 흐름

1. 로그인 → 3D 사무실 허브
2. 허브에서 칸반/문서/채팅/스프린트 접근
3. 프로젝트별 독립 워크스페이스 운영

## 릴리즈 계획

| 버전 | 내용 | 목표일 |
|------|------|--------|
| v0.1 | 핵심 화면 데모 | 2026-06-15 |
| v0.5 | 백엔드 연동 MVP | 2026-07-31 |
| v1.0 | 정식 출시 | 2026-09-30 |

> **Note**: 본 문서는 지속적으로 업데이트됩니다.`,
  },
  d2: {
    title: '2026-06-10 스프린트 3 킥오프 회의', emoji: '📝', author: '김개발',
    updatedAt: '2026-06-10 10:00', project: 'CoWork 웹 플랫폼',
    body: `# 스프린트 3 킥오프 회의록

**일시**: 2026-06-10 10:00
**참석자**: 김개발, 이디자인, 최기획, 박DBA
**진행**: 최기획

---

## 스프린트 목표

스프린트 3의 주요 목표는 **프론트엔드 데모 완성** 및 **백엔드 API 프로토타입 구축**입니다.

## 태스크 배분

| 담당자 | 태스크 | SP |
|--------|--------|-----|
| 이디자인 | 칸반 보드 UI, 문서 에디터 | 13 |
| 김개발 | WebSocket 서버, API 연동 | 11 |
| 최기획 | 알림 시스템 설계 문서 | 2 |
| 박DBA | DB 마이그레이션 스크립트 | 3 |

## 논의 사항

### 기술 결정
- Three.js + React Three Fiber로 3D 허브 구현 확정
- Turbopack 사용 시 React.lazy 패턴 사용 (next/dynamic ssr:false 미사용)

### 리스크
- WebSocket 서버 구현 복잡도 높음 → 스프린트 4로 일부 이월 가능성

## 다음 행동 항목

- [ ] 김개발: WebSocket PoC 금요일까지
- [ ] 이디자인: 에디터 마크다운 파서 연동 수요일까지
- [ ] 최기획: 알림 설계 문서 목요일까지

---

*다음 데일리: 2026-06-11 10:00*`,
  },
};

const FALLBACK = {
  title: '문서를 불러오는 중...', emoji: '📄', author: '알 수 없음',
  updatedAt: '-', project: '-',
  body: `# 제목\n\n여기에 문서 내용을 작성하세요.\n\n## 섹션 1\n\n내용을 입력하세요.`,
};

const AVATAR_COLOR: Record<string, string> = {
  '김개발': '#1A6FC4', '이디자인': '#D95B00', '박DBA': '#7B3FC4', '최기획': '#1A7A47',
};

function renderMarkdown(md: string): string {
  return md
    .replace(/^# (.+)$/gm, '<h1 class="text-2xl font-bold mt-6 mb-3" style="color:var(--color-black)">$1</h1>')
    .replace(/^## (.+)$/gm, '<h2 class="text-lg font-bold mt-5 mb-2" style="color:var(--color-black)">$1</h2>')
    .replace(/^### (.+)$/gm, '<h3 class="text-base font-semibold mt-4 mb-1.5" style="color:var(--color-dark-text)">$1</h3>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/^> (.+)$/gm, '<blockquote class="border-l-4 pl-4 py-1 my-3 italic text-sm" style="border-color:var(--color-accent);color:var(--color-mid-gray)">$1</blockquote>')
    .replace(/^---$/gm, '<hr style="border-color:var(--color-light-gray);margin:1.5rem 0"/>')
    .replace(/^\| (.+) \|$/gm, (row) => {
      const cells = row.split('|').filter(Boolean).map(c => c.trim());
      return `<tr>${cells.map(c => `<td class="px-3 py-2 border text-sm" style="border-color:var(--color-light-gray)">${c}</td>`).join('')}</tr>`;
    })
    .replace(/^- \[ \] (.+)$/gm, '<li class="flex items-center gap-2 text-sm py-0.5"><span class="w-4 h-4 border-2 rounded flex-shrink-0" style="border-color:var(--color-light-gray)"></span>$1</li>')
    .replace(/^- \[x\] (.+)$/gm, '<li class="flex items-center gap-2 text-sm py-0.5 line-through" style="color:var(--color-gray)"><span class="w-4 h-4 rounded flex-shrink-0 flex items-center justify-center text-white text-xs" style="background:var(--color-accent)">✓</span>$1</li>')
    .replace(/^- (.+)$/gm, '<li class="text-sm py-0.5 pl-4 relative before:absolute before:left-1 before:top-2 before:w-1.5 before:h-1.5 before:rounded-full before:bg-current">$1</li>')
    .replace(/^\*(.+)\*$/gm, '<p class="text-xs italic" style="color:var(--color-gray)">$1</p>')
    .replace(/\n\n/g, '</p><p class="text-sm leading-relaxed mb-3" style="color:var(--color-dark-text)">')
    .replace(/^\*\*(.+)\*\*: (.+)$/gm, '<p class="text-sm mb-1"><strong>$1</strong>: $2</p>');
}

export default function DocEditorPage() {
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id ?? '';
  const doc = DOC_CONTENT[id] ?? FALLBACK;

  const [mode, setMode] = useState<'view' | 'edit'>('view');
  const [body, setBody] = useState(doc.body);
  const [saved, setSaved] = useState(false);

  function handleSave() {
    setSaved(true);
    setMode('view');
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="flex flex-col h-screen" style={{ background: 'var(--color-card-bg)' }}>
      {/* 앱바 */}
      <header className="flex items-center justify-between px-6 h-14 shrink-0 border-b"
        style={{ background: 'var(--color-near-white)', borderColor: 'var(--color-light-gray)' }}>
        <div className="flex items-center gap-3">
          <Link href="/hub" className="text-lg font-bold tracking-tight" style={{ color: 'var(--color-black)' }}>● CoWork</Link>
          <span style={{ color: 'var(--color-light-gray)' }}>/</span>
          <Link href="/docs" className="text-sm" style={{ color: 'var(--color-mid-gray)' }}>문서</Link>
          <span style={{ color: 'var(--color-light-gray)' }}>/</span>
          <span className="text-sm font-medium truncate max-w-xs" style={{ color: 'var(--color-dark-text)' }}>{doc.title}</span>
        </div>
        <nav className="flex items-center gap-1">
          {['/notifications','/chat','/company'].map((href, i) => (
            <Link key={href} href={href} className="w-9 h-9 flex items-center justify-center rounded-lg text-lg hover:opacity-70"
              style={{ color: 'var(--color-dark-text)' }}>{['🔔','💬','👤'][i]}</Link>
          ))}
        </nav>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* 문서 트리 사이드바 */}
        <aside className="flex flex-col w-52 shrink-0 h-full border-r pt-5 pb-6 px-3 gap-1"
          style={{ background: 'var(--color-near-white)', borderColor: 'var(--color-light-gray)' }}>
          <p className="text-xs font-semibold px-3 mb-2" style={{ color: 'var(--color-gray)' }}>문서 목록</p>
          {[
            { id: 'd1', title: 'CoWork 기획서 v2', emoji: '📋' },
            { id: 'd2', title: '스프린트 3 킥오프', emoji: '📝' },
            { id: 'd3', title: '컴포넌트 가이드',  emoji: '🎨' },
            { id: 'd4', title: 'API 설계 — 인증',  emoji: '🔑' },
            { id: 'd5', title: 'DB 스키마 최종본', emoji: '🗄️' },
          ].map(d => (
            <Link key={d.id} href={`/docs/${d.id}`}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm"
              style={{
                background: d.id === id ? 'var(--color-accent-bg)' : 'transparent',
                color: d.id === id ? 'var(--color-accent)' : 'var(--color-dark-text)',
                fontWeight: d.id === id ? '600' : '400',
              }}>
              <span>{d.emoji}</span>
              <span className="truncate">{d.title}</span>
            </Link>
          ))}
          <div className="flex-1" />
          <Link href="/docs" className="px-3 py-2 rounded-lg text-sm" style={{ color: 'var(--color-mid-gray)' }}>← 목록으로</Link>
        </aside>

        {/* 에디터 본문 */}
        <div className="flex flex-col flex-1 overflow-hidden">
          {/* 도구 모음 */}
          <div className="flex items-center justify-between px-8 py-3 border-b shrink-0"
            style={{ background: 'var(--color-near-white)', borderColor: 'var(--color-light-gray)' }}>
            <div className="flex items-center gap-2">
              {mode === 'edit' && (
                <>
                  {['B', 'I', 'H1', 'H2', '—', '·'].map(b => (
                    <button key={b} className="w-8 h-8 rounded text-xs font-bold flex items-center justify-center hover:opacity-70"
                      style={{ background: 'var(--color-panel-bg)', color: 'var(--color-dark-text)' }}>{b}</button>
                  ))}
                </>
              )}
            </div>
            <div className="flex items-center gap-2">
              {saved && <span className="text-xs" style={{ color: '#1A7A47' }}>✓ 저장됨</span>}
              {mode === 'view' ? (
                <button onClick={() => setMode('edit')}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold"
                  style={{ background: 'var(--color-panel-bg)', color: 'var(--color-dark-text)', border: '1px solid var(--color-light-gray)' }}>
                  ✏️ 편집
                </button>
              ) : (
                <>
                  <button onClick={() => setMode('view')}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold"
                    style={{ background: 'var(--color-panel-bg)', color: 'var(--color-mid-gray)', border: '1px solid var(--color-light-gray)' }}>
                    취소
                  </button>
                  <button onClick={handleSave}
                    className="px-3 py-1.5 rounded-lg text-xs font-bold hover:opacity-90"
                    style={{ background: 'var(--color-accent)', color: '#fff' }}>
                    저장
                  </button>
                </>
              )}
            </div>
          </div>

          {/* 문서 콘텐츠 */}
          <div className="flex-1 overflow-y-auto">
            <div className="max-w-3xl mx-auto px-8 py-8">
              {/* 문서 메타 */}
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-4xl">{doc.emoji}</span>
                  <h1 className="text-2xl font-bold" style={{ color: 'var(--color-black)' }}>{doc.title}</h1>
                </div>
                <div className="flex items-center gap-4 text-xs" style={{ color: 'var(--color-gray)' }}>
                  <div className="flex items-center gap-1.5">
                    <div className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold text-white"
                      style={{ background: AVATAR_COLOR[doc.author] ?? '#ABABAB' }}>{doc.author[0]}</div>
                    <span>{doc.author}</span>
                  </div>
                  <span>{doc.updatedAt}</span>
                  <span className="px-2 py-0.5 rounded" style={{ background: 'var(--color-panel-bg)' }}>{doc.project}</span>
                </div>
                <hr className="mt-5" style={{ borderColor: 'var(--color-light-gray)' }} />
              </div>

              {/* 본문 */}
              {mode === 'view' ? (
                <div className="prose-sm leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: renderMarkdown(body) }} />
              ) : (
                <textarea
                  value={body}
                  onChange={e => setBody(e.target.value)}
                  className="w-full h-96 p-4 rounded-xl text-sm font-mono leading-relaxed outline-none resize-none"
                  style={{
                    background: 'var(--color-near-white)',
                    border: '1px solid var(--color-accent)',
                    color: 'var(--color-dark-text)',
                    minHeight: '60vh',
                  }}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
