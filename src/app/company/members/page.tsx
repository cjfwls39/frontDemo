'use client';

import Link from 'next/link';
import { useState } from 'react';

type Role = '오너' | '관리자' | '편집자' | '뷰어';
type Status = '활성' | '초대중' | '비활성';
type Dept = '개발' | '디자인' | '기획' | '인프라' | '전체';

interface Member {
  id: string;
  name: string;
  email: string;
  role: Role;
  dept: Dept;
  status: Status;
  joined: string;
  lastActive: string;
  projects: number;
  avatar: string;
}

const MEMBERS: Member[] = [
  { id: 'm1', name: '최기획',   email: 'pm@cowork.io',      role: '오너',   dept: '기획',   status: '활성',  joined: '2026-01-01', lastActive: '방금',    projects: 6, avatar: '#1A7A47' },
  { id: 'm2', name: '김개발',   email: 'dev@cowork.io',     role: '관리자', dept: '개발',   status: '활성',  joined: '2026-01-12', lastActive: '2분 전',  projects: 4, avatar: '#1A6FC4' },
  { id: 'm3', name: '이디자인', email: 'design@cowork.io',  role: '편집자', dept: '디자인', status: '활성',  joined: '2026-01-15', lastActive: '1시간 전', projects: 3, avatar: '#D95B00' },
  { id: 'm4', name: '박DBA',    email: 'dba@cowork.io',     role: '편집자', dept: '인프라', status: '활성',  joined: '2026-02-01', lastActive: '어제',    projects: 3, avatar: '#7B3FC4' },
  { id: 'm5', name: '정프론트', email: 'front@cowork.io',   role: '편집자', dept: '개발',   status: '활성',  joined: '2026-02-15', lastActive: '3일 전',  projects: 2, avatar: '#1A6FC4' },
  { id: 'm6', name: '한백엔드', email: 'back@cowork.io',    role: '편집자', dept: '개발',   status: '활성',  joined: '2026-03-01', lastActive: '1주 전',  projects: 2, avatar: '#5C3FC4' },
  { id: 'm7', name: '오마케팅', email: 'mkt@cowork.io',     role: '뷰어',   dept: '기획',   status: '활성',  joined: '2026-03-10', lastActive: '2일 전',  projects: 1, avatar: '#C47A1A' },
  { id: 'm8', name: '초대중1',  email: 'new1@example.com',  role: '편집자', dept: '개발',   status: '초대중', joined: '-',          lastActive: '-',      projects: 0, avatar: '#ABABAB' },
  { id: 'm9', name: '초대중2',  email: 'new2@example.com',  role: '뷰어',   dept: '디자인', status: '초대중', joined: '-',          lastActive: '-',      projects: 0, avatar: '#ABABAB' },
];

const ROLE_STYLE: Record<Role, { bg: string; color: string }> = {
  '오너':   { bg: '#1A1A1A', color: '#FFF' },
  '관리자': { bg: '#FFF0E6', color: '#D95B00' },
  '편집자': { bg: '#EBF5FF', color: '#1A6FC4' },
  '뷰어':   { bg: '#F5F5F5', color: '#6B6B6B' },
};

const STATUS_STYLE: Record<Status, { bg: string; color: string; dot: string }> = {
  '활성':   { bg: '#EAFAF1', color: '#1A7A47', dot: '#1A7A47' },
  '초대중': { bg: '#FFF8E6', color: '#A07000', dot: '#E6A800' },
  '비활성': { bg: '#F5F5F5', color: '#6B6B6B', dot: '#ABABAB' },
};

const DEPTS: Dept[] = ['전체','개발','디자인','기획','인프라'];

const PERMISSIONS: { label: string; desc: string; roles: Role[] }[] = [
  { label: '프로젝트 생성',    desc: '새 프로젝트를 생성할 수 있습니다.',               roles: ['오너','관리자'] },
  { label: '구성원 초대',      desc: '새 구성원을 워크스페이스에 초대할 수 있습니다.',   roles: ['오너','관리자'] },
  { label: '문서 편집',        desc: '문서를 생성하고 편집할 수 있습니다.',              roles: ['오너','관리자','편집자'] },
  { label: '태스크 관리',      desc: '태스크를 생성, 수정, 삭제할 수 있습니다.',         roles: ['오너','관리자','편집자'] },
  { label: '스프린트 관리',    desc: '스프린트를 시작하고 종료할 수 있습니다.',          roles: ['오너','관리자'] },
  { label: '채팅 채널 생성',   desc: '새 채팅 채널을 만들 수 있습니다.',                roles: ['오너','관리자','편집자'] },
  { label: '문서 열람',        desc: '모든 프로젝트 문서를 볼 수 있습니다.',             roles: ['오너','관리자','편집자','뷰어'] },
  { label: '프로젝트 설정',    desc: '프로젝트 설정을 변경할 수 있습니다.',              roles: ['오너','관리자'] },
  { label: '회사 설정',        desc: '회사 전체 설정을 관리할 수 있습니다.',             roles: ['오너'] },
];

const ALL_ROLES: Role[] = ['오너','관리자','편집자','뷰어'];

function Sidebar() {
  const NAV_ITEMS = [
    { href: '/projects', label: '📋 프로젝트' },
    { href: '/kanban',   label: '📊 칸반 보드' },
    { href: '/sprint',   label: '🏃 스프린트' },
    { href: '/docs',     label: '📄 문서' },
  ];
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
          style={{ color: 'var(--color-dark-text)' }}>🏢 회사 설정</Link>
        <Link href="/company/members" className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium"
          style={{ background: 'var(--color-accent-bg)', color: 'var(--color-accent)' }}>👥 구성원·권한</Link>
      </div>
      <div className="flex-1" />
      <Link href="/hub" className="px-3 py-2 rounded-lg text-sm" style={{ color: 'var(--color-mid-gray)' }}>← 메인 허브로</Link>
    </aside>
  );
}

export default function MembersPage() {
  const [members, setMembers] = useState<Member[]>(MEMBERS);
  const [deptFilter, setDeptFilter] = useState<Dept>('전체');
  const [search, setSearch] = useState('');
  const [view, setView] = useState<'members' | 'permissions'>('members');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<Role>('편집자');

  const filtered = members.filter(m => {
    const matchDept = deptFilter === '전체' || m.dept === deptFilter;
    const matchSearch = m.name.toLowerCase().includes(search.toLowerCase()) ||
                        m.email.toLowerCase().includes(search.toLowerCase());
    return matchDept && matchSearch;
  });

  function changeRole(id: string, role: Role) {
    setMembers(prev => prev.map(m => m.id === id ? { ...m, role } : m));
  }

  function removeMember(id: string) {
    setMembers(prev => prev.filter(m => m.id !== id));
  }

  function invite() {
    if (!inviteEmail.trim()) return;
    const newMember: Member = {
      id: `m${Date.now()}`, name: inviteEmail.split('@')[0], email: inviteEmail,
      role: inviteRole, dept: '개발', status: '초대중',
      joined: '-', lastActive: '-', projects: 0, avatar: '#ABABAB',
    };
    setMembers(prev => [...prev, newMember]);
    setInviteEmail('');
  }

  const active   = members.filter(m => m.status === '활성').length;
  const invited  = members.filter(m => m.status === '초대중').length;

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
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold" style={{ color: 'var(--color-black)' }}>구성원 · 권한</h1>
              <p className="text-sm mt-0.5" style={{ color: 'var(--color-mid-gray)' }}>
                활성 {active}명 · 초대중 {invited}명
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => setView('members')}
                className="px-4 py-2 rounded-lg text-sm font-semibold"
                style={{ background: view === 'members' ? 'var(--color-accent)' : 'var(--color-near-white)', color: view === 'members' ? '#fff' : 'var(--color-mid-gray)', border: '1px solid var(--color-light-gray)' }}>
                👥 구성원
              </button>
              <button onClick={() => setView('permissions')}
                className="px-4 py-2 rounded-lg text-sm font-semibold"
                style={{ background: view === 'permissions' ? 'var(--color-accent)' : 'var(--color-near-white)', color: view === 'permissions' ? '#fff' : 'var(--color-mid-gray)', border: '1px solid var(--color-light-gray)' }}>
                🔑 권한 매트릭스
              </button>
            </div>
          </div>

          {view === 'members' && (
            <>
              {/* 초대 */}
              <div className="rounded-xl border p-5 mb-5 flex items-end gap-3"
                style={{ background: 'var(--color-near-white)', borderColor: 'var(--color-light-gray)' }}>
                <div className="flex-1">
                  <label className="text-xs font-semibold block mb-1" style={{ color: 'var(--color-dark-text)' }}>이메일 초대</label>
                  <input value={inviteEmail} onChange={e => setInviteEmail(e.target.value)}
                    placeholder="email@example.com" onKeyDown={e => e.key === 'Enter' && invite()}
                    className="w-full px-4 py-2 rounded-lg text-sm outline-none"
                    style={{ background: 'var(--color-card-bg)', border: '1px solid var(--color-light-gray)', color: 'var(--color-dark-text)' }}
                    onFocus={e => e.target.style.borderColor = 'var(--color-accent)'}
                    onBlur={e => e.target.style.borderColor = 'var(--color-light-gray)'} />
                </div>
                <div>
                  <label className="text-xs font-semibold block mb-1" style={{ color: 'var(--color-dark-text)' }}>역할</label>
                  <select value={inviteRole} onChange={e => setInviteRole(e.target.value as Role)}
                    className="px-3 py-2 rounded-lg text-sm outline-none"
                    style={{ background: 'var(--color-card-bg)', border: '1px solid var(--color-light-gray)', color: 'var(--color-dark-text)' }}>
                    <option>편집자</option><option>뷰어</option><option>관리자</option>
                  </select>
                </div>
                <button onClick={invite} className="px-4 py-2 rounded-lg text-sm font-bold hover:opacity-90"
                  style={{ background: 'var(--color-accent)', color: '#fff' }}>초대 발송</button>
              </div>

              {/* 필터 */}
              <div className="flex items-center gap-3 mb-4">
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs" style={{ color: 'var(--color-gray)' }}>🔍</span>
                  <input value={search} onChange={e => setSearch(e.target.value)} placeholder="이름, 이메일 검색..."
                    className="pl-8 pr-4 py-2 rounded-lg text-sm outline-none w-48"
                    style={{ background: 'var(--color-near-white)', border: '1px solid var(--color-light-gray)', color: 'var(--color-dark-text)' }} />
                </div>
                <div className="flex gap-1">
                  {DEPTS.map(d => (
                    <button key={d} onClick={() => setDeptFilter(d)}
                      className="px-3 py-1.5 rounded-lg text-xs font-medium"
                      style={{ background: deptFilter === d ? 'var(--color-accent)' : 'var(--color-near-white)', color: deptFilter === d ? '#fff' : 'var(--color-mid-gray)', border: `1px solid ${deptFilter === d ? 'var(--color-accent)' : 'var(--color-light-gray)'}` }}>
                      {d}
                    </button>
                  ))}
                </div>
              </div>

              {/* 테이블 */}
              <div className="rounded-xl border overflow-hidden" style={{ borderColor: 'var(--color-light-gray)' }}>
                <div className="flex items-center gap-4 px-5 py-2.5 text-xs font-semibold"
                  style={{ background: 'var(--color-panel-bg)', color: 'var(--color-gray)' }}>
                  <span className="w-8" />
                  <span className="flex-1">구성원</span>
                  <span className="w-20 text-center">부서</span>
                  <span className="w-24 text-center">역할</span>
                  <span className="w-20 text-center">상태</span>
                  <span className="w-16 text-center">프로젝트</span>
                  <span className="w-24 text-right">마지막 활동</span>
                  <span className="w-16" />
                </div>
                {filtered.map((m, i) => (
                  <div key={m.id} className={`flex items-center gap-4 px-5 py-3.5 ${i < filtered.length - 1 ? 'border-b' : ''}`}
                    style={{ background: 'var(--color-near-white)', borderColor: 'var(--color-light-gray)' }}>
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
                      style={{ background: m.avatar }}>{m.name[0]}</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold" style={{ color: 'var(--color-black)' }}>{m.name}</p>
                      <p className="text-xs" style={{ color: 'var(--color-gray)' }}>{m.email}</p>
                    </div>
                    <span className="w-20 text-center text-xs" style={{ color: 'var(--color-mid-gray)' }}>{m.dept}</span>
                    <div className="w-24 flex justify-center">
                      {m.role === '오너' ? (
                        <span className="text-xs px-2 py-0.5 rounded font-bold" style={ROLE_STYLE[m.role]}>{m.role}</span>
                      ) : (
                        <select value={m.role} onChange={e => changeRole(m.id, e.target.value as Role)}
                          className="text-xs px-2 py-0.5 rounded font-bold outline-none cursor-pointer"
                          style={{ background: ROLE_STYLE[m.role].bg, color: ROLE_STYLE[m.role].color, border: 'none' }}>
                          {ALL_ROLES.filter(r => r !== '오너').map(r => <option key={r}>{r}</option>)}
                        </select>
                      )}
                    </div>
                    <div className="w-20 flex justify-center">
                      <span className="text-xs px-2 py-0.5 rounded-full flex items-center gap-1"
                        style={{ background: STATUS_STYLE[m.status].bg, color: STATUS_STYLE[m.status].color }}>
                        <span className="w-1.5 h-1.5 rounded-full" style={{ background: STATUS_STYLE[m.status].dot }} />
                        {m.status}
                      </span>
                    </div>
                    <span className="w-16 text-center text-xs font-semibold" style={{ color: 'var(--color-dark-text)' }}>{m.projects}개</span>
                    <span className="w-24 text-right text-xs" style={{ color: 'var(--color-gray)' }}>{m.lastActive}</span>
                    <div className="w-16 flex justify-end">
                      {m.role !== '오너' && (
                        <button onClick={() => removeMember(m.id)}
                          className="text-xs px-2 py-1 rounded hover:opacity-80"
                          style={{ color: '#C0392B', background: '#FDECEA' }}>제거</button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {view === 'permissions' && (
            <div className="rounded-xl border overflow-hidden" style={{ borderColor: 'var(--color-light-gray)' }}>
              {/* 헤더 */}
              <div className="flex items-center px-5 py-3 border-b" style={{ background: 'var(--color-panel-bg)', borderColor: 'var(--color-light-gray)' }}>
                <div className="flex-1 text-xs font-semibold" style={{ color: 'var(--color-gray)' }}>권한</div>
                {ALL_ROLES.map(r => (
                  <div key={r} className="w-24 text-center text-xs font-bold"
                    style={{ color: ROLE_STYLE[r].color }}>{r}</div>
                ))}
              </div>
              {PERMISSIONS.map((p, i) => (
                <div key={p.label} className={`flex items-center px-5 py-4 ${i < PERMISSIONS.length - 1 ? 'border-b' : ''}`}
                  style={{ background: 'var(--color-near-white)', borderColor: 'var(--color-light-gray)' }}>
                  <div className="flex-1">
                    <p className="text-sm font-semibold" style={{ color: 'var(--color-dark-text)' }}>{p.label}</p>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--color-gray)' }}>{p.desc}</p>
                  </div>
                  {ALL_ROLES.map(r => (
                    <div key={r} className="w-24 flex justify-center text-base">
                      {p.roles.includes(r)
                        ? <span style={{ color: '#1A7A47' }}>✓</span>
                        : <span style={{ color: 'var(--color-light-gray)' }}>—</span>}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
