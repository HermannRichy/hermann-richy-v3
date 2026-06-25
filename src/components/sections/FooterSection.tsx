import { IconArrowUp } from "@tabler/icons-react";

const links = [
    { href: "#apropos", label: "À propos" },
    { href: "#projets", label: "Projets" },
    { href: "#services", label: "Services" },
    { href: "#contact", label: "Contact" },
];

export default function FooterSection() {
    return (
        <footer className="bg-lime text-dark px-4 sm:px-8 lg:px-14 pt-16 pb-12 relative overflow-hidden">
            <div className="max-w-310 mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-end gap-8">

                {/* Brand */}
                <div>
                    <div className="flex items-center gap-3">
                        <svg width="28" height="28" viewBox="0 0 100 100" aria-hidden="true">
                            <path
                                d="M50 0 C54 32 68 46 100 50 C68 54 54 68 50 100 C46 68 32 54 0 50 C32 46 46 32 50 0 Z"
                                fill="#1E45FB"
                            />
                        </svg>
                        <span className="font-display text-[28px] sm:text-[30px] uppercase">
                            Hermann Richy
                        </span>
                    </div>
                    <p className="font-mono text-2xs tracking-[0.12em] uppercase text-muted mt-3 mb-0">
                        Fullstack · Frontend Master · Cotonou, BJ
                    </p>
                </div>

                {/* Right */}
                <div className="flex items-end gap-10">
                    <nav className="flex flex-col gap-2">
                        {links.map(({ href, label }) => (
                            <a
                                key={href}
                                href={href}
                                className="text-sm font-semibold text-dark no-underline hover:text-brand transition-colors"
                            >
                                {label}
                            </a>
                        ))}
                    </nav>

                    <div className="text-right">
                        <p className="font-jp font-bold text-lg text-brand mb-0">
                            最速、最高。
                        </p>
                        <a
                            href="#top"
                            className="inline-flex items-center gap-1.5 font-mono text-2xs text-dark no-underline mt-2.5 hover:text-brand transition-colors"
                        >
                            Haut de page <IconArrowUp size={15} />
                        </a>
                        <p className="font-mono text-2xs text-muted mt-2.5 mb-0">
                            © 2026 — Tous droits réservés
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
}
