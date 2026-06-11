'use client';

import Link from 'next/link';
import { useState } from 'react';

type CompanyTab = 'overview' | 'billing' | 'security' | 'audit';

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
      <div className="mt-4 pt-4 border-t flex flex-col gap-1" style={{ borderColor: 'var(--color-light-gray)' }}>
        <p className="text-xs font-semibold px-3 mb-1" style={{ color: 'var(--color-gray)' }}>회사 관리</p>
        <Link href="/company" className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium"
          style={{ background: 'var(--color-accent-bg)', color: 'var(--color-accent)' }}>🏢 회사 설정</Link>
        <Link href="/company/members" className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium"
          style={{ color: 'var(--color-dark-text)' }}>👥 구성원·권한</Link>
      </div>
      <div className="flex-1" />
      <Link href="/hub" className="px-3 py-2 rounded-lg text-sm" style={{ color: 'var(--color-mid-gray)' }}>← 메인 허브로</Link>
    </aside>
  );
}

function StatCard({ icon, label, value, sub, color }: { icon: string; label: string; value: string; sub?: string; color?: string }) {
  return (
    <div className="rounded-xl border p-5" style={{ background: 'var(--color-near-white)', borderColor: 'var(--color-light-gray)' }}>
      <div className="flex items-center gap-2 mb-3">
        <span className="text-xl">{icon}</span>
        <p className="text-xs font-semibold" style={{ color: 'var(--color-gray)' }}>{label}</p>
      </div>
      <p className="text-2xl font-bold" style={{ color: color ?? 'var(--color-black)' }}>{value}</p>
      {sub && <p className="text-xs mt-1" style={{ color: 'var(--color-gray)' }}>{sub}</p>}
    </div>
  );
}

const AUDIT_LOGS = [
  { user: '최기획',   action: '프로젝트 생성',           target: 'CoWork 웹 플랫폼',      time: '오늘 14:32', icon: '📋' },
  { user: '김개발',   action: '구성원 초대',              target: 'park@cowork.io',        time: '오늘 11:00', icon: '👤' },
  { user: '이디자인', action: '문서 게시',                target: '컴포넌트 가이드',        time: '어제 18:21', icon: '📄' },
  { user: '박DBA',    action: '프로젝트 설정 변경',       target: 'API 서버 v2',           time: '어제 09:15', icon: '⚙️' },
  { user: '최기획',   action: '스프린트 시작',            target: '스프린트 3',             time: '6일 전',     icon: '🏃' },
  { user: '김개발',   action: '구성원 역할 변경',         target: '이디자인 → 편집자',      time: '1주 전',     icon: '🔑' },
];

const AVATAR_COLOR: Record<string, string> = {
  '김개발': '#1A6FC4', '이디자인': '#D95B00', '박DBA': '#7B3FC4', '최기획': '#1A7A47',
};

export default function CompanyPage() {
  const [tab, setTab] = useState<CompanyTab>('overview');
  const [companyName, setCompanyName] = useState('CoWork Inc.');
  const [saved, setSaved] = useState(false);

  const TABS: { id: CompanyTab; label: string }[] = [
    { id: 'overview',  label: '개요' },
    { id: 'billing',   label: '플랜·결제' },
    { id: 'security',  label: '보안' },
    { id: 'audit',     label: '감사 로그' },
  ];

  return (
    <div className="flex flex-col h-screen" style={{ background: 'var(--color-card-bg)' }}>
      <header className="flex items-center justify-between px-6 h-14 shrink-0 border-b"
        style={{ background: 'var(--color-near-white)', borderColor: 'var(--color-light-gray)' }}>
        <Link href="/hub" className="text-lg font-bold tracking-tight" style={{ color: 'var(--color-black)' }}>● CoWork</Link>
        <nav className="flex items-center gap-1">
          {['/notifications','/chat','/company'].map((href, i) => (
            <Link key={href} href={href} className="w-9 h-9 flex items-center justify-center rounded-lg text-lg hover:opacity-70"
              style={{ color: href === '/company' ? 'var(--color-accent)' : 'var(--color-dark-text)' }}>{['🔔','💬','👤'][i]}</Link>
          ))}
        </nav>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <Sidebar />

        <main className="flex-1 overflow-y-auto px-8 py-7">
          {/* 헤더 */}
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl font-bold text-white"
              style={{ background: 'var(--color-black)' }}>C</div>
            <div>
              <h1 className="text-2xl font-bold" style={{ color: 'var(--color-black)' }}>CoWork Inc.</h1>
              <p className="text-sm" style={{ color: 'var(--color-mid-gray)' }}>cowork.io · 생성일 2026-01-01</p>
            </div>
            <span className="ml-auto px-3 py-1 rounded-full text-xs font-bold"
              style={{ background: 'var(--color-accent-bg)', color: 'var(--color-accent)' }}>Pro 플랜</span>
          </div>

          {/* 탭 */}
          <div className="flex items-center gap-1 mb-6 border-b" style={{ borderColor: 'var(--color-light-gray)' }}>
            {TABS.map(t => (
              <button key={t.id} onClick={() => setTab(t.id)}
                className="px-4 py-2 text-sm font-semibold border-b-2 transition-colors -mb-px"
                style={{ borderColor: tab === t.id ? 'var(--color-accent)' : 'transparent', color: tab === t.id ? 'var(--color-accent)' : 'var(--color-mid-gray)' }}>
                {t.label}
              </button>
            ))}
          </div>

          {/* 개요 */}
          {tab === 'overview' && (
            <div className="flex flex-col gap-6">
              <div className="grid grid-cols-4 gap-4">
                <StatCard icon="👥" label="전체 구성원" value="12명" sub="활성 10명" />
                <StatCard icon="📋" label="프로젝트" value="6개" sub="진행중 3개" color="var(--color-accent)" />
                <StatCard icon="🏃" label="활성 스프린트" value="2개" sub="이번 주 마감 1개" />
                <StatCard icon="📄" label="문서" value="47개" sub="이번 달 +9개" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* 최근 프로젝트 */}
                <div className="rounded-xl border p-5" style={{ background: 'var(--color-near-white)', borderColor: 'var(--color-light-gray)' }}>
                  <p className="text-sm font-bold mb-4" style={{ color: 'var(--color-black)' }}>활성 프로젝트</p>
                  {[
                    { name: 'CoWork 웹 플랫폼', pct: 68, color: 'var(--color-accent)' },
                    { name: 'UI/UX 리디자인',   pct: 42, color: '#1A6FC4' },
                    { name: '데이터 분석 대시보드', pct: 55, color: '#7B3FC4' },
                  ].map(p => (
                    <div key={p.name} className="mb-3">
                      <div className="flex justify-between mb-1">
                        <span className="text-xs font-medium" style={{ color: 'var(--color-dark-text)' }}>{p.name}</span>
                        <span className="text-xs font-bold" style={{ color: p.color }}>{p.pct}%</span>
                      </div>
                      <div className="h-1.5 rounded-full" style={{ background: 'var(--color-light-gray)' }}>
                        <div className="h-full rounded-full" style={{ width: `${p.pct}%`, background: p.color }} />
                      </div>
                    </div>
                  ))}
                </div>

                {/* 회사 정보 */}
                <div className="rounded-xl border p-5" style={{ background: 'var(--color-near-white)', borderColor: 'var(--color-light-gray)' }}>
                  <p className="text-sm font-bold mb-4" style={{ color: 'var(--color-black)' }}>회사 정보</p>
                  <div className="flex flex-col gap-3">
                    <div>
                      <label className="text-xs font-semibold block mb-1" style={{ color: 'var(--color-gray)' }}>회사명</label>
                      <input value={companyName} onChange={e => setCompanyName(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg text-sm outline-none"
                        style={{ background: 'var(--color-card-bg)', border: '1px solid var(--color-light-gray)', color: 'var(--color-dark-text)' }}
                        onFocus={e => e.target.style.borderColor = 'var(--color-accent)'}
                        onBlur={e => e.target.style.borderColor = 'var(--color-light-gray)'} />
                    </div>
                    {[
                      { label: '도메인', val: 'cowork.io' },
                      { label: '업종', val: 'SaaS · 소프트웨어' },
                      { label: '지역', val: '대한민국 서울' },
                    ].map(({ label, val }) => (
                      <div key={label}>
                        <p className="text-xs font-semibold mb-1" style={{ color: 'var(--color-gray)' }}>{label}</p>
                        <p className="text-sm" style={{ color: 'var(--color-dark-text)' }}>{val}</p>
                      </div>
                    ))}
                    <div className="flex justify-end pt-1">
                      {saved && <span className="text-xs mr-3 self-center" style={{ color: '#1A7A47' }}>✓ 저장됨</span>}
                      <button onClick={() => { setSaved(true); setTimeout(() => setSaved(false), 2000); }}
                        className="px-3 py-1.5 rounded-lg text-xs font-bold hover:opacity-90"
                        style={{ background: 'var(--color-accent)', color: '#fff' }}>저장</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 플랜·결제 */}
          {tab === 'billing' && (
            <div className="max-w-2xl flex flex-col gap-5">
              {/* 현재 플랜 */}
              <div className="rounded-xl border p-6" style={{ background: 'var(--color-near-white)', borderColor: 'var(--color-light-gray)' }}>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-xs font-semibold mb-1" style={{ color: 'var(--color-gray)' }}>현재 플랜</p>
                    <p className="text-xl font-bold" style={{ color: 'var(--color-black)' }}>Pro</p>
                    <p className="text-sm" style={{ color: 'var(--color-mid-gray)' }}>월 ₩29,000 · 구성원당 ₩5,000</p>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-bold"
                    style={{ background: 'var(--color-accent-bg)', color: 'var(--color-accent)' }}>활성</span>
                </div>
                <div className="grid grid-cols-3 gap-3 text-sm">
                  {[['구성원','12 / 무제한'],['프로젝트','6 / 무제한'],['스토리지','4.2 GB / 100 GB']].map(([k, v]) => (
                    <div key={k} className="rounded-lg px-3 py-2" style={{ background: 'var(--color-card-bg)' }}>
                      <p className="text-xs" style={{ color: 'var(--color-gray)' }}>{k}</p>
                      <p className="font-semibold" style={{ color: 'var(--color-dark-text)' }}>{v}</p>
                    </div>
                  ))}
                </div>
                <p className="text-xs mt-3" style={{ color: 'var(--color-gray)' }}>다음 결제일: 2026-07-01 · ₩89,000</p>
              </div>

              {/* 플랜 업그레이드 */}
              <div className="rounded-xl border p-6" style={{ background: 'var(--color-near-white)', borderColor: 'var(--color-light-gray)' }}>
                <p className="text-sm font-bold mb-4" style={{ color: 'var(--color-black)' }}>Enterprise 업그레이드</p>
                <div className="grid grid-cols-2 gap-3 mb-4">
                  {['SSO / SAML 지원','감사 로그 무제한','전담 CSM','SLA 99.99%','온프레미스 설치','커스텀 계약'].map(f => (
                    <div key={f} className="flex items-center gap-2 text-sm" style={{ color: 'var(--color-dark-text)' }}>
                      <span style={{ color: '#1A7A47' }}>✓</span>{f}
                    </div>
                  ))}
                </div>
                <button className="w-full py-2.5 rounded-xl text-sm font-bold"
                  style={{ background: 'var(--color-black)', color: '#fff' }}>영업팀 문의하기</button>
              </div>

              {/* 결제 내역 */}
              <div className="rounded-xl border overflow-hidden" style={{ background: 'var(--color-near-white)', borderColor: 'var(--color-light-gray)' }}>
                <div className="px-5 py-3 border-b" style={{ borderColor: 'var(--color-light-gray)' }}>
                  <p className="text-sm font-bold" style={{ color: 'var(--color-black)' }}>결제 내역</p>
                </div>
                {[
                  { date: '2026-06-01', amount: '₩89,000', status: '결제 완료' },
                  { date: '2026-05-01', amount: '₩89,000', status: '결제 완료' },
                  { date: '2026-04-01', amount: '₩74,000', status: '결제 완료' },
                ].map((r, i) => (
                  <div key={r.date} className={`flex items-center px-5 py-3 text-sm ${i < 2 ? 'border-b' : ''}`}
                    style={{ borderColor: 'var(--color-light-gray)' }}>
                    <span className="flex-1" style={{ color: 'var(--color-dark-text)' }}>{r.date}</span>
                    <span className="font-semibold" style={{ color: 'var(--color-black)' }}>{r.amount}</span>
                    <span className="ml-4 text-xs px-2 py-0.5 rounded-full" style={{ background: '#EAFAF1', color: '#1A7A47' }}>{r.status}</span>
                    <button className="ml-3 text-xs" style={{ color: 'var(--color-accent)' }}>영수증</button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 보안 */}
          {tab === 'security' && (
            <div className="max-w-xl flex flex-col gap-5">
              {[
                { title: '2단계 인증 (2FA)', desc: '모든 구성원에게 2FA 의무화. 미설정 시 로그인 제한.', on: true },
                { title: 'SSO (Single Sign-On)', desc: 'Google Workspace 또는 SAML 2.0 제공자로 로그인.', on: false },
                { title: 'IP 허용 목록', desc: '지정된 IP 범위에서만 접속 허용. Enterprise 전용.', on: false },
                { title: '세션 타임아웃', desc: '비활성 상태 30분 후 자동 로그아웃.', on: true },
              ].map(item => <SecurityToggle key={item.title} {...item} />)}

              <div className="rounded-xl border p-5" style={{ background: 'var(--color-near-white)', borderColor: 'var(--color-light-gray)' }}>
                <p className="text-sm font-bold mb-3" style={{ color: 'var(--color-black)' }}>비밀번호 정책</p>
                {[
                  { label: '최소 길이', opts: ['8자','10자','12자','16자'], def: '8자' },
                  { label: '만료 주기', opts: ['없음','30일','60일','90일'], def: '없음' },
                ].map(({ label, opts, def }) => (
                  <div key={label} className="flex items-center justify-between mb-3">
                    <span className="text-sm" style={{ color: 'var(--color-dark-text)' }}>{label}</span>
                    <select defaultValue={def} className="px-3 py-1.5 rounded-lg text-sm outline-none"
                      style={{ background: 'var(--color-card-bg)', border: '1px solid var(--color-light-gray)', color: 'var(--color-dark-text)' }}>
                      {opts.map(o => <option key={o}>{o}</option>)}
                    </select>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 감사 로그 */}
          {tab === 'audit' && (
            <div className="max-w-3xl">
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm font-semibold" style={{ color: 'var(--color-dark-text)' }}>최근 활동 로그</p>
                <button className="text-xs px-3 py-1.5 rounded-lg font-medium"
                  style={{ background: 'var(--color-panel-bg)', color: 'var(--color-mid-gray)', border: '1px solid var(--color-light-gray)' }}>
                  CSV 내보내기
                </button>
              </div>
              <div className="rounded-xl border overflow-hidden" style={{ background: 'var(--color-near-white)', borderColor: 'var(--color-light-gray)' }}>
                {AUDIT_LOGS.map((log, i) => (
                  <div key={i} className={`flex items-center gap-4 px-5 py-3.5 ${i < AUDIT_LOGS.length - 1 ? 'border-b' : ''}`}
                    style={{ borderColor: 'var(--color-light-gray)' }}>
                    <span className="text-lg shrink-0">{log.icon}</span>
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
                      style={{ background: AVATAR_COLOR[log.user] ?? '#ABABAB' }}>{log.user[0]}</div>
                    <div className="flex-1 min-w-0">
                      <span className="text-sm font-semibold" style={{ color: 'var(--color-black)' }}>{log.user}</span>
                      <span className="text-sm mx-2" style={{ color: 'var(--color-mid-gray)' }}>{log.action}</span>
                      <span className="text-sm font-medium" style={{ color: 'var(--color-dark-text)' }}>{log.target}</span>
                    </div>
                    <span className="text-xs shrink-0" style={{ color: 'var(--color-gray)' }}>{log.time}</span>
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

function SecurityToggle({ title, desc, on: defaultOn }: { title: string; desc: string; on: boolean }) {
  const [on, setOn] = useState(defaultOn);
  return (
    <div className="flex items-start justify-between gap-4 rounded-xl border p-5"
      style={{ background: 'var(--color-near-white)', borderColor: 'var(--color-light-gray)' }}>
      <div>
        <p className="text-sm font-semibold" style={{ color: 'var(--color-dark-text)' }}>{title}</p>
        <p className="text-xs mt-0.5" style={{ color: 'var(--color-gray)' }}>{desc}</p>
      </div>
      <button onClick={() => setOn(p => !p)} className="w-10 h-5 rounded-full relative shrink-0 transition-all mt-0.5"
        style={{ background: on ? 'var(--color-accent)' : 'var(--color-light-gray)' }}>
        <span className="absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-all"
          style={{ left: on ? '22px' : '2px' }} />
      </button>
    </div>
  );
}
