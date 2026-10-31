import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { APIError, createAuthMiddleware } from "better-auth/api";
import { nextCookies } from "better-auth/next-js";
import { twoFactor } from "better-auth/plugins";

import { SITE_URL } from "@/config/site";
import { db } from "@/lib/server/db";
import { sendEmail, templates } from "@/lib/server/email";
import { allowedOrigins } from "@/lib/server/request";

const isProd = process.env.NODE_ENV === "production";

/** Admin unique : e-mail + mot de passe + double authentification. Aucune inscription publique. */
export const auth = betterAuth({
  appName: "Hermann Richy",
  baseURL: process.env.BETTER_AUTH_URL ?? SITE_URL,
  secret: process.env.BETTER_AUTH_SECRET,
  database: prismaAdapter(db, { provider: "postgresql" }),
  trustedOrigins: [...allowedOrigins()],

  emailAndPassword: {
    enabled: true,
    disableSignUp: true,
    minPasswordLength: 12,
    maxPasswordLength: 128,
    resetPasswordTokenExpiresIn: 60 * 60,
    revokeSessionsOnPasswordReset: true,
    sendResetPassword: async ({ user, url }) => {
      const hasPassword = await db.account.findFirst({ where: { userId: user.id, providerId: "credential" }, select: { id: true } });
      const mail = templates.passwordReset(url, !hasPassword);
      await sendEmail({ to: user.email, ...mail });
    },
  },

  session: {
    expiresIn: 60 * 60 * 24 * 7,
    updateAge: 60 * 60 * 24,
    cookieCache: { enabled: true, maxAge: 5 * 60 },
  },

  rateLimit: {
    enabled: true,
    storage: "database",
    window: 60,
    max: 60,
    customRules: {
      "/sign-in/email": { window: 300, max: 5 },
      "/request-password-reset": { window: 900, max: 3 },
      "/two-factor/verify-totp": { window: 300, max: 6 },
      "/two-factor/verify-backup-code": { window: 300, max: 6 },
    },
  },

  advanced: {
    cookiePrefix: "hr",
    useSecureCookies: isProd,
    ipAddress: { ipAddressHeaders: ["x-forwarded-for", "x-real-ip"] },
    defaultCookieAttributes: { sameSite: "lax", httpOnly: true, secure: isProd },
  },

  hooks: {
    before: createAuthMiddleware(async (ctx) => {
      // Pot de miel : un champ invisible rempli trahit un robot.
      if ((ctx.path === "/sign-in/email" || ctx.path === "/request-password-reset") && ctx.headers?.get("x-hp")) {
        throw new APIError("BAD_REQUEST", { message: "Requête refusée." });
      }
    }),
  },

  plugins: [twoFactor({ issuer: "hermannrichy.dev" }), nextCookies()],
});
