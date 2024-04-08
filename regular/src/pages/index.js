import { useEffect, useState, useRef } from "react";
import {
  handleChange,
  handleKeydown,
  handleKeyup,
  setCursor,
} from "@/lib/userHandles";
import data from "@/lib/sample.json";
import Timeline from "@/components/Timeline";
export default function Home() {
  const [json, setJson] = useState(data);

  // node search
  function getNode(id, copyJson = json.firstChild) {
    if (copyJson.id === id) {
      return copyJson;
    }
    if (copyJson.firstChild !== null) getNode(id, copyJson.firstChild);
    if (copyJson.nextSibling !== null) getNode(id, copyJson.nextSibling);
  }

  function getNodeById(id, copyJson = json) {
    if (copyJson.id === id) {
      return copyJson;
    }
    if (copyJson.firstChild !== null) return getNode(id, copyJson.firstChild);
  }

  getNodeById("595c478e-ab06-4ee1-83d6-8deda63d3e2e");

  return (
    <div className="app-container">
      <Timeline data={json} />
    </div>
  );
}
