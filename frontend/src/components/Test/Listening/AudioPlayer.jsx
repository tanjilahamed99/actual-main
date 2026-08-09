// components/listening/AudioPlayer/AudioPlayer.jsx
import { useEffect, useRef, useState } from "react";

const fmt = (s) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

export function useAudioController(audioSrc) {
  const audioRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;
    
    const onTime = () => setCurrentTime(el.currentTime);
    const onMeta = () => setDuration(el.duration);
    const onEnded = () => setPlaying(false);
    
    el.addEventListener("timeupdate", onTime);
    el.addEventListener("loadedmetadata", onMeta);
    el.addEventListener("ended", onEnded);
    
    return () => {
      el.removeEventListener("timeupdate", onTime);
      el.removeEventListener("loadedmetadata", onMeta);
      el.removeEventListener("ended", onEnded);
    };
  }, []);

  const toggleAudio = () => {
    const el = audioRef.current;
    if (!el) return;
    playing ? el.pause() : el.play();
    setPlaying(p => !p);
  };

  return { audioRef, playing, toggleAudio, currentTime, duration };
}

export function PartAudioBar({ part, qRange, playing, onToggle, currentTime, duration, seekDisabled = true }) {
  const pct = duration ? (currentTime / duration) * 100 : 0;
  
  return (
    <div className="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded px-4 py-3 mb-5">
      <div className="flex-shrink-0">
        <p className="text-xs font-bold text-gray-800 leading-none">Part {part}</p>
        <p className="text-[11px] text-gray-400 mt-0.5">Q {qRange}</p>
      </div>
      <div className="w-px h-7 bg-gray-200 flex-shrink-0" />
      <button
        onClick={onToggle}
        className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center bg-gray-900 text-white hover:bg-gray-700 transition-colors">
        {playing ? (
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
            <rect x="6" y="4" width="4" height="16" />
            <rect x="14" y="4" width="4" height="16" />
          </svg>
        ) : (
          <svg className="w-3 h-3 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5.14v14l11-7z" />
          </svg>
        )}
      </button>
      <div className="flex-1 flex flex-col gap-1.5">
        <div className={`h-1.5 bg-gray-200 rounded-full ${seekDisabled ? 'cursor-not-allowed' : ''}`}>
          <div className="h-full bg-gray-800 rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
        </div>
        <div className="flex justify-between text-[11px] font-mono text-gray-400">
          <span>{fmt(Math.floor(currentTime))}</span>
          <span>{fmt(Math.floor(duration || 0))}</span>
        </div>
      </div>
      <span className="text-[11px] text-gray-400 hidden sm:block flex-shrink-0">
        plays once
      </span>
    </div>
  );
}