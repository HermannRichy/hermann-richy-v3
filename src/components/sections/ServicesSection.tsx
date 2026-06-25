const services = [
    {
        icon: "ti-code",
        title: "Développement Frontend",
        desc: "Interfaces React / Next.js propres, typées et maintenables, du composant à l'app complète.",
        iconBg: "bg-brand",
        delay: undefined,
    },
    {
        icon: "ti-server-bolt",
        title: "Backend & API",
        desc: "API REST / tRPC, base de données et logique métier solides avec Node.js.",
        iconBg: "bg-purple",
        delay: 100,
    },
    {
        icon: "ti-bolt",
        title: "Animation & Motion",
        desc: "Micro-interactions et storytelling au scroll avec GSAP, pour des sites qui prennent vie.",
        iconBg: "bg-brand",
        delay: undefined,
    },
    {
        icon: "ti-gauge",
        title: "Performance & SEO",
        desc: "Des sites taillés pour le 100/100 Lighthouse : rapides, accessibles, bien référencés.",
        iconBg: "bg-purple",
        delay: 100,
    },
];

export default function ServicesSection() {
    return (
        <section
            id="services"
            className="bg-lime text-dark px-4 sm:px-8 lg:px-14 py-16 lg:py-30"
        >
            <div className="max-w-310 mx-auto">
                <div data-reveal className="mb-12">
                    <p className="font-mono text-2xs tracking-[0.14em] uppercase text-brand">
                        04 — Services
                    </p>
                    <h2 className="font-display text-[clamp(2.5rem,7vw,4.5rem)] uppercase leading-[0.9] mt-4 mb-0">
                        Ce que je fais
                    </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {services.map(({ icon, title, desc, iconBg, delay }) => (
                        <div
                            key={title}
                            data-reveal
                            {...(delay ? { "data-delay": delay } : {})}
                            className="bg-white border-brutal rounded-[22px] p-8 shadow-brutal"
                        >
                            <div
                                className={`flex items-center justify-center w-15.5 h-15.5 ${iconBg} rounded-2xl mb-5`}
                            >
                                <i
                                    className={`ti ${icon} text-[32px] text-white`}
                                />
                            </div>
                            <h3 className="font-display text-[26px] sm:text-[30px] uppercase mt-0 mb-2.5">
                                {title}
                            </h3>
                            <p className="text-sm sm:text-base leading-[1.55] text-muted m-0">
                                {desc}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
