"use client"

import { useState } from "react"
import {
  GradientShimmer,
  gradientPresets,
  type EasingPreset,
  type GradientPresetName,
} from "./gradient-shimmer"

const PRESETS = Object.keys(gradientPresets) as GradientPresetName[]
const EASINGS: { value: EasingPreset; label: string }[] = [
  { value: "smooth", label: "Smooth" },
  { value: "gentle", label: "Gentle" },
  { value: "snappy", label: "Snappy" },
]

/** 180deg swatch preview of a preset's stops (matches the original site). */
function swatchGradient(name: GradientPresetName) {
  const stops = [...gradientPresets[name]].sort((a, b) => a.position - b.position)
  return `linear-gradient(180deg, ${stops
    .map((s) => `${s.color} ${Math.round(s.position * 100)}%`)
    .join(", ")})`
}

const STYLE = `
.gsp {
  --bg: #ffffff; --fg: #1c1c1e; --muted: #8a8a90;
  --border: rgba(0,0,0,.1); --bg-weak: #f5f5f3; --surface: #ffffff;
  --shadow: 0 1px 2px rgba(0,0,0,.05); --ring: #1c1c1e;
  --mono: ui-monospace, SFMono-Regular, "SF Mono", Menlo, monospace;
  display: flex; min-height: 100vh; width: 100%;
  align-items: center; justify-content: center;
  background: var(--bg); color: var(--fg);
  font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", Inter, "Segoe UI", system-ui, sans-serif;
  padding: 40px 24px;
}
@media (prefers-color-scheme: dark) {
  .gsp {
    --bg: #0b0b0d; --fg: #f1f1f4; --muted: #85858d;
    --border: rgba(255,255,255,.12); --bg-weak: #161619; --surface: #161619;
    --shadow: 0 1px 2px rgba(0,0,0,.4); --ring: #f1f1f4;
  }
}
.gsp-inner { width: 100%; max-width: 560px; display: flex; flex-direction: column; align-items: center; }
.gsp-title { min-height: 72px; display: flex; align-items: center; justify-content: center; text-align: center; }
.gsp-install {
  margin-top: 8px; display: inline-flex; align-items: center; justify-content: space-between; gap: 12px;
  width: 100%; max-width: 380px; padding: 12px 16px; border-radius: 14px;
  background: var(--surface); border: .5px solid var(--border); box-shadow: var(--shadow);
  font-family: var(--mono); font-size: 14px; color: var(--fg);
}
.gsp-install .muted { color: var(--muted); }
.gsp-copy { display: inline-flex; padding: 0; border: 0; background: transparent; color: var(--muted); cursor: pointer; }
.gsp-copy:hover { color: var(--fg); }
.gsp-swatches { margin-top: 20px; display: flex; gap: 14px; flex-wrap: wrap; justify-content: center; }
.gsp-swatch { width: 34px; height: 34px; border-radius: 999px; border: 0; padding: 0; cursor: pointer;
  box-shadow: 0 0 0 1px var(--border); transition: transform .2s cubic-bezier(.34,1.4,.5,1), box-shadow .2s ease; }
.gsp-swatch:hover { transform: scale(1.09); }
.gsp-swatch[data-active="true"] { box-shadow: 0 0 0 2px var(--bg), 0 0 0 4px var(--ring); }
.gsp-divider { width: 100%; height: 1px; background: var(--border); margin: 30px 0; }
.gsp-controls { width: 100%; display: flex; flex-direction: column; gap: 18px; }
.gsp-row { display: flex; align-items: center; gap: 16px; }
.gsp-label { color: var(--muted); font-size: 14px; }
.gsp-row > .gsp-label { width: 64px; flex: 0 0 auto; }
.gsp-input { flex: 1; padding: 9px 12px; border-radius: 10px; border: .5px solid var(--border);
  background: var(--surface); color: var(--fg); font: inherit; font-size: 14px; outline: none; }
.gsp-input:focus { border-color: var(--ring); }
.gsp-seg { margin-left: auto; display: inline-flex; gap: 2px; padding: 3px; border-radius: 12px;
  background: var(--bg-weak); }
.gsp-seg button { padding: 7px 16px; border-radius: 10px; border: 0; cursor: pointer;
  font-size: 14px; font-weight: 500; background: transparent; color: var(--muted); transition: all .2s ease; }
.gsp-seg button[data-active="true"] { background: var(--surface); color: var(--fg); box-shadow: var(--shadow); }
.gsp-slider { display: flex; flex-direction: column; gap: 8px; width: 100%; }
.gsp-slider-head { display: flex; justify-content: space-between; font-size: 14px; }
.gsp-slider-head .val { color: var(--fg); font-variant-numeric: tabular-nums; }
.gsp input[type=range] { -webkit-appearance: none; appearance: none; width: 100%; height: 16px;
  background: transparent; cursor: pointer; margin: 0; }
.gsp input[type=range]::-webkit-slider-runnable-track { height: 3px; border-radius: 3px; background: var(--bg-weak); }
.gsp input[type=range]::-moz-range-track { height: 3px; border-radius: 3px; background: var(--bg-weak); }
.gsp input[type=range]::-webkit-slider-thumb { -webkit-appearance: none; appearance: none; margin-top: -5px;
  width: 13px; height: 13px; border-radius: 50%; background: var(--fg); border: 2px solid var(--bg);
  box-shadow: 0 1px 2px rgba(0,0,0,.25); }
.gsp input[type=range]::-moz-range-thumb { width: 13px; height: 13px; border-radius: 50%; background: var(--fg);
  border: 2px solid var(--bg); box-shadow: 0 1px 2px rgba(0,0,0,.25); }
.gsp-section-title { margin: 4px 0 20px; font-size: 12px; font-weight: 600; letter-spacing: .12em;
  text-transform: uppercase; color: var(--muted); text-align: center; }
.gsp-sidebar { width: 100%; max-width: 320px; background: var(--surface); border: .5px solid var(--border);
  border-radius: 20px; box-shadow: var(--shadow); padding: 8px; display: flex; flex-direction: column; gap: 2px; }
.gsp-channel { display: flex; align-items: center; gap: 10px; padding: 10px 12px; border-radius: 12px;
  font-size: 16px; color: var(--muted); }
.gsp-channel[data-active="true"] { background: var(--bg-weak); color: var(--fg); }
.gsp-channel .hash { color: var(--muted); opacity: .8; }
`

function CopyIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  )
}

function Slider({
  label, value, min, max, step, format, onChange,
}: {
  label: string; value: number; min: number; max: number; step: number
  format: (v: number) => string; onChange: (v: number) => void
}) {
  return (
    <div className="gsp-slider">
      <div className="gsp-slider-head">
        <span className="gsp-label">{label}</span>
        <span className="val">{format(value)}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value}
        onChange={(e) => onChange(Number(e.target.value))} />
    </div>
  )
}

export default function Default() {
  const [text, setText] = useState("gradient-shimmer")
  const [gradient, setGradient] = useState<GradientPresetName>("sunrise")
  const [easing, setEasing] = useState<EasingPreset>("smooth")
  const [duration, setDuration] = useState(1.45)
  const [spread, setSpread] = useState(3)
  const [angle, setAngle] = useState(105)
  const [pauseBetween, setPauseBetween] = useState(700)

  const label = text.trim() === "" ? "gradient-shimmer" : text
  // Every live control feeds both the hero and the sidebar channel, so the
  // sidebar is a continuation of the same component — not a separate example.
  const shimmerProps = {
    gradient,
    easing,
    duration,
    spread,
    angle,
    pauseBetween,
    pauseOnScroll: false,
  }

  return (
    <>
      <style>{STYLE}</style>
      <div className="gsp">
        <div className="gsp-inner">
          <div className="gsp-title">
            <GradientShimmer
              {...shimmerProps}
              style={{ fontSize: 56, fontWeight: 700, letterSpacing: "-0.03em", maxWidth: "100%" }}
            >
              {label}
            </GradientShimmer>
          </div>

          <div className="gsp-install">
            <span><span className="muted">$</span>&nbsp;&nbsp;npm i gradient-shimmer</span>
            <button
              type="button"
              className="gsp-copy"
              aria-label="Copy install command"
              onClick={() => navigator.clipboard?.writeText("npm i gradient-shimmer").catch(() => {})}
            >
              <CopyIcon />
            </button>
          </div>

          <div className="gsp-swatches">
            {PRESETS.map((name) => (
              <button
                key={name}
                type="button"
                className="gsp-swatch"
                data-active={gradient === name}
                aria-label={name}
                style={{ backgroundImage: swatchGradient(name) }}
                onClick={() => setGradient(name)}
              />
            ))}
          </div>

          <div className="gsp-divider" />

          <div className="gsp-controls">
            <div className="gsp-row">
              <span className="gsp-label">Text</span>
              <input
                className="gsp-input"
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="gradient-shimmer"
                spellCheck={false}
              />
            </div>

            <div className="gsp-row">
              <span className="gsp-label">Easing</span>
              <div className="gsp-seg">
                {EASINGS.map((e) => (
                  <button key={e.value} type="button" data-active={easing === e.value} onClick={() => setEasing(e.value)}>
                    {e.label}
                  </button>
                ))}
              </div>
            </div>

            <Slider label="Speed" value={duration} min={0.6} max={8} step={0.05}
              format={(v) => `${v.toFixed(2)}s`} onChange={setDuration} />
            <Slider label="Spread" value={spread} min={1} max={8} step={0.5}
              format={(v) => `${v}px/char`} onChange={setSpread} />
            <Slider label="Angle" value={angle} min={0} max={180} step={1}
              format={(v) => `${Math.round(v)}°`} onChange={setAngle} />
            <Slider label="Pause" value={pauseBetween} min={0} max={3000} step={50}
              format={(v) => `${Math.round(v)}ms`} onChange={setPauseBetween} />
          </div>

          <div className="gsp-divider" />

          {/* Continuation — the same shimmer, in context */}
          <div className="gsp-section-title">In the channel sidebar</div>
          <div className="gsp-sidebar">
            <div className="gsp-channel"><span className="hash">#</span><span>general</span></div>
            <div className="gsp-channel" data-active="true">
              <span className="hash">#</span>
              <GradientShimmer {...shimmerProps}>{label}</GradientShimmer>
            </div>
            <div className="gsp-channel"><span className="hash">#</span><span>design-sync</span></div>
            <div className="gsp-channel"><span className="hash">#</span><span>release-notes</span></div>
          </div>
        </div>
      </div>
    </>
  )
}
