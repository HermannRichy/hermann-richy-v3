interface SkillBar { icon: string; label: string; value: number }

const frontend: SkillBar[] = [
  { icon: "ti-brand-react",     label: "React / Next.js", value: 95 },
  { icon: "ti-brand-typescript",label: "TypeScript",       value: 90 },
  { icon: "ti-bolt",            label: "GSAP / Motion",    value: 88 },
  { icon: "ti-brand-tailwind",  label: "Tailwind / CSS",   value: 92 },
];

const backend: SkillBar[] = [
  { icon: "ti-brand-nodejs", label: "Node.js / Express",  value: 85 },
  { icon: "ti-database",     label: "PostgreSQL / Prisma", value: 80 },
  { icon: "ti-api",          label: "API REST / tRPC",     value: 82 },
  { icon: "ti-cloud",        label: "Docker / Deploy",     value: 75 },
];

function BarGroup({
  skills, barColor, dotColor, title, pct, delay,
}: {
  skills: SkillBar[];
  barColor: string;
  dotColor: string;
  title: string;
  pct: string;
  delay?: number;
}) {
  return (
    <div
      data-reveal
      {...(delay ? { "data-delay": delay } : {})}
    >
      <div className="flex items-center gap-2.5 mb-6">
        <span className={`w-3 h-3 rounded-full ${dotColor}`} />
        <span className="font-display text-[26px] uppercase">{title}</span>
        <span className="font-mono text-2xs text-white/50">{pct}</span>
      </div>

      <div className="flex flex-col gap-4.5">
        {skills.map((s) => (
          <div key={s.label}>
            <div className="flex justify-between mb-1.75">
              <span className="flex items-center gap-2 font-semibold text-sm sm:text-[15px]">
                <i className={`ti ${s.icon} text-xl text-lime`} />
                {s.label}
              </span>
              <span className="font-mono text-2xs text-white/50">{s.value}%</span>
            </div>
            <div className="h-2.5 bg-[#1F1F1F] rounded-full overflow-hidden">
              <div
                data-bar={`${s.value}%`}
                className={`w-0 h-full ${barColor} rounded-full`}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function StackSection() {
  return (
    <section className="bg-dark text-white px-4 sm:px-8 lg:px-14 py-16 lg:py-30">
      <div className="max-w-310 mx-auto">
        <div data-reveal className="mb-12">
          <p className="font-mono text-2xs tracking-[0.14em] uppercase text-lime">
            03 — Stack technique
          </p>
          <h2 className="font-display text-[clamp(2.5rem,7vw,4.5rem)] uppercase leading-[0.9] mt-4 mb-0">
            Mes outils
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-12">
          <BarGroup skills={frontend} barColor="bg-brand" dotColor="bg-brand" title="Frontend" pct="60%" />
          <BarGroup skills={backend}  barColor="bg-lime"  dotColor="bg-lime"  title="Backend"  pct="40%" delay={120} />
        </div>
      </div>
    </section>
  );
}
