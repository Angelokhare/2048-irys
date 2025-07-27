import { useRef } from 'react';

export const useSwapSound = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const play = () => {
    if (!audioRef.current) {
      audioRef.current = new Audio('/sounds/Clicks.mp3');
      audioRef.current.volume = 0.5;
    }
    audioRef.current.currentTime = 0;
    audioRef.current.play();
  };

  return play;
};