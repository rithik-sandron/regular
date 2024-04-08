import { useState } from "react";
import data from "./lib/sample.json";
import Timeline from "./components/Timeline";
import "./css/app.css";
import "./css/timeline.css";
import AppLayout from "./components/AppLayout";

function App() {
  const [json, setJson] = useState(data);
  let a = new MutationObserver(() => {
    console.log("jel");
  });
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
    <AppLayout>
      <div className="app-container">
        <Timeline data={json} />
      </div>
    </AppLayout>
  );
}

export default App;
