import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Form as TamaguiForm } from "tamagui";
function FormRoot(props) {
    const { children, trigger, triggerProps, ...rootProps } = props;
    return (_jsxs(TamaguiForm, { ...rootProps, children: [children, trigger != null ? _jsx(FormTrigger, { ...triggerProps, children: trigger }) : null] }));
}
function FormTrigger(props) {
    return _jsx(TamaguiForm.Trigger, { asChild: props.asChild ?? true, ...props });
}
export const Form = Object.assign(FormRoot, {
    Trigger: FormTrigger,
});
