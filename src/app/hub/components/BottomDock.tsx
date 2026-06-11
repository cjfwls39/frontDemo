'use client';

import Link from 'next/link';

const DOCK_ITEMS = [
  { href: '/projects',     label: '📋 프로젝트' },
  { href: '/docs',         label: '📄 문서' },
  { href: '/kanban',       label: '📊 칸반' },
  { href: '/sprint',       label: '🏃 스프린트' },
  { href: '/company',      label: '🏢 회사관리' },
];

export default function BottomDock() {
  return (
    <div className="absolute bottom-0 left-0 right-0 z-20 flex justify-center pb-5 pointer-events-none">
      <nav
        className="flex gap-2 px-4 py-3 rounded-2xl pointer-events-auto"
        style={{
          background: 'rgba(26,26,26,0.90)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(255,255,255,0.08)',
          boxShadow: '0 4px 24px rgba(0,0,0,0.3)',
        }}
      >
        {DOCK_ITEMS.map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            className="px-4 py-2 rounded-xl text-sm font-medium transition-all"
            style={{
              background: 'rgba(255,255,255,0.07)',
              color: '#FAFAFA',
              border: '1px solid rgba(255,255,255,0.08)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(217,91,0,0.28)';
              e.currentTarget.style.borderColor = 'rgba(217,91,0,0.55)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.07)';
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
            }}
          >
            {label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
