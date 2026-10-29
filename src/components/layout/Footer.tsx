import pkg from "../../../package.json";

const REPO_URL = "https://github.com/Anuja-jayasinghe/AnujaJay-com";

export default function Footer() {
    const commitSha = process.env.NEXT_PUBLIC_COMMIT_SHA;
    const builtOn = process.env.NEXT_PUBLIC_BUILD_TIME?.slice(0, 10);

    return (
        <footer className="w-full bg-white border-t border-black/5 py-4 font-mono">
            <div className="site-shell flex flex-col xl:flex-row items-center justify-between gap-4 opacity-70 hover:opacity-100 focus-within:opacity-100 transition-opacity">

                {/* LEFT: System Manifest */}
                <div className="flex flex-col gap-0.5">
                    <div className="flex items-center gap-2" aria-hidden="true">
                        <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                        <span className="text-[10px] font-bold text-black uppercase tracking-[0.2em]">SYSTEM_KERNEL::STABLE</span>
                    </div>
                    <p className="text-[11px] text-gray-500 uppercase tracking-widest">
                        BUILD_ID: <span className="text-gray-700 font-black">AJ_PROT_V{pkg.version}</span>
                    </p>
                </div>

                {/* CENTER: Identity + real build info */}
                <div className="text-center xl:text-left">
                    <p className="text-[11px] font-black text-black tracking-tighter uppercase underline decoration-accent decoration-2 underline-offset-2">
                        DESIGNED_&_ENGINEERED_BY_ANUJA_JAYASINGHE
                    </p>
                    <p className="text-[11px] text-gray-500 font-bold uppercase tracking-[0.2em] mt-0.5">
                        {commitSha ? (
                            <>
                                COMMIT:{" "}
                                <a
                                    href={`${REPO_URL}/commit/${commitSha}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-700 hover:underline"
                                >
                                    {commitSha.slice(0, 7)}
                                </a>
                                {builtOn && <> · BUILT {builtOn}</>}
                            </>
                        ) : (
                            <>LOCAL_BUILD{builtOn && <> · {builtOn}</>}</>
                        )}
                    </p>
                </div>

                {/* RIGHT: Production Stamp */}
                <div className="flex flex-col items-center xl:items-end gap-1" aria-hidden="true">
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest leading-none">
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
                <span className="text-[11px] text-gray-500 font-bold uppercase tracking-widest">
                    © {new Date().getFullYear()} ALL_RIGHTS_RESERVED
                </span>
            </div>
        </footer>
    );
}
