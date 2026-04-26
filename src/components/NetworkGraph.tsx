import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface NetworkGraphProps {
  nodes: any[];
  links: any[];
}

export default function NetworkGraph({ nodes, links }: NetworkGraphProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || !nodes.length) return;

    const width = 600;
    const height = 400;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const simulation = d3.forceSimulation(nodes)
      .force("link", d3.forceLink(links).id((d: any) => d.id).distance(100))
      .force("charge", d3.forceManyBody().strength(-150))
      .force("center", d3.forceCenter(width / 2, height / 2));

    const link = svg.append("g")
      .attr("stroke", "#ffffff10")
      .attr("stroke-width", 1)
      .selectAll("line")
      .data(links)
      .join("line");

    const node = svg.append("g")
      .selectAll("g")
      .data(nodes)
      .join("g")
      .call(d3.drag<any, any>()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended));

    node.append("circle")
      .attr("r", (d: any) => d.type === 'target' ? 8 : 4)
      .attr("fill", (d: any) => {
        if (d.type === 'target') return "#f97316"; // Orange
        if (d.type === 'secret') return "#f43f5e"; // Rose
        if (d.type === 'endpoint') return "#06b6d4"; // Cyan
        return "#64748b";
      });

    node.append("text")
      .attr("dx", 12)
      .attr("dy", 4)
      .text((d: any) => d.label)
      .attr("font-size", "8px")
      .attr("font-family", "JetBrains Mono")
      .attr("fill", "#94a3b8");

    simulation.on("tick", () => {
      link
        .attr("x1", (d: any) => d.source.x)
        .attr("y1", (d: any) => d.source.y)
        .attr("x2", (d: any) => d.target.x)
        .attr("y2", (d: any) => d.target.y);

      node.attr("transform", (d: any) => `translate(${d.x},${d.y})`);
    });

    function dragstarted(event: any) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      event.subject.fx = event.subject.x;
      event.subject.fy = event.subject.y;
    }

    function dragged(event: any) {
      event.subject.fx = event.x;
      event.subject.fy = event.y;
    }

    function dragended(event: any) {
      if (!event.active) simulation.alphaTarget(0);
      event.subject.fx = null;
      event.subject.fy = null;
    }

    return () => {
      simulation.stop();
    };
  }, [nodes, links]);

  return (
    <div className="w-full h-full bg-black/20 rounded-xl overflow-hidden border border-white/5 relative">
      <div className="absolute top-3 left-3 flex gap-4">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-orange-500" />
          <span className="text-[8px] font-black uppercase text-white/40 tracking-widest">Entry</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-cyan-500" />
          <span className="text-[8px] font-black uppercase text-white/40 tracking-widest">Endpoint</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-rose-500" />
          <span className="text-[8px] font-black uppercase text-white/40 tracking-widest">Secret</span>
        </div>
      </div>
      <svg ref={svgRef} className="w-full h-full" viewBox="0 0 600 400" />
    </div>
  );
}
