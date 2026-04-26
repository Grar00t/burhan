import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import * as d3 from 'd3';
import { 
  Activity, 
  Layers, 
  Cpu, 
  Info, 
  ChevronRight, 
  Box, 
  Binary,
  Maximize2
} from 'lucide-react';
import { cn } from '../lib/utils';

interface LayerData {
  name: string;
  type: string;
  weights: number[][];
  bias: number[];
  dimensions: string;
}

const MOCK_LAYERS: LayerData[] = [
  {
    name: "Embedding",
    type: "Lookup",
    weights: Array.from({ length: 20 }, () => Array.from({ length: 20 }, () => Math.random() * 2 - 1)),
    bias: [],
    dimensions: "32000 x 4096"
  },
  {
    name: "Attention_QK",
    type: "Linear",
    weights: Array.from({ length: 20 }, () => Array.from({ length: 20 }, () => Math.random())),
    bias: Array.from({ length: 20 }, () => Math.random() * 0.1),
    dimensions: "4096 x 4096"
  },
  {
    name: "Attention_VO",
    type: "Linear",
    weights: Array.from({ length: 20 }, () => Array.from({ length: 20 }, () => Math.random() * 0.5)),
    bias: Array.from({ length: 20 }, () => Math.random() * 0.1),
    dimensions: "4096 x 4096"
  },
  {
    name: "FeedForward_1",
    type: "MLP",
    weights: Array.from({ length: 20 }, () => Array.from({ length: 20 }, () => Math.sin(Math.random() * Math.PI))),
    bias: Array.from({ length: 20 }, () => Math.random() - 0.5),
    dimensions: "4096 x 11008"
  }
];

const CASPER_LAYERS: LayerData[] = [
  {
    name: "TransformerBlock_0",
    type: "CasperCore",
    weights: Array.from({ length: 20 }, () => Array.from({ length: 20 }, () => Math.random() * 0.2)),
    bias: [],
    dimensions: "4096 x 4096"
  },
  {
    name: "CrossAttention",
    type: "CasperCore",
    weights: Array.from({ length: 20 }, () => Array.from({ length: 20 }, () => Math.cos(Math.random() * Math.PI))),
    bias: [],
    dimensions: "2048 x 2048"
  },
  {
    name: "KV_Cache_Manager",
    type: "StateStore",
    weights: Array.from({ length: 20 }, () => Array.from({ length: 20 }, () => Math.random() > 0.5 ? 1 : 0)),
    bias: [],
    dimensions: "512 x 4096"
  }
];

export default function TensorViz({ model = 'niyah' }: { model?: 'niyah' | 'casper' }) {
  const layers = model === 'casper' ? CASPER_LAYERS : MOCK_LAYERS;
  const [selectedLayer, setSelectedLayer] = useState<LayerData>(layers[0]);
  
  useEffect(() => {
    setSelectedLayer(layers[0]);
  }, [model]);

  const [selectedWeight, setSelectedWeight] = useState<{row: number, col: number, val: number} | null>(null);
  const heatmapRef = useRef<SVGSVGElement>(null);
  const histogramRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!heatmapRef.current || !selectedLayer) return;

    const svg = d3.select(heatmapRef.current);
    svg.selectAll("*").remove();

    const width = 360;
    const height = 360;
    const data = selectedLayer.weights;
    const rows = data.length;
    const cols = data[0].length;

    const x = d3.scaleLinear().domain([0, cols]).range([0, width]);
    const y = d3.scaleLinear().domain([0, rows]).range([0, height]);
    const color = d3.scaleSequential(d3.interpolateViridis).domain([-1, 1]);

    const g = svg.append("g");

    data.forEach((row, i) => {
      row.forEach((value, j) => {
        g.append("rect")
          .attr("x", x(j))
          .attr("y", y(i))
          .attr("width", width / cols)
          .attr("height", height / rows)
          .attr("fill", color(value))
          .attr("stroke", "rgba(0,0,0,0.05)")
          .attr("stroke-width", 0.2)
          .style("cursor", "pointer")
          .on("click", () => setSelectedWeight({row: i, col: j, val: value}));
      });
    });

    // Histogram
    if (!histogramRef.current) return;
    const histSvg = d3.select(histogramRef.current);
    histSvg.selectAll("*").remove();

    const hWidth = 400;
    const hHeight = 120;
    const flatWeights = data.flat();

    const hX = d3.scaleLinear()
      .domain([d3.min(flatWeights) || -1, d3.max(flatWeights) || 1])
      .range([0, hWidth]);

    const bins = d3.bin()
      .domain(hX.domain() as [number, number])
      .thresholds(25)(flatWeights);

    const hY = d3.scaleLinear()
      .domain([0, d3.max(bins, d => d.length) || 0])
      .range([hHeight, 0]);

    const hG = histSvg.append("g");

    hG.selectAll("rect")
      .data(bins)
      .join("rect")
      .attr("x", d => hX(d.x0 || 0) + 1)
      .attr("width", d => Math.max(0, hX(d.x1 || 0) - hX(d.x0 || 0) - 1))
      .attr("y", d => hY(d.length))
      .attr("height", d => hHeight - hY(d.length))
      .attr("fill", "#6366f1");

  }, [selectedLayer]);

  return (
    <div className="p-8 bg-[#E4E3E0] min-h-screen text-[#141414] font-sans">
      <header className="mb-10 pb-6 border-b border-[#141414]">
        <h1 className="text-4xl font-black uppercase italic tracking-tighter">NIYAH Tensor Analysis</h1>
        <p className="text-xs uppercase tracking-[0.2em] opacity-60">Kernel Layer Diagnostic • Sovereign Intel</p>
      </header>

      <div className="grid grid-cols-12 gap-8">
        {/* Layer List */}
        <div className="col-span-3 space-y-4">
          <h2 className="text-[10px] font-bold uppercase tracking-widest opacity-50 mb-4">Neural Layers</h2>
          {MOCK_LAYERS.map((layer) => (
            <button
              key={layer.name}
              onClick={() => {setSelectedLayer(layer); setSelectedWeight(null);}}
              className={cn(
                "w-full text-left p-4 border transition-all",
                selectedLayer.name === layer.name 
                  ? "bg-[#141414] text-[#E4E3E0]" 
                  : "bg-transparent border-[#141414] hover:bg-[#141414]/5"
              )}
            >
              <p className="font-bold font-mono text-sm">{layer.name}</p>
              <p className="text-[9px] uppercase tracking-wider opacity-60">{layer.type} • {layer.dimensions}</p>
            </button>
          ))}
        </div>

        {/* Visualization */}
        <div className="col-span-6 space-y-8">
          <div className="border border-[#141414] p-6 bg-white">
            <h3 className="font-mono text-xs uppercase mb-6 flex justify-between">
              Weight Distribution Map
              <span className="opacity-50 tracking-widest">{selectedLayer.name}</span>
            </h3>
            <div className="flex justify-center bg-[#f0f0f0] p-4">
              <svg ref={heatmapRef} width="360" height="360" />
            </div>
          </div>
          
          <div className="border border-[#141414] p-6 bg-white">
            <h3 className="font-mono text-xs uppercase mb-6">Density Histogram</h3>
            <svg ref={histogramRef} width="400" height="120" />
          </div>
        </div>
        
        {/* Detail Panel */}
        <div className="col-span-3">
          <div className="border border-[#141414] p-6 bg-[#141414] text-[#E4E3E0] sticky top-8">
            <h3 className="font-mono text-xs uppercase mb-6 border-b border-white/20 pb-2">Parameter Detail</h3>
            {selectedWeight ? (
              <div className="space-y-4 text-xs font-mono">
                <p>Node (Row, Col): <span className="font-bold">{selectedWeight.row}, {selectedWeight.col}</span></p>
                <p>Weight Value: <span className="font-bold text-[#00ffc8]">{selectedWeight.val.toFixed(6)}</span></p>
              </div>
            ) : (
              <p className="text-[10px] opacity-50 italic">Select a node in the heatmap to inspect parameter weights.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
