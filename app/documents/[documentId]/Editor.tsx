/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { EditorView, basicSetup } from "codemirror";
import { markdown } from "@codemirror/lang-markdown";
import { EditorState } from "@codemirror/state";
import { yCollab } from "y-codemirror.next";
import { WebsocketProvider } from "y-websocket";
import * as Y from "yjs";
import toolbar, { markdownItems } from "codemirror-toolbar";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { compileMdxFromServer } from "./actions";
import { Button } from "@/components/ui/button";
import { CloudCheck, Code, Columns2, Loader, MonitorPlay } from "lucide-react";
import { ImperativePanelHandle } from "react-resizable-panels";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface EditorProps {
  documentId: string;
  initialContent: string;
  userName: string;
}

const usercolors = [
  "#30bced",
  "#6eeb83",
  "#ffbc42",
  "#ecd444",
  "#ee6352",
  "#9ac2c9",
  "#8acb88",
  "#1be7ff",
];

const userColor = usercolors[Math.floor(Math.random() * usercolors.length)];

const uploadFile = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Server error: ${response.statusText}`);
    }

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.error || "Upload failed");
    }

    return result.path;
  } catch (error) {
    console.error("Upload error:", error);
    throw error;
  }
};

export default function Editor({
  documentId,
  initialContent,
  userName,
}: EditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView | null>(null);

  const [isSaving, setIsSaving] = useState(false);
  const [editorContent, setEditorContent] = useState(initialContent);
  const [debouncedContent, setDebouncedContent] = useState(initialContent);
  const [compiledContent, setCompiledContent] =
    useState<React.ReactNode | null>(<div></div>);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    setIsSaving(false);
    const handler = setTimeout(() => {
      setDebouncedContent(editorContent);
      setIsSaving(true);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [editorContent]);

  useEffect(() => {
    if (
      debouncedContent === initialContent &&
      debouncedContent &&
      !debouncedContent.trim()
    ) {
      return;
    }

    startTransition(async () => {
      const result = await compileMdxFromServer(debouncedContent);
      setCompiledContent(result);
    });
  }, [debouncedContent, initialContent]);

  useEffect(() => {
    if (!editorRef.current || viewRef.current) return;

    const imageDropExtension = EditorView.domEventHandlers({
      drop: (event, view) => {
        event.preventDefault();
        const files = event.dataTransfer?.files;
        if (!files || files.length === 0) {
          return;
        }

        const pos = view.posAtCoords({ x: event.clientX, y: event.clientY });
        if (pos === null) {
          return;
        }

        for (const file of Array.from(files)) {
          if (file.type.startsWith("image/")) {
            const placeholder = `![Uploading ${file.name}...]`;

            view.dispatch({
              changes: { from: pos, insert: placeholder },
            });

            uploadFile(file)
              .then((path) => {
                const markdownImage = `![${file.name}](${path})`;
                const doc = view.state.doc.toString();
                const placeholderIndex = doc.indexOf(
                  placeholder,
                  pos - placeholder.length - 10
                );

                if (placeholderIndex > -1) {
                  view.dispatch({
                    changes: {
                      from: placeholderIndex,
                      to: placeholderIndex + placeholder.length,
                      insert: markdownImage,
                    },
                  });
                }
              })
              .catch((err) => {
                console.error(err);
                const doc = view.state.doc.toString();
                const placeholderIndex = doc.indexOf(
                  placeholder,
                  pos - placeholder.length - 10
                );

                if (placeholderIndex > -1) {
                  view.dispatch({
                    changes: {
                      from: placeholderIndex,
                      to: placeholderIndex + placeholder.length,
                      insert: `[Upload failed for ${file.name}]`,
                    },
                  });
                }
              });
          }
        }
      },
      dragover: (event) => {
        event.preventDefault();
      },
      paste: (event, view) => {
        const files = event.clipboardData?.files;
        if (!files || files.length === 0) {
          return;
        }

        const imageFiles = Array.from(files).filter((file) =>
          file.type.startsWith("image/")
        );

        if (imageFiles.length === 0) {
          return;
        }

        event.preventDefault();

        const pos = view.state.selection.main.head;

        for (const file of imageFiles) {
          const placeholder = `![Uploading ${file.name}...]`;

          view.dispatch({
            changes: { from: pos, insert: placeholder },
          });

          uploadFile(file)
            .then((path) => {
              const markdownImage = `![${file.name}](${path})`;
              const doc = view.state.doc.toString();
              const placeholderIndex = doc.indexOf(
                placeholder,
                pos - placeholder.length - 10
              );

              if (placeholderIndex > -1) {
                view.dispatch({
                  changes: {
                    from: placeholderIndex,
                    to: placeholderIndex + placeholder.length,
                    insert: markdownImage,
                  },
                });
              }
            })
            .catch((err) => {
              console.error(err);
              const doc = view.state.doc.toString();
              const placeholderIndex = doc.indexOf(
                placeholder,
                pos - placeholder.length - 10
              );

              if (placeholderIndex > -1) {
                view.dispatch({
                  changes: {
                    from: placeholderIndex,
                    to: placeholderIndex + placeholder.length,
                    insert: `[Upload failed for ${file.name}]`,
                  },
                });
              }
            });
        }
      },
    });

    const ydoc = new Y.Doc();
    const provider = new WebsocketProvider(
      `ws://${process.env.NEXT_PUBLIC_WEBSOCKET_URL}`,
      documentId,
      ydoc
    );
    const ytext = ydoc.getText("codemirror");

    const onSync = (isSynced: boolean) => {
      if (isSynced && ytext.length === 0) {
        ytext.insert(0, initialContent);
      }
      provider.off("sync", onSync);
    };
    provider.on("sync", onSync);

    provider.awareness.setLocalStateField("user", {
      name: userName,
      color: userColor,
      colorLight: userColor + "33",
    });

    const state = EditorState.create({
      doc: ytext.toString(),
      extensions: [
        basicSetup,
        toolbar({ items: markdownItems }),
        yCollab(ytext, provider.awareness),
        markdown(),
        imageDropExtension,
        EditorView.lineWrapping,
        EditorView.updateListener.of((v) => {
          if (v.docChanged) {
            setEditorContent(v.state.doc.toString());
          }
        }),
      ],
    });

    const view = new EditorView({
      state,
      parent: editorRef.current,
    });
    viewRef.current = view;

    return () => {
      provider.disconnect();
      view.destroy();
      viewRef.current = null;
    };
  }, [documentId, initialContent, userName]);

  const leftPanelRef = useRef<ImperativePanelHandle>(null);
  const rightPanelRef = useRef<ImperativePanelHandle>(null);

  const collapseLeftPanel = () => {
    leftPanelRef.current?.collapse();
  };

  const collapseRightPanel = () => {
    rightPanelRef.current?.collapse();
  };

  const resize5050Panel = () => {
    leftPanelRef.current?.resize(50);
    rightPanelRef.current?.resize(50);
  };

  return (
    <>
      <div className="absolute flex gap-2 right-12 z-[100] bottom-12">
        {isSaving ? (
          <Tooltip>
            <TooltipTrigger asChild>
              <CloudCheck />
            </TooltipTrigger>
            <TooltipContent>
              <p>Perubahan anda telah disimpan.</p>
            </TooltipContent>
          </Tooltip>
        ) : (
          <Loader className="animate-spin" />
        )}
      </div>
      <div className="absolute flex gap-2 right-6 z-[100] top-24">
        <Button
          onClick={collapseRightPanel}
          className="cursor-pointer"
          variant={`outline`}
          size={`icon`}
        >
          <Code />
        </Button>
        <Button
          onClick={resize5050Panel}
          className="cursor-pointer"
          variant={`outline`}
          size={`icon`}
        >
          <Columns2 />
        </Button>
        <Button
          onClick={collapseLeftPanel}
          className="cursor-pointer"
          variant={`outline`}
          size={`icon`}
        >
          <MonitorPlay />
        </Button>
      </div>
      <ResizablePanelGroup className="fixed" direction="horizontal">
        <ResizablePanel collapsible className="z-[50]" ref={leftPanelRef}>
          <div ref={editorRef} />
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel collapsible ref={rightPanelRef}>
          <div className="p-8 prose h-screen overflow-y-scroll">
            {compiledContent}
            <div className="pt-24" />
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </>
  );
}
