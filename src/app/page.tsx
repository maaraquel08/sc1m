import Link from "next/link";
import { GithubLogo } from "@phosphor-icons/react/dist/ssr";

import { Reel } from "@/components/site/landing/reel";
import { ThemeToggle } from "@/components/site/theme-toggle";

/**
 * Landing study 3A — "A reel of miniatures".
 *
 * One screen: the work itself, laid out as a reel of miniature screens that
 * doubles as the journal of how the system was built. No swatch galleries and
 * no foundations tour — those live in /docs. The argument the page makes is
 * that every screen came out of the same contract, so the page shows screens.
 */
export default function Home() {
  return (
    <div className="flex min-h-dvh flex-1 flex-col">
      <header className="flex items-center justify-between gap-6 px-6 py-6 sm:px-14 sm:py-8">
        <span className="text-[19px] font-semibold tracking-[-0.01em] text-fg">
          sc1m<span className="text-fg-subtle">/design</span>
        </span>
        <nav
          aria-label="Primary"
          className="flex items-center gap-5 text-[14.5px] text-fg-muted sm:gap-7"
        >
          <span aria-current="page" className="text-fg">
            Designs
          </span>
          <Link href="/docs" className="transition-colors duration-fast hover:text-fg">
            Documentation
          </Link>
          <ThemeToggle />
        </nav>
      </header>

      <main className="flex flex-1 flex-col pt-4 pb-6 sm:pt-9">
        <Reel />
      </main>

      <footer className="mt-auto flex items-center justify-between gap-6 px-6 pt-6 pb-8 text-[13px] text-fg-subtle sm:px-14">
        <a
          href="https://github.com/maaraquel08/sc1m"
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-[9px] transition-colors duration-fast hover:text-fg"
        >
          <GithubLogo weight="fill" className="size-[15px]" />
          Built in the open · maaraquel08/sc1m
        </a>
        <span className="block h-5 overflow-hidden">
          <span className="role-roll flex flex-col">
            <span className="h-5 leading-5 font-medium whitespace-nowrap text-fg">
              Michael Anthony Raquel
            </span>
            <span className="h-5 leading-5 whitespace-nowrap text-fg-muted">
              Senior Product Designer
            </span>
            <span className="h-5 leading-5 whitespace-nowrap text-fg-muted">
              Interaction Designer
            </span>
            <span className="h-5 leading-5 whitespace-nowrap text-fg-muted">
              Manila, Philippines
            </span>
            <span className="h-5 leading-5 font-medium whitespace-nowrap text-fg">
              Michael Anthony Raquel
            </span>
          </span>
        </span>
      </footer>
    </div>
  );
}
