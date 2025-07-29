import {
  ChangeDetectorRef,
  Component,
  DOCUMENT,
  ElementRef,
  HostListener,
  Inject,
  PLATFORM_ID,
  ViewChild,
  OnDestroy,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

type playerType = 'mp4' | 'youtube' | 'vkvideo'

@Component({
  selector: 'app-player',
  standalone: true,
  imports: [],
  templateUrl: './player.html',
  styleUrl: './player.scss',
})
export class Player implements OnDestroy {
  @ViewChild('videoPlayer') videoPlayer!: ElementRef<HTMLVideoElement>;
  @ViewChild('progressBar') progressBar!: ElementRef<HTMLDivElement>;
  @ViewChild('playerContainer') playerContainer!: ElementRef<HTMLDivElement>;
  @ViewChild('youtubeIframe', { static: false }) youtubeIframe!: ElementRef<HTMLDivElement>;
  private player!: YT.Player;

  isPlaying = false;
  isMuted = false;
  isFullscreen = false;
  isVideoLoaded = false;
  currentTime = 0;
  duration = 0;
  volume = 1;
  showHandle = false;
  playerType: playerType = 'youtube'

  private wasVolumeBeforeMute = 1;
  private animationFrameId: number | null = null;
  isBrowser: boolean;

  constructor(
    private cdRef: ChangeDetectorRef,
    @Inject(PLATFORM_ID) platformId: Object,
    @Inject(DOCUMENT) private document: Document
  ) {
    this.isBrowser = isPlatformBrowser(platformId);

    if (this.isBrowser) {
      this.document.addEventListener('fullscreenchange', this.fullscreenChangeHandler);
    }
  }

  ngOnInit(): void {
    if (!this.isBrowser) return;

    const tag = this.document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api";
    this.document.body.appendChild(tag);

    // YouTube создаёт глобальную функцию
    (window as any).onYouTubeIframeAPIReady = () => {
      this.createYouTubePlayer();
    };
  }
  private createYouTubePlayer(): void {
    this.player = new YT.Player(this.youtubeIframe.nativeElement, {
      width: '100%',
      height: '100%',
      videoId: '1ZYbU82GVz4',
      playerVars: {
        enablejsapi: 1,
        rel: 0,
        modestbranding: 1
      },
      events: {
        onReady: () => {
          const IFRAME_ELEMENT = this.playerContainer.nativeElement.querySelector('iframe') as HTMLIFrameElement
          if (IFRAME_ELEMENT) {
            this.addIframeStyles(IFRAME_ELEMENT)
          }
          this.cdRef.detectChanges();
        },
        onStateChange: (event) => {
          this.onPlayerStateChange(event)
        }
      }
    });
  }
  private lastTime = 0
  onPlayerStateChange(event: YT.OnStateChangeEvent) {
    console.log('Состояние плеера изменилось:', event.data);
    switch (event.data) {
      case YT.PlayerState.PLAYING:
        const currentTime = this.player.getCurrentTime();
        if(this.lastTime!==currentTime){
          this.syncSeek(currentTime)
        }
        this.syncPlay();
        break;
      case YT.PlayerState.PAUSED:
        this.lastTime=this.player.getCurrentTime();
        this.syncPause();
        break;
    }
  }
  private addIframeStyles(iframeElement: HTMLIFrameElement) {
    iframeElement.style.position = 'absolute';
    iframeElement.style.top = '0';
    iframeElement.style.left = '0';
    iframeElement.style.width = '100%';
    iframeElement.style.height = '100%';
    iframeElement.style.border = '0';
  }
  ngOnDestroy(): void {
    if (this.isBrowser) {
      this.document.removeEventListener('fullscreenchange', this.fullscreenChangeHandler);
    }
    this.stopCurrentTimeSync();
  }

  // 🎥 — события из шаблона

  onLoadedMetadata(): void {
    const video = this.videoPlayer.nativeElement;
    this.duration = video.duration;
    this.isVideoLoaded = true;
  }

  onTimeUpdatePlayer(): void {
    this.currentTime = this.videoPlayer.nativeElement.currentTime;
  }

  onPlayPlayer(): void {
    if (this.duration == 0) { this.onLoadedMetadata() }
    this.isPlaying = true;
    this.startCurrentTimeSync();
  }

  onPausePlayer(): void {
    this.isPlaying = false;
    this.stopCurrentTimeSync();
  }

  onVolumeChangePlayer(): void {
    const video = this.videoPlayer.nativeElement;
    this.isMuted = video.muted;
    this.volume = video.volume;
  }

  // 🔄 — проигрывание и время

  togglePlayPlayer(): void {
    const video = this.videoPlayer.nativeElement;
    if (video.paused) {
      video.play()
        .then(() => { this.syncPlay() })
        .catch(e => console.error('Playback failed:', e));
    } else {
      video.pause();
      this.syncPause()
    }
  }

  private startCurrentTimeSync(): void {
    const loop = () => {
      if (!this.isPlaying) return;
      this.currentTime = this.videoPlayer.nativeElement.currentTime;
      this.animationFrameId = requestAnimationFrame(loop);
    };
    this.stopCurrentTimeSync();
    this.animationFrameId = requestAnimationFrame(loop);
  }

  private stopCurrentTimeSync(): void {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  // 🔊 — громкость

  toggleMutePlayer(): void {
    const video = this.videoPlayer.nativeElement;
    if (video.muted) {
      video.muted = false;
      video.volume = this.wasVolumeBeforeMute;
    } else {
      this.wasVolumeBeforeMute = video.volume;
      video.muted = true;
    }
  }

  setVolumePlayer(event: Event): void {
    const newVolume = parseFloat((event.target as HTMLInputElement).value);
    const video = this.videoPlayer.nativeElement;
    video.volume = newVolume;
    this.volume = newVolume;

    if (newVolume > 0 && video.muted) {
      video.muted = false;
    }
  }

  adjustVolumePlayer(change: number): void {
    const newVolume = Math.min(1, Math.max(0, this.volume + change));
    const video = this.videoPlayer.nativeElement;
    video.volume = newVolume;
    this.volume = newVolume;

    if (newVolume > 0 && video.muted) {
      video.muted = false;
    }
  }

  // ⏩ перемотка

  seekPlayer(event: MouseEvent): void {
    const rect = this.progressBar.nativeElement.getBoundingClientRect();
    const pos = (event.clientX - rect.left) / rect.width;
    this.videoPlayer.nativeElement.currentTime = pos * this.duration;

    this.syncSeek(this.videoPlayer.nativeElement.currentTime)
  }

  seekRelativePlayer(seconds: number): void {
    this.videoPlayer.nativeElement.currentTime = Math.min(
      this.duration,
      Math.max(0, this.currentTime + seconds)
    );
  }

  // 🔲 fullscreen

  async toggleFullscreenPlayer(): Promise<void> {
    try {
      if (!this.isFullscreen) {
        await this.playerContainer.nativeElement.requestFullscreen();
      } else {
        await this.document.exitFullscreen();
      }
    } catch (e) {
      this.handleFullscreenError(e);
    }
  }

  private fullscreenChangeHandler = () => {
    this.isFullscreen = !!this.document.fullscreenElement;
    this.cdRef.detectChanges();
  };

  private handleFullscreenError(error: unknown): void {
    console.warn('Fullscreen error:', error);
    if (this.isFullscreen) {
      this.isFullscreen = false;
      this.playerContainer.nativeElement.classList.remove('fullscreen-fallback');
    } else {
      this.isFullscreen = true;
      this.playerContainer.nativeElement.classList.add('fullscreen-fallback');
    }
    this.cdRef.detectChanges();
  }

  // ⌨️ горячие клавиши

  @HostListener('document:keydown', ['$event'])
  handleKeyboardShortcuts(event: KeyboardEvent): void {
    if (!this.isBrowser) return;

    switch (event.key.toLowerCase()) {
      case ' ':
      case 'k':
        event.preventDefault();
        this.togglePlayPlayer();
        break;
      case 'm':
        event.preventDefault();
        this.toggleMutePlayer();
        break;
      case 'f':
        event.preventDefault();
        this.toggleFullscreenPlayer();
        break;
      case 'arrowleft':
      case 'j':
        event.preventDefault();
        this.seekRelativePlayer(-5);
        break;
      case 'arrowright':
      case 'l':
        event.preventDefault();
        this.seekRelativePlayer(5);
        break;
      case 'arrowup':
        event.preventDefault();
        this.adjustVolumePlayer(0.1);
        break;
      case 'arrowdown':
        event.preventDefault();
        this.adjustVolumePlayer(-0.1);
        break;
    }
  }

  // 🕒 формат времени

  formatTime(seconds: number): string {
    if (isNaN(seconds)) return '0:00';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  }

  // 🎯 для отображения handle

  onProgressBarHover(hover: boolean): void {
    this.showHandle = hover;
    this.cdRef.detectChanges();
  }

  syncPause() {
    console.log('pause')
  }
  syncPlay() {
    console.log('play')
  }
  syncSeek(time:number) {
    console.log('seek: ',time)
  }
}
