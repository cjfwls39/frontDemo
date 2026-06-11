'use client';

import Link from 'next/link';
import { useState } from 'react';

type SettingTab = 'general' | 'members' | 'sprint' | 'integrations' | 'danger';

const AVATAR_COLOR: Record<string, string> = {
  '김개발': '#1A6FC4', '이디자인': '#D95B00', '박DBA': '#7B3FC4', '최기획': '#1A7A47',
};

interface Member {
  name: string;
  email: string;
  role: '관리자' | '편집자' | '뷰어';
  joined: string;
}

const MEMBERS: Member[] = [
  { name: '최기획',   email: 'pm@cowork.io',      role: '관리자', joined: '2026-01-10' },
  { name: '김개발',   email: 'dev@cowork.io',     role: '편집자', joined: '2026-01-12' },
  { name: '이디자인', email: 'design@cowork.io',  role: '편집자', joined: '2026-01-15' },
  { name: '박DBA',    email: 'dba@cowork.io',     role: '편집자', joined: '2026-02-01' },
];

const ROLE_STYLE: Record<string, { bg: string; color: string }> = {
  '관리자': { bg: '#FFF0E6', color: '#D95B00' },
  '편집자': { bg: '#EBF5FF', color: '#1A6FC4' },
  '뷰어':   { bg: '#F5F5F5', color: '#6B6B6B' },
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

export default function ProjectSettingsPage() {
  const [tab, setTab] = useState<SettingTab>('general');
  const [projectName, setProjectName] = useState('CoWork 웹 플랫폼');
  const [projectDesc, setProjectDesc] = useState('메인 서비스 프론트엔드 및 백엔드 개발');
  const [sprintLen, setSprintLen] = useState('2');
  const [saved, setSaved] = useState(false);
  const [members, setMembers] = useState<Member[]>(MEMBERS);
  const [inviteEmail, setInviteEmail] = useState('');

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  const TABS: { id: SettingTab; label: string; icon: string }[] = [
    { id: 'general',      label: '일반',       icon: '⚙️' },
    { id: 'members',      label: '구성원',     icon: '👥' },
    { id: 'sprint',       label: '스프린트',   icon: '🏃' },
    { id: 'integrations', label: '연동',       icon: '🔗' },
    { id: 'danger',       label: '위험 구역',  icon: '⚠️' },
  ];

  return (
    <div className="flex flex-col h-screen" style={{ background: 'var(--color-card-bg)' }}>
      <header className="flex items-center justify-between px-6 h-14 shrink-0 border-b"
        style={{ background: 'var(--color-near-white)', borderColor: 'var(--color-light-gray)' }}>
        <div className="flex items-center gap-3">
          <Link href="/hub" className="text-lg font-bold tracking-tight" style={{ color: 'var(--color-black)' }}>● CoWork</Link>
          <span style={{ color: 'var(--color-light-gray)' }}>/</span>
          <Link href="/projects" className="text-sm" style={{ color: 'var(--color-mid-gray)' }}>프로젝트</Link>
          <span style={{ color: 'var(--color-light-gray)' }}>/</span>
          <span className="text-sm font-medium" style={{ color: 'var(--color-dark-text)' }}>설정</span>
        </div>
        <nav className="flex items-center gap-1">
          {['/notifications','/chat','/company'].map((href, i) => (
            <Link key={href} href={href} className="w-9 h-9 flex items-center justify-center rounded-lg text-lg hover:opacity-70"
              style={{ color: 'var(--color-dark-text)' }}>{['🔔','💬','👤'][i]}</Link>
          ))}
        </nav>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <Sidebar />

        <div className="flex flex-1 overflow-hidden">
          {/* 설정 탭 사이드바 */}
          <div className="w-44 shrink-0 border-r pt-6 px-3 flex flex-col gap-1"
            style={{ background: 'var(--color-near-white)', borderColor: 'var(--color-light-gray)' }}>
            <p className="text-xs font-semibold px-3 mb-2" style={{ color: 'var(--color-gray)' }}>프로젝트 설정</p>
            {TABS.map(t => (
              <button key={t.id} onClick={() => setTab(t.id)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-left font-medium w-full"
                style={{
                  background: tab === t.id ? 'var(--color-accent-bg)' : 'transparent',
                  color: tab === t.id ? 'var(--color-accent)' : t.id === 'danger' ? '#C0392B' : 'var(--color-dark-text)',
                }}>
                <span>{t.icon}</span>{t.label}
              </button>
            ))}
          </div>

          {/* 설정 콘텐츠 */}
          <main className="flex-1 overflow-y-auto px-8 py-7">
            {/* 일반 */}
            {tab === 'general' && (
              <div className="max-w-xl">
                <h2 className="text-xl font-bold mb-6" style={{ color: 'var(--color-black)' }}>일반 설정</h2>

                <div className="rounded-xl border p-6 flex flex-col gap-5"
                  style={{ background: 'var(--color-near-white)', borderColor: 'var(--color-light-gray)' }}>
                  <div>
                    <label className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--color-dark-text)' }}>프로젝트 이름</label>
                    <input value={projectName} onChange={e => setProjectName(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-lg text-sm outline-none"
                      style={{ background: 'var(--color-card-bg)', border: '1px solid var(--color-light-gray)', color: 'var(--color-dark-text)' }}
                      onFocus={e => e.target.style.borderColor = 'var(--color-accent)'}
                      onBlur={e => e.target.style.borderColor = 'var(--color-light-gray)'} />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--color-dark-text)' }}>프로젝트 설명</label>
                    <textarea value={projectDesc} onChange={e => setProjectDesc(e.target.value)} rows={3}
                      className="w-full px-4 py-2.5 rounded-lg text-sm outline-none resize-none"
                      style={{ background: 'var(--color-card-bg)', border: '1px solid var(--color-light-gray)', color: 'var(--color-dark-text)' }}
                      onFocus={e => e.target.style.borderColor = 'var(--color-accent)'}
                      onBlur={e => e.target.style.borderColor = 'var(--color-light-gray)'} />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--color-dark-text)' }}>프로젝트 상태</label>
                    <select className="w-full px-4 py-2.5 rounded-lg text-sm outline-none"
                      style={{ background: 'var(--color-card-bg)', border: '1px solid var(--color-light-gray)', color: 'var(--color-dark-text)' }}>
                      <option>진행중</option><option>대기중</option><option>완료</option><option>보류</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--color-dark-text)' }}>프로젝트 키</label>
                    <input defaultValue="CWP" readOnly
                      className="w-full px-4 py-2.5 rounded-lg text-sm outline-none font-mono"
                      style={{ background: 'var(--color-panel-bg)', border: '1px solid var(--color-light-gray)', color: 'var(--color-gray)' }} />
                    <p className="text-xs mt-1" style={{ color: 'var(--color-gray)' }}>태스크 ID 접두사로 사용됩니다 (예: CWP-42)</p>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t" style={{ borderColor: 'var(--color-light-gray)' }}>
                    {saved && <span className="text-sm" style={{ color: '#1A7A47' }}>✓ 저장되었습니다</span>}
                    {!saved && <span />}
                    <button onClick={handleSave} className="px-4 py-2 rounded-lg text-sm font-bold hover:opacity-90"
                      style={{ background: 'var(--color-accent)', color: '#fff' }}>변경사항 저장</button>
                  </div>
                </div>
              </div>
            )}

            {/* 구성원 */}
            {tab === 'members' && (
              <div className="max-w-2xl">
                <h2 className="text-xl font-bold mb-6" style={{ color: 'var(--color-black)' }}>구성원 관리</h2>

                {/* 초대 */}
                <div className="rounded-xl border p-5 mb-5"
                  style={{ background: 'var(--color-near-white)', borderColor: 'var(--color-light-gray)' }}>
                  <p className="text-sm font-semibold mb-3" style={{ color: 'var(--color-dark-text)' }}>구성원 초대</p>
                  <div className="flex gap-2">
                    <input value={inviteEmail} onChange={e => setInviteEmail(e.target.value)}
                      placeholder="이메일 주소" className="flex-1 px-4 py-2 rounded-lg text-sm outline-none"
                      style={{ background: 'var(--color-card-bg)', border: '1px solid var(--color-light-gray)', color: 'var(--color-dark-text)' }}
                      onFocus={e => e.target.style.borderColor = 'var(--color-accent)'}
                      onBlur={e => e.target.style.borderColor = 'var(--color-light-gray)'} />
                    <select className="px-3 py-2 rounded-lg text-sm outline-none"
                      style={{ background: 'var(--color-card-bg)', border: '1px solid var(--color-light-gray)', color: 'var(--color-dark-text)' }}>
                      <option>편집자</option><option>뷰어</option><option>관리자</option>
                    </select>
                    <button className="px-4 py-2 rounded-lg text-sm font-bold hover:opacity-90"
                      style={{ background: 'var(--color-accent)', color: '#fff' }}>초대</button>
                  </div>
                </div>

                {/* 구성원 목록 */}
                <div className="rounded-xl border overflow-hidden"
                  style={{ background: 'var(--color-near-white)', borderColor: 'var(--color-light-gray)' }}>
                  {members.map((m, i) => (
                    <div key={m.email} className={`flex items-center gap-4 px-5 py-4 ${i < members.length - 1 ? 'border-b' : ''}`}
                      style={{ borderColor: 'var(--color-light-gray)' }}>
                      <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0"
                        style={{ background: AVATAR_COLOR[m.name] ?? '#ABABAB' }}>{m.name[0]}</div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold" style={{ color: 'var(--color-black)' }}>{m.name}</p>
                        <p className="text-xs" style={{ color: 'var(--color-gray)' }}>{m.email}</p>
                      </div>
                      <span className="text-xs" style={{ color: 'var(--color-gray)' }}>{m.joined} 참여</span>
                      <select
                        value={m.role}
                        onChange={e => setMembers(prev => prev.map(mb => mb.email === m.email ? { ...mb, role: e.target.value as Member['role'] } : mb))}
                        className="px-2 py-1 rounded-lg text-xs font-semibold outline-none"
                        style={{ background: ROLE_STYLE[m.role].bg, color: ROLE_STYLE[m.role].color, border: 'none' }}>
                        <option>관리자</option><option>편집자</option><option>뷰어</option>
                      </select>
                      {m.role !== '관리자' && (
                        <button onClick={() => setMembers(prev => prev.filter(mb => mb.email !== m.email))}
                          className="text-xs px-2.5 py-1 rounded-lg hover:opacity-80"
                          style={{ color: '#C0392B', background: '#FDECEA' }}>제거</button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 스프린트 */}
            {tab === 'sprint' && (
              <div className="max-w-xl">
                <h2 className="text-xl font-bold mb-6" style={{ color: 'var(--color-black)' }}>스프린트 설정</h2>
                <div className="rounded-xl border p-6 flex flex-col gap-5"
                  style={{ background: 'var(--color-near-white)', borderColor: 'var(--color-light-gray)' }}>
                  <div>
                    <label className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--color-dark-text)' }}>스프린트 기간</label>
                    <select value={sprintLen} onChange={e => setSprintLen(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-lg text-sm outline-none"
                      style={{ background: 'var(--color-card-bg)', border: '1px solid var(--color-light-gray)', color: 'var(--color-dark-text)' }}>
                      <option value="1">1주</option><option value="2">2주</option><option value="3">3주</option><option value="4">4주</option>
                    </select>
                  </div>
                  {[
                    { label: '스프린트 시작일', value: '월요일', opts: ['월요일','화요일','수요일','목요일'] },
                    { label: '스토리 포인트 단위', value: '피보나치', opts: ['피보나치','선형(1-10)','티셔츠(XS~XL)'] },
                  ].map(({ label, value, opts }) => (
                    <div key={label}>
                      <label className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--color-dark-text)' }}>{label}</label>
                      <select defaultValue={value} className="w-full px-4 py-2.5 rounded-lg text-sm outline-none"
                        style={{ background: 'var(--color-card-bg)', border: '1px solid var(--color-light-gray)', color: 'var(--color-dark-text)' }}>
                        {opts.map(o => <option key={o}>{o}</option>)}
                      </select>
                    </div>
                  ))}
                  <ToggleRow label="스프린트 자동 시작" desc="이전 스프린트 종료 시 자동으로 다음 스프린트를 시작합니다." defaultOn={false} />
                  <ToggleRow label="미완료 태스크 이월" desc="스프린트 종료 시 미완료 태스크를 다음 스프린트로 자동 이월합니다." defaultOn={true} />
                  <div className="flex justify-end pt-2 border-t" style={{ borderColor: 'var(--color-light-gray)' }}>
                    <button onClick={handleSave} className="px-4 py-2 rounded-lg text-sm font-bold hover:opacity-90"
                      style={{ background: 'var(--color-accent)', color: '#fff' }}>저장</button>
                  </div>
                </div>
              </div>
            )}

            {/* 연동 */}
            {tab === 'integrations' && (
              <div className="max-w-2xl">
                <h2 className="text-xl font-bold mb-6" style={{ color: 'var(--color-black)' }}>연동 서비스</h2>
                <div className="flex flex-col gap-3">
                  {[
                    { name: 'GitHub', icon: '🐙', desc: '저장소 연결 및 PR 자동 연동', connected: true,  detail: 'cowork-team/cowork-web' },
                    { name: 'Figma',  icon: '🎨', desc: '디자인 파일 임베드 및 코멘트 동기화', connected: true,  detail: 'CoWork Design System' },
                    { name: 'Slack',  icon: '💬', desc: '알림을 Slack 채널로 전송', connected: false, detail: '' },
                    { name: 'Jira',   icon: '🟦', desc: 'Jira 이슈 양방향 동기화', connected: false, detail: '' },
                    { name: 'Notion', icon: '📝', desc: 'Notion 페이지 임포트', connected: false, detail: '' },
                  ].map(svc => (
                    <div key={svc.name} className="flex items-center gap-4 px-5 py-4 rounded-xl border"
                      style={{ background: 'var(--color-near-white)', borderColor: 'var(--color-light-gray)' }}>
                      <span className="text-2xl shrink-0">{svc.icon}</span>
                      <div className="flex-1">
                        <p className="text-sm font-semibold" style={{ color: 'var(--color-black)' }}>{svc.name}</p>
                        <p className="text-xs" style={{ color: 'var(--color-mid-gray)' }}>{svc.desc}</p>
                        {svc.connected && <p className="text-xs mt-0.5" style={{ color: '#1A7A47' }}>✓ {svc.detail}</p>}
                      </div>
                      <button className="px-3 py-1.5 rounded-lg text-xs font-semibold"
                        style={{
                          background: svc.connected ? 'var(--color-panel-bg)' : 'var(--color-accent)',
                          color: svc.connected ? 'var(--color-mid-gray)' : '#fff',
                          border: svc.connected ? '1px solid var(--color-light-gray)' : 'none',
                        }}>
                        {svc.connected ? '연결 해제' : '연결'}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 위험 구역 */}
            {tab === 'danger' && (
              <div className="max-w-xl">
                <h2 className="text-xl font-bold mb-2" style={{ color: '#C0392B' }}>위험 구역</h2>
                <p className="text-sm mb-6" style={{ color: 'var(--color-mid-gray)' }}>아래 작업은 되돌릴 수 없습니다. 신중하게 진행해주세요.</p>
                <div className="flex flex-col gap-4">
                  {[
                    { title: '프로젝트 보관', desc: '프로젝트를 보관하면 더 이상 활성 목록에 표시되지 않습니다. 언제든지 복원할 수 있습니다.', btn: '프로젝트 보관', color: '#D97706' },
                    { title: '모든 태스크 삭제', desc: '이 프로젝트의 모든 태스크, 스프린트, 백로그를 영구 삭제합니다.', btn: '모든 태스크 삭제', color: '#C0392B' },
                    { title: '프로젝트 삭제', desc: '프로젝트와 관련된 모든 데이터(태스크, 문서, 설정)를 영구적으로 삭제합니다. 이 작업은 복원할 수 없습니다.', btn: '프로젝트 삭제', color: '#C0392B' },
                  ].map(item => (
                    <div key={item.title} className="rounded-xl border p-5 flex items-start justify-between gap-4"
                      style={{ background: 'var(--color-near-white)', borderColor: '#FDECEA' }}>
                      <div>
                        <p className="text-sm font-semibold mb-1" style={{ color: 'var(--color-black)' }}>{item.title}</p>
                        <p className="text-xs leading-relaxed" style={{ color: 'var(--color-mid-gray)' }}>{item.desc}</p>
                      </div>
                      <button className="px-3 py-1.5 rounded-lg text-xs font-bold shrink-0 hover:opacity-80"
                        style={{ background: '#FDECEA', color: item.color, border: `1px solid ${item.color}` }}>
                        {item.btn}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

function ToggleRow({ label, desc, defaultOn }: { label: string; desc: string; defaultOn: boolean }) {
  const [on, setOn] = useState(defaultOn);
  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <p className="text-sm font-semibold" style={{ color: 'var(--color-dark-text)' }}>{label}</p>
        <p className="text-xs mt-0.5" style={{ color: 'var(--color-gray)' }}>{desc}</p>
      </div>
      <button onClick={() => setOn(p => !p)}
        className="w-10 h-5 rounded-full relative shrink-0 transition-all"
        style={{ background: on ? 'var(--color-accent)' : 'var(--color-light-gray)' }}>
        <span className="absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-all"
          style={{ left: on ? '22px' : '2px' }} />
      </button>
    </div>
  );
}
