"use client";

import { useState } from "react";
import Link from "next/link";
import { DemoReadingTest } from "../../../demo/demoreading";
import Footer from "@/components/Footer";
import { useModuleTestStore } from "@/features/Useteststore";
import { 
  Search, 
  ArrowLeft, 
  Check, 
  BookOpen, 
  ArrowRight
} from "lucide-react";

export default function DemoPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const { getSession } = useModuleTestStore();

  const filteredTests = DemoReadingTest.filter((test) => {
    const matchesSearch = test.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          test.type.toLowerCase().includes(searchTerm.toLowerCase());
    
    const session = getSession("reading", test.id);
    const isCompleted = session?.status === "completed";

    if (selectedFilter === "completed") return matchesSearch && isCompleted;
    if (selectedFilter === "academic") return matchesSearch && test.type.toLowerCase().includes("academic");
    return matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#f8f9fa] text-[#111827]">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 md:px-8">
        
        {/* Back Link & Header */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-[#4b5563] hover:text-[#111827] transition-colors">
            <ArrowLeft className="h-4 w-4" />
            <span>Back to home</span>
          </Link>
          
          <div className="mt-4">
            <h1 className="font-display text-3xl font-bold tracking-tight text-[#111827] sm:text-4xl">
              Demo Tests
            </h1>
            <p className="mt-2 text-sm text-[#4b5563]">
              Practice with real IELTS reading passages and questions from actual exam cycles.
            </p>
          </div>
        </div>

        {/* Search and Filters Toolbar */}
        <div className="mb-8 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              placeholder="Search tests by title or module type..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-xl border border-[#d1d5db] bg-white px-4 py-3 pl-11 text-sm text-[#111827] placeholder:text-[#9ca3af] shadow-xs focus:border-[#111827] focus:outline-none focus:ring-1 focus:ring-[#111827]"
            />
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9ca3af]" />
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0">
            {[
              { id: "all", label: "All Tests" },
              { id: "academic", label: "Academic" },
              { id: "completed", label: "Completed" },
            ].map((filter) => (
              <button
                key={filter.id}
                onClick={() => setSelectedFilter(filter.id)}
                className={`rounded-lg px-4 py-2 text-xs font-medium transition shrink-0 ${
                  selectedFilter === filter.id
                    ? "bg-[#111827] text-white shadow-xs"
                    : "border border-[#d1d5db] bg-white text-[#374151] hover:bg-[#f3f4f6]"
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tests Grid */}
        {filteredTests.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredTests.map((test) => {
              const session = getSession("reading", test.id);
              const isCompleted = session?.status === "completed";

              return (
                <Link
                  key={test.id}
                  href={`/demo/reading/${test.id}`}
                  className="group relative flex flex-col justify-between rounded-xl border border-[#e5e7eb] bg-white p-6 shadow-xs transition-all duration-200 hover:border-[#9ca3af] hover:shadow-md">
                  
                  {/* Completed Badge */}
                  {isCompleted && (
                    <span className="absolute -top-2.5 -right-2.5 flex items-center gap-1 bg-[#166534] text-white text-[11px] font-medium px-2.5 py-1 rounded-full shadow-xs border border-white">
                      <Check className="h-3.5 w-3.5" />
                      Completed
                    </span>
                  )}

                  <div>
                    {/* Top Type & Priority Labels */}
                    <div className="flex items-center justify-between">
                      <span className="rounded-md bg-[#f3f4f6] px-2.5 py-1 font-mono text-xs font-medium text-[#374151]">
                        {test.type}
                      </span>
                      <span className="rounded-md bg-[#f9fafb] border border-[#e5e7eb] px-2.5 py-1 font-mono text-xs font-medium text-[#4b5563]">
                        {test.priority}
                      </span>
                    </div>

                    <h3 className="mt-4 font-display text-lg font-semibold text-[#111827] group-hover:text-[#1d4ed8] transition-colors">
                      {test.title}
                    </h3>

                    {/* Passages count */}
                    <div className="mt-2 flex items-center gap-2 text-xs text-[#6b7280]">
                      <BookOpen className="h-4 w-4 text-[#9ca3af]" />
                      <span>{test.questions.length} Passages Included</span>
                    </div>

                    {/* Question Labels */}
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {test.questions.map((q, idx) => (
                        <span
                          key={idx}
                          className="rounded-md border border-[#e5e7eb] bg-[#f9fafb] px-2 py-0.5 text-[11px] text-[#4b5563]">
                          {q.label}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Card Footer */}
                  <div className="mt-6 flex items-center justify-between border-t border-[#f3f4f6] pt-4">
                    <span className="text-sm font-medium text-[#111827] group-hover:text-[#1d4ed8] group-hover:translate-x-0.5 inline-flex items-center gap-1 transition-all">
                      <span>Start test</span>
                      <ArrowRight className="h-4 w-4" />
                    </span>
                    <span className="font-mono text-xs text-[#6b7280]">
                      {Object.keys(test.answers).length} questions
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-[#d1d5db] bg-white p-12 text-center">
            <h3 className="text-base font-semibold text-[#111827]">No matching tests found</h3>
            <p className="mt-1 text-xs text-[#6b7280]">Try adjusting your search query or filter settings.</p>
            <button 
              onClick={() => { setSearchTerm(""); setSelectedFilter("all"); }}
              className="mt-4 rounded-lg bg-[#111827] px-4 py-2 text-xs font-medium text-white transition hover:bg-[#1f2937]"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* Stats Dashboard */}
        <div className="mt-12 rounded-xl border border-[#e5e7eb] bg-white p-6 shadow-xs">
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
            <div>
              <dt className="font-mono text-2xl font-bold text-[#111827]">
                {DemoReadingTest.length}
              </dt>
              <dd className="mt-1 text-xs text-[#6b7280]">Total tests</dd>
            </div>
            <div>
              <dt className="font-mono text-2xl font-bold text-[#111827]">
                {DemoReadingTest.reduce((acc, test) => acc + test.questions.length, 0)}
              </dt>
              <dd className="mt-1 text-xs text-[#6b7280]">Total passages</dd>
            </div>
            <div>
              <dt className="font-mono text-2xl font-bold text-[#111827]">
                {DemoReadingTest.reduce((acc, test) => acc + Object.keys(test.answers).length, 0)}
              </dt>
              <dd className="mt-1 text-xs text-[#6b7280]">Total questions</dd>
            </div>
            <div>
              <dt className="font-mono text-2xl font-bold text-[#111827]">Free</dt>
              <dd className="mt-1 text-xs text-[#6b7280]">Always free to practice</dd>
            </div>
          </div>
        </div>

      </div>
      <Footer />
    </div>
  );
}