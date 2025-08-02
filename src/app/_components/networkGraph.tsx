"use client";

import * as d3 from "d3";
import { useEffect, useRef } from "react";

// Add position and velocity fields required by D3
interface GraphNode extends d3.SimulationNodeDatum {
  id: string;
  group: number;
}

interface GraphLink extends d3.SimulationLinkDatum<GraphNode> {
  source: string | GraphNode;
  target: string | GraphNode;
}

const nodes: GraphNode[] = [
  { id: "Root", group: 1 },
  { id: "Leaf 1", group: 2 },
  { id: "Leaf 2", group: 2 },
  { id: "Leaf 3", group: 2 },
  { id: "Leaf 4", group: 2 }
];

const links: GraphLink[] = [
  { source: "Root", target: "Leaf 1" },
  { source: "Root", target: "Leaf 2" },
  { source: "Root", target: "Leaf 3" },
  { source: "Root", target: "Leaf 4" }
];

const NetworkGraph = () => {
  const ref = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (!ref.current) return;

    const width = 600;
    const height = 400;

    const svg = d3
      .select(ref.current)
      .attr("width", width)
      .attr("height", height)
      .append("g");

    const simulation = d3
      .forceSimulation<GraphNode>(nodes)
      .force(
        "link",
        d3
          .forceLink<GraphNode, GraphLink>(links)
          .id((d) => d.id)
          .distance(100)
      )
      .force("charge", d3.forceManyBody().strength(-300))
      .force("center", d3.forceCenter(width / 2, height / 2));

    const link = svg
      .append("g")
      .attr("stroke", "#aaa")
      .attr("stroke-width", 2)
      .selectAll("line")
      .data(links)
      .join("line");

    const node = svg
      .append("g")
      .attr("stroke", "#fff")
      .attr("stroke-width", 1.5)
      .selectAll<SVGCircleElement, GraphNode>("circle")
      .data(nodes)
      .join("circle")
      .attr("r", 10)
      .attr("fill", (d) => (d.group === 1 ? "#f77f00" : "#003049"))
      .call(d3.drag<SVGCircleElement, GraphNode>()
        .on("start", (event, d) => {
          if (!event?.active) simulation.alphaTarget(0.3).restart();
          d.fx = d.x;
          d.fy = d.y;
        })
        .on("drag", (event, d) => {
          d.fx = event.x;
          d.fy = event.y;
        })
        .on("end", (event, d) => {
          if (!event.active) simulation.alphaTarget(0);
          d.fx = null;
          d.fy = null;
        })
      );


    const label = svg
      .append("g")
      .selectAll("text")
      .data(nodes)
      .join("text")
      .text((d) => d.id)
      .attr("font-size", 12)
      .attr("fill", "#333");

    simulation.on("tick", () => {
      link
        .attr("x1", (d) => (d.source as GraphNode).x!)
        .attr("y1", (d) => (d.source as GraphNode).y!)
        .attr("x2", (d) => (d.target as GraphNode).x!)
        .attr("y2", (d) => (d.target as GraphNode).y!);

      node
        .attr("cx", (d) => d.x!)
        .attr("cy", (d) => d.y!);

      label
        .attr("x", (d) => d.x! + 12)
        .attr("y", (d) => d.y! + 4);
    });
  }, []);

  return <svg ref={ref} />;
};

export default NetworkGraph;
