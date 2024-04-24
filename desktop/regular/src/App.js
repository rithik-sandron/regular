import View from "./components/View";
import "./css/app.css";
import "./css/timeline.css";
import "./css/component.css";
import AppLayout from "./components/AppLayout";

function App() {
  return (
    <AppLayout>
      <div style={{
        marginTop: "12mm",
        display: "grid",
        gridTemplateColumns: "44% calc(56% - 4mm)",
        gap: "4mm",
      }}>
        <View />
      </div>
    </AppLayout>
  );
}

export default App;
