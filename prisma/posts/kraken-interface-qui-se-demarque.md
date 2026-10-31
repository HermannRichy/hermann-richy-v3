## Le contexte

On me pose souvent la même question : « Comment tu fais pour que tes interfaces ne ressemblent pas à toutes les autres ? » Plutôt que de répondre en trois messages WhatsApp, voici la réponse complète, avec un projet récent comme fil rouge : **[Kraken : Sold Out](https://kraken.hustlerlabs.tech)**, le site du défi back-end organisé par HustlerLabs.

Le brief tenait en une phrase : un défi où les participants construisent une billetterie qui tient quand tout le monde veut le dernier billet. Le site devait donner envie de s'inscrire, expliquer les règles, afficher le calendrier, gérer les inscriptions et le paiement.

Oui, c'est du néo-brutalisme : bordures épaisses, ombres décalées, couleurs franches. Mais le style seul ne suffit pas. Des sites néo-brutalistes, il y en a des milliers, et la plupart se ressemblent. Ce qui fait la différence, ce sont les petits détails : des cartes légèrement déformées, des éléments SVG qui apportent du contexte, des icônes qui réagissent et des animations choisies une par une.

## 1. Partir d'une direction, pas d'un template

Avant d'écrire une ligne de code, je fixe trois choses.

**L'histoire.** Kraken, c'est un défi sous pression : des places limitées, une billetterie à construire, un compte à rebours. Tout le visuel découle de là. Les cartes ressemblent à des **billets** : bord perforé, code-barres, numéro « 100/100 ». Le tampon « SOLD OUT » est un vrai sticker de papier déchiré.

**La charte.** HustlerLabs avait déjà un kit graphique : la police Manrope, un bleu électrique `#0047FF`, du noir, du blanc et un gris. Je ne l'ai pas réinventé, je l'ai poussé à fond. Une contrainte forte vaut mieux qu'une palette de dix couleurs.

**Les références.** J'ai décortiqué un shot Dribbble de carte bancaire en perspective. Je n'ai pas copié le visuel, j'ai retenu l'idée : des cartes qui semblent posées sur une table et non collées à l'écran.

Je maquette ensuite les écrans clés avant de coder. Ça évite de « designer dans le navigateur », où chaque décision coûte dix fois plus cher.

## 2. Traduire la maquette en système

Un design qui se démarque doit rester cohérent sur 15 pages. Je le transforme donc en **système** dès le début.

### Les tokens

Avec Tailwind 4, tout passe par `@theme`, directement dans le CSS :

```css
@theme {
  --color-ink: #000000;
  --color-paper: #f5f6f8;
  --color-kraken: #0047ff;
  --color-steel: #626670;
  --font-sans: var(--font-manrope), system-ui, sans-serif;
}
```

S'ajoutent quelques règles fixes : bordure de 3 px, ombre décalée de 6 à 8 px sans flou, coins arrondis entre 18 et 30 px. Quand chaque composant applique les mêmes règles, l'ensemble paraît voulu, pas bricolé.

### Les cartes déformées

C'est le détail qu'on me demande le plus. Il n'y a ni image ni canvas : juste un `transform` CSS avec de la perspective. J'en ai fait des utilitaires Tailwind :

```css
@utility distort-a {
  transform: perspective(1000px) rotateY(-8deg) rotateX(3deg) rotateZ(-1.5deg);
}
@utility distort-b {
  transform: perspective(1000px) rotateY(7deg) rotateX(-3deg) rotateZ(1.2deg);
}
```

Trois règles pour que ça fonctionne :

- **Des angles faibles.** Au-delà de 8 à 10 degrés, le texte devient pénible à lire. On veut sentir la perspective, pas la subir.
- **Alterner les variantes.** Une grille de cartes toutes inclinées pareil a l'air cassée. Avec `distort-a`, `distort-b` et `distort-c` en alternance, elle a l'air vivante.
- **Garder le contenu lisible.** Les longs paragraphes et les formulaires restent droits. Seuls les blocs courts sont déformés : titres, billets, chiffres.

### Les SVG qui apportent du contexte

Les petits traits autour d'un titre, l'étoile à quatre branches, la flèche dessinée à la main : je les appelle des **doodles**. Ils ne sont pas là pour décorer, mais pour attirer l'œil vers ce qui compte : le bouton d'inscription, le prix, la date limite.

Chaque doodle est un composant React minuscule, positionné en absolu :

```tsx
export function Burst({ className, size = 36 }: { className?: string; size?: number }) {
  return (
    <svg data-float="burst" className={`pointer-events-none absolute ${className}`}
      width={size} height={size} viewBox="0 0 40 40" fill="none"
      stroke="currentColor" strokeWidth={3.5} strokeLinecap="round" aria-hidden="true">
      <path d="M6 30 L14 24" />
      <path d="M14 10 L19 18" />
      <path d="M30 6 L28 16" />
    </svg>
  );
}
```

L'attribut `data-float` sert à les animer en boucle (on y revient plus bas). `aria-hidden` les rend invisibles pour les lecteurs d'écran : ils sont visuels, pas informatifs.

Ma règle : **un doodle par zone d'attention, jamais plus.** Si tout est souligné, plus rien ne l'est.

## 3. Animer avec intention

Je ne pars pas de « qu'est-ce qui serait cool ? », mais de « qu'est-ce que l'animation doit faire comprendre ? ». Sur Kraken, chaque animation a un rôle :

| Animation | Rôle |
| --- | --- |
| Titres en lettres qui tombent | Donner le ton dès l'arrivée |
| Cartes qui « pop » à l'apparition | Mettre en avant les billets et les étapes |
| Cartes qui se soulèvent au survol | Indiquer ce qui est cliquable |
| Icônes qui s'animent avec leur carte | Renforcer le sens de chaque bloc |
| Doodles en boucle | Garder la page vivante sans distraire |
| Calendrier qui se soulève au scroll | Montrer l'étape en cours |
| FAQ qui s'ouvre au scroll | Faire lire les réponses sans effort |

### Un seul chef d'orchestre

Plutôt que d'éparpiller du GSAP dans chaque composant, j'ai un composant `PageMotion` par page. Il lit des attributs `data-*` : on marque les éléments dans le JSX, et l'animation suit.

```tsx
"use client";
export function PageMotion({ children }: { children: React.ReactNode }) {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const q = gsap.utils.selector(scope);
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const reveals = q("[data-reveal]");
      gsap.set(reveals, { autoAlpha: 0, y: 48 });
      ScrollTrigger.batch(reveals, {
        start: "top 88%",
        onEnter: (els) => gsap.to(els, { autoAlpha: 1, y: 0, stagger: 0.08, ease: "power3.out" }),
      });
    });

    mm.add("(prefers-reduced-motion: reduce)", () => {
      gsap.set(q("[data-reveal]"), { autoAlpha: 1 });
    });

    return () => mm.revert();
  }, { scope });

  return <div ref={scope}>{children}</div>;
}
```

Dans une page, il suffit alors d'écrire `<p data-reveal>…</p>`. Trois choses importantes dans ce code :

- `ScrollTrigger.batch` regroupe les éléments qui entrent à l'écran en même temps et les anime en cascade. C'est bien plus fluide qu'un ScrollTrigger par élément.
- `gsap.matchMedia` respecte `prefers-reduced-motion` : les personnes qui désactivent les animations voient le contenu directement.
- `useGSAP` avec un `scope` nettoie tout au démontage et limite les sélecteurs à la page.

### Le piège qui m'a coûté une soirée

Première version : `PageMotion` était placé dans le layout global. Résultat : **aucune animation au scroll**. Le layout s'exécutait avant que React ait fini d'hydrater la page. GSAP posait ses états initiaux (`opacity: 0`), puis React repassait derrière et les écrasait.

La solution : placer `PageMotion` **dans chaque page**, autour de son contenu. Les effets ne tournent qu'une fois la page entièrement hydratée.

Autre détail qui change tout : relancer `ScrollTrigger.refresh()` quand les polices et les images ont fini de charger. Sinon les positions de déclenchement sont calculées sur une page qui n'a pas encore sa vraie hauteur.

### Le second piège : GSAP contre les cartes déformées

GSAP anime la propriété `transform`. Mes cartes déformées utilisent aussi `transform`. Au premier survol, GSAP écrasait la perspective et la carte se remettait à plat d'un coup.

La solution tient en une idée : **une couche par responsabilité.**

```tsx
// Couche externe : apparition au scroll (pilotée par PageMotion)
<div data-pop>
  {/* Couche interne : soulèvement au survol */}
  <div ref={inner} onMouseEnter={lift} onMouseLeave={drop}>
    {/* L'enfant garde sa déformation CSS, que GSAP ne touche jamais */}
    <article className="distort-a rounded-[28px] border-[3px] border-ink">…</article>
  </div>
</div>
```

Chaque couche a son propre `transform`, et elles ne se gênent jamais. C'est le pattern que je réutilise partout dès qu'une animation rencontre un style.

### Des doodles vivants, mais discrets

Les SVG marqués `data-float` sont animés en boucle avec des durées et des délais aléatoires, pour qu'ils ne bougent jamais en même temps :

```ts
q("[data-float]").forEach((el) => {
  const delay = gsap.utils.random(0, 1.2);
  if (el.dataset.float === "burst") {
    gsap.to(el, { scale: 1.2, rotation: 10, duration: 0.6, ease: "sine.inOut", repeat: -1, yoyo: true, delay });
  }
  if (el.dataset.float === "star") {
    gsap.to(el, { rotation: 360, duration: 6, ease: "none", repeat: -1 });
  }
});
```

Pour les gribouillis, j'anime le tracé lui-même avec `strokeDasharray` et `strokeDashoffset` : le trait a l'air dessiné en direct.

### Des icônes qui réagissent avec la carte

Pour les icônes, j'utilise **[lucide-animated](https://lucide-animated.com)** : les icônes Lucide que tout le monde connaît, mais animées avec Motion. La flèche recule puis repart, le cadenas s'ouvre, le chronomètre tourne. Pour chaque icône, l'animation ajoute un peu de sens.

La bibliothèque fonctionne comme shadcn : on ne l'installe pas comme une dépendance, on **copie le code de chaque icône** dans le projet (`components/icons`). On garde la main sur tout et on ne livre que les icônes réellement utilisées. Seule `motion` s'ajoute aux dépendances.

Par défaut, une icône s'anime quand on la survole elle-même. Sur une carte, c'est trop petit : personne ne vise une icône de 24 px. Je voulais que **toute la carte** déclenche l'animation. Chaque icône expose `startAnimation()` et `stopAnimation()` : il suffit de transmettre l'état de survol du parent par un contexte React.

```tsx
// La carte (ou le bouton) partage son état de survol
export const HoverContext = createContext(false);

export function AnimatedIcon({ name, size = 24 }: { name: IconName; size?: number }) {
  const Icon = ICONS[name];
  const ref = useRef<AnimatedIconHandle>(null);
  const hovered = useContext(HoverContext);
  const prev = useRef(hovered);

  useEffect(() => {
    if (prev.current === hovered) return; // jamais au montage
    prev.current = hovered;
    if (hovered) ref.current?.startAnimation();
    else ref.current?.stopAnimation();
  }, [hovered]);

  return <Icon ref={ref} size={size} className="pointer-events-none" aria-hidden="true" />;
}
```

Côté carte, le même gestionnaire de survol fait deux choses : il soulève la carte avec GSAP (la couche interne vue plus haut) et passe `hovered` au contexte :

```tsx
<HoverContext.Provider value={hovered}>
  <div ref={inner} {...handlers}>
    <article className="distort-a …">
      <AnimatedIcon name="ticket" />
      …
    </article>
  </div>
</HoverContext.Provider>
```

Le même principe sert pour les boutons : survoler « S'inscrire » fait avancer la flèche. Sur quelques icônes clés, comme le chronomètre du compte à rebours, j'ajoute une relance automatique toutes les quelques secondes, désactivée si l'utilisateur préfère réduire les animations.

Deux règles :

- **Une icône animée doit raconter quelque chose.** Un cadenas qui s'ouvre sur « Sécurité », oui. Une icône qui tourne sans raison, non.
- **Elle ne s'anime jamais au chargement de la page**, uniquement en réaction à l'utilisateur. Sinon, dix icônes qui bougent en même temps donnent une page qui s'agite pour rien.

## 4. Responsive et finitions

Le néo-brutalisme a un défaut : les grosses bordures et les ombres prennent de la place. Je travaille donc en **mobile d'abord** et j'ajuste à la main :

- **Ombres et bordures** réduites sous 640 px (par exemple 4 px d'ombre au lieu de 8).
- **Déformations** atténuées sur mobile, où l'œil est plus près de l'écran.
- **Bandeaux défilants** : sur mobile, les deux bandes du bas du hero se chevauchaient. Je les ai superposées avec un espacement fixe au lieu de les croiser.
- **Menu mobile** qui se referme tout seul au changement de page. On l'oublie souvent, et c'est très frustrant pour l'utilisateur.

Et l'en-tête qui disparaît quand on descend et revient quand on remonte. Le hook est court, mais le seuil est essentiel :

```ts
export function useScrollDirection(threshold = 8) {
  const [state, setState] = useState({ direction: "up" as "up" | "down", y: 0 });
  useEffect(() => {
    let last = window.scrollY, ticking = false;
    const update = () => {
      ticking = false;
      const y = window.scrollY, delta = y - last;
      if (Math.abs(delta) < threshold && y > 0) return; // ignore les micro-mouvements
      setState({ direction: delta > 0 ? "down" : "up", y });
      last = y;
    };
    const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold]);
  return state;
}
```

Sans seuil, l'inertie d'un trackpad fait clignoter l'en-tête. `requestAnimationFrame` limite le calcul à une fois par image.

## 5. Garder l'identité dans les écrans applicatifs

C'est là que beaucoup de projets décrochent : un site vitrine soigné, puis un espace connecté qui ressemble à un template d'admin.

Sur Kraken, l'**espace participant** et le **dashboard de l'équipe** reprennent les mêmes règles : bordures, cartes, couleurs. Seule l'organisation change, avec une barre latérale sur ordinateur et un tiroir sur mobile.

Les formulaires méritent la même attention que le hero :

- **Validation en direct**, mais seulement après la sortie du champ. Personne n'aime voir « e-mail invalide » à la deuxième lettre tapée.
- **Erreurs accessibles**, reliées au champ par `aria-describedby`, avec un récapitulatif cliquable en haut du formulaire.
- **Code de double authentification en 6 cases**, qui accepte la saisie, le collage et le remplissage automatique par le téléphone.

## 6. Les détails que personne ne voit mais que tout le monde ressent

- **Les images de partage** sont générées avec `next/og`, aux couleurs du site, pour chaque page. Un lien partagé sur WhatsApp donne alors envie de cliquer.
- **Les polices** sont chargées en local, sans décalage d'affichage.
- **Les animations** respectent `prefers-reduced-motion`.
- **Les icônes animées** se déclenchent au survol de toute la carte, pas seulement de l'icône.

Pris un par un, aucun de ces détails ne se remarque. Ensemble, ils font qu'on « sent » la qualité sans savoir l'expliquer.

## Ma méthode en 5 règles

1. **Une histoire avant un style.** Kraken parle de billets, donc les cartes sont des billets.
2. **Un système avant des pages.** Les tokens, les règles de bordure et d'ombre et les utilitaires de déformation sont fixés dès le premier jour.
3. **Chaque animation a un rôle, icônes comprises.** Si je ne peux pas dire ce qu'elle fait comprendre, je la supprime.
4. **Une couche par responsabilité.** Le style d'un côté, l'animation de l'autre, et on ne les mélange jamais sur le même élément.
5. **Les détails jusqu'au bout.** Formulaires, états vides, images de partage, accessibilité : c'est là que se fait la différence.

Le résultat est en ligne : **[kraken.hustlerlabs.tech](https://kraken.hustlerlabs.tech)**. Si tu veux que je détaille un point en particulier, la FAQ qui s'ouvre au scroll ou le calendrier qui se soulève par exemple, dis-le-moi : ce sera le prochain article.
