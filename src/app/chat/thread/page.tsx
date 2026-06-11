'use client';

import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';

interface ThreadMsg {
  id: string;
  from: string;
  text: string;
  time: string;
  mine: boolean;
  isParent?: boolean;
  reactions?: { emoji: string; count: number; reacted?: boolean }[];
  attachments?: { name: string; size: string; icon: string }[];
}

const AVATAR_COLOR: Record<string, string> = {
  '김개발': '#1A6FC4', '이디자인': '#D95B00', '박DBA': '#7B3FC4', '최기획': '#1A7A47', '나': '#ABABAB',
};

const INIT_THREAD: ThreadMsg[] = [
  {
    id: 'p1', from: '김개발', time: '13:30', mine: false, isParent: true,
    text: 'PR #42 칸반 보드 UI 올렸습니다. 리뷰 부탁드려요!\n\n주요 변경사항:\n- KanbanCard 컴포넌트 분리\n- 우선순위 배지 색상 디자인 시스템 통일\n- 컬럼 헤더 hover 스타일 추가',
    reactions: [
      { emoji: '👀', count: 3, reacted: false },
      { emoji: '🎉', count: 1, reacted: true },
    ],
    attachments: [
      { name: 'kanban-preview.png', size: '245 KB', icon: '🖼️' },
    ],
  },
  { id: 'r1', from: '이디자인', time: '13:45', mine: false,
    text: '디자인 시스템 적용 잘 됐네요! 우선순위 색상 일관성이 훨씬 좋아졌어요 👍', reactions: [{ emoji: '💯', count: 2, reacted: false }] },
  { id: 'r2', from: '박DBA', time: '13:52', mine: false,
    text: '컴포넌트 분리 구조 깔끔해요. KanbanCard props 인터페이스 타입 문서화도 추가해주시면 좋겠어요.' },
  { id: 'r3', from: '나', time: '14:00', mine: true,
    text: '리뷰 완료했어요. 전반적으로 좋은데 한 가지 - 카드 이동 버튼이 모바일에서 너무 작을 수 있어요. 최소 44px 터치 영역 권장드려요.' },
  { id: 'r4', from: '김개발', time: '14:15', mine: false,
    text: '좋은 피드백 감사합니다! 터치 영역 수정하고 타입 주석도 추가해서 push할게요.', reactions: [{ emoji: '✅', count: 1, reacted: false }] },
  { id: 'r5', from: '최기획', time: '14:20', mine: false,
    text: '완성도 높네요. 백로그 탭에서도 같은 카드 컴포넌트 재사용하나요?' },
  { id: 'r6', from: '나', time: '14:22', mine: true,
    text: '네, 스프린트 페이지 태스크 행도 같은 스타일 변수 공유해요!' },
];

const EMOJI_PICKER = ['👍','👀','🎉','✅','💯','❤️','🤔','🚀'];

export default function ThreadPage() {
  const [messages, setMessages] = useState<ThreadMsg[]>(INIT_THREAD);
  const [input, setInput] = useState('');
  const [pickerFor, setPickerFor] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages.length]);

  function send() {
    if (!input.trim()) return;
    setMessages(prev => [...prev, {
      id: `r${Date.now()}`, from: '나', time: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
      mine: true, text: input.trim(),
    }]);
    setInput('');
  }

  function toggleReaction(msgId: string, emoji: string) {
    setMessages(prev => prev.map(m => {
      if (m.id !== msgId) return m;
      const existing = m.reactions?.find(r => r.emoji === emoji);
      if (existing) {
        return { ...m, reactions: m.reactions!.map(r => r.emoji === emoji
          ? { ...r, count: r.reacted ? r.count - 1 : r.count + 1, reacted: !r.reacted }
          : r).filter(r => r.count > 0) };
      }
      return { ...m, reactions: [...(m.reactions ?? []), { emoji, count: 1, reacted: true }] };
    }));
    setPickerFor(null);
  }

  const parent = messages.find(m => m.isParent)!;
  const replies = messages.filter(m => !m.isParent);

  return (
    <div className="flex flex-col h-screen" style={{ background: 'var(--color-card-bg)' }}>
      {/* 앱바 */}
      <header className="flex items-center justify-between px-6 h-14 shrink-0 border-b"
        style={{ background: 'var(--color-near-white)', borderColor: 'var(--color-light-gray)' }}>
        <div className="flex items-center gap-3">
          <Link href="/hub" className="text-lg font-bold tracking-tight" style={{ color: 'var(--color-black)' }}>● CoWork</Link>
          <span style={{ color: 'var(--color-light-gray)' }}>/</span>
          <Link href="/chat" className="text-sm" style={{ color: 'var(--color-mid-gray)' }}>💬 채팅</Link>
          <span style={{ color: 'var(--color-light-gray)' }}>/</span>
          <span className="text-sm font-medium" style={{ color: 'var(--color-dark-text)' }}>스레드</span>
        </div>
        <nav className="flex items-center gap-1">
          {['/notifications','/chat','/company'].map((href, i) => (
            <Link key={href} href={href} className="w-9 h-9 flex items-center justify-center rounded-lg text-lg hover:opacity-70"
              style={{ color: href === '/chat' ? 'var(--color-accent)' : 'var(--color-dark-text)' }}>{['🔔','💬','👤'][i]}</Link>
          ))}
        </nav>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* 왼쪽: 채널 미니 사이드바 */}
        <aside className="flex flex-col w-52 shrink-0 border-r pt-4 pb-4 px-3"
          style={{ background: 'var(--color-near-white)', borderColor: 'var(--color-light-gray)' }}>
          <p className="text-xs font-semibold px-2 mb-2" style={{ color: 'var(--color-gray)' }}>채널</p>
          {['# 일반','# 개발','# 디자인','# 공지'].map((ch, i) => (
            <div key={ch} className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm cursor-pointer ${i === 1 ? 'font-semibold' : ''}`}
              style={{ background: i === 1 ? 'var(--color-accent-bg)' : 'transparent', color: i === 1 ? 'var(--color-accent)' : 'var(--color-dark-text)' }}>
              {ch}
            </div>
          ))}
          <div className="flex-1" />
          <Link href="/chat" className="px-3 py-2 rounded-lg text-sm" style={{ color: 'var(--color-mid-gray)' }}>← 채팅으로</Link>
        </aside>

        {/* 오른쪽: 스레드 패널 */}
        <div className="flex flex-col flex-1 overflow-hidden">
          {/* 스레드 헤더 */}
          <div className="flex items-center justify-between px-6 py-3.5 border-b shrink-0"
            style={{ background: 'var(--color-near-white)', borderColor: 'var(--color-light-gray)' }}>
            <div>
              <p className="text-sm font-bold" style={{ color: 'var(--color-black)' }}>🧵 스레드</p>
              <p className="text-xs" style={{ color: 'var(--color-gray)' }}># 개발 · {replies.length}개 댓글</p>
            </div>
            <Link href="/chat" className="w-8 h-8 flex items-center justify-center rounded-lg text-lg hover:opacity-60"
              style={{ color: 'var(--color-mid-gray)' }}>✕</Link>
          </div>

          {/* 메시지 영역 */}
          <div className="flex-1 overflow-y-auto px-6 py-5" onClick={() => setPickerFor(null)}>

            {/* 원본 메시지 */}
            <MsgBubble msg={parent} pickerFor={pickerFor} setPickerFor={setPickerFor} onReact={toggleReaction} isParent />

            {/* 구분선 */}
            <div className="flex items-center gap-3 my-4">
              <div className="flex-1 h-px" style={{ background: 'var(--color-light-gray)' }} />
              <span className="text-xs" style={{ color: 'var(--color-gray)' }}>{replies.length}개 댓글</span>
              <div className="flex-1 h-px" style={{ background: 'var(--color-light-gray)' }} />
            </div>

            {/* 댓글 */}
            <div className="flex flex-col gap-4">
              {replies.map(m => (
                <MsgBubble key={m.id} msg={m} pickerFor={pickerFor} setPickerFor={setPickerFor} onReact={toggleReaction} />
              ))}
            </div>
            <div ref={bottomRef} />
          </div>

          {/* 입력창 */}
          <div className="px-6 py-4 border-t shrink-0"
            style={{ background: 'var(--color-near-white)', borderColor: 'var(--color-light-gray)' }}>
            <p className="text-xs mb-2" style={{ color: 'var(--color-gray)' }}>
              <span className="font-semibold" style={{ color: 'var(--color-dark-text)' }}>PR #42 리뷰 요청</span> 스레드에 댓글
            </p>
            <div className="flex items-center gap-3 px-4 py-2.5 rounded-2xl border"
              style={{ background: 'var(--color-card-bg)', borderColor: 'var(--color-light-gray)' }}>
              <input className="flex-1 text-sm outline-none bg-transparent"
                style={{ color: 'var(--color-dark-text)' }}
                placeholder="댓글 달기..."
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && send()} />
              <button className="text-lg hover:opacity-60" style={{ color: 'var(--color-gray)' }}>😊</button>
              <button onClick={send}
                className="w-8 h-8 rounded-xl flex items-center justify-center hover:opacity-90"
                style={{ background: input.trim() ? 'var(--color-accent)' : 'var(--color-light-gray)' }}>
                <span className="text-white text-sm">↑</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MsgBubble({ msg, pickerFor, setPickerFor, onReact, isParent }: {
  msg: ThreadMsg;
  pickerFor: string | null;
  setPickerFor: (id: string | null) => void;
  onReact: (id: string, emoji: string) => void;
  isParent?: boolean;
}) {
  return (
    <div className={`group flex gap-3 ${isParent ? 'p-4 rounded-xl border' : ''}`}
      style={isParent ? { background: 'var(--color-near-white)', borderColor: 'var(--color-light-gray)' } : {}}>
      <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0 mt-0.5"
        style={{ background: AVATAR_COLOR[msg.from] ?? '#ABABAB' }}>{msg.from[0]}</div>
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-2 mb-1">
          <span className="text-sm font-bold" style={{ color: 'var(--color-black)' }}>{msg.from}</span>
          <span className="text-xs" style={{ color: 'var(--color-gray)' }}>{msg.time}</span>
        </div>
        <p className="text-sm leading-relaxed whitespace-pre-line" style={{ color: 'var(--color-dark-text)' }}>{msg.text}</p>

        {/* 첨부파일 */}
        {msg.attachments?.map(a => (
          <div key={a.name} className="flex items-center gap-2 mt-2 px-3 py-2 rounded-lg inline-flex border"
            style={{ background: 'var(--color-panel-bg)', borderColor: 'var(--color-light-gray)' }}>
            <span>{a.icon}</span>
            <span className="text-xs font-medium" style={{ color: 'var(--color-dark-text)' }}>{a.name}</span>
            <span className="text-xs" style={{ color: 'var(--color-gray)' }}>{a.size}</span>
          </div>
        ))}

        {/* 리액션 */}
        <div className="flex flex-wrap items-center gap-1.5 mt-2">
          {msg.reactions?.map(r => (
            <button key={r.emoji} onClick={e => { e.stopPropagation(); onReact(msg.id, r.emoji); }}
              className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs border transition-all"
              style={{
                background: r.reacted ? 'var(--color-accent-bg)' : 'var(--color-near-white)',
                borderColor: r.reacted ? 'var(--color-accent)' : 'var(--color-light-gray)',
                color: r.reacted ? 'var(--color-accent)' : 'var(--color-dark-text)',
              }}>
              {r.emoji} {r.count}
            </button>
          ))}
          <div className="relative">
            <button onClick={e => { e.stopPropagation(); setPickerFor(pickerFor === msg.id ? null : msg.id); }}
              className="opacity-0 group-hover:opacity-100 px-2 py-0.5 rounded-full text-xs border transition-all"
              style={{ borderColor: 'var(--color-light-gray)', color: 'var(--color-gray)', background: 'var(--color-near-white)' }}>
              + 😊
            </button>
            {pickerFor === msg.id && (
              <div className="absolute bottom-full left-0 mb-1 p-2 rounded-xl border shadow-lg z-10 flex gap-1"
                style={{ background: 'var(--color-near-white)', borderColor: 'var(--color-light-gray)' }}
                onClick={e => e.stopPropagation()}>
                {EMOJI_PICKER.map(em => (
                  <button key={em} onClick={() => onReact(msg.id, em)}
                    className="w-8 h-8 flex items-center justify-center rounded-lg hover:opacity-70 text-base"
                    style={{ background: 'var(--color-panel-bg)' }}>{em}</button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
