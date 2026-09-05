// Bundle entry for design-sync.
//
// sc1m distributes source through a shadcn registry rather than a compiled
// dist/, so this barrel over the real component sources IS the artifact the
// converter bundles - nothing here is reimplemented. Every component's
// index.ts re-exports its own module; 168 exports, no collisions.
//
// Regenerate after adding a component:
//   ls src/components/ui | sed 's|.*|export * from "../src/components/ui/&";|'

export * from "../src/components/ui/accordion";
export * from "../src/components/ui/ai-summary";
export * from "../src/components/ui/alert-dialog";
export * from "../src/components/ui/autocomplete";
export * from "../src/components/ui/avatar";
export * from "../src/components/ui/badge";
export * from "../src/components/ui/banner";
export * from "../src/components/ui/button";
export * from "../src/components/ui/checkbox";
export * from "../src/components/ui/checkbox-group";
export * from "../src/components/ui/collapsible";
export * from "../src/components/ui/combobox";
export * from "../src/components/ui/context-menu";
export * from "../src/components/ui/dialog";
export * from "../src/components/ui/drawer";
export * from "../src/components/ui/field";
export * from "../src/components/ui/fieldset";
export * from "../src/components/ui/form";
export * from "../src/components/ui/input";
export * from "../src/components/ui/menu";
export * from "../src/components/ui/menubar";
export * from "../src/components/ui/meter";
export * from "../src/components/ui/navigation-menu";
export * from "../src/components/ui/number-field";
export * from "../src/components/ui/otp-field";
export * from "../src/components/ui/popover";
export * from "../src/components/ui/preview-card";
export * from "../src/components/ui/progress";
export * from "../src/components/ui/radio";
export * from "../src/components/ui/radio-group";
export * from "../src/components/ui/scroll-area";
export * from "../src/components/ui/select";
export * from "../src/components/ui/separator";
export * from "../src/components/ui/slider";
export * from "../src/components/ui/switch";
export * from "../src/components/ui/tabs";
export * from "../src/components/ui/toast";
export * from "../src/components/ui/toggle";
export * from "../src/components/ui/toggle-group";
export * from "../src/components/ui/toolbar";
export * from "../src/components/ui/tooltip";

export { cn } from "../src/lib/cn";
