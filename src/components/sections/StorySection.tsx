const StarPath =
  "M50 0 C54 32 68 46 100 50 C68 54 54 68 50 100 C46 68 32 54 0 50 C32 46 46 32 50 0 Z";

const lines = [
  { key: "l1", before: "Je dessine l'interface.", accent: null },
  { key: "l2", before: "Je code ", accent: "l'API", after: "." },
  { key: "l3", before: "Je déploie le tout.", accent: null },
  { key: "l4", before: "Vite. Bien. Animé.", accent: null, special: true },
];

export default function StorySection() {
  return (
    <section
      id="intro"
      className="relative overflow-hidden bg-dark text-white min-h-screen flex items-center px-4 sm:px-8 lg:px-14 py-20"
    >
      <svg
        data-parallax="80"
        width="220"
        height="220"
        viewBox="0 0 100 100"
        aria-hidden="true"
        className="absolute -bottom-12 -right-10 opacity-50"
      >
        <path d={StarPath} fill="#1E45FB" />
      </svg>

      {/* Japanese watermark */}
  <div aria-hidden="true" className="absolute bottom-0 right-0 select-none pointer-events-none overflow-hidden">
    <span className="font-jp font-black text-[clamp(4rem,14vw,10rem)] text-white/5 leading-none whitespace-nowrap">
      仕事の流儀
    </span>
  </div>

  <div className="max-w-310 mx-auto w-full relative z-2">
        <p className="font-mono text-2xs tracking-[0.14em] uppercase text-lime mb-10">
          // Ma façon de travailler
        </p>

        <div className="flex flex-col gap-2">
          {lines.map(({ key, before, accent, after, special }) => (
            <div
              key={key}
              data-story-line
              className={[
                "font-display uppercase leading-[0.98]",
                "text-[clamp(2.25rem,8vw,5.5rem)]",
                special ? "text-brand [--webkit-text-stroke:2px_#CDF22B]" : "",
              ]
                .filter(Boolean)
                .join(" ")}
              style={special ? { WebkitTextStroke: "2px #CDF22B" } : undefined}
            >
              {accent ? (
                <>
                  {before}
                  <span className="text-lime">{accent}</span>
                  {after}
                </>
              ) : (
                before
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
