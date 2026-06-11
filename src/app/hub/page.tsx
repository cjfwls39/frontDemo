'use client';

import { useState, useEffect, Suspense, lazy } from 'react';
import TopBar from './components/TopBar';
import BottomDock from './components/BottomDock';

// React.lazy 사용 — next/dynamic(ssr:false)의 Turbopack 정적 분석 오류 우회
const OfficeScene = lazy(() => import('./components/OfficeScene'));

function Loader() {
  return (
    <div
      className="w-full h-full flex items-center justify-center"
      style={{ background: '#EDF3F9' }}
    >
      <div className="text-center">
        <div className="text-4xl font-bold mb-4" style={{ color: '#1A1A1A' }}>
          ● CoWork
        </div>
        <p className="text-sm" style={{ color: '#5C5C5C' }}>
          사무실 로딩 중...
        </p>
      </div>
    </div>
  );
}

export default function HubPage() {
  // 서버 측에서 Canvas 렌더링 방지 — 클라이언트 마운트 후에만 씬 표시
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);

  return (
    <div className="relative w-full h-screen overflow-hidden">
      <TopBar />

      <div className="absolute inset-0 pt-14 pb-16">
        {ready ? (
          <Suspense fallback={<Loader />}>
            <OfficeScene />
          </Suspense>
        ) : (
          <Loader />
        )}
      </div>

      <BottomDock />
    </div>
  );
}
