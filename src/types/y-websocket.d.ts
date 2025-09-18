/* eslint-disable @typescript-eslint/no-explicit-any */
// src/types/y-websocket.d.ts
declare module "y-websocket" {
  import * as Y from "yjs";
  import { Awareness } from "y-protocols/awareness";

  export class WebsocketProvider {
    constructor(
      serverUrl: string,
      roomName: string,
      doc: Y.Doc,
      options?: {
        awareness?: Awareness;
        params?: { [key: string]: string };
        WebSocketPolyfill?: any;
        resyncInterval?: number;
        maxBackoffTime?: number;
        disableBc?: boolean;
      }
    );

    public awareness: Awareness;
    public bcChannel: string;
    public doc: Y.Doc;
    public url: string;
    public roomname: string;
    public wsconnected: boolean;
    public wsconnecting: boolean;
    public bcconnected: boolean;
    public synced: boolean;
    public on(name: "sync", f: (isSynced: boolean) => void): void;
    public on(name: "status", f: (status: { status: string }) => void): void;
    public on(name: "conection-close", f: (event: any) => void): void;
    public on(name: "connection-error", f: (event: any) => void): void;
    public off(name: "sync", f: (isSynced: boolean) => void): void;
    public off(name: "status", f: (status: { status: string }) => void): void;
    public off(name: "conection-close", f: (event: any) => void): void;
    public off(name: "connection-error", f: (event: any) => void): void;
    public connect(): void;
    public disconnect(): void;
    public destroy(): void;
  }
}
