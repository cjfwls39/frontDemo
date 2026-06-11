'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // 데모: 입력값 상관없이 메인으로 이동
    router.push('/hub');
  };

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--color-card-bg)' }}>
      <div className="w-full max-w-md">

        {/* 로고 */}
        <div className="text-center mb-8">
          <span className="text-2xl font-bold" style={{ color: 'var(--color-black)' }}>
            ● CoWork
          </span>
        </div>

        {/* 카드 */}
        <div
          className="rounded-xl px-10 py-10"
          style={{
            background: 'var(--color-near-white)',
            border: '1px solid var(--color-light-gray)',
          }}
        >
          <h1 className="text-xl font-bold mb-8" style={{ color: 'var(--color-black)' }}>
            CoWork 로그인
          </h1>

          <form onSubmit={handleLogin} className="flex flex-col gap-4">

            {/* 이메일 */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium" style={{ color: 'var(--color-mid-gray)' }}>
                이메일
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="이메일을 입력하세요"
                className="w-full rounded-lg px-4 py-3 text-sm outline-none transition-colors"
                style={{
                  background: 'var(--color-card-bg)',
                  border: '1px solid var(--color-light-gray)',
                  color: 'var(--color-dark-text)',
                }}
                onFocus={(e) => (e.target.style.borderColor = 'var(--color-accent)')}
                onBlur={(e) => (e.target.style.borderColor = 'var(--color-light-gray)')}
              />
            </div>

            {/* 비밀번호 */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium" style={{ color: 'var(--color-mid-gray)' }}>
                비밀번호
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="비밀번호를 입력하세요"
                className="w-full rounded-lg px-4 py-3 text-sm outline-none transition-colors"
                style={{
                  background: 'var(--color-card-bg)',
                  border: '1px solid var(--color-light-gray)',
                  color: 'var(--color-dark-text)',
                }}
                onFocus={(e) => (e.target.style.borderColor = 'var(--color-accent)')}
                onBlur={(e) => (e.target.style.borderColor = 'var(--color-light-gray)')}
              />
            </div>

            {/* 로그인 버튼 */}
            <button
              type="submit"
              className="w-full rounded-lg py-3 text-sm font-bold transition-opacity hover:opacity-90 mt-2"
              style={{
                background: 'var(--color-accent)',
                color: 'var(--color-near-white)',
              }}
            >
              로그인
            </button>

          </form>

          {/* 구분선 */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px" style={{ background: 'var(--color-light-gray)' }} />
            <span className="text-xs" style={{ color: 'var(--color-gray)' }}>또는</span>
            <div className="flex-1 h-px" style={{ background: 'var(--color-light-gray)' }} />
          </div>

          {/* 회원가입 링크 */}
          <Link
            href="/signup"
            className="block w-full text-center rounded-lg py-3 text-sm transition-colors hover:opacity-80"
            style={{
              border: '1px solid var(--color-light-gray)',
              color: 'var(--color-dark-text)',
              background: 'var(--color-near-white)',
            }}
          >
            회원가입
          </Link>

        </div>
      </div>
    </div>
  );
}
