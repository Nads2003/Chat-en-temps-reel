import { useState, useRef, useEffect } from "react";

let currentlyPlaying = null; // pour stopper les autres messages

export default function VoiceMessage({ src }) {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState("0:00");
  const [duration, setDuration] = useState("0:00");

  const formatTime = (sec) => {
    const minutes = Math.floor(sec / 60);
    const seconds = Math.floor(sec % 60);
    return `${minutes}:${seconds < 10 ? "0" + seconds : seconds}`;
  };

  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      // stop la lecture des autres messages
      if (currentlyPlaying && currentlyPlaying !== audioRef.current) {
        currentlyPlaying.pause();
      }
      audioRef.current.play();
      currentlyPlaying = audioRef.current;
    }
  };

  const handlePlay = () => setIsPlaying(true);
  const handlePause = () => setIsPlaying(false);

  const handleTimeUpdate = () => {
    if (audioRef.current && audioRef.current.duration) {
      setProgress((audioRef.current.currentTime / audioRef.current.duration) * 100);
      setCurrentTime(formatTime(audioRef.current.currentTime));
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(formatTime(audioRef.current.duration));
    }
  };

  useEffect(() => {
    setProgress(0);
    setIsPlaying(false);
    setCurrentTime("0:00");
    if (audioRef.current) audioRef.current.pause();
  }, [src]);

  return (
    <div className="flex flex-col w-full mt-2">
      <div className="flex items-center gap-2">
        <button
          onClick={togglePlay}
          className="bg-indigo-600 text-white px-3 py-1 rounded"
        >
          {isPlaying ? "⏸" : "▶️"}
        </button>
        <div className="flex-1 h-2 bg-slate-600 rounded relative">
          <div
            className="h-2 bg-indigo-400 rounded absolute top-0 left-0"
            style={{ width: `${progress}%` }}
          />
        </div>
        <span className="text-xs w-14 text-right">{currentTime}/{duration}</span>
      </div>
      <audio
        ref={audioRef}
        src={src}
        onPlay={handlePlay}
        onPause={handlePause}
        onEnded={handlePause}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        hidden
      />
    </div>
  );
}
