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
  const [editorContent, setEditorContent] = useState("");

  const [fileId, setFileId] = useState(null);
  const [filesCount, setFilesCount] = useState(0);

  const year = useRef(null);

  useEffect(() => {
    if (fileId) {
      invoke("get_file", { id: fileId }).then(data => {
        // console.log(data.id)
        // console.log(data.markdown)
        const json = JSON.parse(data.markdown)
        setMarkdown(data.markdown !== "" ? json : data.markdown);
        setEditorContent(data.markdown !== "" ? json : data.markdown);
      });
      year.current?.scrollIntoView({
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
        ref={year}
        isVerticalTimeline={isVerticalTimeline}
        hasDates={markdown._has_dates}
      />

      <div className="app-container">
        {explorer && !present &&
          <FileExplorer
            setComponent={setComponent}
            fileId={fileId}
            setFileId={setFileId}
            setFilesCount={setFilesCount}
            markdown={markdown}
            setEditorContent={setEditorContent}
          />
        }

        {fileId ?
          <div className="app-container">
            <View
              component={component}
              setComponent={setComponent}
              explorer={explorer}
              setExplorer={setExplorer}
              present={present}
              setPresent={setPresent}
              markdown={markdown}
              editorContent={editorContent}
              setMarkdown={setMarkdown}
              fileId={fileId}
              setFileId={setFileId}
              ref={year}
              isVerticalTimeline={isVerticalTimeline}
            />
          </div>
          :
          <div className="app-container-wrap">{filesCount} Files</div>
        }
      </div>
    </AppLayout >
  );
}

export default App;
