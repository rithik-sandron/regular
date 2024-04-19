import Navigation from "./Navigation";
import { invoke } from "@tauri-apps/api";

const AppLayout = ({ header, children }) => {
  invoke("greet", { name: "regular" })

  return (
    <div>
      <Navigation title={"Regular"} />
      <header>{header}</header>
      <main>{children}</main>
    </div>
  );
};

export default AppLayout;
