import { z } from "zod";

export const emailField = z.string().trim().toLowerCase().max(254, "E-mail trop long.").pipe(z.email("Adresse e-mail invalide."));
