import { useState, useRef, useEffect } from "react";
import Year from "./Year";
import Month from "./Month";
import TimelineEvent from "./TimelineEvent";
import Tree from "./Tree";
// import data from "../lib/sample.json";

export default function Timeline() {
  const [node, setNode] = useState("");

  useEffect(() => {
    f();
  }, []);

  async function f() {
    await fetch("http://localhost:8000/").then((x) => {
      x.text().then((data) => {
        setNode(JSON.parse(data));
      });
    });
  }

  async function p() {
    fetch("/u", {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(node),
    });
  }

  const [view, setView] = useState("Year");
  const ref = useRef(null);

  function handleClick(e) {
    e.preventDefault();
    e.stopPropagation();
    ref.current?.scrollIntoView({
      behavior: "smooth",
      inline: "start",
    });
  }

  function handleClickView(e) {
    e.preventDefault();
    e.stopPropagation();
    if (e.target.localName === "p") {
      setView(e.target.innerText);
    }
  }

  return (
    node && (
      <>
        <section className="list-container">
          <div
            id="m-list"
            className="blocks"
            contentEditable
            spellCheck="true"
            suppressContentEditableWarning="true"
          >
            <Tree data={node} root={node} p={p} />
          </div>
        </section>
        <section className="timeline-container">
          <div className="timeline-container-view">
            <div className="handlers">
              <div onClick={handleClick}>Today</div>
              <div className="dropdown" onClick={handleClickView}>
                <span>{view}</span>
                <div className="dropdown-content">
                  <p>Year</p>
                  <p>Month</p>
                  <p>Day</p>
                </div>
              </div>
            </div>
            <div
              className="grid-container"
              style={{
                height: node.order * 5 + "em",
              }}
            >
              {view === "Year" && <Year ref={ref} height={node.order} />}
              {view === "Month" && <Month ref={ref} />}
              {/* {view === 'Day' && <Day ref={ref} />} */}
              <div
                style={{
                  marginTop: "4em",
                }}
              >
                <TimelineEvent data={node} />
              </div>
            </div>
          </div>
        </section>
      </>
    )
  );
}
