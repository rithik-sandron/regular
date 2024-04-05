import Link from "next/link";
import DateTime from "./DateTime";

export default function Navigation({ title }) {
  return (
    <nav className="layout">
      <Link href="/">{title}</Link>
      <Link href="/availabile">Available</Link>
      <DateTime />
      {/* <Link href="/create">create</Link> */}
    </nav>
  );
}
