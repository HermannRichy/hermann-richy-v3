/** URL publique du site (canonical, OG, sitemap, e-mails). */
export const SITE_URL = (process.env.NEXT_PUBLIC_APP_URL || "https://hermannrichy.site").replace(/\/$/, "");
/** Nom de domaine seul (ex. hermannrichy.site), pour l'affichage. */
export const SITE_HOST = new URL(SITE_URL).host;
export const SITE_NAME = "Hermann Richy";
