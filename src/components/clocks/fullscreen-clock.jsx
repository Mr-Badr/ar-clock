/* FullscreenClock.jsx - A reusable component that provides fullscreen and zoom controls for its children content. */
'use client';

import { useState, useRef, useEffect } from 'react';
import { Fullscreen, Minimize2, ZoomIn, ZoomOut } from 'lucide-react';
import {
  exitActiveFullscreen,
  getActiveFullscreenElement,
  requestElementFullscreen,
  syncFullscreenDocumentState,
} from './fullscreenShared';

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
      const isNativeFullscreen = !!getActiveFullscreenElement();
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

  useEffect(() => {
    syncFullscreenDocumentState(isFullscreen);
    return () => syncFullscreenDocumentState(false);
  }, [isFullscreen]);

  const toggleFullscreen = async () => {
    if (!isFullscreen) {
      const element = containerRef.current;
      if (!element) return;

      setZoomLevel(1);
      await requestElementFullscreen(element);
      setIsFullscreen(true);
    } else {
      await exitActiveFullscreen();
      setIsFullscreen(false);
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
    <div ref={containerRef} className="relative group bg-base w-full h-full">
      {/* Fullscreen Overlay */}
      {isFullscreen && (
        <div
          className="fullscreen-mode text-primary"
          style={{ backgroundColor: 'var(--bg-base)' }}
          dir="rtl"
        >
          {/* Controls Bar */}
          <div className="absolute top-8 right-8 left-8 flex justify-between items-center z-[110]">
            <div className="flex gap-2">
              <button
                onClick={toggleFullscreen}
                className="p-3 hover:bg-surface-3 rounded-xl transition-all text-muted hover:text-primary shadow-lg backdrop-blur-md border border-border flex items-center gap-2"
                title="إغلاق ملء الشاشة"
              >
                <Minimize2 className="w-6 h-6" />
                <span className="hidden sm:inline font-bold">إغلاق</span>
              </button>
            </div>

            <div className="flex items-center gap-2 bg-surface-3/30 backdrop-blur-md p-1.5 rounded-2xl border border-border shadow-2xl">
              <button
                onClick={zoomOut}
                disabled={zoomLevel === 0}
                className={`p-3 rounded-xl transition-all ${zoomLevel === 0 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-surface-3 text-accent hover:text-accent-hover'}`}
                title="تصغير"
              >
                <ZoomOut className="w-6 h-6" />
              </button>

              <div className="px-4 py-2 bg-base/50 rounded-lg border border-border/50 text-xs font-black min-w-[100px] text-center">
                {getZoomLabel()}
              </div>

              <button
                onClick={zoomIn}
                disabled={zoomLevel === 2}
                className={`p-3 rounded-xl transition-all ${zoomLevel === 2 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-surface-3 text-accent hover:text-accent-hover'}`}
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
            className="p-2 hover:bg-surface-3 rounded-lg transition-colors text-muted hover:text-primary"
            title="ملء الشاشة"
          >
            <Fullscreen className="w-4 h-4" />
          </button>
        </div>
      )}

      {!isFullscreen && children}
    </div>
  );
}
