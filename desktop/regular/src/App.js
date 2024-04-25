import View from "./components/View";
import "./css/app.css";
import "./css/timeline.css";
import "./css/component.css";
import AppLayout from "./components/AppLayout";

function App() {
  return (
    <AppLayout>
      <div
        style={{
          display: "flex",
          margin: "auto",
          marginTop: "12mm",
        }}
      >
        <View />
      </div>
    </AppLayout>
  );
}

export default App;
