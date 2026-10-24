import type { ReactNode } from "react";

/** Shared editorial heading for public pages; keeps heading hierarchy consistent. */
export function PageIntro({
  eyebrow,
  title,
  children,
  dark = false,
}: {
  eyebrow: string;
  title: string;
  children: ReactNode;
  dark?: boolean;
}) {
  return (
    <header className={`page-intro ${dark ? "page-intro-dark" : ""}`}>
      <div className="site-container">
        <p className="eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        <div className="intro-copy">{children}</div>
      </div>
    </header>
  );
}
