
import { useEffect, useState } from "react";
import * as Y from "yjs";
import { actions } from "astro:actions";

export const useYjsAstroProvider = (documentId: string) => {
    const [ydoc, setYdoc] = useState<Y.Doc | null>(null);

    useEffect(() => {
        const doc = new Y.Doc();
        setYdoc(doc);

        if (documentId !== 'new-document') {
            actions.getDocument({ id: documentId }).then(({data}) => {
                if (data?.content) {
                    try {
                        // The content is a base64 string, so we need to decode it
                        // This is a workaround for the fact that client-side `Buffer` is not available
                        const binaryString = atob(data.content);
                        const len = binaryString.length;
                        const bytes = new Uint8Array(len);
                        for (let i = 0; i < len; i++) {
                            bytes[i] = binaryString.charCodeAt(i);
                        }

                        Y.applyUpdate(doc, bytes);
                    } catch (e) {
                        console.error("Error applying update to Y.Doc:", e);
                    }
                }
            });
        }

        return () => {
            doc.destroy();
        };
    }, [documentId]);

    return ydoc;
};
