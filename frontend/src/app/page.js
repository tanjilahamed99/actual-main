"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { 
  Headphones, 
  BookOpen, 
  PenTool, 
  Mic, 
  CheckCircle2, 
  Search, 
  ArrowRight, 
  Sparkles, 
  Globe2,
  TrendingUp,
  Star,
  Clock,
  MapPin,
  HelpCircle,
  Mail,
  MessageSquare,
  Send,
  Calculator,
  ChevronDown
} from "lucide-react";

// Skills Data
const skills = [
  {
    letter: "L",
    name: "Listening",
    count: "2,480",
    icon: Headphones,
    desc: "Audio prompts and answer sheets exactly as they appeared in recent tests, complete with real accents and pacing.",
    accent: "from-emerald-500/10 to-teal-500/10 text-emerald-600 border-emerald-500/20 hover:border-emerald-500/40",
    badge: "bg-emerald-100 text-emerald-800"
  },
  {
    letter: "R",
    name: "Reading",
    count: "3,120",
    icon: BookOpen,
    desc: "Full passages with exact question types attached — True/False/Not Given, Matching Headings, and Completion.",
    accent: "from-amber-500/10 to-yellow-500/10 text-amber-600 border-amber-500/20 hover:border-amber-500/40",
    badge: "bg-amber-100 text-amber-800"
  },
  {
    letter: "W",
    name: "Writing",
    count: "1,860",
    icon: PenTool,
    desc: "Task 1 charts and Task 2 prompts paired with Band 8+ sample answers and detailed examiner breakdowns.",
    accent: "from-indigo-500/10 to-blue-500/10 text-indigo-600 border-indigo-500/20 hover:border-indigo-500/40",
    badge: "bg-indigo-100 text-indigo-800"
  },
  {
    letter: "S",
    name: "Speaking",
    count: "2,910",
    icon: Mic,
    desc: "Part 1, 2, and 3 cue cards reported fresh from test centers, updated monthly by region.",
    accent: "from-rose-500/10 to-pink-500/10 text-rose-600 border-rose-500/20 hover:border-rose-500/40",
    badge: "bg-rose-100 text-rose-800"
  },
];

// Recent Submissions Feed
const recentReports = [
  {
    title: "The Spinning Jenny",
    type: "Reading",
    location: "Dhaka, Bangladesh",
    date: "",
    tag: "Verified",
    color: "bg-amber-50 text-amber-700 border-amber-200"
  },
  {
    title: "Multitasking and Our Brain",
    type: "Reading",
    location: "Dhaka, Bangladesh",
    date: "",
    tag: "Verified",
    color: "bg-amber-50 text-amber-700 border-amber-200"
  },
  {
    title: "The Mapmaker",
    type: "Reading",
    location: "Dhaka, Bangladesh",
    date: "",
    tag: "Verified",
    color: "bg-amber-50 text-amber-700 border-amber-200"
  },
  {
    title: "Insect inspired robots",
    type: "Reading",
    location: "Dhaka, Bangladesh",
    date: "",
    tag: "Verified",
    color: "bg-amber-50 text-amber-700 border-amber-200"
  },
];

// Steps Data
const steps = [
  {
    n: "01",
    title: "Real Candidates Report",
    desc: "Test takers submit exact passages, cue cards, and prompts within 24 hours of completing their exam.",
  },
  {
    n: "02",
    title: "Expert Verification",
    desc: "Our IELTS instructors cross-reference submissions against test center logs before approval.",
  },
  {
    n: "03",
    title: "Instant Practice Access",
    desc: "Sorted by region, skill, and month so you practice questions appearing right now.",
  },
];

// Testimonials Data
const testimonials = [
  {
    quote: "The Speaking cue card I got in my test was 100% identical to the one I practiced here 2 days before!",
    name: "Nadia R.",
    score: "Band 7.5",
    location: "Jakarta",
  },
  {
    quote: "The Writing Task 2 sample answers showed me exactly what examiners look for to get past Band 6.5.",
    name: "Arjun K.",
    score: "Band 8.0",
    location: "New Delhi",
  },
  {
    quote: "Finding actual reading passages from this month saved my revision time completely.",
    name: "Elena M.",
    score: "Band 8.5",
    location: "Madrid",
  }
];

// FAQ Data
const faqs = [
  {
    q: "Are these real IELTS exam questions?",
    a: "Yes! Every question on our platform is recalled and reported by genuine test takers within hours of completing their exam, then cross-verified by our teaching team."
  },
  {
    q: "Do IELTS exam questions repeat?",
    a: "Yes. IELTS frequently reuses reading passages, writing prompts, and speaking cue cards within the same testing cycle across different regions."
  },
  {
    q: "Is access to this question bank free?",
    a: "We offer a substantial selection of weekly questions for free. Full historical archives and model band 9 sample answers are unlocked with a free student account."
  },
  {
    q: "How often is the database updated?",
    a: "We add newly verified test taker reports every single day following major weekend test sessions worldwide."
  }
];

export default function Home() {
  const [openFaq, setOpenFaq] = useState(0);

  return (
    <div className="min-h-screen overflow-x-hidden bg-slate-50 text-slate-900 selection:bg-amber-200 selection:text-slate-900">
      <Navbar />

      <main id="top">
        {/* ================= HERO SECTION ================= */}
        <section className="relative overflow-hidden pt-12 pb-20 sm:pt-20 sm:pb-28">
          <div className="pointer-events-none absolute -top-40 left-1/2 -z-10 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-gradient-to-tr from-amber-200/40 via-indigo-200/40 to-emerald-200/30 blur-3xl" />

          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
              
              {/* Hero Left Content */}
              <div className="lg:col-span-7">
                <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-50/80 px-3.5 py-1.5 text-xs font-semibold text-emerald-700 shadow-sm backdrop-blur-md">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
                  </span>
                  <span>Updated Today • 100% Real Exam Recall</span>
                </div>

                <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl md:text-6xl leading-[1.1]">
                  Pass IELTS Faster with{" "}
                  <span className="bg-gradient-to-r from-amber-600 via-indigo-600 to-emerald-600 bg-clip-text text-transparent">
                    Real Exam Questions
                  </span>
                </h1>

                <p className="mt-6 max-w-xl text-lg text-slate-600 leading-relaxed">
                  Stop practicing outdated textbooks. Get actual questions reported directly by test-takers worldwide, verified by experts for your targeted band score.
                </p>

                {/* Instant Search Bar */}
                <div className="mt-8 max-w-lg rounded-2xl border border-slate-200 bg-white p-2 shadow-xl shadow-slate-200/50 sm:flex sm:items-center">
                  <div className="relative flex-1 px-3 py-2 flex items-center gap-2">
                    <Search className="h-5 w-5 text-slate-400 shrink-0" />
                    <input
                      type="text"
                      placeholder="Search cue cards, writing topics, or passages..."
                      className="w-full bg-transparent text-sm text-slate-800 placeholder-slate-400 focus:outline-none"
                    />
                  </div>
                  <button className="mt-2 w-full rounded-xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-slate-800 sm:mt-0 sm:w-auto shrink-0 flex items-center justify-center gap-2">
                    <span>Search</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>

                {/* Quick Stats */}
                <div className="mt-10 flex flex-wrap items-center gap-6 border-t border-slate-200/80 pt-6">
                  <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
                    <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                    <span>10.3k Verified Questions</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
                    <Globe2 className="h-5 w-5 text-indigo-600" />
                    <span>54 Countries Reporting</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
                    <TrendingUp className="h-5 w-5 text-amber-600" />
                    <span>Updated Weekly</span>
                  </div>
                </div>
              </div>

              {/* Hero Right Visual Card */}
              <div className="relative lg:col-span-5">
                <div className="absolute -right-4 -top-4 -z-10 h-72 w-72 rounded-full bg-amber-400/20 blur-2xl" />
                
                <div className="relative rounded-3xl border border-slate-200/80 bg-white/90 p-6 shadow-2xl backdrop-blur-xl transition hover:shadow-indigo-500/10 sm:p-8">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                    <div className="flex items-center gap-2.5">
                      <span className="flex h-3 w-3 rounded-full bg-emerald-500"></span>
                      <span className="font-mono text-xs font-bold uppercase tracking-wider text-slate-500">
                        IELTS Academic • Reading
                      </span>
                    </div>
                    <span className="rounded-full bg-emerald-50 px-3 py-1 font-mono text-xs font-semibold text-emerald-700 border border-emerald-200">
                      Band 7+ Pass Rate
                    </span>
                  </div>

                  <div className="mt-5">
                    <span className="text-xs font-semibold uppercase text-indigo-600 tracking-wide">
                      Passage 2 • Recent Exam
                    </span>
                    <p className="mt-2 text-base font-medium text-slate-800 leading-snug">
                      &ldquo;According to the passage, what was the primary factor leading to the rapid adoption of urban drainage systems?&rdquo;
                    </p>

                    <div className="mt-4 space-y-2.5">
                      {[
                        { text: "A. Financial incentives & insurer pressure", correct: true },
                        { text: "B. Direct impact of sudden climate change", correct: false },
                        { text: "C. Standardized international construction codes", correct: false }
                      ].map((item, idx) => (
                        <div
                          key={idx}
                          className={`flex items-center justify-between rounded-xl border px-4 py-3 text-xs sm:text-sm font-medium transition ${
                            item.correct
                              ? "border-emerald-300 bg-emerald-50/50 text-emerald-900"
                              : "border-slate-100 bg-slate-50/50 text-slate-600"
                          }`}
                        >
                          <span>{item.text}</span>
                          {item.correct && <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4 text-xs font-medium text-slate-400">
                    <span>Reported: London Centre</span>
                    <span className="font-mono text-slate-500">#RC-9982</span>
                  </div>

                  <div className="absolute -right-3 -top-5 flex h-20 w-20 rotate-12 items-center justify-center rounded-full border-2 border-dashed border-amber-600 bg-amber-50 shadow-md">
                    <span className="text-center font-mono text-[9px] font-black uppercase leading-tight tracking-wider text-amber-700">
                      ★ Verified ★<br />Real Exam<br />2026
                    </span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ================= RECENT EXAM REPORTS FEED ================= */}
        <section className="bg-slate-900 py-16 text-white">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-800 pb-8">
              <div>
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-emerald-400">
                  <Clock className="h-4 w-4" />
                  <span>Live Student Reports</span>
                </div>
                <h2 className="mt-1 text-2xl font-bold sm:text-3xl text-white">
                  Reported Questions From Recent Exams
                </h2>
              </div>
              <a href="#skills" className="inline-flex items-center gap-2 text-sm font-semibold text-amber-400 hover:text-amber-300 transition">
                <span>View Full Database</span>
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {recentReports.map((item, idx) => (
                <div key={idx} className="rounded-2xl border border-slate-800 bg-slate-800/40 p-5 backdrop-blur transition hover:border-slate-700 hover:bg-slate-800/70">
                  <div className="flex items-center justify-between">
                    <span className={`rounded-full border px-2.5 py-0.5 text-[11px] font-bold ${item.color}`}>
                      {item.type}
                    </span>
                    <span className="text-xs text-slate-400">{item.date}</span>
                  </div>
                  <h3 className="mt-4 font-semibold text-slate-100 text-sm line-clamp-2">
                    {item.title}
                  </h3>
                  <div className="mt-4 flex items-center justify-between text-xs text-slate-400 border-t border-slate-700/50 pt-3">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5 text-slate-400" />
                      <span>{item.location}</span>
                    </div>
                    <span className="text-amber-400 font-medium">{item.tag}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ================= SKILLS MODULES ================= */}
        <section id="skills" className="border-t border-slate-200 bg-white py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl">
              <span className="text-xs font-bold uppercase tracking-widest text-indigo-600">
                Four Modules • Unlimited Practice
              </span>
              <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
                Master Every Section of the IELTS Test
              </h2>
              <p className="mt-3 text-slate-600">
                Organized precisely how you prepare — indexed by question type, difficulty, and frequency.
              </p>
            </div>

            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {skills.map((s) => {
                const IconComponent = s.icon;
                return (
                  <a
                    key={s.name}
                    href="#"
                    className={`group relative flex flex-col justify-between rounded-3xl border bg-gradient-to-b p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${s.accent}`}
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-md">
                          <IconComponent className="h-6 w-6" />
                        </div>
                        <span className={`rounded-full px-3 py-1 text-xs font-bold ${s.badge}`}>
                          {s.count} Qs
                        </span>
                      </div>

                      <h3 className="mt-6 text-xl font-bold text-slate-900 group-hover:text-indigo-600 transition">
                        {s.name}
                      </h3>

                      <p className="mt-3 text-sm leading-relaxed text-slate-600">
                        {s.desc}
                      </p>
                    </div>

                    <div className="mt-6 flex items-center gap-2 text-sm font-semibold text-slate-900 group-hover:text-indigo-600">
                      <span>Explore {s.name}</span>
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </div>
                  </a>
                );
              })}
            </div>
          </div>
        </section>

        {/* ================= HOW IT WORKS ================= */}
        <section id="process" className="py-20 bg-slate-50 border-t border-slate-200">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-xl mx-auto">
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-600">
                Transparent Verification
              </span>
              <h2 className="mt-2 text-3xl font-extrabold text-slate-900 sm:text-4xl">
                How We Guarantee Accuracy
              </h2>
            </div>

            <div className="mt-16 grid gap-8 md:grid-cols-3">
              {steps.map((step) => (
                <div key={step.n} className="relative rounded-2xl border border-slate-200/80 bg-white p-8 shadow-sm transition hover:shadow-md">
                  <span className="text-3xl font-black text-amber-500">{step.n}</span>
                  <h3 className="mt-4 text-xl font-bold text-slate-900">{step.title}</h3>
                  <p className="mt-3 text-sm text-slate-600 leading-relaxed">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ================= BAND CALCULATOR BANNER ================= */}
        <section className="bg-indigo-900 py-12 text-white border-y border-indigo-800">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-indigo-800 text-amber-400">
                <Calculator className="h-7 w-7" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Targeting Band 7.5 or Higher?</h3>
                <p className="text-sm text-indigo-200">Use our free raw score to band score converter designed for Academic & General Training.</p>
              </div>
            </div>
            <a href="#" className="w-full md:w-auto shrink-0 rounded-full bg-amber-500 px-6 py-3 text-center text-sm font-bold text-slate-950 transition hover:bg-amber-400">
              Try Band Score Tool
            </a>
          </div>
        </section>

        {/* ================= TESTIMONIALS ================= */}
        <section id="stories" className="bg-slate-900 py-20 text-white relative overflow-hidden">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-2 text-amber-400 text-sm font-semibold">
              <Sparkles className="h-5 w-5" />
              <span>Real Student Success Stories</span>
            </div>
            
            <div className="mt-8 grid gap-8 md:grid-cols-3">
              {testimonials.map((item, idx) => (
                <div key={idx} className="rounded-2xl border border-slate-800 bg-slate-800/50 p-8 backdrop-blur">
                  <div className="flex gap-1 text-amber-400 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-amber-400" />
                    ))}
                  </div>
                  <p className="text-base text-slate-200 leading-relaxed italic">
                    &ldquo;{item.quote}&rdquo;
                  </p>
                  <div className="mt-6 flex items-center justify-between border-t border-slate-700/60 pt-4">
                    <div>
                      <h4 className="font-bold text-white">{item.name}</h4>
                      <p className="text-xs text-slate-400">{item.location}</p>
                    </div>
                    <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-400 border border-emerald-500/20">
                      {item.score}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ================= FAQ SECTION ================= */}
        <section className="py-20 bg-white border-t border-slate-200">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="inline-flex items-center gap-2 text-indigo-600 font-bold text-xs uppercase tracking-widest">
                <HelpCircle className="h-4 w-4" />
                <span>Got Questions?</span>
              </div>
              <h2 className="mt-2 text-3xl font-extrabold text-slate-900 sm:text-4xl">
                Frequently Asked Questions
              </h2>
            </div>

            <div className="mt-12 space-y-4">
              {faqs.map((faq, idx) => (
                <div 
                  key={idx} 
                  className="rounded-2xl border border-slate-200 bg-slate-50 overflow-hidden transition"
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                    className="flex w-full items-center justify-between p-6 text-left font-bold text-slate-900 hover:text-indigo-600"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown className={`h-5 w-5 text-slate-500 transition-transform ${openFaq === idx ? "rotate-180" : ""}`} />
                  </button>
                  {openFaq === idx && (
                    <div className="px-6 pb-6 text-sm text-slate-600 leading-relaxed border-t border-slate-200/60 pt-4">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ================= CONTACT & SUBMISSION SECTION ================= */}
        <section id="contact" className="py-20 bg-slate-50 border-t border-slate-200">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-12 lg:grid-cols-12">
              
              {/* Left Details */}
              <div className="lg:col-span-5">
                <span className="text-xs font-bold uppercase tracking-widest text-indigo-600">Get In Touch</span>
                <h2 className="mt-2 text-3xl font-extrabold text-slate-900 sm:text-4xl">
                  Have a question or recent exam report?
                </h2>
                <p className="mt-4 text-slate-600 leading-relaxed">
                  Sat your IELTS exam recently? Submit your exam memory topics to help candidates worldwide, or get in touch with our team for study inquiries.
                </p>

                <div className="mt-8 space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 border border-indigo-100">
                      <Mail className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">Email Support</h4>
                      <p className="text-xs text-slate-500">support@actualieltsquestions.com</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-100">
                      <MessageSquare className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">Community Submissions</h4>
                      <p className="text-xs text-slate-500">Reviewed within 24 hours by teachers</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Contact Form */}
              <div className="lg:col-span-7">
                <form 
                  onSubmit={(e) => e.preventDefault()}
                  className="rounded-3xl border border-slate-200 bg-white p-8 shadow-xl shadow-slate-200/50 space-y-5"
                >
                  <h3 className="text-xl font-bold text-slate-900">Send Us a Message</h3>
                  
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Your Name</label>
                      <input 
                        type="text" 
                        placeholder="John Doe" 
                        className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:border-indigo-600 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
                      <input 
                        type="email" 
                        placeholder="john@example.com" 
                        className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:border-indigo-600 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Topic / Exam City</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Speaking Part 2 in Manila or General Support" 
                      className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:border-indigo-600 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Message / Question Details</label>
                    <textarea 
                      rows={4} 
                      placeholder="Describe the cue card, essay topic, or your query..." 
                      className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:border-indigo-600 focus:outline-none"
                    />
                  </div>

                  <button 
                    type="submit"
                    className="w-full rounded-xl bg-slate-900 py-3.5 text-center text-sm font-bold text-white shadow-md transition hover:bg-slate-800 flex items-center justify-center gap-2"
                  >
                    <span>Send Message</span>
                    <Send className="h-4 w-4" />
                  </button>
                </form>
              </div>

            </div>
          </div>
        </section>

        {/* ================= FINAL CTA BANNER ================= */}
        <section className="py-20 bg-gradient-to-br from-indigo-950 via-slate-900 to-indigo-900 text-white text-center">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-extrabold sm:text-4xl lg:text-5xl">
              Ready to Ace Your IELTS Exam?
            </h2>
            <p className="mt-4 text-slate-300 text-lg max-w-xl mx-auto">
              Get full access to thousands of real, recent exam questions updated every single week.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="#skills"
                className="rounded-full bg-amber-500 px-8 py-4 font-bold text-slate-950 shadow-lg shadow-amber-500/25 transition hover:bg-amber-400 hover:scale-105"
              >
                Browse This Week&apos;s Questions
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}