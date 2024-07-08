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
  const [fileId, setFileId] = useState(2);

  useEffect(() => {
    invoke("get_file", { id: fileId }).then(data => {
      setMarkdown(JSON.parse(data.markdown));
    });
  }, [fileId]);

  return (
    <AppLayout>
      <FileExplorer
        component={component}
        setComponent={setComponent}
        fileId={fileId}
        setFileId={setFileId} />
      <View component={component} markdown={markdown} />
    </AppLayout>
  );
}

export default App;
