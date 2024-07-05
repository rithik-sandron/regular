import View from "./components/View";
import "./css/app.css";
import "./css/timeline.css";
import AppLayout from "./components/AppLayout";
import FileExplorer from "./components/FileExplorer";
import { useState } from "react";

function App() {
  const [component, setComponent] = useState(true);

  return (
    <AppLayout>
        <FileExplorer component={component} setComponent={setComponent} />
        <View component={component} />
    </AppLayout>
  );
}

export default App;
