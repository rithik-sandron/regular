import { useEffect, useState, useRef } from "react";
import {
  handleChange,
  handleKeydown,
  handleKeyup,
  setCursor,
} from "@/lib/userHandles";
import Component from "@/components/Component";
import data from "@/lib/sample.json";
import Tree from "@/components/Tree";
import Timeline from "@/components/Timeline";
export default function Home() {
  return (
    <div className="app-container">
      <section className="list-container">
        <div
          id="m-list"
          className="blocks"
          contentEditable
          spellCheck="true"
          suppressContentEditableWarning="true"
        >
          {data.isRoot && <h1>{data.text}</h1>}
          <div
            style={{
              marginLeft: "4mm",
            }}
          >
            <Tree data={data.firstChild} />
          </div>
        </div>
      </section>
      <section className="timeline-container">
        <Timeline />
      </section>
    </div>
  );
}
