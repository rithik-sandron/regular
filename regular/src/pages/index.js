import { useEffect, useState, useRef } from "react";
import {
  handleChange,
  handleKeydown,
  handleKeyup,
  setCursor,
} from "@/lib/userHandles";
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
          style={{
            marginLeft: "4mm",
          }}
        >
          <Tree data={data} />
        </div>
      </section>
      <section className="timeline-container">
        <Timeline data={data} />
      </section>
    </div>
  );
}
