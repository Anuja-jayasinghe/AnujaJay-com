"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Github, Linkedin, Mail, Menu, X } from "lucide-react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";

function FullscreenMenu({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
    // Lock body scroll when menu is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isOpen]);

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
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                    className="fixed inset-0 z-[200] bg-black flex flex-col items-center justify-center"
                    style={{ width: "100vw", height: "100vh", top: 0, left: 0 }}
                >
                    {/* Close Button - Top Right */}
                    <button
                        onClick={onClose}
                        className="absolute top-6 right-6 sm:top-8 sm:right-8 text-white hover:text-blue-500 transition-colors p-2 rounded-lg hover:bg-white/10"
                        aria-label="Close Menu"
                    >
                        <X className="w-8 h-8 sm:w-10 sm:h-10" />
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

    return (
        <>
            <header className="fixed top-0 z-50 w-full font-mono">
                <div className="w-full px-4 sm:px-8 md:px-12 h-16 sm:h-20 md:h-24 flex items-center justify-between">

                    {/* LEFT: Logo */}
                    <Link 
                        href="/" 
                        onClick={(e) => {
                            if (window.location.pathname === '/' || window.location.hash) {
                                e.preventDefault();
                                window.scrollTo({ top: 0, behavior: "smooth" });
                                // Optional: remove hash from URL
                                history.replaceState(null, '', '/');
                            }
                        }}
                        className="hover:opacity-80 transition-opacity block py-2"
                    >
                        <Image
                            src="/logo-black.svg"
                            alt="Anuja Logo"
                            width={180}
                            height={60}
                            className="w-32 sm:w-40 md:w-56 h-auto object-contain drop-shadow-sm"
                            priority
                        />
                    </Link>

                    {/* RIGHT: Social Icons + Hamburger */}
                    <div className="flex items-center gap-6">
                        <div className="hidden sm:flex items-center gap-6 mr-2">
                            <Link href="https://github.com/Anuja-jayasinghe" target="_blank" className="text-black hover:text-accent transition-colors">
                                <Github className="w-6 h-6" />
                            </Link>
                            <Link href="https://linkedin.com/in/anuja-jayasinghe" target="_blank" className="text-black hover:text-accent transition-colors">
                                <Linkedin className="w-6 h-6" />
                            </Link>
                            <Link href="mailto:anujajayasinhe@gmail.com" className="text-black hover:text-accent transition-colors">
                                <Mail className="w-6 h-6" />
                            </Link>
                        </div>

                        <button
                            onClick={() => setIsMenuOpen(true)}
                            className="text-black hover:text-accent transition-colors p-2 -mr-2 rounded-lg hover:bg-black/5"
                            aria-label="Open Menu"
                        >
                            <Menu className="w-10 h-10" />
                        </button>
                    </div>
                </div>
            </header>

            {/* Fullscreen Menu - rendered via portal to document.body */}
            <FullscreenMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

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
