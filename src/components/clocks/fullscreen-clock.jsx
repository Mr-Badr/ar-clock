/* FullscreenClock.jsx - A reusable component that provides fullscreen and zoom controls for its children content. */
'use client';

import { useState, useRef, useEffect } from 'react';
import { Monitor, Minimize2, ZoomIn, ZoomOut } from 'lucide-react';

/**
 * Reusable wrapper that provides a "Fullscreen" (CSS Overlay + Browser API) toggle
 * with 3-step zoom controls (Smaller, Normal, Bigger) as requested.
 */
export default function FullscreenClock({ children, overlayContent, showExpandButton = true }) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1); // 0: Small, 1: Normal, 2: Large
  const containerRef = useRef(null);

  // Sync state with native fullscreen changes (e.g., exiting via 'Esc' key)
  useEffect(() => {
    const handleFullscreenChange = () => {
      const isNativeFullscreen = !!(
        document.fullscreenElement ||
        document.webkitFullscreenElement ||
        document.mozFullScreenElement ||
        document.msFullscreenElement
      );
      setIsFullscreen(isNativeFullscreen);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
    };
  }, []);

  const toggleFullscreen = async () => {
    if (!isFullscreen) {
      const element = containerRef.current;
      if (!element) return;

      try {
        if (element.requestFullscreen) {
          await element.requestFullscreen();
        } else if (element.webkitRequestFullscreen) {
          await element.webkitRequestFullscreen();
        } else if (element.mozRequestFullScreen) {
          await element.mozRequestFullScreen();
        } else if (element.msRequestFullscreen) {
          await element.msRequestFullscreen();
        }
        setZoomLevel(1); // Reset zoom when opening
      } catch (err) {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
        // Fallback to CSS-only fullscreen if API fails
        setIsFullscreen(true);
      }
    } else {
      try {
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
          await document.webkitExitFullscreen();
        } else if (document.mozCancelFullScreen) {
          await document.mozCancelFullScreen();
        } else if (document.msExitFullscreen) {
          await document.msExitFullscreen();
        }
      } catch (err) {
        console.error(`Error attempting to exit fullscreen: ${err.message}`);
        setIsFullscreen(false);
      }
    }
  };

  const zoomIn = () => setZoomLevel(prev => Math.min(prev + 1, 2));
  const zoomOut = () => setZoomLevel(prev => Math.max(prev - 1, 0));

  const getScale = () => {
    if (zoomLevel === 0) return 'scale-[0.7]';
    if (zoomLevel === 2) return 'scale-[1.3]';
    return 'scale-100';
  };

  const getZoomLabel = () => {
    if (zoomLevel === 0) return 'تصغير (صغير)';
    if (zoomLevel === 2) return 'تكبير (كبير)';
    return 'حجم عادي';
  };

  return (
    <div ref={containerRef} className="relative group bg-background w-full h-full">
      {/* Fullscreen Overlay */}
      {isFullscreen && (
      <div 
        className="fixed inset-0 text-foreground flex flex-col items-center justify-center z-[100]"
        style={{ backgroundColor: window.getComputedStyle(document.documentElement).getPropertyValue('--background') 
          ? `hsl(${window.getComputedStyle(document.documentElement).getPropertyValue('--background')})`
          : document.documentElement.classList.contains('dark') ? '#3737b3' : '#a7f8fb' }}
        dir="rtl"
      >
          {/* Controls Bar */}
          <div className="absolute top-8 right-8 left-8 flex justify-between items-center z-[110]">
             <div className="flex gap-2">
                <button
                  onClick={toggleFullscreen}
                  className="p-3 hover:bg-secondary rounded-xl transition-all text-foreground-muted hover:text-foreground shadow-lg backdrop-blur-md border border-border flex items-center gap-2"
                  title="إغلاق ملء الشاشة"
                >
                  <Minimize2 className="w-6 h-6" />
                  <span className="hidden sm:inline font-bold">إغلاق</span>
                </button>
             </div>

             <div className="flex items-center gap-2 bg-secondary/30 backdrop-blur-md p-1.5 rounded-2xl border border-border shadow-2xl">
                <button
                  onClick={zoomOut}
                  disabled={zoomLevel === 0}
                  className={`p-3 rounded-xl transition-all ${zoomLevel === 0 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-secondary text-primary hover:text-primary-dark'}`}
                  title="تصغير"
                >
                  <ZoomOut className="w-6 h-6" />
                </button>
                
                <div className="px-4 py-2 bg-background/50 rounded-lg border border-border/50 text-xs font-black min-w-[100px] text-center">
                  {getZoomLabel()}
                </div>

                <button
                  onClick={zoomIn}
                  disabled={zoomLevel === 2}
                  className={`p-3 rounded-xl transition-all ${zoomLevel === 2 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-secondary text-primary hover:text-primary-dark'}`}
                  title="تكبير"
                >
                  <ZoomIn className="w-6 h-6" />
                </button>
             </div>
          </div>

          <div className={`w-full h-full flex flex-col items-center justify-center p-4 transition-all duration-500 transform ease-in-out ${getScale()}`}>
            {overlayContent || children}
          </div>
        </div>
      )}

      {/* Normal View with Expand Button */}
      {!isFullscreen && showExpandButton && (
        <div className="absolute top-2 right-2 z-10">
          <button
            onClick={toggleFullscreen}
            className="p-2 hover:bg-secondary rounded-lg transition-colors text-foreground-muted hover:text-foreground"
            title="ملء الشاشة"
          >
            <Monitor className="w-4 h-4" />
          </button>
        </div>
      )}

      {!isFullscreen && children}
    </div>
  );
}
