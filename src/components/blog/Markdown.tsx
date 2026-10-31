import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";

/**
 * Rendu Markdown (GFM : tableaux, listes de tâches, liens auto) avec ancres de titres et coloration du code.
 * Le HTML brut est ignoré par react-markdown : aucun script ne peut être injecté.
 */
export default function Markdown({ children }: { children: string }) {
    return (
        <div className="md">
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeSlug, [rehypeHighlight, { detect: true, ignoreMissing: true }]]}
                components={{
                    a: ({ href = "", children }) => {
                        const external = /^https?:\/\//.test(href) && !href.includes("hermannrichy.dev");
                        return (
                            <a href={href} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
                                {children}
                            </a>
                        );
                    },
                    // eslint-disable-next-line @next/next/no-img-element
                    img: ({ src, alt }) => <img src={typeof src === "string" ? src : undefined} alt={alt ?? ""} loading="lazy" decoding="async" />,
                    table: ({ children }) => (
                        <div className="md-table">
                            <table>{children}</table>
                        </div>
                    ),
                }}
            >
                {children}
            </ReactMarkdown>
        </div>
    );
}
