import React, { useMemo, useState, useCallback, useRef, useEffect } from 'react';
import { useIDEStore } from '../store/useStore';
import {
  Network, Maximize2, Minimize2, ZoomIn, ZoomOut,
  Target, Code2, Shield, BookOpen, Briefcase,
  Palette, Server, HelpCircle, Activity, Download,
  Filter, Clock, Brain,
} from 'lucide-react';

// ── Canonical layout canvas (stable, zoom-independent) ──────────────
const CANVAS_W = 1000;
const CANVAS_H = 1000;

export default function IntentGraph() {
  const { language } = useIDEStore();
  const [zoom, setZoom] = useState(1);
  const [expanded, setExpanded] = useState(false);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [collapsedBranches, setCollapsedBranches] = useState<Set<string>>(new Set());

  const toggleBranch = (id: string) => {
    setCollapsedBranches(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const nodes = [
    { id: 'core', label: 'CORE', cx: 500, cy: 500, r: 40, color: '#00FF00', type: 'Core' },
    { id: 'code', label: 'CODE', cx: 300, cy: 300, r: 30, color: '#00BFFF', type: 'Code', parent: 'core' },
    { id: 'content', label: 'CONTENT', cx: 700, cy: 300, r: 30, color: '#FFA500', type: 'Content', parent: 'core' },
    { id: 'logic', label: 'LOGIC', cx: 300, cy: 150, r: 25, color: '#00BFFF', type: 'Code', parent: 'code' },
    { id: 'data', label: 'DATA', cx: 700, cy: 150, r: 25, color: '#FFA500', type: 'Content', parent: 'content' },
  ];

  const graphHeight = expanded ? 500 : 280;
  const graphWidth = 320;

  const scale = (graphWidth * zoom) / CANVAS_W;

  const visibleNodes = nodes.filter(node => {
    let p = node.parent;
    while (p) {
      if (collapsedBranches.has(p)) return false;
      p = nodes.find(n => n.id === p)?.parent;
    }
    return true;
  });

  return (
    <div className="rounded-lg border border-neon-green/30 overflow-hidden bg-black/20 flex flex-col">
      {/* ── Toolbar ────────────────────────────────────────────── */}
      <div className="flex items-center gap-1 px-2 py-1 border-b border-white/10 flex-wrap">
        <Network size={11} className="text-neon-green" />
        <span className="text-[10px] font-semibold flex-1 text-neon-green uppercase tracking-widest">
          Intent Topology
        </span>
        <button onClick={() => setZoom(z => Math.min(z + 0.2, 2))} className="p-0.5 text-white/40 hover:text-white transition-colors">
          <ZoomIn size={11} />
        </button>
        <button onClick={() => setZoom(z => Math.max(z - 0.2, 0.5))} className="p-0.5 text-white/40 hover:text-white transition-colors">
          <ZoomOut size={11} />
        </button>
        <button onClick={() => setExpanded(!expanded)} className="p-0.5 text-white/40 hover:text-white transition-colors">
          {expanded ? <Minimize2 size={11} /> : <Maximize2 size={11} />}
        </button>
      </div>

      {/* ── Legend ── */}
      <div className="flex gap-4 px-3 py-2 border-b border-white/5 bg-white/[0.02]">
        {[
          { label: 'Core', color: '#00FF00' },
          { label: 'Code', color: '#00BFFF' },
          { label: 'Content', color: '#FFA500' }
        ].map(item => (
          <div key={item.label} className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: item.color }} />
            <span className="text-[8px] font-bold text-white/40 uppercase tracking-tighter">{item.label}</span>
          </div>
        ))}
      </div>

      {/* ── SVG Canvas ───── */}
      <div className="flex-1 relative min-h-[300px] overflow-hidden">
        <svg
          viewBox={`0 0 ${CANVAS_W} ${CANVAS_H}`}
          style={{
            width: '100%',
            height: '100%',
            transform: `scale(${zoom})`,
            transformOrigin: 'center',
            transition: 'transform 0.3s ease-out'
          }}
          className="cursor-crosshair touch-none"
        >
          <defs>
            <pattern id="niyah-grid" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" />
            </pattern>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          <rect width="100%" height="100%" fill="url(#niyah-grid)" />
          
          {visibleNodes.map(node => {
            if (!node.parent) return null;
            const parent = nodes.find(n => n.id === node.parent);
            if (!parent) return null;
            return (
              <line
                key={`${parent.id}-${node.id}`}
                x1={parent.cx} y1={parent.cy}
                x2={node.cx} y2={node.cy}
                stroke={node.color}
                strokeWidth={2}
                opacity={hoveredNode === node.id || hoveredNode === parent.id ? 0.6 : 0.2}
                style={{ transition: 'opacity 0.3s ease' }}
              />
            );
          })}

          {visibleNodes.map(node => (
            <g 
              key={node.id} 
              onMouseEnter={() => setHoveredNode(node.id)}
              onMouseLeave={() => setHoveredNode(null)}
              onClick={() => toggleBranch(node.id)}
              className="cursor-pointer group"
            >
              <circle 
                cx={node.cx} cy={node.cy} r={node.r} 
                fill={`${node.color}1A`} 
                stroke={node.color}
                strokeWidth={hoveredNode === node.id ? 3 : 1}
                filter={hoveredNode === node.id ? "url(#glow)" : ""}
                style={{ transition: 'all 0.3s ease' }}
              />
              <text 
                x={node.cx} y={node.cy} 
                textAnchor="middle" dominantBaseline="central" 
                fontSize={node.r / 3} 
                fill={node.color}
                className="font-black select-none"
              >
                {node.label}
              </text>
              {collapsedBranches.has(node.id) && (
                <circle cx={node.cx + node.r} cy={node.cy - node.r} r={5} fill="#FF0000" />
              )}
            </g>
          ))}
        </svg>
      </div>

      <div className="px-2 py-1 border-t border-white/10 text-[8px] text-white/20 font-mono flex justify-between">
        <span>NIYAH_GRAPH_ACTIVE // NODES: {visibleNodes.length}</span>
        <span className="animate-pulse">STREAMING_TELEMETRY...</span>
      </div>
    </div>
  );
}
