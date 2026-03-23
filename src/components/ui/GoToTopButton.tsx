"use client";

import { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function GoToTopButton() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      // Show when scrolled down 300px
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
    // Remove hash from the URL
    if (window.location.hash) {
      history.replaceState(null, "", window.location.pathname);
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          whileHover={{
            scale: 1.05,
            boxShadow: "6px 6px 0px 0px rgba(0,0,0,1)",
            x: -2,
            y: -2,
          }}
          whileTap={{ scale: 0.95, boxShadow: "2px 2px 0px 0px rgba(0,0,0,1)", x: 2, y: 2 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 md:bottom-10 md:right-10 z-50 p-3 bg-white border-4 border-black text-black font-mono font-bold uppercase transition-transform flex items-center gap-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
          aria-label="Go to top"
        >
          <ArrowUp strokeWidth={3} className="w-5 h-5" />
          <span className="hidden sm:inline">TOP</span>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
