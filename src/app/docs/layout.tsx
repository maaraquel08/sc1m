import { DocsLayout } from "fumadocs-ui/layouts/docs";
import { source } from "@/lib/source";
import { baseOptions } from "@/lib/layout.shared";
import { BrandSwitcher } from "@/components/site/brand-switcher";
import { sidebarClassName, sidebarComponents } from "@/components/site/sidebar-nav";

export default function Layout({ children }: LayoutProps<"/docs">) {
  return (
    <DocsLayout
      tree={source.getPageTree()}
      {...baseOptions()}
      sidebar={{
        className: sidebarClassName,
        components: sidebarComponents,
        footer: <BrandSwitcher key="brand-switcher" />,
      }}
    >
      {children}
    </DocsLayout>
  );
}
