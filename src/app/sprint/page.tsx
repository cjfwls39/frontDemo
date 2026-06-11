'use client';

import Link from 'next/link';
import { useState } from 'react';

// ── 타입 ─────────────────────────────────────────────────
type Priority = '높음' | '중간' | '낮음';
type TaskStatus = '할 일' | '진행중' | '완료';

interface Task {
  id: string;
  title: string;
  priority: Priority;
  status: TaskStatus;
  assignee: string;
  storyPoint: number;
  tag: string;
  inSprint: boolean;
}

// ── 목업 데이터 ───────────────────────────────────────────
const INIT_TASKS: Task[] = [
  // 스프린트 내 태스크
  { id: 't1',  title: '로그인 / 회원가입 화면 구현',     priority: '높음', status: '완료',  assignee: '이디자인', storyPoint: 3, tag: '프론트', inSprint: true },
  { id: 't2',  title: 'JWT 인증 미들웨어 작성',          priority: '높음', status: '완료',  assignee: '김개발',  storyPoint: 5, tag: '백엔드', inSprint: true },
  { id: 't3',  title: '3D 허브 씬 기본 도형 배치',       priority: '높음', status: '완료',  assignee: '이디자인', storyPoint: 8, tag: '프론트', inSprint: true },
  { id: 't4',  title: '칸반 보드 UI 구현',               priority: '높음', status: '진행중', assignee: '이디자인', storyPoint: 5, tag: '프론트', inSprint: true },
  { id: 't5',  title: 'WebSocket 서버 프로토타입',       priority: '높음', status: '진행중', assignee: '김개발',  storyPoint: 8, tag: '백엔드', inSprint: true },
  { id: 't6',  title: '프로젝트 목록 API 연동',          priority: '중간', status: '진행중', assignee: '김개발',  storyPoint: 3, tag: '백엔드', inSprint: true },
  { id: 't7',  title: '문서 에디터 마크다운 파서 연동',  priority: '중간', status: '할 일', assignee: '이디자인', storyPoint: 5, tag: '프론트', inSprint: true },
  { id: 't8',  title: '알림 시스템 설계 문서 작성',      priority: '낮음', status: '할 일', assignee: '최기획',  storyPoint: 2, tag: '기획', inSprint: true },
  // 백로그
  { id: 't9',  title: 'DM 채팅 UI 구현',                priority: '높음', status: '할 일', assignee: '이디자인', storyPoint: 5, tag: '프론트', inSprint: false },
  { id: 't10', title: '스레드 댓글 기능',                priority: '중간', status: '할 일', assignee: '김개발',  storyPoint: 3, tag: '백엔드', inSprint: false },
  { id: 't11', title: '회사 관리 대시보드',              priority: '중간', status: '할 일', assignee: '최기획',  storyPoint: 5, tag: '기획', inSprint: false },
  { id: 't12', title: '구성원 권한 설정 UI',             priority: '중간', status: '할 일', assignee: '이디자인', storyPoint: 3, tag: '프론트', inSprint: false },
  { id: 't13', title: '플랫폼 관리자 대시보드',          priority: '낮음', status: '할 일', assignee: '최기획',  storyPoint: 8, tag: '기획', inSprint: false },
  { id: 't14', title: 'S3 파일 업로드 연동',            priority: '낮음', status: '할 일', assignee: '박DBA',   storyPoint: 3, tag: '인프라', inSprint: false },
  { id: 't15', title: '검색 기능 전체 구현',             priority: '높음', status: '할 일', assignee: '김개발',  storyPoint: 8, tag: '백엔드', inSprint: false },
  { id: 't16', title: '모바일 반응형 대응',              priority: '낮음', status: '할 일', assignee: '이디자인', storyPoint: 5, tag: '프론트', inSprint: false },
];

const PRIORITY_STYLE: Record<Priority, { bg: string; color: string }> = {
  '높음': { bg: '#FDECEA', color: '#C0392B' },
  '중간': { bg: '#FFF0E6', color: '#D95B00' },
  '낮음': { bg: '#F5F5F5', color: '#6B6B6B' },
};

const STATUS_STYLE: Record<TaskStatus, { bg: string; color: string; dot: string }> = {
  '할 일':  { bg: '#EBF5FF', color: '#1A6FC4', dot: '#1A6FC4' },
  '진행중': { bg: '#FFF0E6', color: '#D95B00', dot: '#D95B00' },
  '완료':   { bg: '#EAFAF1', color: '#1A7A47', dot: '#1A7A47' },
};

const AVATAR_COLOR: Record<string, string> = {
  '김개발':  '#1A6FC4', '이디자인': '#D95B00',
  '박DBA':   '#7B3FC4', '최기획':  '#1A7A47',
};

const NAV_ITEMS = [
  { href: '/projects', label: '📋 프로젝트' },
  { href: '/kanban',   label: '📊 칸반 보드' },
  { href: '/sprint',   label: '🏃 스프린트', active: true },
  { href: '/docs',     label: '📄 문서' },
];

// ── 사이드바 ──────────────────────────────────────────────
function Sidebar() {
  return (
    <aside
      className="flex flex-col w-52 shrink-0 h-full border-r pt-5 pb-6 px-3 gap-1"
      style={{ background: 'var(--color-near-white)', borderColor: 'var(--color-light-gray)' }}
    >
      <p className="text-xs font-semibold px-3 mb-2" style={{ color: 'var(--color-gray)' }}>워크스페이스</p>
      {NAV_ITEMS.map(({ href, label, active }) => (
        <Link key={href} href={href}
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium"
          style={{ background: active ? 'var(--color-accent-bg)' : 'transparent', color: active ? 'var(--color-accent)' : 'var(--color-dark-text)' }}
        >{label}</Link>
      ))}
      <div className="flex-1" />
      <Link href="/hub" className="px-3 py-2 rounded-lg text-sm" style={{ color: 'var(--color-mid-gray)' }}>← 메인 허브로</Link>
    </aside>
  );
}

// ── 태스크 행 ─────────────────────────────────────────────
function TaskRow({ task, onToggleSprint, onStatusChange }: {
  task: Task;
  onToggleSprint: (id: string) => void;
  onStatusChange: (id: string, s: TaskStatus) => void;
}) {
  const ps = PRIORITY_STYLE[task.priority];
  const ss = STATUS_STYLE[task.status];

  const nextStatus: Record<TaskStatus, TaskStatus> = {
    '할 일': '진행중', '진행중': '완료', '완료': '할 일',
  };

  return (
    <div
      className="flex items-center gap-3 px-4 py-3 border-b group hover:bg-opacity-60 transition-colors"
      style={{ borderColor: 'var(--color-light-gray)', background: task.status === '완료' ? 'rgba(26,122,71,0.03)' : undefined }}
    >
      {/* 체크 토글 */}
      <button
        onClick={() => onStatusChange(task.id, nextStatus[task.status])}
        className="w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 transition-all"
        style={{
          borderColor: task.status === '완료' ? '#1A7A47' : 'var(--color-light-gray)',
          background: task.status === '완료' ? '#1A7A47' : 'transparent',
        }}
        title="상태 변경"
      >
        {task.status === '완료' && <span className="text-white text-xs">✓</span>}
      </button>

      {/* 태스크명 */}
      <span
        className="flex-1 text-sm font-medium"
        style={{
          color: task.status === '완료' ? 'var(--color-gray)' : 'var(--color-black)',
          textDecoration: task.status === '완료' ? 'line-through' : 'none',
        }}
      >
        {task.title}
      </span>

      {/* 태그 */}
      <span className="text-xs px-2 py-0.5 rounded shrink-0"
        style={{ background: 'var(--color-panel-bg)', color: 'var(--color-mid-gray)' }}>
        {task.tag}
      </span>

      {/* 우선순위 */}
      <span className="text-xs px-2 py-0.5 rounded font-semibold shrink-0"
        style={{ background: ps.bg, color: ps.color }}>
        {task.priority}
      </span>

      {/* 상태 */}
      <span
        className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-semibold shrink-0"
        style={{ background: ss.bg, color: ss.color }}
      >
        <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: ss.dot }} />
        {task.status}
      </span>

      {/* SP */}
      <span
        className="text-xs font-bold w-7 h-7 rounded-full flex items-center justify-center shrink-0"
        style={{ background: 'var(--color-panel-bg)', color: 'var(--color-mid-gray)' }}
        title="스토리 포인트"
      >
        {task.storyPoint}
      </span>

      {/* 담당자 */}
      <div
        className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
        style={{ background: AVATAR_COLOR[task.assignee] ?? '#ABABAB' }}
        title={task.assignee}
      >
        {task.assignee[0]}
      </div>

      {/* 스프린트 이동 버튼 */}
      <button
        onClick={() => onToggleSprint(task.id)}
        className="opacity-0 group-hover:opacity-100 text-xs px-2.5 py-1 rounded-lg font-medium transition-all shrink-0"
        style={{
          background: task.inSprint ? 'var(--color-panel-bg)' : 'var(--color-accent-bg)',
          color: task.inSprint ? 'var(--color-gray)' : 'var(--color-accent)',
          border: `1px solid ${task.inSprint ? 'var(--color-light-gray)' : 'var(--color-accent)'}`,
        }}
      >
        {task.inSprint ? '↓ 백로그' : '↑ 스프린트'}
      </button>
    </div>
  );
}

// ── 메인 페이지 ───────────────────────────────────────────
export default function SprintPage() {
  const [tasks, setTasks] = useState<Task[]>(INIT_TASKS);
  const [tab, setTab] = useState<'sprint' | 'backlog'>('sprint');

  const sprintTasks  = tasks.filter(t => t.inSprint);
  const backlogTasks = tasks.filter(t => !t.inSprint);

  const done  = sprintTasks.filter(t => t.status === '완료').length;
  const total = sprintTasks.length;
  const pct   = total > 0 ? Math.round((done / total) * 100) : 0;
  const totalSP = sprintTasks.reduce((s, t) => s + t.storyPoint, 0);
  const doneSP  = sprintTasks.filter(t => t.status === '완료').reduce((s, t) => s + t.storyPoint, 0);

  function toggleSprint(id: string) {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, inSprint: !t.inSprint } : t));
  }

  function statusChange(id: string, s: TaskStatus) {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, status: s } : t));
  }

  const displayed = tab === 'sprint' ? sprintTasks : backlogTasks;

  return (
    <div className="flex flex-col h-screen" style={{ background: 'var(--color-card-bg)' }}>

      {/* 앱바 */}
      <header className="flex items-center justify-between px-6 h-14 shrink-0 border-b"
        style={{ background: 'var(--color-near-white)', borderColor: 'var(--color-light-gray)' }}>
        <Link href="/hub" className="text-lg font-bold tracking-tight" style={{ color: 'var(--color-black)' }}>● CoWork</Link>
        <nav className="flex items-center gap-1">
          {['/notifications', '/chat', '/company'].map((href, i) => (
            <Link key={href} href={href} className="w-9 h-9 flex items-center justify-center rounded-lg text-lg hover:opacity-70"
              style={{ color: 'var(--color-dark-text)' }}>{['🔔','💬','👤'][i]}</Link>
          ))}
        </nav>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <Sidebar />

        <div className="flex flex-col flex-1 overflow-hidden">

          {/* 서브헤더 */}
          <div className="px-7 py-5 border-b shrink-0"
            style={{ background: 'var(--color-near-white)', borderColor: 'var(--color-light-gray)' }}>

            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  <h1 className="text-xl font-bold" style={{ color: 'var(--color-black)' }}>스프린트 3</h1>
                  <span className="text-xs px-2 py-0.5 rounded-full font-semibold"
                    style={{ background: 'var(--color-accent-bg)', color: 'var(--color-accent)' }}>진행중</span>
                </div>
                <p className="text-xs" style={{ color: 'var(--color-gray)' }}>
                  2026.06.02 – 2026.06.15 · CoWork 웹 플랫폼
                </p>
              </div>
              <button className="px-3 py-1.5 rounded-lg text-xs font-bold hover:opacity-90"
                style={{ background: 'var(--color-accent)', color: '#fff' }}>
                스프린트 완료
              </button>
            </div>

            {/* 스프린트 요약 카드 */}
            <div className="grid grid-cols-4 gap-3 mb-4">
              {[
                { label: '전체 태스크', value: `${total}개` },
                { label: '완료',        value: `${done}개`,    sub: `진행중 ${sprintTasks.filter(t=>t.status==='진행중').length}개` },
                { label: '스토리 포인트', value: `${doneSP} / ${totalSP}`, sub: 'SP 완료' },
                { label: '남은 일수',  value: '4일', sub: '마감 06.15' },
              ].map(({ label, value, sub }) => (
                <div key={label} className="rounded-xl px-4 py-3 border"
                  style={{ background: 'var(--color-card-bg)', borderColor: 'var(--color-light-gray)' }}>
                  <p className="text-xs mb-1" style={{ color: 'var(--color-gray)' }}>{label}</p>
                  <p className="text-lg font-bold" style={{ color: 'var(--color-black)' }}>{value}</p>
                  {sub && <p className="text-xs mt-0.5" style={{ color: 'var(--color-gray)' }}>{sub}</p>}
                </div>
              ))}
            </div>

            {/* 진행률 바 */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: 'var(--color-light-gray)' }}>
                <div className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${pct}%`, background: 'var(--color-accent)' }} />
              </div>
              <span className="text-sm font-bold tabular-nums" style={{ color: 'var(--color-accent)' }}>{pct}%</span>
            </div>
          </div>

          {/* 탭 + 태스크 목록 */}
          <div className="flex flex-col flex-1 overflow-hidden">

            {/* 탭 바 */}
            <div className="flex items-center gap-1 px-7 pt-4 pb-0 shrink-0">
              {(['sprint', 'backlog'] as const).map(t => (
                <button key={t} onClick={() => setTab(t)}
                  className="px-4 py-2 text-sm font-semibold border-b-2 transition-colors"
                  style={{
                    borderColor: tab === t ? 'var(--color-accent)' : 'transparent',
                    color: tab === t ? 'var(--color-accent)' : 'var(--color-mid-gray)',
                  }}>
                  {t === 'sprint' ? `🏃 현재 스프린트 (${total})` : `📦 백로그 (${backlogTasks.length})`}
                </button>
              ))}
              <div className="flex-1 border-b" style={{ borderColor: 'var(--color-light-gray)' }} />
            </div>

            {/* 테이블 헤더 */}
            <div className="flex items-center gap-3 px-4 py-2 mx-7 mt-3 rounded-lg text-xs font-semibold shrink-0"
              style={{ background: 'var(--color-panel-bg)', color: 'var(--color-gray)' }}>
              <span className="w-5" />
              <span className="flex-1">태스크</span>
              <span className="w-16 text-center">태그</span>
              <span className="w-16 text-center">우선순위</span>
              <span className="w-20 text-center">상태</span>
              <span className="w-7 text-center">SP</span>
              <span className="w-7 text-center">담당</span>
              <span className="w-20" />
            </div>

            {/* 태스크 목록 */}
            <div className="flex-1 overflow-y-auto mx-7 rounded-xl border"
              style={{ borderColor: 'var(--color-light-gray)', background: 'var(--color-near-white)' }}>
              {displayed.length > 0 ? displayed.map(task => (
                <TaskRow key={task.id} task={task} onToggleSprint={toggleSprint} onStatusChange={statusChange} />
              )) : (
                <div className="flex flex-col items-center justify-center py-16" style={{ color: 'var(--color-gray)' }}>
                  <div className="text-3xl mb-2">📦</div>
                  <p className="text-sm">태스크가 없습니다</p>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
