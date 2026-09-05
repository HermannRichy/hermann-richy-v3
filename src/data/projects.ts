export type ProjectTag = {
    label: string;
    bg: string;
    color: string;
    mono?: boolean;
};

export type Project = {
    id: string;
    title: string;
    desc: string;
    tags: ProjectTag[];
    image: string;
    url?: string;
    photoBg: string;
    featured: boolean;
};

const wipTag: ProjectTag = {
    label: "En développement",
    bg: "bg-lime",
    color: "text-dark",
};

const yearTag = (year: number): ProjectTag => ({
    label: String(year),
    bg: "bg-card",
    color: "text-dark",
    mono: true,
});

export const projects: Project[] = [
    {
        id: "chez-charly",
        title: "Chez Charly",
        desc: "PWA installable sur Android et iPhone, avec notifications push en temps réel : suivi de commande, fidélité (points, roue de la chance) et dashboard admin complet derrière.",
        tags: [
            { label: "Next.js", bg: "bg-brand", color: "text-white" },
            { label: "PWA", bg: "bg-dark", color: "text-lime" },
            { label: "Push Notification", bg: "bg-purple", color: "text-white" },
            { label: "Resend", bg: "bg-purple", color: "text-white" },
            yearTag(2026),
        ],
        image: "/projects/chez-charly.png",
        url: "https://chezcharly.site",
        photoBg: "bg-brand",
        featured: true,
    },
    {
        id: "maxi-views",
        title: "Maxi Views",
        desc: "Vues, likes, abonnés : la plateforme SMM payable en Mobile Money (FeexPay) partout en Afrique de l'Ouest, avec portefeuille client et tableau de bord analytique complet pour l'admin.",
        tags: [
            { label: "Next.js", bg: "bg-brand", color: "text-white" },
            { label: "FeexPay", bg: "bg-dark", color: "text-lime" },
            { label: "Better Auth", bg: "bg-purple", color: "text-white" },
            { label: "Resend", bg: "bg-purple", color: "text-white" },
            yearTag(2026),
        ],
        image: "/projects/maxi-views.png",
        url: "https://www.maxiviews.me",
        photoBg: "bg-brand",
        featured: true,
    },
    {
        id: "nextpress",
        title: "NextPress",
        desc: "WordPress + WooCommerce sans les thèmes imposés ni les plugins payants : un frontend 100% sur-mesure, avec CMS, boutique, dashboard admin et SEO déjà prêts derrière.",
        tags: [
            { label: "Next.js", bg: "bg-brand", color: "text-white" },
            { label: "Prisma/PostgreSQL", bg: "bg-purple", color: "text-white" },
            wipTag,
        ],
        image: "/projects/nextpress.png",
        photoBg: "bg-dark",
        featured: true,
    },
    {
        id: "benin-events",
        title: "Bénin Events",
        desc: "La billetterie qui fait vibrer le Bénin : créer un évènement, vendre les places, scanner les entrées en QR code, en quelques clics.",
        tags: [
            { label: "Next.js", bg: "bg-brand", color: "text-white" },
            { label: "PostgreSQL", bg: "bg-purple", color: "text-white" },
            yearTag(2026),
        ],
        image: "/projects/benin-events.png",
        url: "https://benin-events.vercel.app",
        photoBg: "bg-brand",
        featured: true,
    },
    {
        id: "pfplatform",
        title: "PF Platform",
        desc: "Le pilotage du Programme FUTUR sur tout le territoire béninois, zone par zone, en temps réel, développée en lead dev & responsable web.",
        tags: [
            { label: "Next.js", bg: "bg-brand", color: "text-white" },
            { label: "PostgreSQL", bg: "bg-purple", color: "text-white" },
            yearTag(2026),
        ],
        image: "/projects/pfplatform.png",
        url: "https://pfplatform.vercel.app",
        photoBg: "bg-dark",
        featured: true,
    },
    {
        id: "e-scrut",
        title: "E-Scrut",
        desc: "Des scrutins nationaux et législatifs suivis en ligne : authentification sécurisée, résultats fiables à la seconde près.",
        tags: [
            { label: "Next.js", bg: "bg-brand", color: "text-white" },
            { label: "PostgreSQL", bg: "bg-purple", color: "text-white" },
            yearTag(2026),
        ],
        image: "/projects/e-scrut.png",
        url: "https://e-scrut.vercel.app",
        photoBg: "bg-lime",
        featured: true,
    },
    {
        id: "scrap-pro",
        title: "Scrap-Pro",
        desc: "Reprend le catalogue produit d'une boutique en ligne, le réécrit et le traduit par IA, puis l'exporte prêt à importer dans WooCommerce, Shopify ou Wix. Crédits prépayés, suivi en direct et tri des fiches avant export.",
        tags: [
            { label: "Next.js", bg: "bg-brand", color: "text-white" },
            { label: "FastAPI", bg: "bg-dark", color: "text-lime" },
            { label: "PostgreSQL", bg: "bg-purple", color: "text-white" },
            { label: "Stripe", bg: "bg-purple", color: "text-white" },
            wipTag,
        ],
        image: "/projects/scrap-pro.png",
        url: "https://scrap-pro-gray.vercel.app",
        photoBg: "bg-purple",
        featured: true,
    },
    {
        id: "tibuce-afrique",
        title: "Tibuce Africa",
        desc: "Le tournoi business qui révèle les entrepreneurs africains de demain : candidatures, jury et certificats générés en ligne.",
        tags: [
            { label: "Next.js", bg: "bg-brand", color: "text-white" },
            { label: "Firebase", bg: "bg-dark", color: "text-lime" },
            yearTag(2025),
        ],
        image: "/projects/tibuce-afrique.png",
        url: "https://tibuce-afrique.vercel.app",
        photoBg: "bg-brand",
        featured: true,
    },
    {
        id: "digitalinnovation",
        title: "Digital Innovation",
        desc: "La vitrine de mon agence : offres, portfolio et prise de contact, animée au scroll avec GSAP.",
        tags: [
            { label: "Next.js", bg: "bg-brand", color: "text-white" },
            { label: "GSAP", bg: "bg-dark", color: "text-lime" },
            yearTag(2025),
        ],
        image: "/projects/digitalinnovation.png",
        url: "https://digitalinnovation-mu.vercel.app",
        photoBg: "bg-dark",
        featured: true,
    },
    {
        id: "well-steven",
        title: "Well Steven",
        desc: "Le site d'un cabinet comptable qui inspire confiance dès le premier scroll : services et formations en clair.",
        tags: [
            { label: "Next.js", bg: "bg-brand", color: "text-white" },
            { label: "Framer Motion", bg: "bg-dark", color: "text-lime" },
            yearTag(2025),
        ],
        image: "/projects/well-steven.png",
        url: "https://well-steven.vercel.app",
        photoBg: "bg-purple",
        featured: false,
    },
    {
        id: "futurcraft-institut",
        title: "FuturCraft Institut",
        desc: "L'institut qui forme aux métiers du numérique : filières, témoignages et inscriptions en ligne.",
        tags: [
            { label: "Next.js", bg: "bg-brand", color: "text-white" },
            { label: "GSAP", bg: "bg-dark", color: "text-lime" },
            yearTag(2026),
        ],
        image: "/projects/futurcraft-institut.png",
        url: "https://futurcraft-institut-v2.vercel.app",
        photoBg: "bg-dark",
        featured: false,
    },
    {
        id: "sigi-africa",
        title: "SIGI Africa",
        desc: "Achat, vente, gestion immobilière au Bénin et dans la diaspora, une agence qui inspire confiance en ligne.",
        tags: [
            { label: "Next.js", bg: "bg-brand", color: "text-white" },
            { label: "GSAP", bg: "bg-dark", color: "text-lime" },
            yearTag(2025),
        ],
        image: "/projects/sigi-africa.png",
        url: "https://sigi-africa-five.vercel.app",
        photoBg: "bg-lime",
        featured: false,
    },
    {
        id: "cefora",
        title: "Cefora Formation",
        desc: "Un centre de formation professionnelle, réalisé avec mes apprenants, de la théorie à la mise en prod.",
        tags: [
            { label: "Next.js", bg: "bg-brand", color: "text-white" },
            yearTag(2026),
        ],
        image: "/projects/cefora.png",
        url: "https://cefora.vercel.app",
        photoBg: "bg-brand",
        featured: false,
    },
];
