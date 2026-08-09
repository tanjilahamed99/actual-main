import QuestionsTable from "../_components/QuestionsTable";

const rows = [
  { id: "LS-1187", title: "University accommodation office — Section 1", type: "Form completion", location: "Lagos, NG", date: "2026-08-06", status: "Pending" },
  { id: "LS-1181", title: "Campus tour guide talk — Section 3", type: "Multiple choice", location: "Jakarta, ID", date: "2026-08-04", status: "Pending" },
  { id: "LS-1176", title: "Community gardening scheme — Section 2", type: "Map labelling", location: "Accra, GH", date: "2026-08-03", status: "Verified" },
  { id: "LS-1169", title: "Renewable energy seminar — Section 4", type: "Note completion", location: "Ho Chi Minh, VN", date: "2026-08-02", status: "Verified" },
  { id: "LS-1162", title: "Library orientation session — Section 1", type: "Form completion", location: "Riyadh, SA", date: "2026-08-01", status: "Flagged" },
  { id: "LS-1155", title: "Marine biology field trip — Section 3", type: "Matching", location: "Lima, PE", date: "2026-07-31", status: "Verified" },
];

export default function ListeningAdmin() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-xl font-sans text-sm text-muted">
          2,480 Listening questions transcribed from real test audio,
          covering all four sections and every question type.
        </p>
        <button
          type="button"
          className="shrink-0 rounded-full bg-gold px-5 py-2.5 font-sans text-sm font-semibold text-indigo-deep transition-all duration-200 hover:bg-gold-soft hover:shadow-md active:scale-[0.98]"
        >
          + Add question
        </button>
      </div>

      <QuestionsTable rows={rows} typeLabel="Question type" />
    </div>
  );
}
