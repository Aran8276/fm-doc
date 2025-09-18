"use client";

import { useEffect, useRef } from "react";
import { EditorView, basicSetup } from "codemirror";
import { markdown } from "@codemirror/lang-markdown";
import { EditorState } from "@codemirror/state";
import { yCollab } from "y-codemirror.next";
import { WebsocketProvider } from "y-websocket";
import * as Y from "yjs";

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

  useEffect(() => {
    if (!editorRef.current) return;
    if (viewRef.current) return;

    const ydoc = new Y.Doc();
    const provider = new WebsocketProvider(
      `ws://${process.env.NEXT_PUBLIC_WEBSOCKET_URL}`,
      documentId,
      ydoc
    );
    const ytext = ydoc.getText("codemirror");

    provider.awareness.setLocalStateField("user", {
      name: userName,
      color: userColor,
      colorLight: userColor + "33",
    });

    const state = EditorState.create({
      doc: ytext.toString() || initialContent,
      extensions: [basicSetup, yCollab(ytext, provider.awareness), markdown()],
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

  return <div ref={editorRef} className="border rounded-md"></div>;
}
