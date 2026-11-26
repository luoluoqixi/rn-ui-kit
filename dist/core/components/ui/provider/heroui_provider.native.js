import { jsx as _jsx } from "react/jsx-runtime";
import { HeroUINativeProvider } from "heroui-native";
const config = { toast: false, devInfo: { stylingPrinciples: false } };
export function HeroUIProvider({ children }) {
    // The project mounts its routed ToastProvider separately from HeroUI's portal host.
    return _jsx(HeroUINativeProvider, { config: config, children: children });
}
