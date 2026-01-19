import { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';

const STREAM_URL = 'http://play.radios.com.br/11331';

export default function RadioPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(70);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, [volume]);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-primary text-white shadow-lg z-50">
      <audio ref={audioRef} src={STREAM_URL} preload="none" />
      
      <div className="container py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Program Info */}
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-semibold">Ao Vivo</span>
            </div>
            <div className="hidden sm:block border-l border-white/30 pl-3 min-w-0">
              <p className="text-sm font-medium truncate">Programa Manhã na Cidade</p>
              <p className="text-xs text-white/80 truncate">com João Silva • FM 87.9</p>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-4">
            {/* Play/Pause Button */}
            <button
              onClick={togglePlay}
              className="w-12 h-12 rounded-full bg-secondary text-primary flex items-center justify-center hover:bg-secondary/90 transition-colors"
              aria-label={isPlaying ? 'Pausar' : 'Reproduzir'}
            >
              {isPlaying ? (
                <Pause className="w-6 h-6" fill="currentColor" />
              ) : (
                <Play className="w-6 h-6 ml-1" fill="currentColor" />
              )}
            </button>

            {/* Volume Control */}
            <div className="hidden md:flex items-center gap-2">
              <button
                onClick={toggleMute}
                className="text-white hover:text-secondary transition-colors"
                aria-label={isMuted ? 'Ativar som' : 'Silenciar'}
              >
                {isMuted || volume === 0 ? (
                  <VolumeX className="w-5 h-5" />
                ) : (
                  <Volume2 className="w-5 h-5" />
                )}
              </button>
              <input
                type="range"
                min="0"
                max="100"
                value={isMuted ? 0 : volume}
                onChange={(e) => {
                  const newVolume = parseInt(e.target.value);
                  setVolume(newVolume);
                  if (newVolume > 0 && isMuted) {
                    setIsMuted(false);
                    if (audioRef.current) audioRef.current.muted = false;
                  }
                }}
                className="w-24 h-1 bg-white/30 rounded-lg appearance-none cursor-pointer accent-secondary"
                style={{
                  background: `linear-gradient(to right, #facc15 0%, #facc15 ${isMuted ? 0 : volume}%, rgba(255,255,255,0.3) ${isMuted ? 0 : volume}%, rgba(255,255,255,0.3) 100%)`
                }}
              />
              <span className="text-xs font-medium w-8 text-right">{isMuted ? 0 : volume}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
