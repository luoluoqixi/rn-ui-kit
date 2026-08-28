import { Text } from "../text";
import * as React from "react";
declare function Alert({ className, variant, children, description, descriptionClassName, descriptionProps, icon, iconAlign, iconContainerClassName, iconClassName, iconProps, title, titleClassName, titleProps, ...props }: import("./types").AlertProps): React.JSX.Element;
declare function AlertTitle({ className, ...props }: React.ComponentProps<typeof Text>): React.JSX.Element;
declare function AlertDescription({ className, ...props }: React.ComponentProps<typeof Text>): React.JSX.Element;
declare const AlertComponent: typeof Alert & {
    Description: typeof AlertDescription;
    Root: typeof Alert;
    Title: typeof AlertTitle;
};
export { AlertComponent as Alert };
