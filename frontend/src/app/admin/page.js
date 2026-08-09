import Link from "next/link";
import StatCard from "./_components/StatCard";
import QuestionsTable from "./_components/QuestionsTable";

const stats = [
  { label: "Total questions", value: "10,370", delta: "+128 this week", tint: "indigo", icon: "Σ" },
  { label: "Pending review", value: "212", delta: "+34 this week", tint: "gold", icon: "?" },
  { label: "Verified this week", value: "94", delta: "+12%", tint: "sage", icon: "✓" },
  { label: "Flagged submissions", value: "7", delta: "-2 this week", tint: "clay", icon: "!" },
];

const breakdown = [
  { name: "Listening", href: "/admin/listening", count: 2480, tint: "bg-sage-soft text-sage", letter: "L" },
  { name: "Reading", href: "/admin/reading", count: 3120, tint: "bg-gold-soft/40 text-gold", letter: "R" },
  { name: "Writing", href: "/admin/writing", count: 1860, tint: "bg-sage-soft text-sage", letter: "W" },
  { name: "Speaking", href: "#", count: 2910, tint: "bg-gold-soft/40 text-gold", letter: "S" },
];

const recent = [
  { id: "RC-2291", title: "Coastal cities drainage systems — Passage 2", type: "Reading", location: "Manila, PH", date: "2026-08-06", status: "Verified" },
  { id: "LS-1187", title: "University accommodation office — Section 1", type: "Listening", location: "Lagos, NG", date: "2026-08-06", status: "Pending" },
  { id: "WT-0934", title: "Task 2 — Should university be free?", type: "Writing", location: "Hanoi, VN", date: "2026-08-05", status: "Verified" },
  { id: "RC-2288", title: "History of urban beekeeping — Passage 1", type: "Reading", location: "São Paulo, BR", date: "2026-08-05", status: "Flagged" },
  { id: "LS-1181", title: "Campus tour guide talk — Section 3", type: "Listening", location: "Jakarta, ID", date: "2026-08-04", status: "Pending" },
  { id: "WT-0929", title: "Task 1 — Line graph, plastic waste by country", type: "Writing", location: "Karachi, PK", date: "2026-08-03", status: "Verified" },
];

export default function AdminDashboard() {
  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
        {stats.map((s, i) => (
          <div key={s.label} className="animate-fade-in-up" style={{ animationDelay: `${i * 60}ms` }}>
            <StatCard {...s} />
          </div>
        ))}
      </div>

      {/* Skill breakdown */}
      <div>
        <h2 className="font-display text-lg text-ink sm:text-xl">By skill</h2>
        <div className="mt-4 grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
          {breakdown.map((b) => (
            <Link
              key={b.name}
              href={b.href}
              className="group rounded-2xl border border-line bg-paper-raised p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-ink/25 hover:shadow-[0_20px_40px_-30px_rgba(22,29,52,0.4)]"
            >
              <span className={`flex h-10 w-10 items-center justify-center rounded-full font-display text-base ${b.tint}`}>
                {b.letter}
              </span>
              <p className="mt-4 font-mono text-xl text-ink">{b.count.toLocaleString()}</p>
              <p className="mt-1 flex items-center gap-1 font-sans text-sm text-muted transition-colors duration-200 group-hover:text-indigo-deep">
                {b.name}
                <span aria-hidden className="transition-transform duration-200 group-hover:translate-x-0.5">
                  →
                </span>
              </p>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent submissions */}
      <div>
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg text-ink sm:text-xl">Recent submissions</h2>
          <span className="font-mono text-xs text-muted">Last 48 hours</span>
        </div>
        <div className="mt-4">
          <QuestionsTable rows={recent} typeLabel="Skill" />
        </div>
      </div>
    </div>
  );
}
