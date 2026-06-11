'use client';

import { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';

// ── 그래프 데이터 ────────────────────────────────────────
// 실제 환경에서는 Spring Boot GET /api/graph 로 받아옴
const GRAPH_DATA = {
  nodes: [
    { id: 'd1', title: 'CoWork 기획서 v2',        type: '기획서',  tags: ['기획','서비스'],   project: 'CoWork 웹 플랫폼', size: 18 },
    { id: 'd2', title: '스프린트 3 킥오프',        type: '회의록', tags: ['회의','스프린트'], project: 'CoWork 웹 플랫폼', size: 12 },
    { id: 'd3', title: '컴포넌트 가이드',          type: '가이드',  tags: ['디자인','프론트'], project: 'UI/UX 리디자인',   size: 14 },
    { id: 'd4', title: 'API 설계 — 인증',          type: '문서',    tags: ['백엔드','API'],    project: 'API 서버 v2',      size: 13 },
    { id: 'd5', title: 'DB 스키마 최종본',         type: '문서',    tags: ['백엔드','DB'],     project: 'API 서버 v2',      size: 13 },
    { id: 'd6', title: '디자인 리뷰 회의',         type: '회의록', tags: ['회의','디자인'],   project: 'UI/UX 리디자인',   size: 10 },
    { id: 'd7', title: '배포 파이프라인 가이드',   type: '가이드',  tags: ['인프라','CI/CD'],  project: 'CoWork 웹 플랫폼', size: 11 },
    { id: 'd8', title: 'Q2 로드맵',               type: '기획서',  tags: ['기획','로드맵'],   project: 'CoWork 웹 플랫폼', size: 15 },
    { id: 'd9', title: '칸반 보드 기능 명세',      type: '기획서',  tags: ['기획','칸반'],     project: 'CoWork 웹 플랫폼', size: 12 },
    // 태그 노드
    { id: 't-기획',    title: '#기획',    type: 'tag', tags: [], project: '', size: 8 },
    { id: 't-백엔드',  title: '#백엔드',  type: 'tag', tags: [], project: '', size: 9 },
    { id: 't-디자인',  title: '#디자인',  type: 'tag', tags: [], project: '', size: 8 },
    { id: 't-인프라',  title: '#인프라',  type: 'tag', tags: [], project: '', size: 7 },
    { id: 't-회의',    title: '#회의',    type: 'tag', tags: [], project: '', size: 7 },
  ],
  links: [
    // 문서 간 참조 링크
    { source: 'd1', target: 'd8', label: '참조' },
    { source: 'd1', target: 'd9', label: '참조' },
    { source: 'd1', target: 'd3', label: '참조' },
    { source: 'd2', target: 'd1', label: '회의주제' },
    { source: 'd2', target: 'd9', label: '논의' },
    { source: 'd4', target: 'd5', label: '연관' },
    { source: 'd7', target: 'd4', label: '참조' },
    { source: 'd6', target: 'd3', label: '리뷰대상' },
    { source: 'd8', target: 'd4', label: '포함' },
    { source: 'd9', target: 'd3', label: '참조' },
    // 태그 링크
    { source: 'd1', target: 't-기획',   label: 'tag' },
    { source: 'd8', target: 't-기획',   label: 'tag' },
    { source: 'd9', target: 't-기획',   label: 'tag' },
    { source: 'd4', target: 't-백엔드', label: 'tag' },
    { source: 'd5', target: 't-백엔드', label: 'tag' },
    { source: 'd3', target: 't-디자인', label: 'tag' },
    { source: 'd6', target: 't-디자인', label: 'tag' },
    { source: 'd7', target: 't-인프라', label: 'tag' },
    { source: 'd2', target: 't-회의',   label: 'tag' },
    { source: 'd6', target: 't-회의',   label: 'tag' },
  ],
};

const TYPE_COLOR: Record<string, string> = {
  '기획서':  '#D95B00',
  '회의록':  '#7B3FC4',
  '가이드':  '#1A7A47',
  '문서':    '#1A6FC4',
  'tag':     '#ABABAB',
};

interface GraphNode {
  id: string;
  title: string;
  type: string;
  tags: string[];
  project: string;
  size: number;
  x?: number;
  y?: number;
}

interface GraphLink {
  source: string | GraphNode;
  target: string | GraphNode;
  label: string;
}

interface TooltipState {
  node: GraphNode;
  x: number;
  y: number;
}

export default function DocGraph() {
  const containerRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const fgRef = useRef<any>(null);
  const router = useRouter();
  const [tooltip, setTooltip] = useState<TooltipState | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<string>('전체');
  const [ForceGraph, setForceGraph] = useState<React.ComponentType<unknown> | null>(null);
  const [dims, setDims] = useState({ w: 800, h: 500 });

  // SSR 방지 — React.lazy 패턴 대신 dynamic import in useEffect
  useEffect(() => {
    import('react-force-graph-2d').then(mod => {
      setForceGraph(() => mod.default);
    });
  }, []);

  // 컨테이너 크기 감지
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(entries => {
      const { width, height } = entries[0].contentRect;
      setDims({ w: width, h: height });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // 라이브러리가 link.source/target을 객체로 변이시키므로 매번 새 객체로 복사
  const filteredData = useMemo(() => {
    const nodes = GRAPH_DATA.nodes
      .filter(n => {
        if (filterType !== '전체' && filterType !== 'tag' && n.type !== filterType) return false;
        if (filterType === 'tag' && n.type !== 'tag') return false;
        if (search && !n.title.toLowerCase().includes(search.toLowerCase())) return false;
        return true;
      })
      .map(n => ({ ...n })); // 새 객체 — 라이브러리 변이가 원본에 영향 안 줌

    const nodeIds = new Set(nodes.map(n => n.id));

    const links = GRAPH_DATA.links
      .filter(l => nodeIds.has(l.source as string) && nodeIds.has(l.target as string))
      .map(l => ({ ...l })); // 새 객체 — source/target 변이가 원본 배열에 영향 안 줌

    return { nodes, links };
  }, [search, filterType]);

  const paintNode = useCallback((node: GraphNode, ctx: CanvasRenderingContext2D, globalScale: number) => {
    const isSelected = node.id === selected;
    const isTag = node.type === 'tag';
    const r = (node.size ?? 10) / globalScale * (isSelected ? 1.4 : 1);
    const color = TYPE_COLOR[node.type] ?? '#ABABAB';

    // 선택 후광
    if (isSelected) {
      ctx.beginPath();
      ctx.arc(node.x ?? 0, node.y ?? 0, r * 1.6, 0, 2 * Math.PI);
      ctx.fillStyle = color + '33';
      ctx.fill();
    }

    // 노드 원
    ctx.beginPath();
    ctx.arc(node.x ?? 0, node.y ?? 0, r, 0, 2 * Math.PI);
    if (isTag) {
      ctx.strokeStyle = color;
      ctx.lineWidth = 1.5 / globalScale;
      ctx.fillStyle = color + '22';
      ctx.fill();
      ctx.stroke();
    } else {
      ctx.fillStyle = color;
      ctx.fill();
    }

    // 레이블
    const fontSize = Math.max(3, 11 / globalScale);
    ctx.font = `${isSelected ? 'bold ' : ''}${fontSize}px -apple-system, sans-serif`;
    ctx.fillStyle = isSelected ? color : '#444';
    ctx.textAlign = 'center';
    ctx.fillText(node.title.length > 12 ? node.title.slice(0, 12) + '…' : node.title, node.x ?? 0, (node.y ?? 0) + r + fontSize * 1.2);
  }, [selected]);

  const getLinkColor = useCallback((link: GraphLink) => {
    return link.label === 'tag' ? '#CCCCCC' : '#AAAAAA';
  }, []);

  const getLinkWidth = useCallback((link: GraphLink) => {
    return link.label === 'tag' ? 0.8 : 1.5;
  }, []);

  if (!ForceGraph) {
    return (
      <div className="flex items-center justify-center h-full" style={{ color: 'var(--color-gray)' }}>
        <div className="text-center">
          <div className="text-3xl mb-2">🕸️</div>
          <p className="text-sm">그래프 로딩 중...</p>
        </div>
      </div>
    );
  }

  const FG = ForceGraph as React.ComponentType<{
    ref: React.Ref<unknown>;
    width: number;
    height: number;
    graphData: { nodes: GraphNode[]; links: GraphLink[] };
    nodeCanvasObject: (node: GraphNode, ctx: CanvasRenderingContext2D, scale: number) => void;
    nodeLabel: () => string;
    onNodeClick: (node: GraphNode) => void;
    onNodeHover: (node: GraphNode | null, prev: GraphNode | null) => void;
    linkColor: (link: GraphLink) => string;
    linkWidth: (link: GraphLink) => number;
    linkDirectionalArrowLength: number;
    linkDirectionalArrowRelPos: number;
    linkDirectionalArrowColor: (link: GraphLink) => string;
    backgroundColor: string;
    cooldownTicks: number;
    nodeRelSize: number;
    d3AlphaDecay: number;
    d3VelocityDecay: number;
  }>;

  return (
    <div className="flex flex-col h-full">
      {/* 컨트롤 바 */}
      <div className="flex items-center gap-3 px-5 py-3 border-b shrink-0"
        style={{ background: 'var(--color-near-white)', borderColor: 'var(--color-light-gray)' }}>
        {/* 검색 */}
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs" style={{ color: 'var(--color-gray)' }}>🔍</span>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="노드 검색..."
            className="pl-8 pr-4 py-1.5 rounded-lg text-xs outline-none w-40"
            style={{ background: 'var(--color-card-bg)', border: '1px solid var(--color-light-gray)', color: 'var(--color-dark-text)' }} />
        </div>

        {/* 타입 필터 */}
        <div className="flex gap-1">
          {['전체','기획서','회의록','가이드','문서','tag'].map(t => (
            <button key={t} onClick={() => setFilterType(t)}
              className="px-2.5 py-1 rounded-lg text-xs font-medium"
              style={{
                background: filterType === t ? 'var(--color-accent)' : 'var(--color-panel-bg)',
                color: filterType === t ? '#fff' : 'var(--color-mid-gray)',
              }}>
              {t === 'tag' ? '#태그' : t}
            </button>
          ))}
        </div>

        <div className="flex-1" />

        {/* 범례 */}
        <div className="flex items-center gap-3">
          {Object.entries(TYPE_COLOR).filter(([t]) => t !== 'tag').map(([t, c]) => (
            <div key={t} className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: c }} />
              <span className="text-xs" style={{ color: 'var(--color-gray)' }}>{t}</span>
            </div>
          ))}
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full border shrink-0" style={{ borderColor: '#ABABAB' }} />
            <span className="text-xs" style={{ color: 'var(--color-gray)' }}>태그</span>
          </div>
        </div>

        {/* 중앙 정렬 버튼 */}
        <button
          onClick={() => fgRef.current?.zoomToFit(400, 40)}
          className="px-3 py-1.5 rounded-lg text-xs font-medium"
          style={{ background: 'var(--color-panel-bg)', color: 'var(--color-mid-gray)', border: '1px solid var(--color-light-gray)' }}>
          ⌖ 전체 보기
        </button>
      </div>

      {/* 그래프 캔버스 */}
      <div ref={containerRef} className="flex-1 relative overflow-hidden" style={{ background: '#F7F7F7' }}>
        <FG
          ref={fgRef}
          width={dims.w}
          height={dims.h}
          graphData={filteredData as { nodes: GraphNode[]; links: GraphLink[] }}
          nodeCanvasObject={paintNode}
          nodeLabel={() => ''}
          linkColor={getLinkColor}
          linkWidth={getLinkWidth}
          linkDirectionalArrowColor={getLinkColor}
          onNodeClick={(node: GraphNode) => {
            setSelected(node.id === selected ? null : node.id);
            if (node.type !== 'tag' && node.id !== selected) {
              // 더블클릭 없이 단일 클릭 — 선택만. 이동은 툴팁의 버튼으로
            }
          }}
          onNodeHover={(node: GraphNode | null, _prev: GraphNode | null) => {
            if (node) {
              const canvas = containerRef.current?.querySelector('canvas');
              if (canvas) {
                const rect = canvas.getBoundingClientRect();
                setTooltip({ node, x: rect.left + (node.x ?? 0), y: rect.top + (node.y ?? 0) });
              }
            } else {
              setTooltip(null);
            }
          }}
          linkDirectionalArrowLength={4}
          linkDirectionalArrowRelPos={1}
          backgroundColor="#F7F7F7"
          cooldownTicks={100}
          nodeRelSize={1}
          d3AlphaDecay={0.02}
          d3VelocityDecay={0.3}
        />

        {/* 선택 노드 상세 패널 */}
        {selected && (() => {
          const node = GRAPH_DATA.nodes.find(n => n.id === selected);
          if (!node) return null;
          const connections = GRAPH_DATA.links.filter(
            l => l.source === node.id || l.target === node.id
          ).length;
          return (
            <div className="absolute top-4 right-4 w-56 rounded-xl border p-4 shadow-lg"
              style={{ background: 'var(--color-near-white)', borderColor: 'var(--color-light-gray)' }}>
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full shrink-0"
                    style={{ background: TYPE_COLOR[node.type] ?? '#ABABAB' }} />
                  <span className="text-xs font-bold" style={{ color: 'var(--color-black)' }}>{node.type}</span>
                </div>
                <button onClick={() => setSelected(null)} className="text-xs" style={{ color: 'var(--color-gray)' }}>✕</button>
              </div>
              <p className="text-sm font-semibold mb-1 leading-snug" style={{ color: 'var(--color-black)' }}>{node.title}</p>
              {node.project && <p className="text-xs mb-2" style={{ color: 'var(--color-gray)' }}>{node.project}</p>}
              <div className="flex flex-wrap gap-1 mb-3">
                {node.tags.map(tag => (
                  <span key={tag} className="text-xs px-1.5 py-0.5 rounded"
                    style={{ background: 'var(--color-panel-bg)', color: 'var(--color-mid-gray)' }}>#{tag}</span>
                ))}
              </div>
              <p className="text-xs mb-3" style={{ color: 'var(--color-gray)' }}>연결 {connections}개</p>
              {node.type !== 'tag' && (
                <button onClick={() => router.push(`/docs/${node.id}`)}
                  className="w-full py-1.5 rounded-lg text-xs font-bold hover:opacity-90"
                  style={{ background: 'var(--color-accent)', color: '#fff' }}>
                  문서 열기 →
                </button>
              )}
            </div>
          );
        })()}

        {/* 툴팁 */}
        {tooltip && !selected && (
          <div className="fixed z-50 px-3 py-2 rounded-lg text-xs pointer-events-none shadow-lg"
            style={{
              left: tooltip.x + 12, top: tooltip.y - 10,
              background: 'var(--color-black)', color: '#fff',
              transform: 'translateY(-100%)',
            }}>
            <p className="font-semibold">{tooltip.node.title}</p>
            {tooltip.node.project && <p style={{ color: '#aaa' }}>{tooltip.node.project}</p>}
          </div>
        )}

        {/* 빈 상태 */}
        {filteredData.nodes.length === 0 && (
          <div className="absolute inset-0 flex flex-col items-center justify-center" style={{ color: 'var(--color-gray)' }}>
            <div className="text-3xl mb-2">🔍</div>
            <p className="text-sm">해당하는 노드가 없습니다</p>
          </div>
        )}
      </div>
    </div>
  );
}
