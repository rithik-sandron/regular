import Timeline from "./components/Timeline";
import "./css/app.css";
import "./css/timeline.css";
import AppLayout from "./components/AppLayout";

function App() {
  return (
    <AppLayout>
      <div className="app-container">
        <Timeline />
      </div>
    </AppLayout>
  );
}

export default App;
