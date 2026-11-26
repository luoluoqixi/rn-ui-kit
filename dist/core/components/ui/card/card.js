import { jsx as _jsx } from "react/jsx-runtime";
import { CardHeroUI } from "./card_heroui";
/** Metro selects the implementation; the public entry and types stay shared. */
export function Card(props) {
    return _jsx(CardHeroUI, { ...props });
}
