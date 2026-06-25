const StarPath =
  "M50 0 C54 32 68 46 100 50 C68 54 54 68 50 100 C46 68 32 54 0 50 C32 46 46 32 50 0 Z";

const stats = [
  { count: 5,  suffix: "+", label: "Années d'expérience web",     delay: undefined },
  { count: 50, suffix: "+", label: "Projets développés",          delay: 80 },
  { count: 4,  suffix: "+", label: "Années à former les devs",    delay: 160 },
  { count: 98, suffix: "",  label: "Score Lighthouse moyen",      delay: 240 },
];

export default function NumbersSection() {
  return (
    <section className="relative overflow-hidden bg-brand text-white px-4 sm:px-8 lg:px-14 py-20 lg:py-25">
      <svg
        data-parallax="60"
        width="180"
        height="180"
        viewBox="0 0 100 100"
        aria-hidden="true"
        className="absolute -top-8 -left-8 opacity-35"
      >
        <path d={StarPath} fill="#CDF22B" />
      </svg>

      {/* Japanese watermark */}
      <div aria-hidden="true" className="absolute inset-0 flex items-center justify-center select-none pointer-events-none overflow-hidden">
        <span className="font-jp font-black text-[clamp(5rem,18vw,13rem)] text-white/5 leading-none whitespace-nowrap">
          実績
        </span>
      </div>

      <div className="max-w-310 mx-auto grid grid-cols-2 lg:grid-cols-4 gap-5 relative z-2">
        {stats.map(({ count, suffix, label, delay }) => (
          <div
            key={label}
            data-reveal
            {...(delay ? { "data-delay": delay } : {})}
          >
            <div className="font-display text-[clamp(3.5rem,10vw,6rem)] leading-[0.85] text-lime">
              <span data-count={count} data-suffix={suffix}>
                {count}{suffix}
              </span>
            </div>
            <p className="text-sm sm:text-base text-white/85 mt-3 mb-0 max-w-50">
              {label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
