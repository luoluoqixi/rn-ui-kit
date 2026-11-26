import { Fragment as _Fragment, jsx as _jsx } from "react/jsx-runtime";
// Web sheets already own their DOM portal. Keep this entry free of Native imports.
export function OverlayPortal({ children }) {
    return _jsx(_Fragment, { children: children });
}
export function OverlayPortalHost(_props) {
    return null;
}
