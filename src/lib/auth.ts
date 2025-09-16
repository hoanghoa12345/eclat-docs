import { betterAuth } from "better-auth"
import { genericOAuth } from "better-auth/plugins"
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db/drizzle";
import { schema } from "@/db/schema";

export const auth = betterAuth({
    // ... other config options
    plugins: [
        genericOAuth({
            config: [
                {
                    providerId: "auth0",
                    clientId: import.meta.env.AUTH0_CLIENT_ID as string,
                    clientSecret: import.meta.env.AUTH0_CLIENT_SECRET as string,
                    discoveryUrl: `https://${import.meta.env.AUTH0_DOMAIN_URL}/.well-known/openid-configuration`,
                    scopes: ["openid", "profile", "email"],
                    accessType: 'offline',
                    pkce: true,
                    authorizationUrl: `https://${import.meta.env.AUTH0_DOMAIN_URL}/auth`,
                    tokenUrl: `https://${import.meta.env.AUTH0_DOMAIN_URL}/token`,
                    userInfoUrl: `https://${import.meta.env.AUTH0_DOMAIN_URL}/me`,
                }
            ]
        }),
    ],
    rateLimit: {
        enabled: true
    },
    logger: {
        disabled: false,
        level: "error",
        log: (level, message, ...args) => {
            // Custom logging implementation
            console.log(`better auth [${level}] ${message}`, ...args);
        }
    },
    trustedOrigins: [
        process.env.BETTER_AUTH_URL || ''
    ],
    secret: process.env.AUTH_SECRET,
    baseURL: process.env.BETTER_AUTH_URL,
    database: drizzleAdapter(db, {
        provider: "sqlite",
        schema,
    })
},)