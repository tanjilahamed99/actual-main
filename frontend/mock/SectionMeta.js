import { BookOpen, Headphones, PenLine } from "lucide-react";

export const SECTION_META = [
  {
    id: "listening",
    name: "Listening",
    fullName: "IELTS Listening Test",
    icon: Headphones,
    accent: "#7c6ff7",
    accentBg: "rgba(124,111,247,0.08)",
    accentBorder: "rgba(124,111,247,0.22)",
    duration: "40 Minutes",
    durationMin: 40,
    questions: 40,
    description:
      "You will hear four recordings of native English speakers and answer questions on what you hear.",
    instructions: [
      "Use headphones for the best experience.",
      "You will hear each recording only once.",
      "Read questions carefully before the audio begins.",
      "Transfer answers to the answer sheet in the final 10 minutes.",
    ],
  },
  {
    id: "reading",
    name: "Reading",
    fullName: "IELTS Reading Test",
    icon: BookOpen,
    accent: "#3b9eff",
    accentBg: "rgba(59,158,255,0.08)",
    accentBorder: "rgba(59,158,255,0.22)",
    duration: "60 Minutes",
    durationMin: 60,
    questions: 40,
    description:
      "Three reading passages of increasing difficulty with a range of question types to test comprehension.",
    instructions: [
      "Skim each passage before reading questions.",
      "Manage your time — roughly 20 minutes per passage.",
      "Answers must come directly from the text.",
      "No extra time is given to transfer answers.",
    ],
  },
  {
    id: "writing",
    name: "Writing",
    fullName: "IELTS Writing Test",
    icon: PenLine,
    accent: "#22c98a",
    accentBg: "rgba(34,201,138,0.08)",
    accentBorder: "rgba(34,201,138,0.22)",
    duration: "60 Minutes",
    durationMin: 60,
    questions: 2,
    description:
      "Task 1: Describe a graph or diagram (min. 150 words). Task 2: Write an essay responding to a point of view (min. 250 words).",
    instructions: [
      "Spend about 20 minutes on Task 1 and 40 minutes on Task 2.",
      "Task 2 carries more marks than Task 1.",
      "Plan your essay before writing to ensure a clear structure.",
      "Check your grammar and vocabulary after finishing.",
    ],
  },
];