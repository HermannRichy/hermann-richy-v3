"use client";

import { IconArchive, IconArrowBackUp, IconCheck, IconMailOpened, IconTrash } from "@tabler/icons-react";

import { deleteMessageAction, setMessageStatusAction } from "@/app/admin/actions";
import { ActionButton } from "@/components/admin/confirm-button";

export function MessageActions({ id, status, email, title }: { id: string; status: string; email: string; title: string }) {
    return (
        <div className="flex flex-wrap gap-1.5">
            <a href={`mailto:${email}?subject=${encodeURIComponent(`Re: ${title}`)}`} className="inline-flex min-h-10 items-center gap-1.5 rounded-[12px] border-[2.5px] border-dark bg-brand px-3 text-sm font-extrabold text-white">
                <IconArrowBackUp size={16} stroke={2.5} /> Répondre
            </a>
            {status === "new" && (
                <ActionButton action={() => setMessageStatusAction(id, "read")}>
                    <IconCheck size={16} stroke={2.5} /> Marquer lu
                </ActionButton>
            )}
            {status === "read" && (
                <ActionButton action={() => setMessageStatusAction(id, "new")}>
                    <IconMailOpened size={16} stroke={2.5} /> Non lu
                </ActionButton>
            )}
            {status !== "archived" ? (
                <ActionButton action={() => setMessageStatusAction(id, "archived")}>
                    <IconArchive size={16} stroke={2.5} /> Archiver
                </ActionButton>
            ) : (
                <ActionButton action={() => setMessageStatusAction(id, "read")}>Désarchiver</ActionButton>
            )}
            <ActionButton action={() => deleteMessageAction(id)} confirm="Supprimer définitivement ce message ?" label="Supprimer" className="hover:bg-[#FFE9E9]">
                <IconTrash size={16} stroke={2.5} />
            </ActionButton>
        </div>
    );
}
