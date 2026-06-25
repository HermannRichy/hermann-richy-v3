interface Milestone {
    year: string;
    title: string;
    company: string;
    role: string;
    desc: string;
}

const milestones: Milestone[] = [
    {
        year: "2021",
        title: "PHP & Bootstrap",
        company: "Freelance",
        role: "Développeur Web",
        desc: "Premières missions clients, fondamentaux serveur, initiation à l'architecture web.",
    },
    {
        year: "2022",
        title: "React, Tailwind & Firebase",
        company: "FuturCraft Institut — Godomey",
        role: "Dev & Formateur",
        desc: "Passage au frontend moderne. Début de la formation des développeurs juniors.",
    },
    {
        year: "2023",
        title: "Next.js & Node.js / Express",
        company: "Cefora Formation — Agla",
        role: "Formateur & Lead Dev",
        desc: "Stack fullstack professionnelle. Lead dev sur projets clients complexes.",
    },
    {
        year: "Jan 2024",
        title: "CEO — Digital Innovation",
        company: "Digital Innovation",
        role: "CEO",
        desc: "Fondation et direction de la startup tech. Pilotage des équipes et des projets.",
    },
    {
        year: "Mai 2024",
        title: "Responsable Web",
        company: "Programme FUTUR",
        role: "Lead Dev",
        desc: "Direction technique des projets web. GSAP & Three.js au cœur des productions.",
    },
];

export default function TimelineSection() {
    return (
        <section
            id="parcours"
            className="relative overflow-hidden bg-dark text-white"
            style={{ height: "100vh" }}
        >
            {/* Header */}
            <div className="absolute top-0 left-0 right-0 z-10 px-4 sm:px-8 lg:px-14 pt-10">
                <p className="font-mono text-2xs tracking-[0.14em] uppercase text-lime m-0">
                    // Parcours professionnel
                </p>
            </div>

            {/* Stacked cards — each one covers the full section */}
            {milestones.map((m, i) => (
                <div
                    key={m.year}
                    data-timeline-card
                    className="absolute inset-0 flex items-center px-4 sm:px-8 lg:px-14"
                >
                    <div className="max-w-310 mx-auto w-full grid grid-cols-1 lg:grid-cols-[160px_1fr] gap-6 lg:gap-16 items-center">

                        {/* Step number — large ghost digit */}
                        <div className="hidden lg:block text-right select-none">
                            <span className="font-display leading-none text-white/8 tabular-nums"
                                style={{ fontSize: "clamp(5rem,12vw,9rem)" }}>
                                {String(i + 1).padStart(2, "0")}
                            </span>
                        </div>

                        {/* Content */}
                        <div>
                            <span className="font-mono text-2xs tracking-[0.18em] uppercase text-lime/70 block mb-4">
                                {m.year}
                            </span>

                            <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                                <h3 className="font-display uppercase leading-[0.9] m-0 text-white"
                                    style={{ fontSize: "clamp(1.6rem,4.5vw,3rem)" }}>
                                    {m.title}
                                </h3>
                                <span className="font-mono text-2xs tracking-wide uppercase bg-lime text-dark px-3.5 py-1.5 rounded-full font-bold whitespace-nowrap self-start mt-1">
                                    {m.role}
                                </span>
                            </div>

                            <p className="font-mono text-sm text-white/40 mb-5">
                                {m.company}
                            </p>

                            <p className="text-lg sm:text-xl leading-[1.55] text-white/70 mb-0 max-w-120">
                                {m.desc}
                            </p>
                        </div>
                    </div>
                </div>
            ))}

            {/* Static progress dots */}
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-2.5 z-10">
                {milestones.map((_, i) => (
                    <div
                        key={i}
                        data-timeline-dot={i}
                        className="h-2 rounded-full"
                        style={{
                            width: i === 0 ? "20px" : "8px",
                            backgroundColor: i === 0 ? "#CDF22B" : "rgba(255,255,255,0.25)",
                        }}
                    />
                ))}
            </div>
        </section>
    );
}
