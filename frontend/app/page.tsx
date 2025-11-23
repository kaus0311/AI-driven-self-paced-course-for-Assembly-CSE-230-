"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

type Major = "computer-science" | "cybersecurity";
type Track = "mips" | "riscv" | "x86";

const majors: Array<{ id: Major; label: string; description: string }> = [
  {
    id: "computer-science",
    label: "Computer Science",
    description: "Dive into computer architecture fundamentals with AI support.",
  },
  {
    id: "cybersecurity",
    label: "Cybersecurity",
    description: "Focus on low-level systems that power secure computing.",
  },
];

const trackOptions: Record<Major, Array<{ id: Track; label: string; description: string }>> = {
  "computer-science": [
    {
      id: "mips",
      label: "MIPS",
      description: "Focus on classic reduced instruction set concepts.",
    },
    {
      id: "riscv",
      label: "RISC-V",
      description: "Explore the modern open instruction set architecture.",
    },
  ],
  cybersecurity: [
    {
      id: "x86",
      label: "x86",
      description: "Dive into complex instruction set fundamentals.",
    },
  ],
};

export default function LandingPage() {
  const router = useRouter();
  const [selectedMajor, setSelectedMajor] = useState<Major | null>(null);
  const [selectedTrack, setSelectedTrack] = useState<Track | null>(null);

  const majorLabel = useMemo(
    () => majors.find((major) => major.id === selectedMajor)?.label,
    [selectedMajor],
  );
  const trackLabel = useMemo(() => {
    if (!selectedMajor || !selectedTrack) return null;
    return trackOptions[selectedMajor].find((track) => track.id === selectedTrack)?.label ?? null;
  }, [selectedMajor, selectedTrack]);

  const statusMessage = useMemo(() => {
    if (!selectedMajor) {
      return "Pick a major to get started.";
    }
    if (!selectedTrack) {
      return `Great! Now choose a ${majorLabel} track to continue.`;
    }
    const label = trackLabel ?? "your";
    return `Excellent choice! We will send you to the ${label} experience next.`;
  }, [majorLabel, selectedMajor, selectedTrack, trackLabel]);

  useEffect(() => {
    if (!selectedMajor || !selectedTrack) {
      return undefined;
    }
    const redirectTimer = setTimeout(() => {
      const search = new URLSearchParams({ major: selectedMajor, track: selectedTrack }).toString();
      router.push(`/login?${search}`);
    }, 1600);

    return () => clearTimeout(redirectTimer);
  }, [router, selectedMajor, selectedTrack]);

  const renderMajorCards = () => (
    <div className="grid gap-4 md:grid-cols-2">
      {majors.map((major) => {
        const isActive = selectedMajor === major.id;
        return (
          <button
            key={major.id}
            onClick={() => {
              setSelectedMajor(major.id);
              setSelectedTrack(null);
            }}
            className={`relative flex flex-col gap-2 rounded-xl border px-5 py-4 text-left transition-all ${
              isActive
                ? "border-[#800020] bg-rose-50 text-[#800020] shadow-lg"
                : "border-gray-200 bg-white text-gray-700 hover:border-[#800020]"
            }`}
          >
            <span className="text-2xl font-semibold">{major.label}</span>
            <span className="text-sm text-gray-500">{major.description}</span>
            {isActive && (
              <span className="absolute right-4 top-4 text-xs font-semibold uppercase tracking-wide">
                Selected
              </span>
            )}
          </button>
        );
      })}
    </div>
  );

  const renderTrackCards = () => {
    if (!selectedMajor) return null;
    return (
      <div className="grid gap-4 md:grid-cols-3">
        {trackOptions[selectedMajor].map((track) => {
          const isActive = selectedTrack === track.id;
          return (
            <button
              key={track.id}
              onClick={() => setSelectedTrack(track.id)}
              className={`relative flex flex-col gap-2 rounded-xl border px-5 py-4 text-left transition-all ${
                isActive
                  ? "border-[#800020] bg-rose-50 text-[#800020] shadow-lg"
                  : "border-gray-200 bg-white text-gray-700 hover:border-[#800020]"
              }`}
            >
              <span className="text-2xl font-semibold">{track.label}</span>
              <span className="text-sm text-gray-500">{track.description}</span>
              {isActive && (
                <span className="absolute right-4 top-4 text-xs font-semibold uppercase tracking-wide">
                  Selected
                </span>
              )}
            </button>
          );
        })}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-rose-50 to-white flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-4xl space-y-8 rounded-2xl border border-rose-100 bg-white p-10 shadow-xl">
        <div className="flex flex-col items-center gap-4 text-center">
          <Image src="/asu-logo.png" alt="ASU logo" width={160} height={60} priority />
          <p className="text-sm uppercase tracking-[0.3em] text-rose-500">Welcome</p>
          <h1 className="text-4xl font-bold text-gray-900">Choose your learning journey</h1>
          <p className="text-gray-600 text-lg">
            Start by selecting a major and then the architecture you are most excited to study today.
          </p>
        </div>

        {selectedMajor ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <p className="text-sm uppercase tracking-wider text-rose-400">Step 2</p>
                <h2 className="text-2xl font-semibold text-gray-900">
                  Pick a {majorLabel} architecture track
                </h2>
              </div>
              <button
                type="button"
                onClick={() => {
                  setSelectedMajor(null);
                  setSelectedTrack(null);
                }}
                className="inline-flex items-center gap-2 rounded-full border border-rose-200 px-4 py-2 text-sm text-rose-600 transition hover:border-rose-400"
              >
                <ArrowLeft className="h-4 w-4" /> Choose another major
              </button>
            </div>
            {renderTrackCards()}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="text-center">
              <p className="text-sm uppercase tracking-wider text-rose-400">Step 1</p>
              <h2 className="text-2xl font-semibold text-gray-900">Which major should we tailor to you?</h2>
            </div>
            {renderMajorCards()}
          </div>
        )}

        <div className="rounded-xl border border-dashed border-rose-200 bg-rose-50/60 px-6 py-4 text-center text-sm text-[#800020]">
          {statusMessage}
          {selectedTrack && <span className="ml-2 animate-pulse">Redirecting...</span>}
        </div>
      </div>
    </div>
  );
}
