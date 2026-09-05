import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: (
        <span className="text-sm font-semibold tracking-tight">
          sc1m<span className="text-fg-subtle">/design</span>
        </span>
      ),
      url: "/",
    },
    links: [
      { text: "Gallery", url: "/", active: "none" },
      { text: "Registry", url: "/r/registry.json", active: "none" },
    ],
    githubUrl: "https://github.com/maaraquel08/sc1m",
  };
}
