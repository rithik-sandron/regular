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
  const [fileId, setFileId] = useState(102);

  const ref = useRef(null);


  useEffect(() => {
    invoke("get_file", { id: fileId }).then(data => {
      setMarkdown(data.markdown !== "" ? JSON.parse(data.markdown) : data.markdown);
    });
    ref.current?.scrollIntoView({
      inline: "center",
      block: "nearest"
    });
  }, [fileId]);

  const isVerticalTimeline = markdown._min_date !== 0 &&
    markdown._max_date !== 0 ? (markdown._min_date !== 0 &&
      markdown._max_date !== 0) : false;

  // useEffect(() => {
  //   const resizer = document.querySelector('.resizer');
  //   const fileExplorer = document.querySelector('.file-explorer');

  //   let isResizing = false;
  //   let startX;
  //   let startWidth;

  //   resizer.addEventListener('mousedown', startResizing);
  //   document.addEventListener('mousemove', resize);
  //   document.addEventListener('mouseup', stopResizing);

  //   function startResizing(e) {
  //     isResizing = true;
  //     startX = e.clientX;
  //     startWidth = parseInt(window.getComputedStyle(fileExplorer).width, 10);
  //   }

  //   function resize(e) {
  //     if (!isResizing) return;
  //     const width = startWidth + (e.clientX - startX);
  //     fileExplorer.style.width = `${width}px`;
  //   }

  //   function stopResizing() {
  //     isResizing = false;
  //   }

  // }, []);

  return (
    <AppLayout>
      <TopComponent
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
            component={component}
            setComponent={setComponent}
            fileId={fileId}
            setFileId={setFileId}
          />
        }
        {/* <div className="resizer" /> */}

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
      </div>
    </AppLayout>
  );
}

export default App;
