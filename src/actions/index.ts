import { defineAction } from "astro:actions";
import { z } from "astro:schema";
import { and, eq } from "drizzle-orm";
import { nanoid } from "nanoid";

import { db } from "@/db/drizzle";
import { document } from "@/db/schema";
import { auth } from "@/lib/auth";

export const server = {
  createDocument: defineAction({
    accept: "json",
    input: z.object({
      template: z.string().optional(),
    }),
    handler: async (input, context) => {
      const session = await auth.api.getSession({
        headers: context.request.headers,
      });
      if (!session?.user) {
        throw new Error("Unauthorized");
      }

      const result = await db
        .insert(document)
        .values({
          id: nanoid(),
          title: "Untitled",
          content: "",
          userId: session.user.id,
          templateId: input?.template,
          organizationId: null,
        })
        .returning({
          id: document.id,
        });

      return result[0];
    },
  }),
  getDocument: defineAction({
    accept: "json",
    input: z.object({
      id: z.string(),
    }),
    handler: async (input, context) => {
      const session = await auth.api.getSession({
        headers: context.request.headers,
      });
      if (!session?.user) {
        throw new Error("Unauthorized");
      }

      const doc = await db.query.document.findFirst({
        where: and(
          eq(document.id, input.id),
          eq(document.userId, session.user.id)
        ),
      });

      return {
        ...doc,
        content: doc?.content,
      };
    },
  }),
  updateDocumentContent: defineAction({
    accept: "json",
    input: z.object({
      id: z.string(),
      content: z.string(),
    }),
    handler: async (input, context) => {
      const session = await auth.api.getSession({
        headers: context.request.headers,
      });
      if (!session?.user) {
        throw new Error("Unauthorized");
      }

      await db
        .update(document)
        .set({
          content: input.content,
        })
        .where(
          and(eq(document.id, input.id), eq(document.userId, session.user.id))
        );

      return { success: true };
    },
  }),
  updateDocumentTitle: defineAction({
    accept: "json",
    input: z.object({
      id: z.string(),
      title: z.string(),
    }),
    handler: async (input, context) => {
      const session = await auth.api.getSession({
        headers: context.request.headers,
      });
      if (!session?.user) {
        throw new Error("Unauthorized");
      }

      if (input.id === "new-document") {
        // If the document is new, just return the title
        return input.title;
      }

      const result = await db
        .update(document)
        .set({
          title: input.title,
        })
        .where(
          and(eq(document.id, input.id), eq(document.userId, session.user.id))
        )
        .returning({
          title: document.title,
        });

      return result[0].title;
    },
  }),
};
