import DateTime from "./DateTime";

export default function Navigation({ title }) {
  return (
    <nav className="layout">
      <a href="/">{title}</a>
      <a href="/availabile">Available</a>
      <DateTime />
    </nav>
  );
}
