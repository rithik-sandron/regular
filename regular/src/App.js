import View from "./components/View";
import "./css/app.css";
import "./css/timeline.css";
import AppLayout from "./components/AppLayout";
import FileExplorer from "./components/FileExplorer";
import { useState, useEffect, useRef } from "react";
import { invoke } from "@tauri-apps/api";
import TopComponent from "./components/TopComponent";

function App() {
  const [component, setComponent] = useState(false);
  const [explorer, setExplorer] = useState(true);
  const [present, setPresent] = useState(false);
  const [markdown, setMarkdown] = useState("");
  const [fileId, setFileId] = useState(null);

  const ref = useRef(null);

  useEffect(() => {
    if (fileId) {
      invoke("get_file", { id: fileId }).then(data => {
        // console.log(data.id)
        // console.log(data.markdown)
        setMarkdown(data.markdown !== "" ? JSON.parse(data.markdown) : data.markdown);
      });
      ref.current?.scrollIntoView({
        inline: "center",
        block: "nearest"
      });
    }
  }, [fileId]);

  const isVerticalTimeline = markdown._min_date !== 0 &&
    markdown._max_date !== 0 ? (markdown._min_date !== 0 &&
      markdown._max_date !== 0) : false;

  return (
    <AppLayout>
      <TopComponent
        fileId={fileId}
        component={component}
        setComponent={setComponent}
        explorer={explorer}
        setExplorer={setExplorer}
        present={present}
        setPresent={setPresent}
        ref={ref}
        isVerticalTimeline={isVerticalTimeline}
      />

      <div className="app-container">
        {explorer && !present &&
          <FileExplorer
            setComponent={setComponent}
            fileId={fileId}
            setFileId={setFileId}
          />
        }

        <div className={fileId ? "app-container" : "app-container-wrap"}>
          {fileId &&
            <View
              component={component}
              setComponent={setComponent}
              explorer={explorer}
              setExplorer={setExplorer}
              present={present}
              setPresent={setPresent}
              markdown={markdown}
              setMarkdown={setMarkdown}
              fileId={fileId}
              ref={ref}
              isVerticalTimeline={isVerticalTimeline}
            />
          }
        </div>
      </div>
    </AppLayout>
  );
}

export default App;
