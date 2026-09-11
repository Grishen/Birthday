import { useEffect, useRef } from "react";

const LOUD_RMS = 0.08;
const LOUD_FRAMES = 5;

export function useCandleWish({ enabled, onWish }) {
  const wishRef = useRef(onWish);
  wishRef.current = onWish;

  useEffect(() => {
    if (!enabled || typeof navigator === "undefined" || !navigator.mediaDevices?.getUserMedia) {
      return undefined;
    }

    let stream;
    let context;
    let frame;
    let granted = false;
    let loudFrames = 0;
    let cancelled = false;

    const stop = () => {
      if (frame) window.cancelAnimationFrame(frame);
      stream?.getTracks().forEach((track) => track.stop());
      if (context && context.state !== "closed") context.close().catch(() => {});
    };

    const listen = (analyser) => {
      const data = new Uint8Array(analyser.fftSize);
      const tick = () => {
        if (cancelled || granted) return;
        analyser.getByteTimeDomainData(data);
        let sum = 0;
        for (let i = 0; i < data.length; i += 1) {
          const sample = (data[i] - 128) / 128;
          sum += sample * sample;
        }
        const rms = Math.sqrt(sum / data.length);
        if (rms > LOUD_RMS) loudFrames += 1;
        else loudFrames = Math.max(0, loudFrames - 1);
        if (loudFrames >= LOUD_FRAMES) {
          granted = true;
          wishRef.current?.();
          stop();
          return;
        }
        frame = window.requestAnimationFrame(tick);
      };
      tick();
    };

    const wait = window.setTimeout(() => {
      navigator.mediaDevices
        .getUserMedia({ audio: true, video: false })
        .then(async (nextStream) => {
          if (cancelled) {
            nextStream.getTracks().forEach((track) => track.stop());
            return;
          }
          stream = nextStream;
          const AudioCtx = window.AudioContext || window.webkitAudioContext;
          context = new AudioCtx();
          if (context.state === "suspended") await context.resume();
          const source = context.createMediaStreamSource(stream);
          const analyser = context.createAnalyser();
          analyser.fftSize = 512;
          source.connect(analyser);
          listen(analyser);
        })
        .catch(() => {});
    }, 900);

    return () => {
      cancelled = true;
      window.clearTimeout(wait);
      stop();
    };
  }, [enabled]);
}
