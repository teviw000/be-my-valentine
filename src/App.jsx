import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import "./App.css";
import valentineGif from "./assets/chopper-tony-tony-chopper.gif";
import valentineThanks from "./assets/love-you-hamster.gif";


function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

export default function App() {
  const arenaRef = useRef(null);
  const noRef = useRef(null);

  const [accepted, setAccepted] = useState(false);

  // Position & size for the "No" button (absolute within arena)
  const [noBox, setNoBox] = useState({ x: 0, y: 0, w: 120, h: 48 });

  // Random sizes for "No" each time it moves
  const sizes = useMemo(
    () => [
      { w: 90, h: 40 },
      { w: 110, h: 44 },
      { w: 130, h: 52 },
      { w: 80, h: 36 },
      { w: 150, h: 56 },
    ],
    []
  );

  // Center initial "No" on first layout
  useLayoutEffect(() => {
    const arena = arenaRef.current;
    if (!arena) return;
    const rect = arena.getBoundingClientRect();

    // start near the right side, aligned with "Yes"
    const initW = 120;
    const initH = 48;
    setNoBox({
      x: Math.round(rect.width * 0.58),
      y: Math.round(rect.height * 0.50 - initH / 2),
      w: initW,
      h: initH,
    });
  }, []);

  // Move "No" somewhere else inside arena, with a new size
const teleportNo = () => {
  const arena = arenaRef.current;
  if (!arena) return;

  const rect = arena.getBoundingClientRect();

  const sizes = [
    { w: 90, h: 36 },
    { w: 110, h: 44 },
    { w: 130, h: 52 },
    { w: 150, h: 56 },
  ];

  const s = sizes[Math.floor(Math.random() * sizes.length)];

  const padding = 8;
  const maxX = rect.width - s.w - padding;
  const maxY = rect.height - s.h - padding;

  const x = Math.random() * maxX + padding;
  const y = Math.random() * maxY + padding;

  setNoBox({
    x,
    y,
    w: s.w,
    h: s.h,
  });
};

  // Make it even harder to click "No": if mouse gets close, move it
  useEffect(() => {
    const arena = arenaRef.current;
    const noEl = noRef.current;
    if (!arena || !noEl) return;

    const onMove = (e) => {
      const noRect = noEl.getBoundingClientRect();
      const mx = e.clientX;
      const my = e.clientY;

      // distance from mouse to center of "No"
      const cx = noRect.left + noRect.width / 2;
      const cy = noRect.top + noRect.height / 2;
      const dist = Math.hypot(mx - cx, my - cy);

      // If mouse approaches within this radius, bail out
      const triggerRadius = 90;
      if (dist < triggerRadius) moveNo();
    };

    arena.addEventListener("mousemove", onMove);
    return () => arena.removeEventListener("mousemove", onMove);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [noBox.x, noBox.y, noBox.w, noBox.h]);

  return (
    <div className="page">
      <div className="card">
        <h1 className="title">
          {accepted ? "Yay! 💖" : "Will you be my valentines?"}
        </h1>

        <img
          src={valentineGif}
          alt="Cute valentine gif"
          className="valentine-gif"
        />

        <p className="subtitle">
          {accepted
            ? "Best decision ever. See you on Valentine’s! 🥰"
            : "Choose wisely… 😏"}
        </p>

        <div className="arena" ref={arenaRef}>
          <button
            className="btn yes"
            onClick={() => setAccepted(true)}
            type="button"
          >
            Yes
          </button>

          <button
  ref={noRef}
  className="btn no"
  type="button"
  style={{
    left: `${noBox.x}px`,
    top: `${noBox.y}px`,
    width: `${noBox.w}px`,
    height: `${noBox.h}px`,
  }}
  onMouseEnter={teleportNo}
  onPointerEnter={teleportNo}
  onClick={(e) => {
    e.preventDefault();
    teleportNo();
  }}
>
  No
</button>
        </div>

        {accepted && (
          <button className="btn reset" onClick={() => setAccepted(false)} type="button">
            Reset
          </button>
        )}
      </div>
    </div>

  );
}
