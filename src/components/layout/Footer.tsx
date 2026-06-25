export default function Footer() {
    return (
        <footer className="w-full bg-white border-t border-black/5 py-4 px-8 font-mono">
            <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4 opacity-70 hover:opacity-100 transition-opacity">
                
                {/* LEFT: System Manifest */}
                <div className="flex flex-col gap-0.5">
                    <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                        <span className="text-[10px] font-bold text-black uppercase tracking-[0.2em]">SYSTEM_KERNEL::STABLE</span>
                    </div>
                    <p className="text-[9px] text-gray-400 uppercase tracking-widest">
                        BUILD_ID: <span className="text-gray-600 font-black">AJ_PROT_V2.2.0</span>
                    </p>
                </div>

                {/* CENTER: Identity Hash */}
                <div className="text-center md:text-left">
                    <p className="text-[10px] font-black text-black tracking-tighter uppercase underline decoration-accent decoration-2 underline-offset-2">
                        DESIGNED_&_ENGINEERED_BY_ANUJA_JAYASINGHE
                    </p>
                    <p className="text-[7px] text-gray-400 font-bold uppercase tracking-[0.3em] mt-0.5">
                        AUTH_HASH: 0x717B92A4...E82
                    </p>
                </div>

                {/* RIGHT: Production Stamp */}
                <div className="flex flex-col items-center md:items-end gap-1">
                    <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest leading-none">
                        PRODUCTION_ERA::{new Date().getFullYear()}_CYCLE
                    </span>
                    <div className="flex gap-1">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="w-4 h-1 bg-gray-100 rounded-full" />
                        ))}
                    </div>
                </div>
            </div>

            {/* Micro-Copyright */}
            <div className="mt-4 pt-4 border-t border-black/5 text-center">
                <span className="text-[8px] text-gray-300 font-bold uppercase tracking-widest">
                    © {new Date().getFullYear()} ALL_RIGHTS_RESERVED // ENCRYPTION_ACTIVE
                </span>
            </div>
        </footer>
    );
}
