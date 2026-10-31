import rehypeHighlight from "rehype-highlight";
import rehypeParse from "rehype-parse";
import rehypeSanitize, { defaultSchema, type Options as SanitizeSchema } from "rehype-sanitize";
import rehypeSlug from "rehype-slug";
import rehypeStringify from "rehype-stringify";
import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified, type PluggableList } from "unified";

const ALIGN = /^text-align:\s*(left|center|right|justify);?$/;
const YOUTUBE = /^https:\/\/(www\.)?youtube(-nocookie)?\.com\/embed\/[\w-]{6,20}(\?[\w=&;%-]*)?$/;

/**
 * Liste blanche du contenu des articles (éditeur Tiptap ou Markdown) :
 * pas de script, pas de style libre, iframes limitées à YouTube.
 */
const schema: SanitizeSchema = {
    ...defaultSchema,
    clobberPrefix: "",
    tagNames: [...(defaultSchema.tagNames ?? []), "mark", "u", "s", "iframe", "figure", "figcaption", "label", "div", "span"],
    attributes: {
        ...defaultSchema.attributes,
        "*": [...(defaultSchema.attributes?.["*"] ?? []).filter((a) => a !== "style"), "dataType", "dataChecked"],
        a: ["href", "title", "target", "rel"],
        img: ["src", "alt", "title", "width", "height", "loading"],
        p: [["style", ALIGN]],
        h1: [["style", ALIGN]],
        h2: [["style", ALIGN]],
        h3: [["style", ALIGN]],
        h4: [["style", ALIGN]],
        code: [["className", /^language-[\w-]+$/, "hljs"]],
        span: [["className", /^hljs[\w-]*$/]],
        pre: [],
        div: ["dataYoutubeVideo"],
        iframe: [["src", YOUTUBE], "width", "height", "allowFullScreen", "allow", "frameBorder", "title", "loading"],
        td: ["colSpan", "rowSpan"],
        th: ["colSpan", "rowSpan"],
        input: [["type", "checkbox"], ["disabled", true], "checked"],
        li: ["dataType", "dataChecked", ["className", "task-list-item"]],
        ul: ["dataType", ["className", "contains-task-list"]],
    },
    protocols: { ...defaultSchema.protocols, href: ["http", "https", "mailto"], src: ["http", "https"] },
};

type HNode = { type: string; tagName?: string; properties?: Record<string, unknown>; children?: HNode[] };

/** Retire les iframes dont l'adresse a été refusée par la liste blanche. */
function dropEmptyIframes() {
    return (tree: unknown) => {
        const walk = (node: HNode) => {
            if (!node.children) return;
            node.children = node.children.filter((c) => !(c.type === "element" && c.tagName === "iframe" && !c.properties?.src));
            node.children.forEach(walk);
        };
        walk(tree as HNode);
    };
}

/** HTML venant de l'éditeur → HTML sûr à stocker. */
export async function sanitizeHtml(html: string) {
    const file = await unified().use(rehypeParse, { fragment: true }).use(rehypeSanitize, schema).use(dropEmptyIframes).use(rehypeStringify).process(html);
    return String(file);
}

/** Markdown (anciens articles) → HTML pour l'éditeur. */
export async function markdownToHtml(md: string) {
    const file = await unified().use(remarkParse).use(remarkGfm).use(remarkRehype).use(rehypeSanitize, schema).use(rehypeStringify).process(md);
    return String(file);
}

/** Liens externes : nouvel onglet ; images : chargement différé ; tableaux : défilement horizontal. */
function enhance() {
    return (tree: unknown) => {
        const walk = (node: HNode) => {
            if (node.type === "element" && node.properties) {
                const href = node.properties.href;
                if (node.tagName === "a" && typeof href === "string" && /^https?:\/\//.test(href) && !href.includes("hermannrichy.dev")) {
                    node.properties.target = "_blank";
                    node.properties.rel = "noopener noreferrer";
                }
                if (node.tagName === "img") {
                    node.properties.loading = "lazy";
                    node.properties.decoding = "async";
                }
                if (node.tagName === "iframe") node.properties.loading = "lazy";
                if (node.tagName === "table") {
                    const copy: HNode = { ...node };
                    node.tagName = "div";
                    node.properties = { className: ["md-table"] };
                    node.children = [copy];
                    return;
                }
            }
            node.children?.forEach(walk);
        };
        walk(tree as HNode);
    };
}

const publicPlugins: PluggableList = [[rehypeSanitize, schema], dropEmptyIframes, rehypeSlug, [rehypeHighlight, { detect: true }], enhance, rehypeStringify];

/** Contenu d'article → HTML public : nettoyage, ancres de titres, coloration du code. */
export async function renderPost(content: string, format: string) {
    if (format === "markdown") return String(await unified().use(remarkParse).use(remarkGfm).use(remarkRehype).use(publicPlugins).process(content));
    return String(await unified().use(rehypeParse, { fragment: true }).use(publicPlugins).process(content));
}

/** Texte brut d'un contenu HTML ou Markdown (temps de lecture, extraits). */
export function plainText(content: string, format: string) {
    const noCode = content.replace(/```[\s\S]*?```/g, " ").replace(/<pre[\s\S]*?<\/pre>/g, " ");
    return (format === "markdown" ? noCode.replace(/[#>*_`~[\]()!-]/g, " ") : noCode.replace(/<[^>]+>/g, " ")).replace(/&\w+;/g, " ").replace(/\s+/g, " ").trim();
}
