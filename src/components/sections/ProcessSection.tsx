const steps = [
  { icon: "ti-compass", num: "01", title: "Découverte",    desc: "On cadre l'objectif, l'audience et les contraintes du projet.", delay: undefined },
  { icon: "ti-pencil",  num: "02", title: "Design",        desc: "Maquette Figma, direction visuelle et prototype interactif.",   delay: 80 },
  { icon: "ti-code",    num: "03", title: "Développement", desc: "Front, back et animations GSAP, intégrés et testés de bout en bout.", delay: 160 },
  { icon: "ti-rocket",  num: "04", title: "Lancement",     desc: "Déploiement, optimisation finale et suivi post-mise en ligne.", delay: 240 },
];

export default function ProcessSection() {
  return (
    <section className="bg-cream px-4 sm:px-8 lg:px-14 pt-10 pb-16 lg:pb-30">
      <div className="max-w-310 mx-auto">
        <div data-reveal className="mb-12">
          <p className="font-mono text-2xs tracking-[0.14em] uppercase text-brand">
            06 — Process
          </p>
          <h2 className="font-display text-[clamp(2.5rem,7vw,4.5rem)] uppercase leading-[0.9] mt-4 mb-0">
            Ma méthode
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {steps.map(({ icon, num, title, desc, delay }) => (
            <div
              key={num}
              data-reveal
              {...(delay ? { "data-delay": delay } : {})}
              className="border-t-[3px] border-dark pt-5.5"
            >
              <div className="flex justify-between items-center mb-4.5">
                <i className={`ti ${icon} text-[34px] text-brand`} />
                <span className="font-display text-[36px] text-muted-light">{num}</span>
              </div>
              <h3 className="font-display text-[26px] uppercase mt-0 mb-2">
                {title}
              </h3>
              <p className="text-[15px] leading-[1.55] text-muted m-0">
                {desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
