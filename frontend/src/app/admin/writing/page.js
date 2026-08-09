import QuestionsTable from "../_components/QuestionsTable";

const rows = [
  { id: "WT-0934", title: "Task 2 — Should university education be free?", type: "Task 2, Opinion", location: "Hanoi, VN", date: "2026-08-05", status: "Verified" },
  { id: "WT-0929", title: "Task 1 — Line graph, plastic waste by country", type: "Task 1, Line graph", location: "Karachi, PK", date: "2026-08-03", status: "Verified" },
  { id: "WT-0921", title: "Task 2 — Remote work and city centres", type: "Task 2, Discussion", location: "Bogotá, CO", date: "2026-08-02", status: "Pending" },
  { id: "WT-0914", title: "Task 1 — Process diagram, water treatment", type: "Task 1, Process", location: "Casablanca, MA", date: "2026-07-30", status: "Verified" },
  { id: "WT-0908", title: "Task 2 — Should zoos be banned?", type: "Task 2, Opinion", location: "Colombo, LK", date: "2026-07-28", status: "Flagged" },
  { id: "WT-0901", title: "Task 1 — Bar chart, transport use by age group", type: "Task 1, Bar chart", location: "Almaty, KZ", date: "2026-07-27", status: "Pending" },
];

export default function WritingAdmin() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-xl font-sans text-sm text-muted">
          1,860 Writing tasks, each paired with a band-scored sample answer
          so students can see what a strong response actually looks like.
        </p>
        <button
          type="button"
          className="shrink-0 rounded-full bg-gold px-5 py-2.5 font-sans text-sm font-semibold text-indigo-deep transition-all duration-200 hover:bg-gold-soft hover:shadow-md active:scale-[0.98]"
        >
          + Add question
        </button>
      </div>

      <QuestionsTable rows={rows} typeLabel="Task type" />
    </div>
  );
}
