const searchParams = new URLSearchParams(location.search);

const removeSlash = (s: string | null) =>
  !s ? s
  : s.endsWith("/") ? s.slice(0, -1)
  : s;

// i won't let a url tell me what to do
export const api =
  removeSlash(searchParams.get("api")) ??
  "https://meower-thing-dont-actually-use-pls.goog-search.eu.org";
export const cl =
  removeSlash(searchParams.get("cl")) ?? "wss://meower-ws.goog-search.eu.org";
export const uploads =
  removeSlash(searchParams.get("uploads")) ??
  "https://meow-uploads.goog-search.eu.org";
