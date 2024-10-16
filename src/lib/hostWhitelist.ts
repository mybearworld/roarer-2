/**
 * This list is taken from https://github.com/meower-media-co/Meower-Svelte.
 * @license MIT by Meower Media
 */

// IP grabber sites exist, and I don't know if hosting a proxy is feasible
// WARNING: Put a / at the end of each URL so it can't be bypassed
// (like https://http.meower.org@evilsite.bad)!
export const hostWhitelist: (string | { url: string; autolink: boolean })[] = [
  // Meower
  { url: "https://meower.org/", autolink: false },
  "https://http.meower.org/",
  "https://assets.meower.org/",
  "https://forums.meower.org/",
  "https://go.meower.org/", // not everyone can add urls to go.meower.org, should be fine
  "https://hedgedoc.meower.org/",
  "https://docs.meower.org/",
  "https://uploads.meower.org/", // now™

  // cubeupload
  "https://u.cubeupload.com/",
  "https://cubeupload.com/",

  // ImgBB
  "https://i.ibb.co/",

  // Tenor
  "https://media.tenor.com/",
  "https://tenor.com/",
  "https://c.tenor.com/",

  // Scratch (assets file uploading exists)
  "https://assets.scratch.mit.edu/",
  "https://cdn2.scratch.mit.edu/",
  "https://cdn.scratch.mit.edu/",
  "https://uploads.scratch.mit.edu/",

  // Discord
  "https://cdn.discordapp.com/",
  "https://media.discordapp.net/",
];
