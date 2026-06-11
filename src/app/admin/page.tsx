'use client';

import Link from 'next/link';
import { useState } from 'react';

type AdminTab = 'dashboard' | 'workspaces' | 'users' | 'system' | 'logs';

interface Workspace {
  id: string;
  name: string;
  plan: 'Free' | 'Pro' | 'Enterprise';
  members: number;
  projects: number;
  storage: string;
  createdAt: string;
  status: '활성' | '정지' | '만료';
  mrr: string;
}

const WORKSPACES: Workspace[] = [
  { id: 'w1', name: 'CoWork Inc.',      plan: 'Pro',        members: 12, projects: 6,  storage: '4.2 GB', createdAt: '2026-01-01', status: '활성', mrr: '₩89,000' },
  { id: 'w2', name: 'TechLab Korea',    plan: 'Enterprise', members: 47, projects: 23, storage: '28 GB',  createdAt: '2025-11-15', status: '활성', mrr: '₩490,000' },
  { id: 'w3', name: 'DesignStudio',     plan: 'Pro',        members: 8,  projects: 12, storage: '7.1 GB', createdAt: '2026-02-20', status: '활성', mrr: '₩69,000' },
  { id: 'w4', name: 'StartupX',         plan: 'Free',       members: 3,  projects: 2,  storage: '0.8 GB', createdAt: '2026-04-01', status: '활성', mrr: '₩0' },
  { id: 'w5', name: 'OldCorp',          plan: 'Pro',        members: 5,  projects: 3,  storage: '1.2 GB', createdAt: '2025-06-01', status: '만료', mrr: '₩0' },
  { id: 'w6', name: 'SuspendedCo',      plan: 'Free',       members: 2,  projects: 1,  storage: '0.1 GB', createdAt: '2026-05-01', status: '정지', mrr: '₩0' },
];

const PLAN_STYLE: Record<string, { bg: string; color: string }> = {
  'Free':       { bg: '#F5F5F5', color: '#6B6B6B' },
  'Pro':        { bg: '#FFF0E6', color: '#D95B00' },
  'Enterprise': { bg: '#1A1A1A', color: '#FFF' },
};

const WS_STATUS_STYLE: Record<string, { bg: string; color: string; dot: string }> = {
  '활성': { bg: '#EAFAF1', color: '#1A7A47', dot: '#1A7A47' },
  '정지': { bg: '#FDECEA', color: '#C0392B', dot: '#C0392B' },
  '만료': { bg: '#F5F5F5', color: '#6B6B6B', dot: '#ABABAB' },
};

const ADMIN_TABS: { id: AdminTab; label: string; icon: string }[] = [
  { id: 'dashboard',   label: '대시보드',    icon: '📊' },
  { id: 'workspaces',  label: '워크스페이스', icon: '🏢' },
  { id: 'users',       label: '전체 사용자', icon: '👥' },
  { id: 'system',      label: '시스템 설정', icon: '⚙️' },
  { id: 'logs',        label: '서버 로그',   icon: '📋' },
];

const SYSTEM_LOGS = [
  { level: 'INFO',  time: '14:32:01', msg: 'User pm@cowork.io logged in from 203.0.113.45' },
  { level: 'INFO',  time: '14:31:44', msg: 'WebSocket connection established for workspace cowork-inc' },
  { level: 'WARN',  time: '14:30:12', msg: 'Rate limit threshold reached for API /api/v1/tasks (workspace: techlab)' },
  { level: 'INFO',  time: '14:28:55', msg: 'Sprint #3 started in project CoWork 웹 플랫폼' },
  { level: 'ERROR', time: '14:25:03', msg: 'Failed to send email notification to back@oldcorp.com: SMTP timeout' },
  { level: 'INFO',  time: '14:22:11', msg: 'Document d1 updated by pm@cowork.io (revision 14)' },
  { level: 'WARN',  time: '14:18:30', msg: 'Storage quota at 85% for workspace designstudio' },
  { level: 'INFO',  time: '14:15:00', msg: 'Daily backup completed successfully (4 workspaces, 2.3 GB)' },
  { level: 'INFO',  time: '13:59:47', msg: 'New user invited: new1@example.com to workspace cowork-inc' },
  { level: 'ERROR', time: '13:45:22', msg: 'Database connection pool exhausted (pool: 20/20, queued: 3)' },
];

const LOG_LEVEL_STYLE: Record<string, { bg: string; color: string }> = {
  'INFO':  { bg: '#EBF5FF', color: '#1A6FC4' },
  'WARN':  { bg: '#FFF8E6', color: '#A07000' },
  'ERROR': { bg: '#FDECEA', color: '#C0392B' },
};

export default function AdminPage() {
  const [tab, setTab] = useState<AdminTab>('dashboard');

  const totalUsers = WORKSPACES.reduce((s, w) => s + w.members, 0);
  const activeWs   = WORKSPACES.filter(w => w.status === '활성').length;
  const totalMRR   = '₩648,000';

  return (
    <div className="flex flex-col h-screen" style={{ background: 'var(--color-card-bg)' }}>
      {/* 앱바 — 다크 테마 */}
      <header className="flex items-center justify-between px-6 h-14 shrink-0 border-b"
        style={{ background: 'var(--color-black)', borderColor: '#333' }}>
        <div className="flex items-center gap-3">
          <span className="text-lg font-bold tracking-tight text-white">● CoWork</span>
          <span className="px-2 py-0.5 rounded text-xs font-bold"
            style={{ background: 'var(--color-accent)', color: '#fff' }}>ADMIN</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs" style={{ color: '#888' }}>플랫폼 관리자 모드</span>
          <Link href="/hub" className="px-3 py-1.5 rounded-lg text-xs font-medium"
            style={{ background: '#2b2b2b', color: '#ccc', border: '1px solid #444' }}>
            ← 워크스페이스로
          </Link>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* 관리자 사이드바 */}
        <aside className="flex flex-col w-52 shrink-0 border-r pt-5 pb-6 px-3 gap-1"
          style={{ background: '#1e1e1e', borderColor: '#333' }}>
          <p className="text-xs font-semibold px-3 mb-2" style={{ color: '#666' }}>PLATFORM</p>
          {ADMIN_TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-left font-medium w-full"
              style={{
                background: tab === t.id ? 'rgba(217,91,0,0.15)' : 'transparent',
                color: tab === t.id ? 'var(--color-accent)' : '#aaa',
              }}>
              <span>{t.icon}</span>{t.label}
            </button>
          ))}
        </aside>

        {/* 콘텐츠 */}
        <main className="flex-1 overflow-y-auto px-8 py-7">

          {/* 대시보드 */}
          {tab === 'dashboard' && (
            <div className="flex flex-col gap-6">
              <div>
                <h1 className="text-2xl font-bold" style={{ color: 'var(--color-black)' }}>플랫폼 대시보드</h1>
                <p className="text-sm mt-0.5" style={{ color: 'var(--color-mid-gray)' }}>전체 서비스 현황 · 실시간</p>
              </div>

              {/* 핵심 지표 */}
              <div className="grid grid-cols-4 gap-4">
                {[
                  { icon: '🏢', label: '활성 워크스페이스', value: `${activeWs}개`,   sub: `전체 ${WORKSPACES.length}개`, color: 'var(--color-black)' },
                  { icon: '👥', label: '전체 사용자',       value: `${totalUsers}명`, sub: '활성 75명 (어제 대비 +2)', color: 'var(--color-accent)' },
                  { icon: '💰', label: '월간 반복 수익',     value: totalMRR,          sub: '전월 대비 +12%', color: '#1A7A47' },
                  { icon: '⚡', label: 'API 응답시간',      value: '142ms',           sub: '99.9% 가용성', color: '#1A6FC4' },
                ].map(s => (
                  <div key={s.label} className="rounded-xl border p-5" style={{ background: 'var(--color-near-white)', borderColor: 'var(--color-light-gray)' }}>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-xl">{s.icon}</span>
                      <p className="text-xs" style={{ color: 'var(--color-gray)' }}>{s.label}</p>
                    </div>
                    <p className="text-2xl font-bold" style={{ color: s.color }}>{s.value}</p>
                    <p className="text-xs mt-1" style={{ color: 'var(--color-gray)' }}>{s.sub}</p>
                  </div>
                ))}
              </div>

              {/* 차트 영역 */}
              <div className="grid grid-cols-2 gap-4">
                {/* 플랜 분포 */}
                <div className="rounded-xl border p-5" style={{ background: 'var(--color-near-white)', borderColor: 'var(--color-light-gray)' }}>
                  <p className="text-sm font-bold mb-4" style={{ color: 'var(--color-black)' }}>플랜별 워크스페이스</p>
                  {[
                    { plan: 'Enterprise', count: 1, pct: 17, color: '#1A1A1A' },
                    { plan: 'Pro',        count: 3, pct: 50, color: 'var(--color-accent)' },
                    { plan: 'Free',       count: 2, pct: 33, color: '#ABABAB' },
                  ].map(p => (
                    <div key={p.plan} className="mb-3">
                      <div className="flex justify-between mb-1.5">
                        <span className="text-xs font-medium" style={{ color: 'var(--color-dark-text)' }}>{p.plan}</span>
                        <span className="text-xs" style={{ color: 'var(--color-gray)' }}>{p.count}개 ({p.pct}%)</span>
                      </div>
                      <div className="h-2 rounded-full" style={{ background: 'var(--color-light-gray)' }}>
                        <div className="h-full rounded-full" style={{ width: `${p.pct}%`, background: p.color }} />
                      </div>
                    </div>
                  ))}
                </div>

                {/* 주간 활동 */}
                <div className="rounded-xl border p-5" style={{ background: 'var(--color-near-white)', borderColor: 'var(--color-light-gray)' }}>
                  <p className="text-sm font-bold mb-4" style={{ color: 'var(--color-black)' }}>일별 API 호출 수 (7일)</p>
                  <div className="flex items-end justify-between h-28 gap-2">
                    {[
                      { day: '화', val: 62 }, { day: '수', val: 78 }, { day: '목', val: 55 },
                      { day: '금', val: 91 }, { day: '토', val: 34 }, { day: '일', val: 29 },
                      { day: '오늘', val: 84 },
                    ].map(({ day, val }) => (
                      <div key={day} className="flex flex-col items-center gap-1 flex-1">
                        <span className="text-xs font-bold" style={{ color: 'var(--color-accent)' }}>{val}k</span>
                        <div className="w-full rounded-t-md" style={{ height: `${val}%`, background: day === '오늘' ? 'var(--color-accent)' : 'var(--color-light-gray)' }} />
                        <span className="text-xs" style={{ color: 'var(--color-gray)' }}>{day}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* 시스템 상태 */}
              <div className="rounded-xl border p-5" style={{ background: 'var(--color-near-white)', borderColor: 'var(--color-light-gray)' }}>
                <p className="text-sm font-bold mb-4" style={{ color: 'var(--color-black)' }}>서비스 상태</p>
                <div className="grid grid-cols-4 gap-3">
                  {[
                    { name: 'API 서버',   status: '정상', uptime: '99.97%' },
                    { name: 'WebSocket', status: '정상', uptime: '99.91%' },
                    { name: 'DB (주)',   status: '정상', uptime: '99.99%' },
                    { name: '파일 저장', status: '점검', uptime: '98.50%' },
                  ].map(svc => (
                    <div key={svc.name} className="rounded-lg px-4 py-3 border"
                      style={{ background: 'var(--color-card-bg)', borderColor: 'var(--color-light-gray)' }}>
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className="w-2 h-2 rounded-full" style={{ background: svc.status === '정상' ? '#1A7A47' : '#E6A800' }} />
                        <p className="text-xs font-semibold" style={{ color: 'var(--color-dark-text)' }}>{svc.name}</p>
                      </div>
                      <p className="text-xs" style={{ color: svc.status === '정상' ? '#1A7A47' : '#A07000' }}>{svc.status}</p>
                      <p className="text-xs" style={{ color: 'var(--color-gray)' }}>업타임 {svc.uptime}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 워크스페이스 */}
          {tab === 'workspaces' && (
            <div>
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-xl font-bold" style={{ color: 'var(--color-black)' }}>워크스페이스 관리</h2>
                <button className="px-3 py-1.5 rounded-lg text-xs font-bold hover:opacity-90"
                  style={{ background: 'var(--color-accent)', color: '#fff' }}>+ 워크스페이스 생성</button>
              </div>
              <div className="rounded-xl border overflow-hidden" style={{ borderColor: 'var(--color-light-gray)' }}>
                <div className="flex items-center gap-4 px-5 py-2.5 text-xs font-semibold"
                  style={{ background: 'var(--color-panel-bg)', color: 'var(--color-gray)' }}>
                  <span className="flex-1">워크스페이스</span>
                  <span className="w-24 text-center">플랜</span>
                  <span className="w-16 text-center">구성원</span>
                  <span className="w-16 text-center">프로젝트</span>
                  <span className="w-20 text-center">스토리지</span>
                  <span className="w-20 text-center">MRR</span>
                  <span className="w-20 text-center">상태</span>
                  <span className="w-20" />
                </div>
                {WORKSPACES.map((w, i) => (
                  <div key={w.id} className={`flex items-center gap-4 px-5 py-4 ${i < WORKSPACES.length - 1 ? 'border-b' : ''}`}
                    style={{ background: 'var(--color-near-white)', borderColor: 'var(--color-light-gray)' }}>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold" style={{ color: 'var(--color-black)' }}>{w.name}</p>
                      <p className="text-xs" style={{ color: 'var(--color-gray)' }}>{w.createdAt} 생성</p>
                    </div>
                    <div className="w-24 flex justify-center">
                      <span className="text-xs px-2 py-0.5 rounded font-bold"
                        style={{ background: PLAN_STYLE[w.plan].bg, color: PLAN_STYLE[w.plan].color }}>{w.plan}</span>
                    </div>
                    <span className="w-16 text-center text-sm font-semibold" style={{ color: 'var(--color-dark-text)' }}>{w.members}명</span>
                    <span className="w-16 text-center text-sm" style={{ color: 'var(--color-dark-text)' }}>{w.projects}개</span>
                    <span className="w-20 text-center text-xs" style={{ color: 'var(--color-mid-gray)' }}>{w.storage}</span>
                    <span className="w-20 text-center text-sm font-bold" style={{ color: '#1A7A47' }}>{w.mrr}</span>
                    <div className="w-20 flex justify-center">
                      <span className="text-xs px-2 py-0.5 rounded-full flex items-center gap-1"
                        style={{ background: WS_STATUS_STYLE[w.status].bg, color: WS_STATUS_STYLE[w.status].color }}>
                        <span className="w-1.5 h-1.5 rounded-full" style={{ background: WS_STATUS_STYLE[w.status].dot }} />
                        {w.status}
                      </span>
                    </div>
                    <div className="w-20 flex justify-end gap-1">
                      <button className="text-xs px-2 py-1 rounded hover:opacity-80"
                        style={{ background: 'var(--color-panel-bg)', color: 'var(--color-mid-gray)' }}>관리</button>
                      {w.status === '활성' && (
                        <button className="text-xs px-2 py-1 rounded hover:opacity-80"
                          style={{ background: '#FDECEA', color: '#C0392B' }}>정지</button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 사용자 */}
          {tab === 'users' && (
            <div>
              <h2 className="text-xl font-bold mb-5" style={{ color: 'var(--color-black)' }}>전체 사용자</h2>
              <div className="grid grid-cols-3 gap-4 mb-5">
                {[
                  { label: '전체 사용자', value: '77명', color: 'var(--color-black)' },
                  { label: '이번 주 신규', value: '+3명', color: '#1A7A47' },
                  { label: '30일 활성', value: '69명', color: 'var(--color-accent)' },
                ].map(s => (
                  <div key={s.label} className="rounded-xl border p-5" style={{ background: 'var(--color-near-white)', borderColor: 'var(--color-light-gray)' }}>
                    <p className="text-xs mb-2" style={{ color: 'var(--color-gray)' }}>{s.label}</p>
                    <p className="text-2xl font-bold" style={{ color: s.color }}>{s.value}</p>
                  </div>
                ))}
              </div>
              <div className="rounded-xl border overflow-hidden" style={{ borderColor: 'var(--color-light-gray)' }}>
                <div className="flex items-center gap-4 px-5 py-2.5 text-xs font-semibold"
                  style={{ background: 'var(--color-panel-bg)', color: 'var(--color-gray)' }}>
                  <span className="flex-1">사용자</span>
                  <span className="w-36">워크스페이스</span>
                  <span className="w-24 text-center">역할</span>
                  <span className="w-28 text-right">가입일</span>
                </div>
                {[
                  { name: '최기획',   email: 'pm@cowork.io',    ws: 'CoWork Inc.',   role: '오너',   joined: '2026-01-01', color: '#1A7A47' },
                  { name: '김개발',   email: 'dev@cowork.io',   ws: 'CoWork Inc.',   role: '관리자', joined: '2026-01-12', color: '#1A6FC4' },
                  { name: '이디자인', email: 'design@cowork.io',ws: 'CoWork Inc.',   role: '편집자', joined: '2026-01-15', color: '#D95B00' },
                  { name: '박DBA',    email: 'dba@cowork.io',   ws: 'CoWork Inc.',   role: '편집자', joined: '2026-02-01', color: '#7B3FC4' },
                  { name: 'TL 관리자', email: 'admin@techlab.io',ws: 'TechLab Korea', role: '오너',  joined: '2025-11-15', color: '#1A7A47' },
                ].map((u, i) => (
                  <div key={u.email} className={`flex items-center gap-4 px-5 py-3.5 ${i < 4 ? 'border-b' : ''}`}
                    style={{ background: 'var(--color-near-white)', borderColor: 'var(--color-light-gray)' }}>
                    <div className="flex-1 flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
                        style={{ background: u.color }}>{u.name[0]}</div>
                      <div>
                        <p className="text-sm font-semibold" style={{ color: 'var(--color-black)' }}>{u.name}</p>
                        <p className="text-xs" style={{ color: 'var(--color-gray)' }}>{u.email}</p>
                      </div>
                    </div>
                    <span className="w-36 text-xs" style={{ color: 'var(--color-mid-gray)' }}>{u.ws}</span>
                    <div className="w-24 flex justify-center">
                      <span className="text-xs px-2 py-0.5 rounded font-semibold"
                        style={{ background: PLAN_STYLE.Free.bg, color: 'var(--color-mid-gray)' }}>{u.role}</span>
                    </div>
                    <span className="w-28 text-right text-xs" style={{ color: 'var(--color-gray)' }}>{u.joined}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 시스템 설정 */}
          {tab === 'system' && (
            <div className="max-w-2xl flex flex-col gap-5">
              <h2 className="text-xl font-bold" style={{ color: 'var(--color-black)' }}>시스템 설정</h2>
              {[
                { section: '이메일 / SMTP', fields: [
                  { label: 'SMTP 호스트', val: 'smtp.sendgrid.net' },
                  { label: 'SMTP 포트', val: '587' },
                  { label: '발신 이메일', val: 'no-reply@cowork.io' },
                ]},
                { section: '스토리지', fields: [
                  { label: '스토리지 제공자', val: 'AWS S3' },
                  { label: '버킷명', val: 'cowork-prod-files' },
                  { label: 'CDN 도메인', val: 'cdn.cowork.io' },
                ]},
                { section: '기본값', fields: [
                  { label: 'Free 플랜 스토리지 한도', val: '1 GB' },
                  { label: 'Pro 플랜 스토리지 한도', val: '100 GB' },
                  { label: '세션 만료 시간', val: '24시간' },
                ]},
              ].map(({ section, fields }) => (
                <div key={section} className="rounded-xl border p-5" style={{ background: 'var(--color-near-white)', borderColor: 'var(--color-light-gray)' }}>
                  <p className="text-sm font-bold mb-4" style={{ color: 'var(--color-black)' }}>{section}</p>
                  <div className="flex flex-col gap-3">
                    {fields.map(f => (
                      <div key={f.label} className="flex items-center gap-4">
                        <label className="text-xs font-semibold w-40 shrink-0" style={{ color: 'var(--color-gray)' }}>{f.label}</label>
                        <input defaultValue={f.val} className="flex-1 px-3 py-2 rounded-lg text-sm outline-none font-mono"
                          style={{ background: 'var(--color-card-bg)', border: '1px solid var(--color-light-gray)', color: 'var(--color-dark-text)' }}
                          onFocus={e => e.target.style.borderColor = 'var(--color-accent)'}
                          onBlur={e => e.target.style.borderColor = 'var(--color-light-gray)'} />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              <div className="flex justify-end">
                <button className="px-4 py-2 rounded-lg text-sm font-bold hover:opacity-90"
                  style={{ background: 'var(--color-accent)', color: '#fff' }}>설정 저장</button>
              </div>
            </div>
          )}

          {/* 로그 */}
          {tab === 'logs' && (
            <div>
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-xl font-bold" style={{ color: 'var(--color-black)' }}>서버 로그</h2>
                <div className="flex gap-2">
                  {['ALL','INFO','WARN','ERROR'].map(l => (
                    <button key={l} className="px-3 py-1.5 rounded-lg text-xs font-semibold"
                      style={{ background: l === 'ALL' ? 'var(--color-accent)' : 'var(--color-near-white)', color: l === 'ALL' ? '#fff' : 'var(--color-mid-gray)', border: '1px solid var(--color-light-gray)' }}>
                      {l}
                    </button>
                  ))}
                </div>
              </div>
              <div className="rounded-xl border overflow-hidden font-mono" style={{ borderColor: 'var(--color-light-gray)', background: '#111' }}>
                {SYSTEM_LOGS.map((log, i) => (
                  <div key={i} className={`flex items-start gap-3 px-4 py-2.5 text-xs ${i < SYSTEM_LOGS.length - 1 ? 'border-b border-gray-800' : ''}`}>
                    <span style={{ color: '#555' }}>{log.time}</span>
                    <span className="px-2 py-0.5 rounded text-xs font-bold shrink-0"
                      style={{ background: LOG_LEVEL_STYLE[log.level].bg, color: LOG_LEVEL_STYLE[log.level].color }}>
                      {log.level}
                    </span>
                    <span style={{ color: log.level === 'ERROR' ? '#FF6B6B' : log.level === 'WARN' ? '#FFB84D' : '#bbb' }}>
                      {log.msg}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}
