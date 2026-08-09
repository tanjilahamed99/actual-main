import React from "react";

const Footer = () => {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 md:px-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2.5">
            <span className="flex h-7 w-7 items-center justify-center rounded-full border border-ink/15 bg-indigo-deep font-display text-xs text-paper">
              A
            </span>
            <span className="font-display text-[15px] text-ink">
              Actual IELTS Questions
            </span>
          </div>
          <nav className="flex flex-wrap gap-x-6 gap-y-2 font-sans text-sm text-muted">
            <a href="#skills" className="hover:text-ink">
              Skills
            </a>
            <a href="#process" className="hover:text-ink">
              How it works
            </a>
            <a href="#stories" className="hover:text-ink">
              Stories
            </a>
            <a href="#" className="hover:text-ink">
              Submit a question
            </a>
          </nav>
        </div>
        <p className="mt-8 font-sans text-xs leading-relaxed text-muted">
          Not affiliated with IELTS, the British Council, IDP, or Cambridge
          Assessment English. Questions are reported by test takers from memory
          and reviewed for accuracy before publishing.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
