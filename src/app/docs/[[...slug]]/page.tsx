import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  DocsBody,
  DocsDescription,
  DocsPage,
  DocsTitle,
} from "fumadocs-ui/layouts/docs/page";
import { createRelativeLink } from "fumadocs-ui/mdx";
import { source } from "@/lib/source";
import { getMDXComponents } from "@/components/mdx";

export default async function Page(props: PageProps<"/docs/[[...slug]]">) {
  const params = await props.params;
  const page = source.getPage(params.slug);
  if (!page) notFound();

  const MDX = page.data.body;

  return (
    <DocsPage
      toc={page.data.toc}
      full={page.data.full}
      // The nav is a flat list of separators, so the section name only reaches
      // the breadcrumb via `includeSeparator` — that is what makes it read
      // "Components / Accordion" rather than just the page.
      breadcrumb={{
        includeSeparator: true,
        includePage: true,
        className: [
          "gap-2 font-mono text-[11px] tracking-[0.12em] uppercase text-fg-subtle",
          // Swap fumadocs' chevron icons for the design's slash.
          "[&>svg]:hidden",
          "[&>:not(svg):not(:first-child)]:before:mr-2 [&>:not(svg):not(:first-child)]:before:content-['/']",
          "[&>:last-child]:text-fg!",
        ].join(" "),
      }}
    >
      <DocsTitle className="text-[2.75rem] leading-[1.05] font-semibold tracking-[-0.035em]">
        {page.data.title}
      </DocsTitle>
      <DocsDescription className="max-w-[600px] text-[17px] leading-relaxed text-pretty text-fg-muted">
        {page.data.description}
      </DocsDescription>
      <DocsBody
        className={[
          // Scopes src/styles/docs-chrome.css, which restyles code blocks.
          "docs-body",
          // Section rhythm from the design: generous air above each heading,
          // headings themselves tighter and smaller than prose defaults.
          // Direct children only — Base UI's AccordionTrigger renders its own
          // <h3>, so a descendant selector restyles every preview on the page.
          "[&>h2]:mt-14 [&>h2]:mb-4 [&>h2]:text-[22px] [&>h2]:tracking-[-0.02em]",
          "[&>h3]:mt-8 [&>h3]:mb-2 [&>h3]:font-mono [&>h3]:text-[13px] [&>h3]:font-medium",
          // Inline code: a quiet tinted chip, not a bordered box.
          "[&_:not(pre)>code]:rounded [&_:not(pre)>code]:border-none [&_:not(pre)>code]:bg-surface",
          "[&_:not(pre)>code]:px-1.5 [&_:not(pre)>code]:py-0.5 [&_:not(pre)>code]:text-[12.5px]",
        ].join(" ")}
      >
        <MDX components={getMDXComponents({ a: createRelativeLink(source, page) })} />
      </DocsBody>
    </DocsPage>
  );
}

export async function generateStaticParams() {
  return source.generateParams();
}

export async function generateMetadata(
  props: PageProps<"/docs/[[...slug]]">,
): Promise<Metadata> {
  const params = await props.params;
  const page = source.getPage(params.slug);
  if (!page) notFound();

  return {
    title: page.data.title,
    description: page.data.description,
  };
}
