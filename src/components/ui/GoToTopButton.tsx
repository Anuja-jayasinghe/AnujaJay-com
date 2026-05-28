"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUp } from "lucide-react";

export default function GoToTopButton() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };
    
    toggleVisibility();

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
    if (window.location.hash) {
      history.replaceState(null, "", window.location.pathname);
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          // We apply the base rotation of 45deg to create the diamond shape
          // and layer hover scale / background color changes on top
          whileHover={{ 
            scale: 1.15,
            backgroundColor: "#000075", // Project accent color from Navbar
            boxShadow: "0 10px 25px -5px rgba(0, 0, 117, 0.4)" 
          }}
          whileTap={{ scale: 0.95 }}
          onClick={scrollToTop}
          className="fixed bottom-10 right-10 z-50 w-12 h-12 bg-black flex items-center justify-center cursor-pointer outline-none border-none shadow-xl transition-colors duration-300"
          style={{ rotate: 45, borderRadius: '8px' }}
          aria-label="Back to top"
        >
          {/* We must rotate the icon back -45deg so it points straight up */}
          <div className="-rotate-45 origin-center flex items-center justify-center">
            <ArrowUp className="text-white w-6 h-6" strokeWidth={2.5} />
          </div>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
