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
import { Code, Columns2, MonitorPlay } from "lucide-react";
import { ImperativePanelHandle } from "react-resizable-panels";
import { WebSocketErrorDialog } from "@/app/components/WebSocketErrorDialog";

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

export default function Editor({
  documentId,
  initialContent,
  userName,
}: EditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView | null>(null);

  const [editorContent, setEditorContent] = useState(initialContent);
  const [debouncedContent, setDebouncedContent] = useState(initialContent);
  const [compiledContent, setCompiledContent] =
    useState<React.ReactNode | null>(<div>Type to see a preview...</div>);
  const [isPending, startTransition] = useTransition();
  const [isErrorDialogOpen, setIsErrorDialogOpen] = useState(false);
  const handleCloseDialog = () => {
    setIsErrorDialogOpen(false);
  };

  const showWebSocketError = () => {
    setIsErrorDialogOpen(true);
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedContent(editorContent);
    }, 500);

    return () => clearTimeout(handler);
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
    console.log(documentId);

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
    const panel = leftPanelRef.current;
    if (panel) {
      panel.collapse();
    }
  };

  const collapseRightPanel = () => {
    const panel = rightPanelRef.current;
    if (panel) {
      panel.collapse();
    }
  };

  const resize5050Panel = () => {
    const leftPanel = leftPanelRef.current;
    const rightPanel = rightPanelRef.current;
    if (leftPanel && rightPanel) {
      leftPanel.resize(50);
      rightPanel.resize(50);
    }
  };

  return (
    <>
      <WebSocketErrorDialog
        isOpen={isErrorDialogOpen}
        onClose={handleCloseDialog}
      />
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
