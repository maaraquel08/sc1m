import { CodeBlock, Pre } from "fumadocs-ui/components/codeblock";

/**
 * The "Composition" block from shadcn/ui component pages: an ASCII tree of the
 * parts a component is assembled from.
 *
 * Authors write indentation, not box-drawing characters — two spaces per level
 * — and this draws the connectors. Hand-drawn `├──` runs drift the moment a
 * part is added or renamed, which is exactly the edit these pages get most.
 *
 *   <Composition>{`
 *     Accordion
 *       AccordionItem
 *         AccordionTrigger
 *         AccordionPanel
 *   `}</Composition>
 */

interface Node {
  label: string;
  children: Node[];
}

const INDENT_WIDTH = 2;

function parse(source: string): Node[] {
  const lines = source
    .split("\n")
    .filter((line) => line.trim().length > 0)
    .map((line) => ({
      label: line.trim(),
      indent: line.length - line.trimStart().length,
    }));

  // Indentation is relative to the shallowest line, so the template literal can
  // sit at any indentation inside the MDX file.
  const base = Math.min(...lines.map((line) => line.indent));

  const roots: Node[] = [];
  // stack[depth] holds the most recent node opened at that depth.
  const stack: Node[] = [];

  for (const line of lines) {
    const depth = Math.round((line.indent - base) / INDENT_WIDTH);
    const node: Node = { label: line.label, children: [] };
    const parent = stack[depth - 1];

    if (depth === 0 || !parent) roots.push(node);
    else parent.children.push(node);

    stack.length = depth;
    stack[depth] = node;
  }

  return roots;
}

function branch(nodes: Node[], prefix: string, out: string[]): void {
  nodes.forEach((node, index) => {
    const last = index === nodes.length - 1;
    out.push(`${prefix}${last ? "└──" : "├──"} ${node.label}`);
    branch(node.children, `${prefix}${last ? "    " : "│   "}`, out);
  });
}

function render(roots: Node[]): string[] {
  const out: string[] = [];

  // A root prints bare and its children start at column zero, so the tree
  // hangs off the component name rather than being indented under it.
  for (const root of roots) {
    out.push(root.label);
    branch(root.children, "", out);
  }

  return out;
}

export function Composition({ children }: { children: string }) {
  const tree = render(parse(children));

  return (
    <CodeBlock>
      <Pre>
        <code>
          {tree.map((line, index) => (
            // Sibling subtrees repeat verbatim, so the line is not a stable key.
            <span className="line" key={index}>
              {line}
            </span>
          ))}
        </code>
      </Pre>
    </CodeBlock>
  );
}
