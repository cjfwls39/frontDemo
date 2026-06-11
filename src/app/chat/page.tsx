'use client';

import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';

// ── 타입 ─────────────────────────────────────────────────
interface Message {
  id: string;
  from: string;
  text: string;
  time: string;
  mine: boolean;
  reactions?: { emoji: string; count: number }[];
}

interface Channel {
  id: string;
  name: string;
  type: 'dm' | 'channel';
  avatar?: string;
  unread?: number;
  lastMsg: string;
  lastTime: string;
  online?: boolean;
}

// ── 목업 데이터 ───────────────────────────────────────────
const CHANNELS: Channel[] = [
  { id: 'ch1', name: '# 일반',         type: 'channel', unread: 0,  lastMsg: '좋아요, 내일 10시에 봐요!',            lastTime: '14:30' },
  { id: 'ch2', name: '# 개발',         type: 'channel', unread: 3,  lastMsg: 'PR #42 리뷰 부탁드립니다',             lastTime: '13:55' },
  { id: 'ch3', name: '# 디자인',       type: 'channel', unread: 0,  lastMsg: '피그마 링크 공유했어요',               lastTime: '어제' },
  { id: 'ch4', name: '# 공지',         type: 'channel', unread: 1,  lastMsg: '스프린트 3 리뷰 금요일 4시입니다',     lastTime: '10:00' },
  { id: 'dm1', name: '김개발',         type: 'dm', online: true,  unread: 2,  lastMsg: 'WebSocket 붙이는 거 오후에 합시다', lastTime: '방금' },
  { id: 'dm2', name: '이디자인',       type: 'dm', online: true,  unread: 0,  lastMsg: '컴포넌트 PR 올렸어요!',             lastTime: '11:20' },
  { id: 'dm3', name: '박DBA',          type: 'dm', online: false, unread: 0,  lastMsg: '스키마 최종본 확인해주세요',        lastTime: '어제' },
  { id: 'dm4', name: '최기획',         type: 'dm', online: false, unread: 0,  lastMsg: '기획서 v2 공유드렸습니다',         lastTime: '어제' },
];

const MESSAGES: Record<string, Message[]> = {
  dm1: [
    { id: 'm1', from: '김개발', text: '안녕하세요! 오늘 WebSocket 서버 프로토타입 작업 시작할게요.', time: '10:00', mine: false },
    { id: 'm2', from: '나',     text: '좋아요! 기본 연결이랑 메시지 브로드캐스트부터 해주세요.', time: '10:02', mine: true },
    { id: 'm3', from: '김개발', text: 'Socket.io 쓸까요 아니면 ws 라이브러리로 직접 할까요?', time: '10:05', mine: false, reactions: [{ emoji: '🤔', count: 1 }] },
    { id: 'm4', from: '나',     text: 'ws로 직접 구현해봐요. 나중에 Socket.io로 바꾸기도 쉬울 거예요.', time: '10:07', mine: true },
    { id: 'm5', from: '김개발', text: '알겠습니다! 오후 3시쯤 PoC 결과 공유할게요 🚀', time: '10:10', mine: false, reactions: [{ emoji: '👍', count: 2 }] },
    { id: 'm6', from: '나',     text: '기대할게요. 연결 안정성 테스트도 꼭 해주세요.', time: '10:11', mine: true },
    { id: 'm7', from: '김개발', text: 'WebSocket 붙이는 거 오후에 합시다', time: '방금', mine: false },
  ],
  dm2: [
    { id: 'm1', from: '이디자인', text: '칸반 보드 카드 컴포넌트 PR 올렸어요! 확인해주실 수 있나요?', time: '11:00', mine: false },
    { id: 'm2', from: '나',       text: '바로 볼게요 👀', time: '11:05', mine: true },
    { id: 'm3', from: '이디자인', text: '감사합니다! 우선순위 배지 색상 디자인 시스템이랑 맞춰봤어요.', time: '11:08', mine: false },
    { id: 'm4', from: '나',       text: '디자인 잘 됐네요! 컴포넌트 PR 올렸어요!', time: '11:20', mine: true },
  ],
  ch2: [
    { id: 'm1', from: '이디자인', text: '칸반 보드 PR 올렸습니다. 리뷰 부탁드려요!', time: '13:30', mine: false },
    { id: 'm2', from: '박DBA',    text: '확인해볼게요', time: '13:35', mine: false },
    { id: 'm3', from: '김개발',   text: 'PR #42 리뷰 부탁드립니다', time: '13:55', mine: false },
    { id: 'm4', from: '나',       text: '오늘 오후에 리뷰 완료할게요!', time: '14:00', mine: true },
  ],
  ch1: [
    { id: 'm1', from: '최기획', text: '모두 수고하셨어요! 스프린트 3 순항 중이에요 👏', time: '14:10', mine: false },
    { id: 'm2', from: '김개발', text: '덕분에 잘 진행되고 있어요!', time: '14:15', mine: false },
    { id: 'm3', from: '이디자인', text: '좋아요, 내일 10시에 봐요!', time: '14:30', mine: false },
  ],
};

const AVATAR_COLOR: Record<string, string> = {
  '김개발': '#1A6FC4', '이디자인': '#D95B00', '박DBA': '#7B3FC4', '최기획': '#1A7A47', '나': '#ABABAB',
};

// ── 컴포넌트 ─────────────────────────────────────────────
export default function ChatPage() {
  const [activeId, setActiveId] = useState('dm1');
  const [input, setInput] = useState('');
  const [messagesMap, setMessagesMap] = useState<Record<string, Message[]>>(MESSAGES);
  const bottomRef = useRef<HTMLDivElement>(null);

  const active = CHANNELS.find(c => c.id === activeId)!;
  const messages = messagesMap[activeId] ?? [];

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeId, messages.length]);

  function sendMessage() {
    if (!input.trim()) return;
    const newMsg: Message = {
      id: `m${Date.now()}`, from: '나', text: input.trim(),
      time: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
      mine: true,
    };
    setMessagesMap(prev => ({ ...prev, [activeId]: [...(prev[activeId] ?? []), newMsg] }));
    setInput('');
  }

  const dmList = CHANNELS.filter(c => c.type === 'dm');
  const chList = CHANNELS.filter(c => c.type === 'channel');

  return (
    <div className="flex flex-col h-screen" style={{ background: 'var(--color-card-bg)' }}>
      {/* 앱바 */}
      <header className="flex items-center justify-between px-6 h-14 shrink-0 border-b"
        style={{ background: 'var(--color-near-white)', borderColor: 'var(--color-light-gray)' }}>
        <Link href="/hub" className="text-lg font-bold tracking-tight" style={{ color: 'var(--color-black)' }}>● CoWork</Link>
        <nav className="flex items-center gap-1">
          {['/notifications','/chat','/company'].map((href, i) => (
            <Link key={href} href={href}
              className="w-9 h-9 flex items-center justify-center rounded-lg text-lg hover:opacity-70"
              style={{ color: href === '/chat' ? 'var(--color-accent)' : 'var(--color-dark-text)' }}>
              {['🔔','💬','👤'][i]}
            </Link>
          ))}
        </nav>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* 채팅 사이드바 */}
        <aside className="flex flex-col w-60 shrink-0 h-full border-r overflow-y-auto"
          style={{ background: 'var(--color-near-white)', borderColor: 'var(--color-light-gray)' }}>

          {/* 검색 */}
          <div className="px-3 pt-4 pb-2">
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs" style={{ color: 'var(--color-gray)' }}>🔍</span>
              <input placeholder="검색..." className="w-full pl-8 pr-3 py-2 rounded-lg text-xs outline-none"
                style={{ background: 'var(--color-panel-bg)', color: 'var(--color-dark-text)', border: '1px solid var(--color-light-gray)' }} />
            </div>
          </div>

          {/* 채널 목록 */}
          <div className="px-3 pt-3">
            <p className="text-xs font-semibold px-2 mb-1" style={{ color: 'var(--color-gray)' }}>채널</p>
            {chList.map(c => (
              <ConvItem key={c.id} ch={c} active={activeId === c.id} onClick={() => setActiveId(c.id)} />
            ))}
          </div>

          {/* DM 목록 */}
          <div className="px-3 pt-4">
            <p className="text-xs font-semibold px-2 mb-1" style={{ color: 'var(--color-gray)' }}>다이렉트 메시지</p>
            {dmList.map(c => (
              <ConvItem key={c.id} ch={c} active={activeId === c.id} onClick={() => setActiveId(c.id)} />
            ))}
          </div>

          <div className="flex-1" />
          <div className="px-3 pb-4">
            <Link href="/hub" className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm"
              style={{ color: 'var(--color-mid-gray)' }}>← 메인 허브로</Link>
          </div>
        </aside>

        {/* 채팅 본문 */}
        <div className="flex flex-col flex-1 overflow-hidden">
          {/* 채팅 헤더 */}
          <div className="flex items-center justify-between px-6 py-3.5 border-b shrink-0"
            style={{ background: 'var(--color-near-white)', borderColor: 'var(--color-light-gray)' }}>
            <div className="flex items-center gap-2">
              {active.type === 'dm' ? (
                <>
                  <div className="relative">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white"
                      style={{ background: AVATAR_COLOR[active.name] ?? '#ABABAB' }}>{active.name[0]}</div>
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-white"
                      style={{ background: active.online ? '#1A7A47' : '#ABABAB' }} />
                  </div>
                  <div>
                    <p className="text-sm font-bold" style={{ color: 'var(--color-black)' }}>{active.name}</p>
                    <p className="text-xs" style={{ color: active.online ? '#1A7A47' : 'var(--color-gray)' }}>
                      {active.online ? '온라인' : '오프라인'}
                    </p>
                  </div>
                </>
              ) : (
                <p className="text-sm font-bold" style={{ color: 'var(--color-black)' }}>{active.name}</p>
              )}
            </div>
            <div className="flex items-center gap-1">
              {['🔍','📞','📎'].map(icon => (
                <button key={icon} className="w-8 h-8 flex items-center justify-center rounded-lg text-base hover:opacity-60"
                  style={{ color: 'var(--color-mid-gray)' }}>{icon}</button>
              ))}
            </div>
          </div>

          {/* 메시지 영역 */}
          <div className="flex-1 overflow-y-auto px-6 py-4 flex flex-col gap-4">
            {messages.length === 0 && (
              <div className="flex flex-col items-center justify-center flex-1 py-16" style={{ color: 'var(--color-gray)' }}>
                <div className="text-4xl mb-2">💬</div>
                <p className="text-sm">대화를 시작해보세요</p>
              </div>
            )}
            {messages.map((msg, i) => {
              const showName = !msg.mine && (i === 0 || messages[i - 1].from !== msg.from);
              return (
                <div key={msg.id} className={`flex ${msg.mine ? 'justify-end' : 'justify-start'} gap-2.5`}>
                  {!msg.mine && (
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0 ${showName ? '' : 'invisible'}`}
                      style={{ background: AVATAR_COLOR[msg.from] ?? '#ABABAB' }}>{msg.from[0]}</div>
                  )}
                  <div className={`flex flex-col ${msg.mine ? 'items-end' : 'items-start'} max-w-xs`}>
                    {showName && !msg.mine && (
                      <p className="text-xs font-semibold mb-1" style={{ color: 'var(--color-dark-text)' }}>{msg.from}</p>
                    )}
                    <div className="px-4 py-2.5 rounded-2xl text-sm leading-relaxed"
                      style={{
                        background: msg.mine ? 'var(--color-accent)' : 'var(--color-near-white)',
                        color: msg.mine ? '#fff' : 'var(--color-dark-text)',
                        border: msg.mine ? 'none' : '1px solid var(--color-light-gray)',
                        borderRadius: msg.mine ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                      }}>
                      {msg.text}
                    </div>
                    {msg.reactions && (
                      <div className="flex gap-1 mt-1">
                        {msg.reactions.map(r => (
                          <span key={r.emoji} className="text-xs px-2 py-0.5 rounded-full border"
                            style={{ background: 'var(--color-near-white)', borderColor: 'var(--color-light-gray)', color: 'var(--color-dark-text)' }}>
                            {r.emoji} {r.count}
                          </span>
                        ))}
                      </div>
                    )}
                    <p className="text-xs mt-1" style={{ color: 'var(--color-gray)' }}>{msg.time}</p>
                  </div>
                </div>
              );
            })}
            <div ref={bottomRef} />
          </div>

          {/* 입력창 */}
          <div className="px-6 py-4 border-t shrink-0"
            style={{ background: 'var(--color-near-white)', borderColor: 'var(--color-light-gray)' }}>
            <div className="flex items-center gap-3 px-4 py-2.5 rounded-2xl border"
              style={{ background: 'var(--color-card-bg)', borderColor: 'var(--color-light-gray)' }}>
              <button className="text-lg hover:opacity-60" style={{ color: 'var(--color-gray)' }}>📎</button>
              <input
                className="flex-1 text-sm outline-none bg-transparent"
                style={{ color: 'var(--color-dark-text)' }}
                placeholder={`${active.name}에게 메시지 보내기...`}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && sendMessage()}
              />
              <button className="text-lg hover:opacity-60" style={{ color: 'var(--color-gray)' }}>😊</button>
              <button
                onClick={sendMessage}
                className="w-8 h-8 rounded-xl flex items-center justify-center hover:opacity-90 transition-all"
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

function ConvItem({ ch, active, onClick }: { ch: Channel; active: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick}
      className="w-full flex items-center gap-2.5 px-2 py-2 rounded-lg text-left hover:opacity-80 transition-all"
      style={{ background: active ? 'var(--color-accent-bg)' : 'transparent' }}>
      {ch.type === 'dm' ? (
        <div className="relative shrink-0">
          <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white"
            style={{ background: AVATAR_COLOR[ch.name] ?? '#ABABAB' }}>{ch.name[0]}</div>
          <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full border border-white"
            style={{ background: ch.online ? '#1A7A47' : '#ABABAB' }} />
        </div>
      ) : (
        <div className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0"
          style={{ background: active ? 'var(--color-accent)' : 'var(--color-panel-bg)', color: active ? '#fff' : 'var(--color-mid-gray)' }}>
          #
        </div>
      )}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold truncate"
            style={{ color: active ? 'var(--color-accent)' : 'var(--color-dark-text)' }}>{ch.name}</p>
          {(ch.unread ?? 0) > 0 && (
            <span className="text-xs font-bold px-1.5 py-0.5 rounded-full text-white ml-1 shrink-0"
              style={{ background: 'var(--color-accent)', fontSize: '10px' }}>{ch.unread}</span>
          )}
        </div>
        <p className="text-xs truncate" style={{ color: 'var(--color-gray)' }}>{ch.lastMsg}</p>
      </div>
    </button>
  );
}
