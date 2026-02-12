import { use, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import "./App.css";
import valentineGif from "./assets/chopper-tony-tony-chopper.gif";
import img1 from "./assets/gallery/gopro.jpeg";
import img2 from "./assets/gallery/IMG_0109.jpeg";
import img3 from "./assets/gallery/IMG_1881.jpeg";
import img4 from "./assets/gallery/IMG_3026.jpeg";
import img5 from "./assets/gallery/throwback.jpeg";
import img6 from "./assets/gallery/IMG_8151.jpeg";
import bgMusic from "./assets/atmosphere.mp3";

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

export default function App() {
  const arenaRef = useRef(null);
  const noRef = useRef(null);
  const galleryImages = [ img1, img2, img3, img4, img5, img6 ];
  const [currentIndex, setCurrentIndex] = useState(0);

  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.35);

  const [accepted, setAccepted] = useState(false);

  // music logic
  const startMusic = async () => {
    const a = audioRef.current;
    if (!a) return;

    try {
      a.volume = volume;
      await a.play();
      setIsPlaying(true);
    } catch (err) {
      // Autoplay blocked until user interacts — this is normal.
      console.log("Audio play blocked:", err);
    }
  };

  const toggleMusic = async () => {
    const a = audioRef.current;
    if (!a) return;

    if (a.paused) {
      await startMusic();
    } else {
      a.pause();
      setIsPlaying(false);
    }
  };

  useEffect(() => {
    const a = audioRef.current;
    if (a) a.volume = volume;
  }, [volume]);

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
      if (dist < triggerRadius) teleportNo();;
    };

    arena.addEventListener("mousemove", onMove);
    return () => arena.removeEventListener("mousemove", onMove);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [noBox.x, noBox.y, noBox.w, noBox.h]);

  return (
    <div className="page">
      <audio ref={audioRef} src={bgMusic} loop preload="auto" />
      {accepted ? (
        <div className>
          <div className="gallery">
            <div className="gallery-frame">
              <img
                src={galleryImages[currentIndex]}
                className="gallery-image"
                alt="gallery"
              />
            </div>
          </div>
          <div className="gallery-controls">
              <div className="love-message">
                <p>
                  Hi pookie. I know I don't write often so instead I thought I would do
                  something a little creative this time. I hope you like it! I love you
                  so much and I am so grateful to have you in my life. Thank you for choosing me.
                  Happy Valentine's Day!
                </p>
              </div>
              <div className="arrow-controls">
                <button
                  className="arrow left"
                  onClick={() =>
                    setCurrentIndex((prev) =>
                      prev === 0 ? galleryImages.length - 1 : prev - 1
                    )
                  }
                >
                  ◀
                </button>
                <button
                  className="arrow right"
                  onClick={() =>
                    setCurrentIndex((prev) =>
                      prev === galleryImages.length - 1 ? 0 : prev + 1
                    )
                  }
                >
                  ▶
                </button>
              </div>
            </div>
          
          <button
            className="reset"
            onClick={() => {
            setAccepted(false);
            setCurrentIndex(0);

            const a = audioRef.current;
            if (a) {
              a.pause();          // stop playback
              a.currentTime = 0;  // rewind to beginning
            }

            setIsPlaying(false);
          }}
          >
            Reset
          </button>
          <div className="music-controls">
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              aria-label="Music volume"
            />
        </div>
</div>
      ) : (
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
          Choose wisely… 😏
        </p>

        <div className="arena" ref={arenaRef}>
          <button
            className="btn yes"
            onClick={() => {
              startMusic();
              setAccepted(true);
            }}
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
      </div>
      )}
    </div>
  );
}
