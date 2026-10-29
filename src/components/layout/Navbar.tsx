"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { Github, Linkedin, Mail, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";

const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

function FullscreenMenu({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
    const dialogRef = useRef<HTMLDivElement>(null);

    // Lock body scroll when menu is open, restoring whatever was set before
    useEffect(() => {
        if (!isOpen) return;
        const previous = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = previous;
        };
    }, [isOpen]);

    // Move focus into the dialog, close on Escape, keep Tab inside, then
    // hand focus back to whatever opened the menu.
    useEffect(() => {
        if (!isOpen) return;
        const opener = document.activeElement as HTMLElement | null;
        dialogRef.current?.querySelector<HTMLElement>("button")?.focus();

        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                onClose();
                return;
            }
            if (event.key !== "Tab" || !dialogRef.current) return;
            const items = Array.from(dialogRef.current.querySelectorAll<HTMLElement>(FOCUSABLE));
            if (items.length === 0) return;
            const first = items[0];
            const last = items[items.length - 1];
            if (event.shiftKey && document.activeElement === first) {
                event.preventDefault();
                last.focus();
            } else if (!event.shiftKey && document.activeElement === last) {
                event.preventDefault();
                first.focus();
            }
        };

        document.addEventListener("keydown", onKeyDown);
        return () => {
            document.removeEventListener("keydown", onKeyDown);
            opener?.focus();
        };
    }, [isOpen, onClose]);

    const navLinks = [
        { name: "Home", href: "#home" },
        { name: "RealMe", href: "#about" },
        { name: "Projects", href: "#portfolio" },
        { name: "Mini Projects", href: "#mini-projects" },
        { name: "Certifications", href: "#certifications" },
        { name: "Contact", href: "#contact" },
    ];

    if (typeof document === "undefined") return null;

    return createPortal(
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    ref={dialogRef}
                    role="dialog"
                    aria-modal="true"
                    aria-label="Site menu"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                    className="fixed inset-0 z-[200] h-dvh bg-black flex flex-col items-center justify-center"
                >
                    {/* Close Button - Top Right */}
                    <button
                        onClick={onClose}
                        className="absolute top-6 right-6 sm:top-8 sm:right-8 text-white hover:text-blue-500 transition-colors p-2 rounded-lg hover:bg-white/10"
                        aria-label="Close Menu"
                    >
                        <X className="w-8 h-8 sm:w-10 sm:h-10" aria-hidden="true" />
                    </button>

                    {/* Navigation Links */}
                    <nav className="flex flex-col gap-4 sm:gap-6 md:gap-8 text-center px-4 max-h-[85vh] overflow-y-auto no-scrollbar">
                        {navLinks.map((link, i) => (
                            <motion.div
                                key={link.name}
                                initial={{ opacity: 0, y: 40 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.15 + i * 0.1, duration: 0.5, ease: "easeOut" }}
                            >
                                <Link href={link.href} onClick={onClose}>
                                    <motion.span
                                        whileHover={{ scale: 1.15, x: 15, color: "#000075" }}
                                        transition={{ type: "spring", stiffness: 400, damping: 15 }}
                                        className="inline-block text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold font-sans text-white tracking-tighter cursor-pointer uppercase"
                                    >
                                        {link.name}
                                    </motion.span>
                                </Link>
                            </motion.div>
                        ))}
                    </nav>
                </motion.div>
            )}
        </AnimatePresence>,
        document.body
    );
}

export default function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    // Recent logo click times, for the 5-clicks-replays-the-intro easter egg.
    const logoClicks = useRef<number[]>([]);
    // Stable identity: the menu's focus effect depends on it, and this
    // component re-renders on every scroll threshold change.
    const closeMenu = useCallback(() => setIsMenuOpen(false), []);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20);
        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    return (
        <>
            {/* Once scrolled, a frosted backdrop keeps the floating logo and menu button from overlapping page text. */}
            <header className={`fixed top-0 z-50 w-full font-mono pointer-events-none transition-[background-color,box-shadow] duration-300 ${
                scrolled ? "bg-white/85 backdrop-blur-md shadow-[0_1px_0_rgba(0,0,0,0.06)]" : ""
            }`}>
                <div className={`site-shell flex items-center justify-between transition-[height] duration-300 ${
                    scrolled ? "h-14 sm:h-16" : "h-16 sm:h-20 md:h-24"
                }`}>

                    {/* LEFT: Logo — always floating */}
                    <Link
                        href="/"
                        onClick={(e) => {
                            // Easter egg: five quick clicks replay the signature intro.
                            const now = Date.now();
                            logoClicks.current = [...logoClicks.current, now].filter((t) => now - t < 2000);
                            if (logoClicks.current.length >= 5) {
                                logoClicks.current = [];
                                e.preventDefault();
                                // Full reload on purpose: the splash reads ?intro=replay only on mount,
                                // so a client-side router push would not replay it.
                                // eslint-disable-next-line @next/next/no-location-assign-relative-destination
                                window.location.href = "/?intro=replay";
                                return;
                            }
                            if (window.location.pathname === '/' || window.location.hash) {
                                e.preventDefault();
                                window.scrollTo({ top: 0, behavior: "smooth" });
                                history.replaceState(null, '', '/');
                            }
                        }}
                        aria-label="Anuja Jayasinghe, back to top"
                        className="block py-2 pointer-events-auto"
                    >
                        <motion.img
                            src="/logo-black.svg"
                            alt=""
                            animate={{
                                width: scrolled ? 120 : 200,
                                opacity: scrolled ? 0.55 : 1,
                            }}
                            whileHover={{ opacity: scrolled ? 0.85 : 0.75 }}
                            transition={{
                                width:   { type: "spring", stiffness: 40, damping: 18 },
                                opacity: { type: "spring", stiffness: 40, damping: 18 },
                            }}
                            style={{
                                height: "auto",
                                maxWidth: "42vw",
                                objectFit: "contain",
                                filter: "drop-shadow(0 1px 4px rgba(255,255,255,0.9))",
                            }}
                        />
                    </Link>

                    {/* RIGHT: Social Icons (hide on scroll) + Hamburger */}
                    <div className="flex items-center gap-6 pointer-events-auto">
                        <div className={`hidden sm:flex items-center gap-6 mr-2 transition-all duration-300 ${
                            scrolled ? "opacity-0 pointer-events-none" : "opacity-100"
                        }`}>
                            <Link href="https://github.com/Anuja-jayasinghe" target="_blank" rel="noopener noreferrer" aria-label="GitHub profile (opens in a new tab)" className="text-black hover:text-accent transition-colors">
                                <Github className="w-6 h-6" aria-hidden="true" />
                            </Link>
                            <Link href="https://linkedin.com/in/anuja-jayasinghe" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn profile (opens in a new tab)" className="text-black hover:text-accent transition-colors">
                                <Linkedin className="w-6 h-6" aria-hidden="true" />
                            </Link>
                            <Link href="mailto:anujajayasinhe@gmail.com" aria-label="Send an email" className="text-black hover:text-accent transition-colors">
                                <Mail className="w-6 h-6" aria-hidden="true" />
                            </Link>
                        </div>

                        <button
                            onClick={() => setIsMenuOpen(true)}
                            className="text-black hover:text-accent transition-colors p-2 -mr-2 rounded-lg hover:bg-black/5"
                            aria-label="Open Menu"
                        >
                            <Menu className="w-10 h-10" aria-hidden="true" />
                        </button>
                    </div>
                </div>
            </header>

            {/* Fullscreen Menu - rendered via portal to document.body */}
            <FullscreenMenu isOpen={isMenuOpen} onClose={closeMenu} />

            <style jsx global>{`
                .no-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .no-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}</style>
        </>
    );
}
