'use client';

import Link from 'next/link';

const NAV_ICONS = [
  { href: '/notifications', label: '알림', icon: '🔔' },
  { href: '/chat',          label: '채팅', icon: '💬' },
  { href: '/company',       label: '프로필', icon: '👤' },
];

export default function TopBar() {
  return (
    <header
      className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-7 h-14"
      style={{
        background: 'rgba(26,26,26,0.90)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(255,255,255,0.07)',
      }}
    >
      <Link href="/hub" className="text-lg font-bold tracking-tight" style={{ color: '#FAFAFA' }}>
        ● CoWork
      </Link>

      <nav className="flex items-center gap-1">
        {NAV_ICONS.map(({ href, label, icon }) => (
          <Link
            key={href}
            href={href}
            title={label}
            className="flex items-center justify-center w-10 h-10 rounded-lg text-xl transition-colors"
            style={{ color: '#FAFAFA' }}
            onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.10)')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
          >
            {icon}
          </Link>
        ))}
      </nav>
    </header>
  );
}
