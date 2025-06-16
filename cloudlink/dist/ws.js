let ws;
if (globalThis.WebSocket) {
  ws = WebSocket;
} else {
  // ws = (await import("ws")).default;
}
export { ws };
