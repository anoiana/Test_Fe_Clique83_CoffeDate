import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * Match Feature: Theatrical Intro Hook
 * Manages the staged intro animation sequence for the match profile reveal.
 *
 * Stage 1 (0-2.5s): "WE FOUND SOMEONE FOR YOU"
 * Stage 2 (2.5-5s): Name Reveal
 * Stage 3 (5-7.5s): Anthem Tease
 * Stage 4 (7.5s+): Main profile content
 */
export const useTheatricalIntro = (shouldStart = true) => {
  const [introStage, setIntroStage] = useState(0);

  useEffect(() => {
    if (!shouldStart) {
      setIntroStage(0);
      return;
    }

    // Set stage 1 immediately if we should start
    setIntroStage(prev => prev === 0 ? 1 : prev);
    
    const stage2Timer = setTimeout(() => setIntroStage(2), 1500);
    const stage3Timer = setTimeout(() => setIntroStage(3), 3000);
    const stage4Timer = setTimeout(() => setIntroStage(4), 5000);

    return () => {
      clearTimeout(stage2Timer);
      clearTimeout(stage3Timer);
      clearTimeout(stage4Timer);
    };
  }, [shouldStart]);

  return { introStage };
};

/**
 * Match Feature: Audio Playback Hook
 * Manages audio play/pause/mute state for the match anthem.
 */
export const useMatchAudio = () => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);

  // Sync state with audio element
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.warn("Autoplay was prevented by browser. User interaction needed.", error);
          // Don't flip isPlaying to false automatically, 
          // let the UI show it's 'playing' and it'll start once they click anywhere.
        });
      }
    } else {
      audio.pause();
    }
    audio.muted = isMuted;
  }, [isPlaying, isMuted, audioRef.current]); // Also watch for when ref becomes available

  const togglePlay = useCallback(() => setIsPlaying(prev => !prev), []);
  const toggleMute = useCallback(() => setIsMuted(prev => !prev), []);

  return {
    audioRef,
    isMuted,
    isPlaying,
    togglePlay,
    toggleMute,
    setIsPlaying,
  };
};
