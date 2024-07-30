import View from "./components/View";
import "./css/app.css";
import "./css/timeline.css";
import AppLayout from "./components/AppLayout";
import FileExplorer from "./components/FileExplorer";
import { useState, useEffect } from "react";
import { invoke } from "@tauri-apps/api";

function App() {
  const [component, setComponent] = useState(true);
  const [markdown, setMarkdown] = useState("");
  const [fileId, setFileId] = useState(8);

  useEffect(() => {
    invoke("get_file", { id: fileId }).then(data => {
      setMarkdown(JSON.parse(data.markdown));
    });
  }, [fileId]);

  useEffect(() => {
    const resizer = document.querySelector('.resizer');
    const fileExplorer = document.querySelector('.file-explorer');

    let isResizing = false;
    let startX;
    let startWidth;

    resizer.addEventListener('mousedown', startResizing);
    document.addEventListener('mousemove', resize);
    document.addEventListener('mouseup', stopResizing);

    function startResizing(e) {
      isResizing = true;
      startX = e.clientX;
      startWidth = parseInt(window.getComputedStyle(fileExplorer).width, 10);
    }

    function resize(e) {
      if (!isResizing) return;

      const width = startWidth + (e.clientX - startX);
      fileExplorer.style.width = `${width}px`;
    }

    function stopResizing() {
      isResizing = false;
    }

  }, []);

  return (
    <AppLayout>
      <FileExplorer
        component={component}
        setComponent={setComponent}
        fileId={fileId}
        setFileId={setFileId} />
      <div className="resizer" />
      <View component={component} markdown={markdown} />
    </AppLayout>
  );
}

export default App;
