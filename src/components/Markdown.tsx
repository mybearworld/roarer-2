import { useState } from "react";
import { twMerge } from "tailwind-merge";
import Marked from "marked-react";
import { codeToHtml } from "shiki";
// import { urlFromDiscordEmoji } from "../lib/discordEmoji";
import { hostWhitelist } from "../lib/hostWhitelist";
import { User } from "./User";

const HEADING_TO_SIZE = {
  1: "text-2xl",
  2: "text-xl",
  3: "text-lg",
  4: "text-md",
  5: "text-sm",
  6: "text-xs",
} as const;

export type MarkdownProps = {
  children: string;
  secondaryBackground?: boolean;
  inline?: boolean;
};
export const Markdown = (mdProps: MarkdownProps) => {
  const md = mdProps.children;
  return (
    <Marked
      gfm
      breaks
      isInline={!!mdProps.inline}
      langPrefix=""
      renderer={{
        code: (code, lang) => {
          const [syntaxHighlighted, setSyntaxHighlighted] = useState("");
          if (lang) {
            codeToHtml(code?.toString() ?? "", {
              lang,
              theme: "github-dark-default",
              structure: "inline",
            }).then(setSyntaxHighlighted);
          }
          return (
            <pre className="overflow-auto rounded-lg bg-gray-800 px-1 py-0.5 text-gray-100">
              {syntaxHighlighted ? (
                <code dangerouslySetInnerHTML={{ __html: syntaxHighlighted }} />
              ) : (
                <code>{code}</code>
              )}
            </pre>
          );
        },
        blockquote: (children) => (
          <blockquote className="border-l-2 border-lime-500 pl-2 dark:border-lime-600">
            {children}
          </blockquote>
        ),
        heading: (children, level) => (
          <p className={twMerge("font-bold", HEADING_TO_SIZE[level])}>
            {children}
          </p>
        ),
        hr: () => <hr className="mx-12 my-2 border-current opacity-20" />,
        list: (children, ordered) => {
          const Tag = ordered ? "ol" : "ul";
          return (
            <Tag
              className={twMerge(
                "table border-spacing-x-1 list-inside",
                ordered ? "list-decimal" : "list-disc",
              )}
            >
              {children}
            </Tag>
          );
        },
        listItem: (children) => (
          <li className="table-row">
            <span className="table-cell text-right">
              <span className="list-item" />
            </span>
            <div className="table-cell">{children}</div>
          </li>
        ),
        checkbox: (checked) => (
          <>
            <input
              className="mr-2"
              type="checkbox"
              checked={!!checked}
              readOnly
              aria-hidden
            />
            <span className="sr-only">{checked ? "Done" : "Not done"}</span>
          </>
        ),
        paragraph: (children) => (
          <p className="my-1 first:mt-0 last:mb-0">{children}</p>
        ),
        table: (children) => (
          <table className="border-collapse">{children}</table>
        ),
        tableCell: (children, flags) => {
          const Tag = flags.header ? "th" : "td";
          return (
            <Tag
              className="border border-gray-300 px-2"
              style={{ textAlign: flags.align ?? "left" }}
            >
              {children}
            </Tag>
          );
        },
        link: (href, text) => {
          const match = href.match(
            /^https?:\/\/app.meower.org\/users\/([a-z0-9\-_]+)$/i,
          );
          if (match) {
            const username = match[1]!;
            return (
              <User username={username}>
                <button type="button" className="font-bold text-lime-600">
                  {text}
                </button>
              </User>
            );
          }
          return (
            <a href={href} className="font-bold text-lime-600">
              {text}
            </a>
          );
        },
        image: (src, alt, title) =>
          hostWhitelist.some((host) => src.startsWith(host)) ? (
            <img
              src={src}
              alt={alt}
              title={title ?? ""}
              className="inline-block"
            />
          ) : (
            <a className="font-bold text-lime-600" href={src}>
              {alt || "Unnamed image"}
            </a>
          ),
      }}
    >
      {md}
    </Marked>
  );
};
