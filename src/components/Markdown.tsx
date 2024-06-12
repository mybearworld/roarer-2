import { createContext, useContext, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkBreaks from "remark-breaks";
import remarkGfm from "remark-gfm";
import { codeToHtml } from "shiki";
import { twMerge } from "tailwind-merge";
import { hostWhitelist } from "../lib/hostWhitelist";

const IsPreContext = createContext(false);
const DISALLOWED_INLINE = [
  "blockquote",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "hr",
  "img",
  "input",
  "li",
  "ol",
  "pre",
  "table",
  "tbody",
  "td",
  "th",
  "thead",
  "tr",
  "ul",
];

export type MarkdownProps = {
  children: string;
  secondaryBackground?: boolean;
  inline?: boolean;
};
export const Markdown = (mdProps: MarkdownProps) => {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm, remarkBreaks]}
      disallowedElements={mdProps.inline ? DISALLOWED_INLINE : []}
      unwrapDisallowed
      components={{
        a: (props) => (
          <a
            href={props.href}
            title={props.title}
            className="font-bold text-lime-600"
          >
            {props.children}
          </a>
        ),
        blockquote: (props) => (
          <blockquote className="border-l-2 border-lime-500 pl-2 dark:border-lime-600">
            {props.children}
          </blockquote>
        ),
        code: (props) => {
          const isPre = useContext(IsPreContext);
          const [code, setCode] = useState("");
          const language = props.className?.replace("language-", "");
          const className = twMerge(
            "bg-gray-800 text-gray-100 rounded-lg px-1 py-0.5",
          );
          if (language) {
            codeToHtml(props.children?.toString() ?? "", {
              lang: language,
              theme: "github-dark-default",
              structure: "inline",
            }).then(setCode);
          }
          return isPre ? (
            <pre className={className}>
              {code ? (
                <code dangerouslySetInnerHTML={{ __html: code }} />
              ) : (
                <code>{props.children}</code>
              )}
            </pre>
          ) : (
            <code className={className}>{props.children}</code>
          );
        },
        h1: (props) => <p className="text-2xl font-bold">{props.children}</p>,
        h2: (props) => <p className="text-xl font-bold">{props.children}</p>,
        h3: (props) => <p className="text-lg font-bold">{props.children}</p>,
        h4: (props) => <p className="text-lg font-bold">{props.children}</p>,
        h5: (props) => <p className="text-md font-bold">{props.children}</p>,
        h6: (props) => <p className="text-sm font-bold">{props.children}</p>,
        hr: () => <hr className="mx-12 my-2 border-current opacity-20" />,
        img: (props) =>
          hostWhitelist.some((host) => props.src?.startsWith(host)) ? (
            <img src={props.src} alt={props.alt} title={props.title} />
          ) : (
            <a className="font-bold text-lime-600" href={props.src}>
              {props.alt || "Unnamed image"}
            </a>
          ),
        input: (props) => (
          <>
            <input type="checkbox" checked={props.checked} aria-hidden />
            <span className="sr-only">
              {props.checked ? "Done" : "Not done"}
            </span>
          </>
        ),
        ol: (props) => (
          <ol className="table border-spacing-x-1 list-inside list-decimal">
            {props.children}
          </ol>
        ),
        li: (props) => (
          <li className="table-row">
            <span className="table-cell text-right">
              <span className="list-item" />
            </span>
            <div className="table-cell">{props.children}</div>
          </li>
        ),
        p: (props) => (
          <p className="my-1 first:mt-0 last:mb-0">{props.children}</p>
        ),
        pre: (props) => (
          <IsPreContext.Provider value={true}>
            {props.children}
          </IsPreContext.Provider>
        ),
        table: (props) => (
          <table className="border-collapse">{props.children}</table>
        ),
        td: (props) => (
          <td className="border border-gray-300 px-2" style={props.style}>
            {props.children}
          </td>
        ),
        th: (props) => (
          <th className="border border-gray-300 px-2" style={props.style}>
            {props.children}
          </th>
        ),
        ul: (props) => (
          <ul className="table list-inside list-disc">{props.children}</ul>
        ),
      }}
    >
      {mdProps.children}
    </ReactMarkdown>
  );
};
