import { Children, type ReactNode } from "react";
import { Text, TextClassContext } from "../text";

/** Bare strings/numbers need a Text boundary on Native; custom nodes stay intact. */
export function AccordionText({ children, className }: { children: ReactNode; className: string }) {
  return (
    <TextClassContext.Provider value={className}>
      {Children.map(children, (child) =>
        typeof child === "string" || typeof child === "number" ? <Text>{child}</Text> : child,
      )}
    </TextClassContext.Provider>
  );
}
