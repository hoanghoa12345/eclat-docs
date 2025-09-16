
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Collaboration } from "@tiptap/extension-collaboration";
import { useEditorStore } from "@/store/useEditorStore";
import * as Y from "yjs";
import CollaborationCaret from '@tiptap/extension-collaboration-caret'

export const LEFT_MARGIN_DEFAULT = 56;
export const RIGHT_MARGIN_DEFAULT = 56

interface EditorProps {
    initialContent?: string | undefined;
}

export const Editor = ({ initialContent }: EditorProps) => {
    const leftMargin = LEFT_MARGIN_DEFAULT;
    const rightMargin = RIGHT_MARGIN_DEFAULT;

    const { setEditor } = useEditorStore();

    const editor = useEditor({
        immediatelyRender: false,
        content: initialContent ? JSON.parse(initialContent) : '',
        onCreate({ editor }) {
            setEditor(editor);
        },
        onDestroy() {
            setEditor(null);
        },
        onUpdate({ editor }) {
            setEditor(editor);
        },
        onSelectionUpdate({ editor }) {
            setEditor(editor);
        },
        onTransaction({ editor }) {
            setEditor(editor);
        },
        onFocus({ editor }) {
            setEditor(editor);
        },
        onBlur({ editor }) {
            setEditor(editor);
        },
        onContentError({ editor }) {
            setEditor(editor);
        },
        editorProps: {
            attributes: {
                style: `padding-left: ${leftMargin}px; padding-right: ${rightMargin}px;`,
                class:
                    "focus:outline-none print:boder-0 border bg-white border-editor-border flex flex-col min-h-[1054px] w-[816px] pt-10 pr-14 pb-10 cursor-text",
            },
        },
        extensions: [
            StarterKit.configure({
                
            }),
            //   Table,
            //   TableCell,
            //   TableHeader,
            //   TableRow,
            //   TaskList,
            //   Image,
            //   ImageResize,
            //   Underline,
            //   FontFamily,
            //   TextStyle,
            //   Color,
            //   LineHeightExtension.configure({
            //     types: ["heading", "paragraph"],
            //     defaultLineHeight: "1.5",
            //   }),
            //   FontSizeExtensions,
            //   TextAlign.configure({
            //     types: ["heading", "paragraph"],
            //   }),
            //   Link.configure({
            //     openOnClick: false,
            //     autolink: true,
            //     defaultProtocol: "https",
            //   }),
            //   Highlight.configure({
            //     multicolor: true,
            //   }),
            //   TaskItem.configure({ nested: true }),
        ],
    });

    return <div className="size-full overflow-x-auto bg-editor-bg px-4 print:p-0 print:bg-white print:overflow-visible">
        {/* <Ruler /> */}
        <div className="min-w-max flex justify-center w-[816px] py-4 print:py-0 mx-auto print:w-full print:min-w-0">
            <EditorContent editor={editor} />
        </div>
    </div>;
};
