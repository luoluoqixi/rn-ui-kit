import { createContext } from "react";

/** Shared by text and icon slots without importing platform adapters. */
export const TextClassContext = createContext<string | undefined>(undefined);
