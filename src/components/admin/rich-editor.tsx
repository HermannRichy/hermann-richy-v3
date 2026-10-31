"use client";

import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import Highlight from "@tiptap/extension-highlight";
import Image from "@tiptap/extension-image";
import { TaskItem, TaskList } from "@tiptap/extension-list";
import { TableKit } from "@tiptap/extension-table";
import TextAlign from "@tiptap/extension-text-align";
import Typography from "@tiptap/extension-typography";
import Youtube from "@tiptap/extension-youtube";
import { CharacterCount, Placeholder } from "@tiptap/extensions";
import { EditorContent, useEditor, useEditorState, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {
    IconAlignCenter,
    IconAlignJustified,
    IconAlignLeft,
    IconAlignRight,
    IconArrowBackUp,
    IconArrowForwardUp,
    IconBlockquote,
    IconBold,
    IconBrandYoutube,
    IconClearFormatting,
    IconCode,
    IconColumnInsertRight,
    IconColumnRemove,
    IconHighlight,
    IconItalic,
    IconLink,
    IconList,
    IconListCheck,
    IconListNumbers,
    IconPhoto,
    IconRowInsertBottom,
    IconRowRemove,
    IconSeparatorHorizontal,
    IconSourceCode,
    IconStrikethrough,
    IconTable,
    IconTableOff,
    IconUnderline,
} from "@tabler/icons-react";
import { common, createLowlight } from "lowlight";
import { useRef, useState, type ReactNode } from "react";
import { toast } from "sonner";

import { uploadImage } from "@/lib/cloudinary-client";
import { cn } from "@/lib/utils";

const lowlight = createLowlight(common);

const LANGUAGES = [
    ["plaintext", "Texte"],
    ["typescript", "TypeScript"],
    ["javascript", "JavaScript"],
    ["bash", "Bash"],
    ["json", "JSON"],
    ["css", "CSS"],
    ["xml", "HTML / XML"],
    ["python", "Python"],
    ["go", "Go"],
    ["sql", "SQL"],
    ["yaml", "YAML"],
    ["php", "PHP"],
    ["diff", "Diff"],
] as const;

type Prompt = { kind: "link" | "image" | "youtube"; value: string } | null;

function Btn({ onClick, active, disabled, label, children }: { onClick: () => void; active?: boolean; disabled?: boolean; label: string; children: ReactNode }) {
    return (
        <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={onClick}
            disabled={disabled}
            title={label}
            aria-label={label}
            aria-pressed={active}
            className={cn("flex size-9 flex-none items-center justify-center rounded-full transition-colors disabled:opacity-30", active ? "bg-lime text-dark" : "hover:bg-white/10 hover:text-white")}
        >
            {children}
        </button>
    );
}

const Sep = () => <span className="mx-1 h-6 w-px flex-none bg-white/10" aria-hidden="true" />;

/** État de la barre d'outils (boutons actifs, annuler / rétablir, nombre de mots). */
function snapshot(e: Editor | null) {
    return e
                ? {
                      block: e.isActive("heading", { level: 2 }) ? "h2" : e.isActive("heading", { level: 3 }) ? "h3" : e.isActive("heading", { level: 4 }) ? "h4" : "p",
                      bold: e.isActive("bold"),
                      italic: e.isActive("italic"),
                      underline: e.isActive("underline"),
                      strike: e.isActive("strike"),
                      highlight: e.isActive("highlight"),
                      code: e.isActive("code"),
                      link: e.isActive("link"),
                      left: e.isActive({ textAlign: "left" }),
                      center: e.isActive({ textAlign: "center" }),
                      right: e.isActive({ textAlign: "right" }),
                      justify: e.isActive({ textAlign: "justify" }),
                      bullet: e.isActive("bulletList"),
                      ordered: e.isActive("orderedList"),
                      task: e.isActive("taskList"),
                      quote: e.isActive("blockquote"),
                      codeBlock: e.isActive("codeBlock"),
                      language: (e.getAttributes("codeBlock").language as string | undefined) ?? "plaintext",
                      table: e.isActive("table"),
                      canUndo: e.can().undo(),
                      canRedo: e.can().redo(),
                      words: e.storage.characterCount.words() as number,
                  }
                : null;
}

/** Éditeur riche Tiptap : titres, mise en forme, liens, listes, tâches, citations, code coloré, tableaux, images (Cloudinary), vidéos YouTube. */
export function RichEditor({ value, onChange, placeholder = "Commencez à écrire…" }: { value: string; onChange: (html: string) => void; placeholder?: string }) {
    const [prompt, setPrompt] = useState<Prompt>(null);
    const [uploading, setUploading] = useState(false);
    const fileInput = useRef<HTMLInputElement>(null);
    const editorRef = useRef<Editor | null>(null);

    const insertFile = async (file: File) => {
        const ed = editorRef.current;
        if (!ed) return;
        setUploading(true);
        try {
            const src = await uploadImage(file, "blog");
            ed.chain().focus().setImage({ src, alt: file.name.replace(/\.[^.]+$/, "") }).run();
            toast.success("Image insérée");
        } catch (e) {
            toast.error((e as Error).message);
        } finally {
            setUploading(false);
        }
    };

    const editor = useEditor({
        immediatelyRender: false,
        extensions: [
            StarterKit.configure({
                codeBlock: false,
                heading: { levels: [2, 3, 4] },
                link: { openOnClick: false, autolink: true, defaultProtocol: "https", protocols: ["http", "https", "mailto"] },
            }),
            CodeBlockLowlight.configure({ lowlight, defaultLanguage: "plaintext" }),
            Image.configure({ allowBase64: false }),
            Highlight,
            TextAlign.configure({ types: ["heading", "paragraph"] }),
            Typography.configure({ openDoubleQuote: "« ", closeDoubleQuote: " »", openSingleQuote: "‘", closeSingleQuote: "’" }),
            TaskList,
            TaskItem.configure({ nested: true }),
            TableKit.configure({ table: { resizable: false } }),
            Youtube.configure({ nocookie: true, modestBranding: true, width: 640, height: 360 }),
            Placeholder.configure({ placeholder }),
            CharacterCount,
        ],
        content: value,
        editorProps: {
            attributes: { class: "md min-h-[55vh] px-4 py-5 outline-none sm:px-8 sm:py-7", "aria-label": "Contenu de l'article", role: "textbox", "aria-multiline": "true" },
            // Coller / déposer une image : envoi automatique vers Cloudinary.
            handlePaste: (_view, event) => {
                const file = [...(event.clipboardData?.files ?? [])].find((f) => f.type.startsWith("image/"));
                if (!file) return false;
                void insertFile(file);
                return true;
            },
            handleDrop: (_view, event) => {
                const file = [...((event as DragEvent).dataTransfer?.files ?? [])].find((f) => f.type.startsWith("image/"));
                if (!file) return false;
                event.preventDefault();
                void insertFile(file);
                return true;
            },
        },
        onCreate: ({ editor }) => {
            editorRef.current = editor;
        },
        onUpdate: ({ editor }) => onChange(editor.getHTML()),
    });

    // useEditorState ne se met à jour qu'aux transactions : instantané direct en attendant la première.
    const live = useEditorState({ editor, selector: ({ editor: e }) => snapshot(e) });
    const state = live ?? snapshot(editor);

    if (!editor || !state) return <div className="min-h-[60vh] animate-pulse rounded-[21px] bg-white/5" aria-busy="true" />;

    const c = () => editor.chain().focus();

    const applyPrompt = () => {
        if (!prompt) return;
        const v = prompt.value.trim();
        if (prompt.kind === "link") {
            if (!v) c().extendMarkRange("link").unsetLink().run();
            else if (!/^(https?:\/\/|mailto:|\/)/.test(v)) return toast.error("Lien invalide : https://… , mailto:… ou /…");
            else c().extendMarkRange("link").setLink({ href: v }).run();
        } else if (prompt.kind === "image") {
            if (!/^https:\/\//.test(v)) return toast.error("Adresse d'image invalide (https://…).");
            c().setImage({ src: v }).run();
        } else {
            if (!/^https:\/\/(www\.)?(youtube\.com|youtu\.be)\//.test(v)) return toast.error("Lien YouTube invalide.");
            c().setYoutubeVideo({ src: v }).run();
        }
        setPrompt(null);
    };

    return (
        <div className="flex min-w-0 flex-col">
            <div className="sticky top-16 z-10 flex flex-wrap items-center gap-0.5 rounded-t-[21px] border-b border-white/10 bg-[#161616] p-2 text-white/80 lg:top-0" role="toolbar" aria-label="Mise en forme">
                <Btn label="Annuler" onClick={() => c().undo().run()} disabled={!state.canUndo}>
                    <IconArrowBackUp size={18} stroke={2.25} />
                </Btn>
                <Btn label="Rétablir" onClick={() => c().redo().run()} disabled={!state.canRedo}>
                    <IconArrowForwardUp size={18} stroke={2.25} />
                </Btn>
                <Sep />
                <select
                    aria-label="Type de bloc"
                    value={state.block}
                    onChange={(e) => {
                        const v = e.target.value;
                        if (v === "p") c().setParagraph().run();
                        else c().setHeading({ level: Number(v.slice(1)) as 2 | 3 | 4 }).run();
                    }}
                    className="h-9 rounded-full border border-white/15 bg-dark px-3 text-sm text-white [color-scheme:dark]"
                >
                    <option value="p">Paragraphe</option>
                    <option value="h2">Titre</option>
                    <option value="h3">Sous-titre</option>
                    <option value="h4">Intertitre</option>
                </select>
                <Sep />
                <Btn label="Gras (Ctrl+B)" active={state.bold} onClick={() => c().toggleBold().run()}>
                    <IconBold size={18} stroke={2.25} />
                </Btn>
                <Btn label="Italique (Ctrl+I)" active={state.italic} onClick={() => c().toggleItalic().run()}>
                    <IconItalic size={18} stroke={2.25} />
                </Btn>
                <Btn label="Souligné (Ctrl+U)" active={state.underline} onClick={() => c().toggleUnderline().run()}>
                    <IconUnderline size={18} stroke={2.25} />
                </Btn>
                <Btn label="Barré" active={state.strike} onClick={() => c().toggleStrike().run()}>
                    <IconStrikethrough size={18} stroke={2.25} />
                </Btn>
                <Btn label="Surligné" active={state.highlight} onClick={() => c().toggleHighlight().run()}>
                    <IconHighlight size={18} stroke={2.25} />
                </Btn>
                <Btn label="Code en ligne" active={state.code} onClick={() => c().toggleCode().run()}>
                    <IconCode size={18} stroke={2.25} />
                </Btn>
                <Btn label="Lien" active={state.link} onClick={() => setPrompt({ kind: "link", value: (editor.getAttributes("link").href as string) ?? "" })}>
                    <IconLink size={18} stroke={2.25} />
                </Btn>
                <Btn label="Effacer la mise en forme" onClick={() => c().unsetAllMarks().clearNodes().run()}>
                    <IconClearFormatting size={18} stroke={2.25} />
                </Btn>
                <Sep />
                <Btn label="Aligner à gauche" active={state.left} onClick={() => c().setTextAlign("left").run()}>
                    <IconAlignLeft size={18} stroke={2.25} />
                </Btn>
                <Btn label="Centrer" active={state.center} onClick={() => c().setTextAlign("center").run()}>
                    <IconAlignCenter size={18} stroke={2.25} />
                </Btn>
                <Btn label="Aligner à droite" active={state.right} onClick={() => c().setTextAlign("right").run()}>
                    <IconAlignRight size={18} stroke={2.25} />
                </Btn>
                <Btn label="Justifier" active={state.justify} onClick={() => c().setTextAlign("justify").run()}>
                    <IconAlignJustified size={18} stroke={2.25} />
                </Btn>
                <Sep />
                <Btn label="Liste à puces" active={state.bullet} onClick={() => c().toggleBulletList().run()}>
                    <IconList size={18} stroke={2.25} />
                </Btn>
                <Btn label="Liste numérotée" active={state.ordered} onClick={() => c().toggleOrderedList().run()}>
                    <IconListNumbers size={18} stroke={2.25} />
                </Btn>
                <Btn label="Liste de tâches" active={state.task} onClick={() => c().toggleTaskList().run()}>
                    <IconListCheck size={18} stroke={2.25} />
                </Btn>
                <Btn label="Citation" active={state.quote} onClick={() => c().toggleBlockquote().run()}>
                    <IconBlockquote size={18} stroke={2.25} />
                </Btn>
                <Btn label="Bloc de code" active={state.codeBlock} onClick={() => c().toggleCodeBlock().run()}>
                    <IconSourceCode size={18} stroke={2.25} />
                </Btn>
                {state.codeBlock && (
                    <select aria-label="Langage du code" value={state.language} onChange={(e) => c().updateAttributes("codeBlock", { language: e.target.value }).run()} className="h-9 rounded-full border border-white/15 bg-dark px-3 text-sm text-white [color-scheme:dark]">
                        {LANGUAGES.map(([v, l]) => (
                            <option key={v} value={v}>
                                {l}
                            </option>
                        ))}
                    </select>
                )}
                <Btn label="Séparateur" onClick={() => c().setHorizontalRule().run()}>
                    <IconSeparatorHorizontal size={18} stroke={2.25} />
                </Btn>
                <Sep />
                <Btn label="Envoyer une image" disabled={uploading} onClick={() => fileInput.current?.click()}>
                    <IconPhoto size={18} stroke={2.25} />
                </Btn>
                <Btn label="Image par adresse" onClick={() => setPrompt({ kind: "image", value: "" })}>
                    <span className="text-[11px] font-bold">URL</span>
                </Btn>
                <Btn label="Vidéo YouTube" onClick={() => setPrompt({ kind: "youtube", value: "" })}>
                    <IconBrandYoutube size={18} stroke={2.25} />
                </Btn>
                <Btn label="Insérer un tableau" onClick={() => c().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}>
                    <IconTable size={18} stroke={2.25} />
                </Btn>
                {state.table && (
                    <>
                        <Btn label="Ajouter une ligne" onClick={() => c().addRowAfter().run()}>
                            <IconRowInsertBottom size={18} stroke={2.25} />
                        </Btn>
                        <Btn label="Ajouter une colonne" onClick={() => c().addColumnAfter().run()}>
                            <IconColumnInsertRight size={18} stroke={2.25} />
                        </Btn>
                        <Btn label="Supprimer la ligne" onClick={() => c().deleteRow().run()}>
                            <IconRowRemove size={18} stroke={2.25} />
                        </Btn>
                        <Btn label="Supprimer la colonne" onClick={() => c().deleteColumn().run()}>
                            <IconColumnRemove size={18} stroke={2.25} />
                        </Btn>
                        <Btn label="Supprimer le tableau" onClick={() => c().deleteTable().run()}>
                            <IconTableOff size={18} stroke={2.25} />
                        </Btn>
                    </>
                )}
                <input
                    ref={fileInput}
                    type="file"
                    accept="image/png,image/jpeg,image/webp,image/avif,image/gif"
                    className="hidden"
                    onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (f) void insertFile(f);
                        e.target.value = "";
                    }}
                />
                <span className="ml-auto pl-2 font-mono text-[11px] tracking-wider text-white/40 uppercase">
                    {uploading ? "Envoi de l'image…" : `${state.words} mots`}
                </span>
            </div>

            {prompt && (
                <div className="flex flex-wrap items-center gap-2 border-b border-white/10 bg-white/[0.04] p-2.5">
                    <label htmlFor="rte-prompt" className="font-mono text-[11px] tracking-widest text-white/50 uppercase">
                        {prompt.kind === "link" ? "Lien" : prompt.kind === "image" ? "Adresse de l'image" : "Lien YouTube"}
                    </label>
                    <input
                        id="rte-prompt"
                        autoFocus
                        value={prompt.value}
                        onChange={(e) => setPrompt({ ...prompt, value: e.target.value })}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                e.preventDefault();
                                applyPrompt();
                            }
                            if (e.key === "Escape") setPrompt(null);
                        }}
                        placeholder={prompt.kind === "youtube" ? "https://www.youtube.com/watch?v=…" : "https://…"}
                        inputMode="url"
                        className="h-10 min-w-0 flex-1 rounded-full border border-white/15 bg-white/5 px-4 text-[15px] text-white outline-none placeholder:text-white/35 focus:border-lime"
                    />
                    <button type="button" onClick={applyPrompt} className="h-10 rounded-full bg-lime px-4 text-sm font-bold text-dark">
                        Appliquer
                    </button>
                    {prompt.kind === "link" && state.link && (
                        <button
                            type="button"
                            onClick={() => {
                                c().extendMarkRange("link").unsetLink().run();
                                setPrompt(null);
                            }}
                            className="h-10 px-2 text-sm font-bold underline underline-offset-4"
                        >
                            Retirer le lien
                        </button>
                    )}
                    <button type="button" onClick={() => setPrompt(null)} className="h-10 px-2 text-sm font-bold">
                        Annuler
                    </button>
                </div>
            )}

            <div className="rounded-b-[21px] bg-transparent">
                <EditorContent editor={editor} />
            </div>
        </div>
    );
}
