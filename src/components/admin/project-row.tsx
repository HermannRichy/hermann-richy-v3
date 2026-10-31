"use client";

import { IconArrowDown, IconArrowUp, IconEye, IconEyeOff, IconStar, IconStarFilled, IconTrash } from "@tabler/icons-react";

import { deleteProjectAction, moveProjectAction, toggleProjectAction } from "@/app/admin/actions";
import { ActionButton } from "@/components/admin/confirm-button";

/** Actions rapides d'un projet dans la liste. */
export function ProjectRowActions({ id, title, featured, published, first, last }: { id: string; title: string; featured: boolean; published: boolean; first: boolean; last: boolean }) {
    return (
        <div className="flex flex-wrap gap-1.5">
            <ActionButton action={() => moveProjectAction(id, "up")} label="Monter" className={first ? "invisible" : ""}>
                <IconArrowUp size={17} stroke={2.5} />
            </ActionButton>
            <ActionButton action={() => moveProjectAction(id, "down")} label="Descendre" className={last ? "invisible" : ""}>
                <IconArrowDown size={17} stroke={2.5} />
            </ActionButton>
            <ActionButton action={() => toggleProjectAction(id, "featured")} label={featured ? "Retirer de l'accueil" : "Mettre en avant"} className={featured ? "bg-lime" : ""}>
                {featured ? <IconStarFilled size={17} /> : <IconStar size={17} stroke={2.5} />}
            </ActionButton>
            <ActionButton action={() => toggleProjectAction(id, "published")} label={published ? "Masquer" : "Rendre visible"} className={published ? "" : "bg-white/10"}>
                {published ? <IconEye size={17} stroke={2.5} /> : <IconEyeOff size={17} stroke={2.5} />}
            </ActionButton>
            <ActionButton action={() => deleteProjectAction(id)} confirm={`Supprimer définitivement « ${title} » ?`} label="Supprimer" className="hover:border-[#ff6b6b] hover:text-[#ff8a8a]">
                <IconTrash size={17} stroke={2.5} />
            </ActionButton>
        </div>
    );
}
