import Link from "next/link";
import { MessageSquare, Navigation2, LayoutDashboard, ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/Card";

const FEATURES = [
  {
    href: "/assistant",
    icon: MessageSquare,
    title: "Stadium assistant",
    description: "Ask about gates, seating, restrooms, food queues, or accessible routes.",
  },
  {
    href: "/navigation",
    icon: Navigation2,
    title: "AI navigation",
    description: "Get the fastest, most accessible, or least crowded route to any destination.",
  },
  {
    href: "/dashboard",
    icon: LayoutDashboard,
    title: "Crowd intelligence",
    description: "Live zone density and AI-generated operational recommendations for staff.",
  },
] as const;

export default function HomePage() {
  return (
    <main id="main-content" className="mx-auto max-w-4xl px-4 py-16">
      <div className="mb-2 flex items-center gap-1.5 text-xs text-pitch">
        <span className="h-1.5 w-1.5 rounded-full bg-pitch" aria-hidden="true" />
        Stadium Atlanta 01 &middot; live
      </div>
      <h1 className="mb-3 font-display text-3xl text-white">AIZVerse</h1>
      <p className="mb-10 max-w-xl text-sm text-white/60">
        AI-powered stadium intelligence for FIFA World Cup 2026 &mdash; wayfinding, crowd
        insight, and fan support in one platform.
      </p>

      <div className="grid gap-4 sm:grid-cols-3">
        {FEATURES.map(({ href, icon: Icon, title, description }) => (
          <Link key={href} href={href} className="group block focus-visible:outline-none">
            <Card className="h-full p-5 transition-colors group-hover:border-floodlight/60 group-focus-visible:outline group-focus-visible:outline-2 group-focus-visible:outline-floodlight">
              <Icon className="mb-3 h-5 w-5 text-pitch" aria-hidden="true" />
              <h2 className="mb-1 font-display text-sm text-white">{title}</h2>
              <p className="mb-3 text-xs leading-relaxed text-white/50">{description}</p>
              <span className="inline-flex items-center gap-1 text-xs text-floodlight">
                Open <ArrowRight className="h-3 w-3" aria-hidden="true" />
              </span>
            </Card>
          </Link>
        ))}
      </div>
    </main>
  );
}
