import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import ladybug from "@/assets/ladybug.png.asset.json";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [
    { title: "Welcome to NestTask" },
    { name: "description", content: "A comfortable home for your tasks. Start your NestTask guest session." },
    { property: "og:title", content: "Welcome to NestTask" },
    { property: "og:description", content: "A comfortable home for your tasks." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: Index,
});
function Index() {
  return <main className="welcome-page">
    <div className="welcome-content">
      <img className="welcome-logo" src={ladybug.url} alt="NestTask ladybug on a leaf" />
      <h1 className="welcome-heading">Welcome to NestTask</h1>
      <p className="welcome-subtitle">A comfortable home for your tasks</p>
      <div className="welcome-actions">
        <Button variant="nest" asChild><Link to="/dashboard">Continue as guest</Link></Button>
        <Button variant="nestSecondary" disabled title="Account sign-in is not connected">Sign in or create account</Button>
      </div>
    </div>
  </main>;
}
