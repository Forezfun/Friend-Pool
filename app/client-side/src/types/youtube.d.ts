export {}
declare global {
  namespace YT {
    interface PlayerEvent {
      target: Player;
    }

    interface OnStateChangeEvent extends PlayerEvent {
      data: number;
    }

    interface OnErrorEvent extends PlayerEvent {
      data: number;
    }

    interface PlayerOptions {
      height?: string;
      width?: string;
      videoId: string;
      events?: {
        onReady?: (event: PlayerEvent) => void;
        onStateChange?: (event: OnStateChangeEvent) => void;
        onError?: (event: OnErrorEvent) => void;
      };
      playerVars?: {
        controls?: number;
        modestbranding?: number;
        rel?: number;
        fs?: number;
        showinfo?: number;
        enablejsapi?: number;
      };
    }

    class Player {
      constructor(elementId: string | HTMLElement, options: PlayerOptions);

      playVideo(): void;
      pauseVideo(): void;
      mute(): void;
      unMute(): void;
      isMuted(): boolean;
      setVolume(volume: number): void;
      getVolume(): number;
      getCurrentTime(): number;
      seekTo(seconds: number, allowSeekAhead: boolean): void;
      getDuration(): number;
      getPlayerState(): number;
    }

    const PlayerState: {
      UNSTARTED: -1;
      ENDED: 0;
      PLAYING: 1;
      PAUSED: 2;
      BUFFERING: 3;
      CUED: 5;
    };
  }

  interface Window {
    onYouTubeIframeAPIReady: () => void;
  }
}
