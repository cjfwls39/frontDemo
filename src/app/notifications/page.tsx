'use client';

import Link from 'next/link';
import { useState } from 'react';

type NotiType = 'mention' | 'task' | 'pr' | 'doc' | 'system';
type NotiFilter = '전체' | '읽지않음' | '멘션' | '태스크' | '문서';

interface Notification {
  id: string;
  type: NotiType;
  from: string;
  title: string;
  body: string;
  time: string;
  read: boolean;
  link: string;
  project?: string;
}

const INIT_NOTIS: Notification[] = [
  { id: 'n1',  type: 'mention', from: '김개발',   title: '개발 채널에서 멘션됨',          body: '@나 WebSocket PoC 결과 공유할게요 🚀 확인해주세요!',                   time: '방금',    read: false, link: '/chat',       project: 'CoWork 웹 플랫폼' },
  { id: 'n2',  type: 'task',    from: '최기획',   title: '태스크가 나에게 배정됨',        body: '알림 시스템 설계 문서 작성 — 스프린트 3',                             time: '10분 전', read: false, link: '/sprint',     project: 'CoWork 웹 플랫폼' },
  { id: 'n3',  type: 'pr',      from: '이디자인', title: 'PR #42 리뷰 요청',              body: '칸반 보드 UI 컴포넌트 분리 및 디자인 시스템 통일',                    time: '32분 전', read: false, link: '/chat/thread', project: 'CoWork 웹 플랫폼' },
  { id: 'n4',  type: 'task',    from: '이디자인', title: '태스크 상태 변경',              body: '칸반 보드 UI 구현 → 진행중으로 변경됨',                               time: '1시간 전', read: false, link: '/sprint',     project: 'CoWork 웹 플랫폼' },
  { id: 'n5',  type: 'doc',     from: '최기획',   title: '문서가 업데이트됨',             body: 'CoWork 서비스 기획서 v2 — 릴리즈 계획 섹션 추가됨',                  time: '2시간 전', read: false, link: '/docs/d1',    project: 'CoWork 웹 플랫폼' },
  { id: 'n6',  type: 'mention', from: '박DBA',    title: '개발 채널에서 멘션됨',          body: '@나 DB 스키마 최종본 확인해주실 수 있나요? ERD 링크 공유드려요.',     time: '3시간 전', read: true,  link: '/chat',       project: 'API 서버 v2' },
  { id: 'n7',  type: 'pr',      from: '김개발',   title: 'PR #41 머지됨',                 body: 'JWT 인증 미들웨어 — develop 브랜치에 머지 완료',                      time: '5시간 전', read: true,  link: '/chat',       project: 'CoWork 웹 플랫폼' },
  { id: 'n8',  type: 'task',    from: '나',       title: '태스크 완료',                   body: 'JWT 토큰 갱신 로직 — 완료 처리됨',                                    time: '어제',    read: true,  link: '/sprint',     project: 'CoWork 웹 플랫폼' },
  { id: 'n9',  type: 'doc',     from: '이디자인', title: '새 문서 생성됨',                body: '프론트엔드 컴포넌트 가이드 — UI/UX 리디자인 프로젝트',                time: '어제',    read: true,  link: '/docs/d3',    project: 'UI/UX 리디자인' },
  { id: 'n10', type: 'system',  from: 'CoWork',   title: '스프린트 3 시작',               body: '스프린트 3이 시작되었습니다 (2026-06-02 ~ 2026-06-15). 8개 태스크.',  time: '6일 전',  read: true,  link: '/sprint',     project: 'CoWork 웹 플랫폼' },
  { id: 'n11', type: 'system',  from: 'CoWork',   title: '프로젝트에 초대됨',             body: 'UI/UX 리디자인 프로젝트에 초대되었습니다.',                           time: '1주 전',  read: true,  link: '/projects',   project: 'UI/UX 리디자인' },
];

const TYPE_META: Record<NotiType, { icon: string; bg: string; color: string; label: string }> = {
  mention: { icon: '@',  bg: '#FFF0E6', color: '#D95B00', label: '멘션' },
  task:    { icon: '✓',  bg: '#EBF5FF', color: '#1A6FC4', label: '태스크' },
  pr:      { icon: '⑂',  bg: '#F3ECFF', color: '#7B3FC4', label: 'PR' },
  doc:     { icon: '📄', bg: '#EAFAF1', color: '#1A7A47', label: '문서' },
  system:  { icon: '⚙',  bg: '#F5F5F5', color: '#6B6B6B', label: '시스템' },
};

const AVATAR_COLOR: Record<string, string> = {
  '김개발': '#1A6FC4', '이디자인': '#D95B00', '박DBA': '#7B3FC4', '최기획': '#1A7A47', 'CoWork': '#1A1A1A',
};

const NAV_ITEMS = [
  { href: '/projects', label: '📋 프로젝트' },
  { href: '/kanban',   label: '📊 칸반 보드' },
  { href: '/sprint',   label: '🏃 스프린트' },
  { href: '/docs',     label: '📄 문서' },
];

function Sidebar() {
  return (
    <aside className="flex flex-col w-52 shrink-0 h-full border-r pt-5 pb-6 px-3 gap-1"
      style={{ background: 'var(--color-near-white)', borderColor: 'var(--color-light-gray)' }}>
      <p className="text-xs font-semibold px-3 mb-2" style={{ color: 'var(--color-gray)' }}>워크스페이스</p>
      {NAV_ITEMS.map(({ href, label }) => (
        <Link key={href} href={href} className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium"
          style={{ color: 'var(--color-dark-text)' }}>{label}</Link>
      ))}
      <div className="flex-1" />
      <Link href="/hub" className="px-3 py-2 rounded-lg text-sm" style={{ color: 'var(--color-mid-gray)' }}>← 메인 허브로</Link>
    </aside>
  );
}

export default function NotificationsPage() {
  const [notis, setNotis] = useState<Notification[]>(INIT_NOTIS);
  const [filter, setFilter] = useState<NotiFilter>('전체');

  const unreadCount = notis.filter(n => !n.read).length;

  function markAllRead() {
    setNotis(prev => prev.map(n => ({ ...n, read: true })));
  }

  function markRead(id: string) {
    setNotis(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  }

  const filtered = notis.filter(n => {
    if (filter === '읽지않음') return !n.read;
    if (filter === '멘션') return n.type === 'mention';
    if (filter === '태스크') return n.type === 'task';
    if (filter === '문서') return n.type === 'doc';
    return true;
  });

  // 날짜 그룹핑
  const today  = filtered.filter(n => ['방금','10분 전','32분 전','1시간 전','2시간 전','3시간 전','5시간 전'].includes(n.time));
  const yesterday = filtered.filter(n => n.time === '어제');
  const older  = filtered.filter(n => ['6일 전','1주 전'].includes(n.time));

  return (
    <div className="flex flex-col h-screen" style={{ background: 'var(--color-card-bg)' }}>
      <header className="flex items-center justify-between px-6 h-14 shrink-0 border-b"
        style={{ background: 'var(--color-near-white)', borderColor: 'var(--color-light-gray)' }}>
        <Link href="/hub" className="text-lg font-bold tracking-tight" style={{ color: 'var(--color-black)' }}>● CoWork</Link>
        <nav className="flex items-center gap-1">
          {['/notifications','/chat','/company'].map((href, i) => (
            <Link key={href} href={href} className="relative w-9 h-9 flex items-center justify-center rounded-lg text-lg hover:opacity-70"
              style={{ color: href === '/notifications' ? 'var(--color-accent)' : 'var(--color-dark-text)' }}>
              {['🔔','💬','👤'][i]}
              {href === '/notifications' && unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full" style={{ background: 'var(--color-accent)' }} />
              )}
            </Link>
          ))}
        </nav>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <Sidebar />

        <main className="flex-1 overflow-y-auto px-8 py-7">
          {/* 헤더 */}
          <div className="flex items-center justify-between mb-5">
            <div>
              <h1 className="text-2xl font-bold" style={{ color: 'var(--color-black)' }}>알림</h1>
              {unreadCount > 0 && (
                <p className="text-sm mt-0.5" style={{ color: 'var(--color-mid-gray)' }}>읽지 않은 알림 {unreadCount}개</p>
              )}
            </div>
            {unreadCount > 0 && (
              <button onClick={markAllRead} className="text-xs px-3 py-1.5 rounded-lg font-medium"
                style={{ color: 'var(--color-accent)', background: 'var(--color-accent-bg)', border: '1px solid var(--color-accent)' }}>
                모두 읽음 처리
              </button>
            )}
          </div>

          {/* 필터 탭 */}
          <div className="flex items-center gap-1 mb-6 border-b" style={{ borderColor: 'var(--color-light-gray)' }}>
            {(['전체','읽지않음','멘션','태스크','문서'] as NotiFilter[]).map(f => (
              <button key={f} onClick={() => setFilter(f)}
                className="px-4 py-2 text-sm font-semibold border-b-2 transition-colors -mb-px"
                style={{
                  borderColor: filter === f ? 'var(--color-accent)' : 'transparent',
                  color: filter === f ? 'var(--color-accent)' : 'var(--color-mid-gray)',
                }}>
                {f}
                {f === '읽지않음' && unreadCount > 0 && (
                  <span className="ml-1.5 text-xs px-1.5 py-0.5 rounded-full font-bold text-white"
                    style={{ background: 'var(--color-accent)' }}>{unreadCount}</span>
                )}
              </button>
            ))}
          </div>

          {/* 알림 그룹 */}
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24" style={{ color: 'var(--color-gray)' }}>
              <div className="text-4xl mb-3">🔔</div>
              <p className="text-sm">알림이 없습니다</p>
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              {today.length > 0 && <NotiGroup label="오늘" items={today} onRead={markRead} />}
              {yesterday.length > 0 && <NotiGroup label="어제" items={yesterday} onRead={markRead} />}
              {older.length > 0 && <NotiGroup label="이전" items={older} onRead={markRead} />}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

function NotiGroup({ label, items, onRead }: { label: string; items: Notification[]; onRead: (id: string) => void }) {
  return (
    <section>
      <p className="text-xs font-semibold mb-2" style={{ color: 'var(--color-gray)' }}>{label}</p>
      <div className="flex flex-col gap-2">
        {items.map(n => <NotiItem key={n.id} noti={n} onRead={onRead} />)}
      </div>
    </section>
  );
}

function NotiItem({ noti, onRead }: { noti: Notification; onRead: (id: string) => void }) {
  const meta = TYPE_META[noti.type];
  return (
    <Link href={noti.link} onClick={() => onRead(noti.id)}
      className="flex items-start gap-4 px-5 py-4 rounded-xl border transition-all hover:shadow-sm"
      style={{
        background: noti.read ? 'var(--color-near-white)' : 'var(--color-accent-bg)',
        borderColor: noti.read ? 'var(--color-light-gray)' : 'rgba(217,91,0,0.2)',
      }}>
      {/* 타입 아이콘 */}
      <div className="relative shrink-0">
        <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm"
          style={{ background: AVATAR_COLOR[noti.from] ?? '#ABABAB', color: '#fff' }}>
          {noti.from[0]}
        </div>
        <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold border-2 border-white"
          style={{ background: meta.bg, color: meta.color }}>
          {meta.icon}
        </div>
      </div>

      {/* 내용 */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-sm font-semibold" style={{ color: 'var(--color-black)' }}>{noti.title}</p>
            <p className="text-xs mt-0.5 leading-relaxed" style={{ color: 'var(--color-mid-gray)' }}>{noti.body}</p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {!noti.read && <span className="w-2 h-2 rounded-full shrink-0" style={{ background: 'var(--color-accent)' }} />}
            <span className="text-xs" style={{ color: 'var(--color-gray)' }}>{noti.time}</span>
          </div>
        </div>
        {noti.project && (
          <p className="text-xs mt-1.5 px-2 py-0.5 rounded inline-block"
            style={{ background: 'var(--color-panel-bg)', color: 'var(--color-gray)' }}>{noti.project}</p>
        )}
      </div>
    </Link>
  );
}
