"use client";

import { IconArticle, IconBriefcase, IconExternalLink, IconLayoutDashboard, IconLock, IconLogout, IconMail, IconMenu2, IconShieldCheck, IconX, type TablerIcon } from "@tabler/icons-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState, useSyncExternalStore, useTransition, type ReactNode } from "react";
import { toast } from "sonner";

import { authClient } from "@/lib/auth-client";
import { STAR_PATH } from "@/components/dashboard/ui";
import { cn } from "@/lib/utils";

const ICONS = {
  dashboard: IconLayoutDashboard,
  posts: IconArticle,
  projects: IconBriefcase,
  messages: IconMail,
  security: IconShieldCheck,
} satisfies Record<string, TablerIcon>;

export type NavItem = {
  href: string;
  label: string;
  icon: keyof typeof ICONS;
  group: string;
  /** Pastille à droite (ex. « À faire »). */
  badge?: string;
  /** Section pas encore disponible pour cet utilisateur (cadenas). */
  locked?: boolean;
};

type Props = {
  /** Libellé à côté du logo (ADMIN, ESPACE…). */
  badge: string;
  /** Page d'accueil de l'interface (lien du logo, onglet « exact »). */
  home: string;
  items: NavItem[];
  groups: { id: string; label: string }[];
  user: { name: string; email: string; role: string };
  /** Destination après déconnexion. */
  signOutTo: string;
  links?: { href: string; label: string }[];
  children: ReactNode;
};

const DESKTOP = "(min-width: 1024px)";
const subscribe = (cb: () => void) => {
  const mq = window.matchMedia(DESKTOP);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
};

const initials = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("") || "K";

const isActive = (pathname: string, href: string, home: string) => (href === home ? pathname === home : pathname === href || pathname.startsWith(`${href}/`));

/** Interface type tableau de bord : barre latérale fixe sur grand écran, tiroir sur mobile et tablette. */
export function DashboardShell({ badge, home, items, groups, user, signOutTo, links = [{ href: "/", label: "Voir le site" }], children }: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [lastPath, setLastPath] = useState(pathname);
  const [signingOut, startSignOut] = useTransition();
  const closeRef = useRef<HTMLButtonElement>(null);
  const burgerRef = useRef<HTMLButtonElement>(null);
  const desktop = useSyncExternalStore(
    subscribe,
    () => window.matchMedia(DESKTOP).matches,
    () => true,
  );

  // Fermeture du tiroir à chaque changement de page.
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpen(false);
  }

  useEffect(() => {
    if (!open || desktop) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        burgerRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, desktop]);

  const current = items.find((it) => isActive(pathname, it.href, home))?.label ?? badge;
  const signOut = () =>
    startSignOut(async () => {
      await authClient.signOut();
      toast.success("Vous êtes déconnecté.");
      router.push(signOutTo);
      router.refresh();
    });

  return (
    <div data-admin-shell className="min-h-dvh bg-dark font-sans text-white antialiased">
      {/* Barre supérieure (mobile et tablette) */}
      <div className="fixed inset-x-0 top-0 z-40 flex h-16 items-center gap-3 border-b border-white/10 bg-dark/90 px-3 text-white backdrop-blur sm:px-5 lg:hidden">
        <button
          ref={burgerRef}
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Ouvrir le menu"
          aria-expanded={open}
          aria-controls="admin-sidebar"
          className="flex size-10 flex-none items-center justify-center rounded-full bg-lime text-dark"
        >
          <IconMenu2 size={22} stroke={2.5} aria-hidden="true" />
        </button>
        <div className="min-w-0 flex-1">
          <div className="font-mono text-[10px] leading-none tracking-widest text-lime/60 uppercase">Hermann Richy · {badge}</div>
          <div className="truncate font-display text-[19px] leading-tight uppercase">{current}</div>
        </div>
        <span className="flex size-10 flex-none items-center justify-center rounded-full bg-brand font-display text-base text-white" aria-hidden="true">
          {initials(user.name)}
        </span>
      </div>

      {/* Voile du tiroir */}
      <div
        aria-hidden="true"
        onClick={() => setOpen(false)}
        className={cn("fixed inset-0 z-40 bg-black/70 transition-opacity duration-300 lg:hidden", open ? "opacity-100" : "pointer-events-none opacity-0")}
      />

      {/* Barre latérale */}
      <aside
        id="admin-sidebar"
        aria-label={`Navigation ${badge.toLowerCase()}`}
        inert={!desktop && !open}
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-[288px] max-w-[86vw] flex-col overflow-hidden border-r border-white/10 bg-[#111111] text-white transition-transform duration-300 ease-out motion-reduce:transition-none lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="relative flex h-16 flex-none items-center justify-between gap-3 border-b border-white/10 px-5 lg:h-20">
          <Link href={home} className="flex items-center gap-2.5 no-underline">
            <svg width="22" height="22" viewBox="0 0 100 100" aria-hidden="true">
              <path d={STAR_PATH} fill="#CDF22B" />
            </svg>
            <span className="flex flex-col leading-none">
              <span className="font-display text-[19px] tracking-[0.02em] text-white uppercase">Hermann Richy</span>
              <span className="mt-1 font-mono text-[10px] tracking-widest text-lime/60 uppercase">{badge}</span>
            </span>
          </Link>
          <button
            ref={closeRef}
            type="button"
            onClick={() => {
              setOpen(false);
              burgerRef.current?.focus();
            }}
            aria-label="Fermer le menu"
            className="flex size-10 items-center justify-center rounded-full border border-white/20 text-white/80 hover:border-lime hover:text-lime lg:hidden"
          >
            <IconX size={20} stroke={2.5} aria-hidden="true" />
          </button>
        </div>

        <nav className="relative flex-1 overflow-y-auto overscroll-contain px-3 py-6">
          {groups.map((g) => {
            const list = items.filter((it) => it.group === g.id);
            if (!list.length) return null;
            return (
              <div key={g.id} className="mb-6 last:mb-0">
                <div className="mb-2.5 px-4 font-mono text-[11px] tracking-[0.14em] text-white/35 uppercase">{g.label}</div>
                <ul className="flex flex-col gap-1.5">
                  {list.map((it) => {
                    const Icon = ICONS[it.icon];
                    const active = isActive(pathname, it.href, home);
                    return (
                      <li key={it.href}>
                        <Link
                          href={it.href}
                          aria-current={active ? "page" : undefined}
                          className={cn(
                            "flex min-h-11 items-center gap-3 rounded-full px-4 text-[15px] font-medium no-underline transition-colors",
                            active ? "bg-lime font-bold text-dark" : "text-white/70 hover:bg-white/5 hover:text-white",
                          )}
                        >
                          <Icon size={20} stroke={2.25} aria-hidden="true" className="flex-none" />
                          <span className="min-w-0 flex-1 truncate">{it.label}</span>
                          {it.locked && <IconLock size={15} stroke={2.5} aria-label="Pas encore disponible" className={active ? "text-dark/60" : "text-white/40"} />}
                          {it.badge && (
                            <span className={cn("rounded-full px-2 py-0.5 font-mono text-[10px] tracking-wider whitespace-nowrap uppercase", active ? "bg-dark text-lime" : "bg-lime text-dark")}>{it.badge}</span>
                          )}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}
        </nav>

        <div className="relative flex flex-none flex-col gap-3 border-t border-white/10 p-4">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="flex items-center gap-2 px-1 font-mono text-[12px] tracking-wider text-white/50 uppercase no-underline hover:text-lime">
              <IconExternalLink size={16} stroke={2.25} aria-hidden="true" />
              {l.label}
            </Link>
          ))}
          <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-2.5">
            <span className="flex size-10 flex-none items-center justify-center rounded-full bg-brand font-display text-base text-white" aria-hidden="true">
              {initials(user.name)}
            </span>
            <div className="min-w-0 flex-1 leading-tight">
              <div className="truncate text-sm font-bold">{user.name}</div>
              <div className="truncate text-xs text-white/45">
                {user.role} · {user.email}
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={signOut}
            disabled={signingOut}
            className="flex min-h-11 items-center justify-center gap-2 rounded-full border-[2.5px] border-white/25 text-sm font-bold text-white transition-colors hover:border-lime hover:text-lime disabled:opacity-60"
          >
            <IconLogout size={18} stroke={2.25} aria-hidden="true" />
            {signingOut ? "Déconnexion…" : "Se déconnecter"}
          </button>
        </div>
      </aside>

      {/* Contenu */}
      <div className="relative pt-16 lg:pt-0 lg:pl-[288px]">
        <svg width="220" height="220" viewBox="0 0 100 100" aria-hidden="true" className="pointer-events-none absolute top-20 right-6 opacity-[0.06] lg:top-8 lg:right-12">
          <path d={STAR_PATH} fill="#CDF22B" />
        </svg>
        <div className="relative mx-auto w-full max-w-[1280px] px-4 py-8 sm:px-6 sm:py-10 lg:px-12 lg:py-14">{children}</div>
      </div>
    </div>
  );
}
