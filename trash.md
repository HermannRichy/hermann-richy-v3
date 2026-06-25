1. Principes généraux et syntaxe

- Utilise exclusivement l’objet global gsap (ex. gsap.to(), gsap.timeline()).
- N’utilise jamais les anciennes classes TweenMax, TweenLite, TimelineLite ou TimelineMax.
- Crée les timelines via la syntaxe gsap.timeline() (pas de new).

2. Architecture Next.js (App Router) et SSR

- Chaque fichier client doit commencer par "use client";.
- N’enregistre ou n’utilise les plugins GSAP que côté client : vérifie typeof window !== "undefined" avant tout gsap.registerPlugin(...).
- Tipe strictement tous les refs et éléments DOM (HTMLDivElement, HTMLElement, etc.) en TypeScript.

3. Cycle de vie React & intégration propre

- Privilégie le hook officiel fourni pour React (useGSAP / gsap.context()) pour initialiser, scoper et nettoyer les animations — il gère correctement le contexte et les nettoyages sous React 18 Strict Mode.
- Évite d’implémenter manuellement des hooks useEffect pour des initialisations d’animations DOM ; useGSAP/gsap.context() doit gérer ces cas. UseEffect reste acceptable pour d’autres effets non-animation (fetchs, abonnements non DOM).
- Place le scope du hook sur une ref (ex: containerRef) pour isoler les sélecteurs et éviter les fuites entre composants.

4. Enregistrement de plugins (SSR-safe)

- Toujours enregistrer plugins à l’intérieur d’un bloc client-check :  
  if (typeof window !== "undefined") { gsap.registerPlugin(ScrollTrigger, SplitText, ...); }
- Effectue cet enregistrement dans le composant client avant d’exécuter les animations pour garantir qu’aucune opération côté serveur n’essaie d’accéder à window.

5. ScrollTrigger — règles clés

- Pour la fiabilité mobile, active invalidateOnRefresh: true sur les ScrollTrigger qui requièrent un recalcul lors des changements de hauteur/largeur d’écran (ex. barre d’adresse mobile dynamique).
- Ajoute will-change: transform en CSS sur les conteneurs animés pour améliorer la fluidité matérielle sur appareils tactiles.
- Quand tu fais du défilement horizontal avec pin/translate (timeline principale), calcule la largeur réelle du scroll (scrollWidth) dynamiquement à l’intérieur du scope d’animation pour définir les distances et durées précises.
- Pour toute animation imbriquée qui doit se déclencher pendant le scroll horizontal, fournis la timeline de scroll principale via containerAnimation au ScrollTrigger interne — sans containerAnimation, le déclenchement imbriqué est souvent incorrect.

6. Timelines imbriquées et containerAnimation

- Construit d’abord une timeline dédiée au scrolling horizontal (pin/translate).
- Pour les sous-animations (fade, parallaxe, mots/lettres), utilise scrollTrigger.containerAnimation = pinTimeline afin de synchroniser correctement les déclencheurs internes avec le mouvement horizontal principal.
- Commente explicitement les propriétés critiques (scrub, pin, containerAnimation, invalidateOnRefresh) dans le code pour indiquer leur rôle technique.

7. SplitText et gestion du texte (accessibilité)

- Utilise la version moderne de SplitText/documentation pour découper en lignes/mots/lettres.
- Lors du découpage, assure l’accessibilité : ajoute aria-hidden="true" aux fragments créés et fournis le texte complet non découpé ou un aria-label lisible pour les lecteurs d’écran.
- Si le texte contient balises enfants (sup, span, emojis), active l’option de découpage profond (option équivalente à deepSlice) pour préserver la structure HTML et l’affichage.

8. Bonnes pratiques TypeScript & commentaires

- Typage strict : tous les refs, retours de hook et handlers DOM doivent être typés explicitement (par ex. useRef<HTMLDivElement | null>(null)).
- Documente brièvement chaque propriété GSAP/ScrollTrigger critique par un commentaire d’une ligne (pourquoi scrub existe, pourquoi pin est nécessaire, pourquoi invalidateOnRefresh est activé, etc.).
- Évite les any et les assertions non justifiées ; si tu dois forcer un cast, commente la raison technique.

9. Performance mobile et stabilité

- Prépare les conteneurs animés avec will-change: transform et évite les propriétés coûteuses (box-shadow animé, layout-triggering) pour les animations fréquentes.
- Déclenche un refresh/invalidations sur resize/orientationchange si nécessaire : ScrollTrigger.refresh() ou reliance sur invalidateOnRefresh selon le cas.
- Mesure et teste sur appareils réels, en particulier pour le scroll horizontal et la gestion de la barre d’adresse mobile.

10. Tests, nettoyage et déploiement

- En mode développement avec React Strict Mode, vérifie les doubles montages et assure-toi que useGSAP/gsap.context() nettoie correctement les timelines au démontage.
- Ajoute une checklist pré-déploiement : plugins enregistrés côté client, refs typés, will-change appliqué, ScrollTrigger.invalidateOnRefresh configuré, SplitText accessible, pas de useEffect non-justifié pour les animations DOM.
- Inclue des tests manuels (iOS Safari, Chrome Android) et un test d’accessibilité (lecteurs d’écran) pour les composants textuels découpés.

Exemple de pattern recommandé (schéma)

- "use client";
- import gsap, { ScrollTrigger, SplitText } et le hook useGSAP;
- const containerRef = useRef<HTMLDivElement | null>(null);
- if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger, SplitText);
- useGSAP(() => { /_ construire pinTimeline, sous-timelines, ScrollTrigger internes avec containerAnimation, options invalidateOnRefresh _/ }, { scope: containerRef });
