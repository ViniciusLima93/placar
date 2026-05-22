"use client";

import { useState, useEffect } from "react";

const SETS_TO_WIN = 3;
const MAX_SETS = 5;

type Team = "A" | "B";

interface SetScore {
  A: number;
  B: number;
}

interface Settings {
  pointsPerSet: number;
  pointsFifthSet: number;
  minDiff: number;
}

const DEFAULT_SETTINGS: Settings = {
  pointsPerSet: 25,
  pointsFifthSet: 15,
  minDiff: 2,
};

function limitForSet(setIndex: number, s: Settings) {
  return setIndex === 4 ? s.pointsFifthSet : s.pointsPerSet;
}

function isSetWon(p: number, opp: number, setIndex: number, s: Settings) {
  return p >= limitForSet(setIndex, s) && p - opp >= s.minDiff;
}

function countSets(sets: SetScore[], team: Team, s: Settings) {
  return sets.filter((score, i) => {
    const o: Team = team === "A" ? "B" : "A";
    return isSetWon(score[team], score[o], i, s);
  }).length;
}

// ── Settings modal ──────────────────────────────────────────────────────────

function SettingRow({
  label,
  value,
  min,
  max,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-3 border-b border-slate-700 last:border-0">
      <span className="text-slate-200 text-sm font-medium">{label}</span>
      <div className="flex items-center gap-3">
        <button
          onClick={() => onChange(Math.max(min, value - 1))}
          className="w-9 h-9 rounded-full bg-slate-600 hover:bg-slate-500 text-white text-xl font-bold transition-colors disabled:opacity-30"
          disabled={value <= min}
        >
          −
        </button>
        <input
          type="number"
          value={value}
          min={min}
          max={max}
          onChange={(e) => {
            const n = parseInt(e.target.value, 10);
            if (!isNaN(n) && n >= min && n <= max) onChange(n);
          }}
          className="w-16 text-center bg-slate-700 text-white text-xl font-black rounded-lg py-1 outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none"
        />
        <button
          onClick={() => onChange(Math.min(max, value + 1))}
          className="w-9 h-9 rounded-full bg-slate-600 hover:bg-slate-500 text-white text-xl font-bold transition-colors disabled:opacity-30"
          disabled={value >= max}
        >
          +
        </button>
      </div>
    </div>
  );
}

function SettingsModal({
  settings,
  onSave,
  onClose,
}: {
  settings: Settings;
  onSave: (s: Settings) => void;
  onClose: () => void;
}) {
  const [draft, setDraft] = useState<Settings>(settings);

  function set<K extends keyof Settings>(key: K, value: Settings[K]) {
    setDraft((prev) => ({ ...prev, [key]: value }));
  }

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="bg-slate-800 rounded-2xl shadow-2xl w-full max-w-sm mx-4 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-700">
          <h2 className="text-white text-lg font-black uppercase tracking-widest">Configurações</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white text-2xl leading-none transition-colors">
            ×
          </button>
        </div>

        <div className="px-6 py-2">
          <SettingRow
            label="Pontos para vencer o set"
            value={draft.pointsPerSet}
            min={3}
            max={99}
            onChange={(v) => set("pointsPerSet", v)}
          />
          <SettingRow
            label="Pontos para vencer o 5º set"
            value={draft.pointsFifthSet}
            min={3}
            max={99}
            onChange={(v) => set("pointsFifthSet", v)}
          />
          <SettingRow
            label="Diferença mínima"
            value={draft.minDiff}
            min={1}
            max={10}
            onChange={(v) => set("minDiff", v)}
          />
        </div>

        <div className="px-6 py-4 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-full bg-slate-700 hover:bg-slate-600 text-slate-300 text-sm font-bold uppercase tracking-wider transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={() => onSave(draft)}
            className="flex-1 py-3 rounded-full bg-yellow-400 hover:bg-yellow-300 text-slate-900 text-sm font-black uppercase tracking-wider transition-colors"
          >
            Salvar
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main scoreboard ──────────────────────────────────────────────────────────

export default function Home() {
  const [nameA, setNameA] = useState("Time A");
  const [nameB, setNameB] = useState("Time B");
  const [editA, setEditA] = useState(false);
  const [editB, setEditB] = useState(false);

  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [showSettings, setShowSettings] = useState(false);

  const [sets, setSets] = useState<SetScore[]>([{ A: 0, B: 0 }]);
  const [currentSet, setCurrentSet] = useState(0);
  const [matchOver, setMatchOver] = useState(false);
  const [winner, setWinner] = useState<Team | null>(null);
  const [serving, setServing] = useState<Team>("A");
  const [flash, setFlash] = useState<Team | null>(null);

  const score = sets[currentSet];
  const setsA = countSets(sets, "A", settings);
  const setsB = countSets(sets, "B", settings);
  const limit = limitForSet(currentSet, settings);

  const wonA = isSetWon(score.A, score.B, currentSet, settings);
  const wonB = isSetWon(score.B, score.A, currentSet, settings);
  const setWonBy: Team | null = wonA ? "A" : wonB ? "B" : null;

  useEffect(() => {
    if (!setWonBy || matchOver) return;
    setFlash(setWonBy);
    const t = setTimeout(() => {
      setFlash(null);
      const updated = sets;
      const nA = countSets(updated, "A", settings);
      const nB = countSets(updated, "B", settings);
      if (nA >= SETS_TO_WIN) { setMatchOver(true); setWinner("A"); return; }
      if (nB >= SETS_TO_WIN) { setMatchOver(true); setWinner("B"); return; }
      if (updated.length < MAX_SETS) {
        setSets((p) => [...p, { A: 0, B: 0 }]);
        setCurrentSet((c) => c + 1);
      }
    }, 1800);
    return () => clearTimeout(t);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [score.A, score.B]);

  function addPoint(team: Team) {
    if (matchOver || flash) return;
    setSets((p) => p.map((s, i) => i === currentSet ? { ...s, [team]: s[team] + 1 } : s));
    setServing(team);
  }

  function removePoint(team: Team) {
    if (matchOver || flash) return;
    setSets((p) => p.map((s, i) => i === currentSet ? { ...s, [team]: Math.max(0, s[team] - 1) } : s));
  }

  function addSet(team: Team) {
    if (matchOver) return;
    setSets((prev) => {
      const insert: SetScore = team === "A"
        ? { A: limitForSet(currentSet, settings), B: 0 }
        : { A: 0, B: limitForSet(currentSet, settings) };
      const newSets = [...prev.slice(0, currentSet), insert, { A: 0, B: 0 }, ...prev.slice(currentSet + 1)];
      setCurrentSet(newSets.length - 1);
      const nA = countSets(newSets, "A", settings);
      const nB = countSets(newSets, "B", settings);
      if (nA >= SETS_TO_WIN) { setMatchOver(true); setWinner("A"); }
      if (nB >= SETS_TO_WIN) { setMatchOver(true); setWinner("B"); }
      return newSets;
    });
  }

  function removeSet(team: Team) {
    if (matchOver) return;
    setSets((prev) => {
      const opp: Team = team === "A" ? "B" : "A";
      let removeIdx = -1;
      for (let i = prev.length - 1; i >= 0; i--) {
        if (isSetWon(prev[i][team], prev[i][opp], i, settings)) { removeIdx = i; break; }
      }
      if (removeIdx === -1) return prev;
      const next = prev.filter((_, i) => i !== removeIdx);
      if (next.length === 0) return [{ A: 0, B: 0 }];
      setCurrentSet(Math.min(currentSet, next.length - 1));
      return next;
    });
  }

  function saveSettings(newSettings: Settings) {
    setSettings(newSettings);
    setShowSettings(false);
    resetMatch();
  }

  function resetMatch() {
    setSets([{ A: 0, B: 0 }]);
    setCurrentSet(0);
    setMatchOver(false);
    setWinner(null);
    setServing("A");
    setFlash(null);
    setShowSettings(false);
  }

  const prevSets = sets.slice(0, currentSet);

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden select-none">

      {/* Settings modal */}
      {showSettings && (
        <SettingsModal
          settings={settings}
          onSave={saveSettings}
          onClose={() => setShowSettings(false)}
        />
      )}

      {/* Match winner overlay */}
      {matchOver && winner && (
        <div className="absolute inset-0 z-40 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="text-center">
            <p className="text-yellow-400 text-7xl font-black uppercase tracking-widest drop-shadow-2xl mb-6">
              {winner === "A" ? nameA : nameB}
            </p>
            <p className="text-white text-3xl font-bold mb-10 tracking-wide">venceu a partida!</p>
            <button
              onClick={resetMatch}
              className="px-10 py-4 bg-white text-slate-900 rounded-full text-xl font-bold uppercase tracking-widest hover:bg-yellow-400 transition-colors"
            >
              Nova Partida
            </button>
          </div>
        </div>
      )}

      {/* Main panels */}
      <div className="flex flex-1 min-h-0">

        {/* === TEAM A — BLUE === */}
        <div className={`relative w-1/2 flex flex-col items-center justify-between py-8 px-6 transition-all duration-300
          ${flash === "A" ? "bg-blue-300" : "bg-blue-700"}`}>

          {flash === "A" && (
            <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
              <p className="text-blue-900 text-5xl font-black uppercase tracking-widest animate-bounce">Set!</p>
            </div>
          )}

          <div className="z-10 text-center">
            {editA ? (
              <input autoFocus
                className="bg-blue-600 text-white text-3xl font-black text-center rounded-xl px-4 py-2 outline-none w-48"
                value={nameA}
                onChange={(e) => setNameA(e.target.value)}
                onBlur={() => setEditA(false)}
                onKeyDown={(e) => e.key === "Enter" && setEditA(false)}
              />
            ) : (
              <button onClick={() => setEditA(true)}
                className="text-white text-3xl font-black uppercase tracking-widest hover:text-blue-200 transition-colors">
                {nameA}
              </button>
            )}
            {serving === "A" && !matchOver && (
              <p className="text-blue-200 text-xs mt-1 uppercase tracking-widest">● Saque</p>
            )}
          </div>

          <div className="z-10 flex flex-col items-center gap-2">
            <p className="text-blue-200 text-sm uppercase tracking-widest">Sets</p>
            <div className="flex items-center gap-4">
              <button onClick={() => removeSet("A")} disabled={setsA === 0}
                className="w-10 h-10 rounded-full bg-blue-600 hover:bg-blue-500 disabled:opacity-30 text-white text-2xl font-bold transition-colors">
                −
              </button>
              <span className="text-white text-5xl font-black w-12 text-center tabular-nums">{setsA}</span>
              <button onClick={() => addSet("A")}
                className="w-10 h-10 rounded-full bg-blue-600 hover:bg-blue-500 text-white text-2xl font-bold transition-colors">
                +
              </button>
            </div>
          </div>

          <div className="z-10">
            <span className={`font-black tabular-nums leading-none transition-colors
              ${score.A >= limit ? "text-yellow-300" : "text-white"}
              ${score.A > 9 ? "text-[22vw]" : "text-[28vw]"}`}>
              {score.A}
            </span>
          </div>

          <div className="z-10 flex items-center gap-6">
            <button onClick={() => removePoint("A")} disabled={matchOver || score.A === 0 || !!flash}
              className="w-16 h-16 rounded-full bg-blue-600 hover:bg-blue-500 disabled:opacity-30 text-white text-4xl font-bold transition-colors shadow-lg">
              −
            </button>
            <button onClick={() => addPoint("A")} disabled={matchOver || !!flash}
              className="w-20 h-20 rounded-full bg-white hover:bg-blue-100 disabled:opacity-30 text-blue-700 text-5xl font-black transition-colors shadow-xl">
              +
            </button>
          </div>

          <div className="h-4" />
        </div>

        {/* Center divider */}
        <div className="w-1 bg-slate-900 z-10 flex flex-col items-center justify-center gap-2 py-4 shrink-0">
          <div className="flex-1 w-px bg-slate-700" />
          <div className="w-2 h-2 rounded-full bg-slate-500" />
          <div className="w-2 h-2 rounded-full bg-slate-500" />
          <div className="w-2 h-2 rounded-full bg-slate-500" />
          <div className="flex-1 w-px bg-slate-700" />
        </div>

        {/* === TEAM B — RED === */}
        <div className={`relative w-1/2 flex flex-col items-center justify-between py-8 px-6 transition-all duration-300
          ${flash === "B" ? "bg-red-300" : "bg-red-700"}`}>

          {flash === "B" && (
            <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
              <p className="text-red-900 text-5xl font-black uppercase tracking-widest animate-bounce">Set!</p>
            </div>
          )}

          <div className="z-10 text-center">
            {editB ? (
              <input autoFocus
                className="bg-red-600 text-white text-3xl font-black text-center rounded-xl px-4 py-2 outline-none w-48"
                value={nameB}
                onChange={(e) => setNameB(e.target.value)}
                onBlur={() => setEditB(false)}
                onKeyDown={(e) => e.key === "Enter" && setEditB(false)}
              />
            ) : (
              <button onClick={() => setEditB(true)}
                className="text-white text-3xl font-black uppercase tracking-widest hover:text-red-200 transition-colors">
                {nameB}
              </button>
            )}
            {serving === "B" && !matchOver && (
              <p className="text-red-200 text-xs mt-1 uppercase tracking-widest">● Saque</p>
            )}
          </div>

          <div className="z-10 flex flex-col items-center gap-2">
            <p className="text-red-200 text-sm uppercase tracking-widest">Sets</p>
            <div className="flex items-center gap-4">
              <button onClick={() => removeSet("B")} disabled={setsB === 0}
                className="w-10 h-10 rounded-full bg-red-600 hover:bg-red-500 disabled:opacity-30 text-white text-2xl font-bold transition-colors">
                −
              </button>
              <span className="text-white text-5xl font-black w-12 text-center tabular-nums">{setsB}</span>
              <button onClick={() => addSet("B")}
                className="w-10 h-10 rounded-full bg-red-600 hover:bg-red-500 text-white text-2xl font-bold transition-colors">
                +
              </button>
            </div>
          </div>

          <div className="z-10">
            <span className={`font-black tabular-nums leading-none transition-colors
              ${score.B >= limit ? "text-yellow-300" : "text-white"}
              ${score.B > 9 ? "text-[22vw]" : "text-[28vw]"}`}>
              {score.B}
            </span>
          </div>

          <div className="z-10 flex items-center gap-6">
            <button onClick={() => removePoint("B")} disabled={matchOver || score.B === 0 || !!flash}
              className="w-16 h-16 rounded-full bg-red-600 hover:bg-red-500 disabled:opacity-30 text-white text-4xl font-bold transition-colors shadow-lg">
              −
            </button>
            <button onClick={() => addPoint("B")} disabled={matchOver || !!flash}
              className="w-20 h-20 rounded-full bg-white hover:bg-red-100 disabled:opacity-30 text-red-700 text-5xl font-black transition-colors shadow-xl">
              +
            </button>
          </div>

          <div className="h-4" />
        </div>
      </div>

      {/* Bottom bar */}
      <div className="bg-slate-900 flex items-center justify-between px-6 py-2 shrink-0">
        <div className="flex gap-3 min-w-0">
          {prevSets.map((s, i) => (
            <div key={i} className="text-xs text-slate-400 font-mono whitespace-nowrap">
              <span className="text-blue-400">{s.A}</span>
              <span className="text-slate-600 mx-1">–</span>
              <span className="text-red-400">{s.B}</span>
            </div>
          ))}
        </div>

        <p className="text-slate-400 text-xs uppercase tracking-widest text-center shrink-0 mx-4">
          {flash ? `Fim do ${currentSet + 1}º Set` : `${currentSet + 1}º Set · ${limit} pts`}
        </p>

        <div className="flex items-center gap-4">
          <button
            onClick={() => setShowSettings(true)}
            className="text-slate-500 hover:text-white transition-colors"
            title="Configurações"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
          <button onClick={resetMatch}
            className="text-slate-500 hover:text-white text-xs uppercase tracking-widest transition-colors">
            Nova Partida
          </button>
        </div>
      </div>
    </div>
  );
}
