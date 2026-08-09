const tints = {
  indigo: "bg-indigo-deep/[0.06] text-indigo-deep",
  gold: "bg-gold-soft/40 text-gold",
  sage: "bg-sage-soft text-sage",
  clay: "bg-clay/10 text-clay",
};

export default function StatCard({ label, value, delta, tint = "indigo", icon }) {
  return (
    <div className="rounded-2xl border border-line bg-paper-raised p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_20px_40px_-30px_rgba(22,29,52,0.4)] sm:p-6">
      <div className="flex items-center justify-between">
        <span
          className={`flex h-10 w-10 items-center justify-center rounded-full font-display text-base ${tints[tint]}`}
        >
          {icon}
        </span>
        {delta && (
          <span
            className={`font-mono text-xs ${
              delta.startsWith("-") ? "text-clay" : "text-sage"
            }`}
          >
            {delta}
          </span>
        )}
      </div>
      <p className="mt-4 font-mono text-2xl text-ink sm:text-[1.75rem]">{value}</p>
      <p className="mt-1 font-sans text-sm text-muted">{label}</p>
    </div>
  );
}
