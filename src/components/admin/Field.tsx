"use client";

import { cloneElement, useId, type ReactElement } from "react";

/** Explicit label/description IDs keep helpful hints out of the input name. */
export function Field({
  label,
  hint,
  children,
  wide = false,
}: {
  label: string;
  hint?: string;
  children: ReactElement<{
    id?: string;
    "aria-labelledby"?: string;
    "aria-describedby"?: string;
  }>;
  wide?: boolean;
}) {
  const id = useId();
  return (
    <label htmlFor={id} className={`admin-field ${wide ? "field-wide" : ""}`}>
      <span id={`${id}-label`}>{label}</span>
      {cloneElement(children, {
        id,
        "aria-labelledby": `${id}-label`,
        "aria-describedby": hint ? `${id}-hint` : undefined,
      })}
      {hint && <small id={`${id}-hint`}>{hint}</small>}
    </label>
  );
}
