import defaultMdxComponents from "fumadocs-ui/mdx";
import { Tab, Tabs } from "fumadocs-ui/components/tabs";
import { Step, Steps } from "fumadocs-ui/components/steps";
import { Accordion, Accordions } from "fumadocs-ui/components/accordion";
import { TypeTable } from "fumadocs-ui/components/type-table";
import type { MDXComponents } from "mdx/types";
import { Callout } from "@/components/site/callout";
import { PMCommand } from "@/components/site/pm-command";
import { Composition } from "@/components/site/composition";
import { Chips, Preview, SpecTable } from "@/components/site/docs-page";
import { Demo, DemoCode, DemoPreview } from "@/components/site/demo";

export function getMDXComponents(components?: MDXComponents) {
  return {
    ...defaultMdxComponents,
    Tab,
    Tabs,
    Step,
    Steps,
    Callout,
    Accordion,
    Accordions,
    TypeTable,
    PMCommand,
    Composition,
    Chips,
    Preview,
    SpecTable,
    Demo,
    DemoPreview,
    DemoCode,
    ...components,
  } satisfies MDXComponents;
}

export const useMDXComponents = getMDXComponents;

declare global {
  type MDXProvidedComponents = ReturnType<typeof getMDXComponents>;
}
