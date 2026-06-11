'use client';

import { Canvas, ThreeEvent } from '@react-three/fiber';
import { OrbitControls, Html, ContactShadows } from '@react-three/drei';
import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';

// ── 색상 팔레트 ────────────────────────────────────────────
const C = {
  floor:      '#EAE6DF',
  wall:       '#F5F2ED',
  wallSide:   '#F0EDE7',
  ceiling:    '#F6F4F0',
  desk:       '#C8A47C',
  deskTop:    '#D8B88A',
  chairDark:  '#3E3E3E',
  chairMid:   '#505050',
  monitor:    '#222222',
  screen:     '#C8E5FF',
  tableTop:   '#B8926A',
  tableLeg:   '#9A7248',
  plantGreen: '#527A4A',
  plantDark:  '#3A5C34',
  pot:        '#A86040',
  sofaDark:   '#7A756E',
  sofaLight:  '#9E9690',
  rug:        '#DDD5C5',
  lamp:       '#FFFBF0',
  screenGlow: '#EBF4FF',
  shelf:      '#C4AA85',
  shelfLight: '#D4BE9A',
};

// ── 기본 메시 박스 ─────────────────────────────────────────
type V3 = [number, number, number];

function Bx({
  p, s, c, ry = 0, rx = 0,
  emissive, emissiveIntensity = 0,
}: {
  p: V3; s: V3; c: string;
  ry?: number; rx?: number;
  emissive?: string; emissiveIntensity?: number;
}) {
  return (
    <mesh position={p} rotation={[rx, ry, 0]} castShadow receiveShadow>
      <boxGeometry args={s} />
      <meshStandardMaterial
        color={c}
        emissive={emissive ?? '#000000'}
        emissiveIntensity={emissive ? emissiveIntensity : 0}
      />
    </mesh>
  );
}

// ── 책상 + 모니터 + 의자 세트 ─────────────────────────────
function DeskSetup({ p, ry = 0 }: { p: V3; ry?: number }) {
  return (
    <group position={p} rotation={[0, ry, 0]}>
      {/* 상판 */}
      <Bx p={[0, 0.44, 0]}      s={[2.0, 0.06, 0.95]}  c={C.deskTop} />
      {/* 측면 판 좌우 */}
      <Bx p={[-0.95, 0.22, 0]}  s={[0.05, 0.44, 0.90]} c={C.desk} />
      <Bx p={[0.95, 0.22, 0]}   s={[0.05, 0.44, 0.90]} c={C.desk} />
      {/* 모니터 스탠드 */}
      <Bx p={[0, 0.49, -0.25]}  s={[0.26, 0.04, 0.26]} c={C.monitor} />
      <Bx p={[0, 0.62, -0.25]}  s={[0.05, 0.22, 0.05]} c={C.monitor} />
      {/* 모니터 본체 */}
      <Bx p={[0, 0.88, -0.30]}  s={[1.02, 0.62, 0.06]} c={C.monitor} rx={-0.12} />
      {/* 화면 (발광) */}
      <mesh position={[0, 0.88, -0.27]} rotation={[-0.12, 0, 0]}>
        <planeGeometry args={[0.90, 0.52]} />
        <meshStandardMaterial color={C.screen} emissive={C.screen} emissiveIntensity={0.40} />
      </mesh>
      {/* 의자 좌면 */}
      <Bx p={[0, 0.31, 0.65]}   s={[0.66, 0.08, 0.66]} c={C.chairMid} />
      {/* 의자 등받이 */}
      <Bx p={[0, 0.64, 0.95]}   s={[0.66, 0.58, 0.06]} c={C.chairDark} />
      {/* 의자 지지대 */}
      <Bx p={[0, 0.15, 0.65]}   s={[0.07, 0.20, 0.07]} c={C.chairDark} />
    </group>
  );
}

// ── 회의 테이블 + 의자 ────────────────────────────────────
const CHAIR_SLOTS: V3[] = [
  [-1.3, 0, -1.25], [0, 0, -1.25], [1.3, 0, -1.25],
  [-1.3, 0,  1.25], [0, 0,  1.25], [1.3, 0,  1.25],
];

function MeetingTable({ p }: { p: V3 }) {
  return (
    <group position={p}>
      <Bx p={[0, 0.76, 0]}      s={[3.5, 0.08, 1.9]} c={C.tableTop} />
      {/* 다리 4개 */}
      {([-1.5, 1.5] as number[]).flatMap(x =>
        ([-0.8, 0.8] as number[]).map((z, i) => (
          <Bx key={`${x}${i}`} p={[x, 0.37, z]} s={[0.07, 0.74, 0.07]} c={C.tableLeg} />
        ))
      )}
      {/* 의자 6개 */}
      {CHAIR_SLOTS.map(([cx, , cz], i) => {
        const flip = i >= 3 ? Math.PI : 0;
        return (
          <group key={i} position={[cx, 0, cz]} rotation={[0, flip, 0]}>
            <Bx p={[0, 0.30, 0]}    s={[0.60, 0.07, 0.60]} c={C.chairMid} />
            <Bx p={[0, 0.62, 0.28]} s={[0.60, 0.50, 0.05]} c={C.chairDark} />
            <Bx p={[0, 0.14, 0]}    s={[0.07, 0.28, 0.07]} c={C.chairDark} />
          </group>
        );
      })}
    </group>
  );
}

// ── 화분 ─────────────────────────────────────────────────
function Plant({ p }: { p: V3 }) {
  return (
    <group position={p}>
      <mesh position={[0, 0.22, 0]} castShadow>
        <cylinderGeometry args={[0.20, 0.16, 0.44, 10]} />
        <meshStandardMaterial color={C.pot} />
      </mesh>
      <mesh position={[0, 0.86, 0]} castShadow>
        <sphereGeometry args={[0.36, 12, 12]} />
        <meshStandardMaterial color={C.plantGreen} />
      </mesh>
      <mesh position={[0.18, 0.74, 0.10]} castShadow>
        <sphereGeometry args={[0.20, 8, 8]} />
        <meshStandardMaterial color={C.plantDark} />
      </mesh>
    </group>
  );
}

// ── 소파 ─────────────────────────────────────────────────
function Sofa({ p, ry = 0 }: { p: V3; ry?: number }) {
  return (
    <group position={p} rotation={[0, ry, 0]}>
      <Bx p={[0, 0.27, 0]}      s={[2.2, 0.22, 0.90]} c={C.sofaLight} />
      <Bx p={[0, 0.60, -0.38]}  s={[2.2, 0.52, 0.20]} c={C.sofaDark} />
      <Bx p={[-1.02, 0.44, 0]}  s={[0.18, 0.44, 0.90]} c={C.sofaDark} />
      <Bx p={[1.02, 0.44, 0]}   s={[0.18, 0.44, 0.90]} c={C.sofaDark} />
      <Bx p={[0, 0.08, 0]}      s={[2.04, 0.10, 0.86]} c={C.sofaDark} />
    </group>
  );
}

// ── 벽 디스플레이 스크린 ──────────────────────────────────
function WallDisplay({ p }: { p: V3 }) {
  return (
    <group position={p}>
      {/* 프레임 */}
      <Bx p={[0, 0, 0]} s={[4.6, 2.8, 0.10]} c="#202020" />
      {/* 화면 */}
      <mesh position={[0, 0, 0.06]}>
        <planeGeometry args={[4.28, 2.50]} />
        <meshStandardMaterial color={C.screenGlow} emissive={C.screenGlow} emissiveIntensity={0.65} />
      </mesh>
      {/* 화면 내 텍스트 */}
      <Html position={[0, 0.1, 0.12]} center style={{ pointerEvents: 'none', userSelect: 'none' }}>
        <div style={{ color: '#1A1A1A', fontSize: '26px', fontWeight: 800, letterSpacing: '-0.5px', whiteSpace: 'nowrap' }}>
          ● CoWork
        </div>
      </Html>
      <Html position={[0, -0.38, 0.12]} center style={{ pointerEvents: 'none', userSelect: 'none' }}>
        <div style={{ color: '#5C5C5C', fontSize: '11px', letterSpacing: '1px', whiteSpace: 'nowrap' }}>
          KANBAN BOARD
        </div>
      </Html>
    </group>
  );
}

// ── 호버 라벨 스타일 ──────────────────────────────────────
const tooltipStyle: React.CSSProperties = {
  background: 'rgba(26,26,26,0.93)',
  color: '#FAFAFA',
  padding: '7px 16px',
  borderRadius: '10px',
  fontSize: '13px',
  fontWeight: 600,
  whiteSpace: 'nowrap',
  borderLeft: '3px solid #D95B00',
  boxShadow: '0 4px 12px rgba(0,0,0,0.35)',
  pointerEvents: 'none',
};

// ── 클릭 가능한 네비게이션 존 ─────────────────────────────
interface ZoneProps {
  children: React.ReactNode;
  href: string;
  label: string;
  hitSize: V3;
  hitOffset?: V3;
}

function Zone({ children, href, label, hitSize, hitOffset = [0, 0, 0] }: ZoneProps) {
  const router = useRouter();
  const [hovered, setHovered] = useState(false);

  const onOver  = useCallback((e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    setHovered(true);
    document.body.style.cursor = 'pointer';
  }, []);
  const onOut   = useCallback(() => {
    setHovered(false);
    document.body.style.cursor = 'auto';
  }, []);
  const onClick = useCallback((e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    router.push(href);
  }, [href, router]);

  const [hx, hy, hz] = hitOffset;
  const [hw, hh, hd] = hitSize;

  return (
    <group onPointerOver={onOver} onPointerOut={onOut} onClick={onClick}>
      {children}

      {/* 히트박스 */}
      <mesh position={[hx, hy + hh / 2, hz]} visible={false}>
        <boxGeometry args={hitSize} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>

      {/* 호버 바닥 글로우 */}
      {hovered && (
        <mesh position={[hx, 0.01, hz]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[hw * 0.95, hd * 0.95]} />
          <meshBasicMaterial color="#D95B00" transparent opacity={0.09} depthWrite={false} />
        </mesh>
      )}

      {/* 호버 라벨 */}
      {hovered && (
        <Html position={[hx, hy + hh + 0.6, hz]} center zIndexRange={[10, 20]}>
          <div style={tooltipStyle}>{label}</div>
        </Html>
      )}
    </group>
  );
}

// ── 씬 내부 ───────────────────────────────────────────────
function Scene() {
  return (
    <>
      {/* ── 조명 ── */}
      <ambientLight intensity={1.15} color="#FFF9F4" />
      <directionalLight position={[8, 14, 10]} intensity={1.9} color="#FFFFFF" castShadow />
      {/* @ts-ignore – hemisphereLight args 타입 */}
      <hemisphereLight args={['#CCE5FF', '#E8D8C0', 0.55]} />
      <pointLight position={[-3, 5.5, 0]}  intensity={0.7} color="#FFF8EE" distance={13} />
      <pointLight position={[3, 5.5, -2]}  intensity={0.7} color="#FFF8EE" distance={13} />
      <pointLight position={[5, 5.5, 4]}   intensity={0.5} color="#FFF8EE" distance={10} />

      {/* ── 바닥 ── */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[22, 20]} />
        <meshStandardMaterial color={C.floor} />
      </mesh>

      {/* ── 벽 ── */}
      <Bx p={[0, 4.0, -9.6]}  s={[22, 8.0, 0.30]} c={C.wall}     ry={0} />
      <Bx p={[-9.6, 4.0, 0]}  s={[0.30, 8.0, 20]} c={C.wallSide} ry={0} />
      <Bx p={[9.6, 4.0, 0]}   s={[0.30, 8.0, 20]} c={C.wall}     ry={0} />

      {/* ── 천장 ── */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 8, 0]}>
        <planeGeometry args={[22, 20]} />
        <meshStandardMaterial color={C.ceiling} />
      </mesh>

      {/* ── 천장 조명 패널 (발광) ── */}
      {([[-4,-3],[0,-3],[4,-3],[-4,2],[0,2],[4,2]] as [number,number][]).map(([x, z], i) => (
        <mesh key={i} position={[x, 7.97, z]} rotation={[Math.PI / 2, 0, 0]}>
          <planeGeometry args={[1.6, 0.48]} />
          <meshStandardMaterial color={C.lamp} emissive={C.lamp} emissiveIntensity={1.6} />
        </mesh>
      ))}

      {/* ── 카펫 (책상 존) ── */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-5.5, 0.005, 0.5]}>
        <planeGeometry args={[4.0, 8.0]} />
        <meshStandardMaterial color={C.rug} />
      </mesh>

      {/* ── 책상 카펫 (회의실 존) ── */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[2.5, 0.005, -3]}>
        <planeGeometry args={[5.5, 4.5]} />
        <meshStandardMaterial color={C.rug} />
      </mesh>

      {/* ─────────────────────────────────────────
          클릭 존 ① 책상 존 → /projects
      ───────────────────────────────────────── */}
      <Zone href="/projects" label="📋 프로젝트 목록으로" hitSize={[4.2, 2.2, 8.0]} hitOffset={[-5.5, 0, 0.5]}>
        <DeskSetup p={[-5.5, 0, -2.5]} />
        <DeskSetup p={[-5.5, 0,  0.5]} />
        <DeskSetup p={[-5.5, 0,  3.5]} />
      </Zone>

      {/* ─────────────────────────────────────────
          클릭 존 ② 회의 테이블 → /docs
      ───────────────────────────────────────── */}
      <Zone href="/docs" label="📄 문서·회의록으로" hitSize={[5.0, 2.0, 3.8]} hitOffset={[2.5, 0, -3]}>
        <MeetingTable p={[2.5, 0, -3]} />
      </Zone>

      {/* ─────────────────────────────────────────
          클릭 존 ③ 벽 스크린 → /kanban
      ───────────────────────────────────────── */}
      <Zone href="/kanban" label="📊 칸반 보드로" hitSize={[5.0, 3.2, 1.5]} hitOffset={[0, 1.6, -8.7]}>
        <WallDisplay p={[0, 3.4, -9.44]} />
      </Zone>

      {/* ─────────────────────────────────────────
          클릭 존 ④ 소파 존 → /chat
      ───────────────────────────────────────── */}
      <Zone href="/chat" label="💬 채팅으로" hitSize={[3.5, 2.0, 2.8]} hitOffset={[5.5, 0, 3.0]}>
        <Sofa p={[5.5, 0, 3.0]} ry={Math.PI} />
        {/* 사이드 테이블 */}
        <Bx p={[3.9, 0.32, 3.0]} s={[0.64, 0.06, 0.64]} c={C.tableTop} />
        <Bx p={[3.9, 0.16, 3.0]} s={[0.07, 0.32, 0.07]} c={C.tableLeg} />
      </Zone>

      {/* ── 화분 ── */}
      <Plant p={[-8.5, 0, -8.5]} />
      <Plant p={[ 8.0, 0, -8.5]} />
      <Plant p={[ 8.0, 0,  7.5]} />

      {/* ── 책장 (오른쪽 벽) ── */}
      <Bx p={[9.2, 2.2, -6.0]} s={[0.55, 4.4, 2.6]} c={C.shelf} />
      {[0.5, 1.5, 2.5, 3.5].map((y, i) => (
        <Bx key={i} p={[9.15, y, -6.0]} s={[0.52, 0.05, 2.5]} c={C.shelfLight} />
      ))}

      {/* ── 소프트 그림자 ── */}
      <ContactShadows position={[0, 0.01, 0]} opacity={0.22} scale={24} blur={3} far={9} />

      {/* ── 카메라 컨트롤 ── */}
      <OrbitControls
        target={[0, 1.5, 0]}
        minDistance={9}
        maxDistance={22}
        maxPolarAngle={Math.PI / 2.2}
        minPolarAngle={Math.PI / 7}
        enablePan={false}
        enableDamping
        dampingFactor={0.07}
      />
    </>
  );
}

// ── Canvas 진입점 ─────────────────────────────────────────
export default function OfficeScene() {
  return (
    <Canvas
      camera={{ position: [11, 13, 14], fov: 48 }}
      shadows
      gl={{ antialias: true }}
      style={{ background: '#EDF3F9' }}
      className="w-full h-full"
    >
      <Scene />
    </Canvas>
  );
}
