'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function SignupPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // 데모: 가입 후 로그인으로 이동
    router.push('/login');
  };

  const fields: { name: keyof typeof form; label: string; type: string; placeholder: string }[] = [
    { name: 'name',     label: '이름',        type: 'text',     placeholder: '이름을 입력하세요' },
    { name: 'email',    label: '이메일',       type: 'email',    placeholder: '이메일을 입력하세요' },
    { name: 'password', label: '비밀번호',     type: 'password', placeholder: '비밀번호를 입력하세요' },
    { name: 'confirm',  label: '비밀번호 확인', type: 'password', placeholder: '비밀번호를 다시 입력하세요' },
  ];

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
            회원가입
          </h1>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {fields.map(({ name, label, type, placeholder }) => (
              <div key={name} className="flex flex-col gap-1.5">
                <label className="text-sm font-medium" style={{ color: 'var(--color-mid-gray)' }}>
                  {label}
                </label>
                <input
                  type={type}
                  name={name}
                  value={form[name]}
                  onChange={handleChange}
                  placeholder={placeholder}
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
            ))}

            <button
              type="submit"
              className="w-full rounded-lg py-3 text-sm font-bold transition-opacity hover:opacity-90 mt-2"
              style={{ background: 'var(--color-accent)', color: 'var(--color-near-white)' }}
            >
              가입하기
            </button>
          </form>

          {/* 로그인 링크 */}
          <div className="mt-6 text-center text-sm" style={{ color: 'var(--color-mid-gray)' }}>
            이미 계정이 있으신가요?{' '}
            <Link
              href="/login"
              className="font-semibold transition-opacity hover:opacity-70"
              style={{ color: 'var(--color-accent)' }}
            >
              로그인
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
