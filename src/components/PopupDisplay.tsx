import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';
import { PopupItem } from '../types';
import { getDirectImageUrl } from '../utils/imageUtils';

interface PopupDisplayProps {
  popups: PopupItem[];
}

export default function PopupDisplay({ popups }: PopupDisplayProps) {
  const [activePopups, setActivePopups] = useState<PopupItem[]>([]);
  const [checkedPopups, setCheckedPopups] = useState<Record<string, boolean>>({});
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    // Filter active popups and check localStorage "do not show today" dismissal
    const now = new Date();
    const todayStr = now.toISOString().split('T')[0]; // YYYY-MM-DD

    const visible = popups.filter((pop) => {
      if (!pop.isActive) return false;
      
      const dismissalDate = localStorage.getItem(`dadm_dismiss_popup_${pop.id}`);
      if (dismissalDate === todayStr) {
        return false; // Dismissed for today
      }
      return true;
    });

    setActivePopups(visible);
  }, [popups]);

  const toggleDismissTodayChecked = (id: string) => {
    setCheckedPopups((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleClose = (id: string) => {
    if (checkedPopups[id]) {
      const todayStr = new Date().toISOString().split('T')[0];
      localStorage.setItem(`dadm_dismiss_popup_${id}`, todayStr);
    }
    setActivePopups((prev) => prev.filter((p) => p.id !== id));
  };

  if (activePopups.length === 0) return null;

  return (
    <>
      {/* Popups overlay wrapper */}
      <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden" id="popups-container">
        <AnimatePresence>
          {activePopups.map((pop, index) => {
            // Apply dynamic sizing: use flexible layout on mobile and fixed pixel dimensions on desktop
            const responsiveStyle: React.CSSProperties = isMobile
              ? {
                  maxHeight: '85vh',
                }
              : {
                  width: `${pop.width || 400}px`,
                  height: `${pop.height || 500}px`,
                  left: `${pop.left !== undefined ? pop.left + index * 20 : 80 + index * 20}px`,
                  top: `${pop.top !== undefined ? pop.top + index * 10 : 120 + index * 10}px`,
                };

            return (
              <motion.div
                key={pop.id}
                initial={{ opacity: 0, scale: 0.95, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -15 }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
                className="pointer-events-auto fixed md:absolute bg-white rounded-3xl shadow-2xl border border-neutral-200 overflow-hidden flex flex-col justify-between
                           inset-x-4 mx-auto max-w-[420px] bottom-6 md:bottom-auto md:inset-auto md:max-w-none"
                style={{
                  ...responsiveStyle,
                  zIndex: 100 + index,
                }}
                id={`popup-card-${pop.id}`}
              >
                {/* Close Button at top-right over image if exists */}
                <button
                  onClick={() => handleClose(pop.id)}
                  className="absolute top-4 right-4 z-20 bg-neutral-950/40 hover:bg-neutral-950/70 text-white p-1.5 rounded-full backdrop-blur-xs transition-colors cursor-pointer"
                  title="닫기"
                  id={`popup-close-btn-${pop.id}`}
                >
                  <X size={16} className="stroke-[2.5px]" />
                </button>

                {/* Content Container (Scrollable body if content overflows) */}
                <div className="flex-grow flex flex-col overflow-y-auto">
                  
                  {/* Image section */}
                  {pop.imageUrl && (
                    <div className="relative w-full aspect-16/10 bg-neutral-100 shrink-0 border-b border-neutral-100">
                      {pop.linkUrl ? (
                        <a href={pop.linkUrl} target="_blank" rel="noopener noreferrer" className="block w-full h-full">
                          <img
                            src={getDirectImageUrl(pop.imageUrl)}
                            alt={pop.title}
                            className="w-full h-full object-cover hover:scale-[1.02] transition-transform duration-300"
                            referrerPolicy="no-referrer"
                          />
                        </a>
                      ) : (
                        <img
                          src={getDirectImageUrl(pop.imageUrl)}
                          alt={pop.title}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      )}
                    </div>
                  )}

                  {/* Text section */}
                  <div className="p-5 sm:p-6 space-y-3 flex-grow flex flex-col justify-between">
                    <div className="space-y-2">
                      <h3 className="text-base font-black text-neutral-950 font-sans tracking-tight leading-snug">
                        {pop.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-neutral-600 font-sans leading-relaxed whitespace-pre-wrap">
                        {pop.content}
                      </p>
                    </div>

                    {/* CTA Link (if available) */}
                    {pop.linkUrl && (
                      <div className="pt-2">
                        <a
                          href={pop.linkUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center w-full bg-neutral-900 hover:bg-neutral-800 text-white font-sans font-bold text-xs py-2.5 rounded-xl transition-all shadow-xs"
                        >
                          자세히 보기
                        </a>
                      </div>
                    )}
                  </div>
                </div>

                {/* Bottom Dismiss / Close rail */}
                <div className="bg-neutral-50 px-5 py-3 border-t border-neutral-100 flex items-center justify-between text-xs font-sans text-neutral-500 shrink-0">
                  <button
                    onClick={() => toggleDismissTodayChecked(pop.id)}
                    className="flex items-center space-x-1.5 hover:text-neutral-900 cursor-pointer transition-colors"
                    id={`popup-dismiss-today-${pop.id}`}
                  >
                    <input
                      type="checkbox"
                      checked={!!checkedPopups[pop.id]}
                      onChange={(e) => {
                        e.stopPropagation();
                        toggleDismissTodayChecked(pop.id);
                      }}
                      className="h-3.5 w-3.5 accent-neutral-800 rounded border-neutral-300 cursor-pointer"
                    />
                    <span className="font-semibold text-[11px] select-none">오늘 하루 동안 보지 않기</span>
                  </button>

                  <button
                    onClick={() => handleClose(pop.id)}
                    className="font-bold text-neutral-800 hover:text-neutral-950 px-2.5 py-1 hover:bg-neutral-200/50 rounded-lg transition-all cursor-pointer"
                  >
                    닫기
                  </button>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </>
  );
}
