import type { Card as HeroUINativeCard } from "heroui-native/card";
import type { Card as HeroUIWebCard } from "@heroui/react/card";
import type { ComponentProps, ReactNode } from "react";
import type { RenderProp } from "../utils/render";
export type CardVariant = "default" | "secondary" | "tertiary" | "transparent";
export type CardRenderContext = Record<string, never>;
/** Shared styling stays flat; platform refs, styles and events remain distinct. */
type CardSlotProps<NativeProps, WebProps> = {
    className?: string;
    herouiNativeProps?: Omit<NativeProps, "children" | "className" | "asChild" | "variant">;
    herouiWebProps?: Omit<WebProps, "children" | "className" | "variant">;
};
export type CardHeaderProps = CardSlotProps<ComponentProps<typeof HeroUINativeCard.Header>, ComponentProps<typeof HeroUIWebCard.Header<"div">>>;
/** Native Card.Body and Web Card.Content. */
export type CardContentProps = CardSlotProps<ComponentProps<typeof HeroUINativeCard.Body>, ComponentProps<typeof HeroUIWebCard.Content<"div">>>;
export type CardFooterProps = CardSlotProps<ComponentProps<typeof HeroUINativeCard.Footer>, ComponentProps<typeof HeroUIWebCard.Footer<"div">>>;
export type CardTitleProps = CardSlotProps<ComponentProps<typeof HeroUINativeCard.Title>, ComponentProps<typeof HeroUIWebCard.Title<"h3">>>;
export type CardDescriptionProps = CardSlotProps<ComponentProps<typeof HeroUINativeCard.Description>, ComponentProps<typeof HeroUIWebCard.Description<"p">>>;
export type CardProps = CardSlotProps<ComponentProps<typeof HeroUINativeCard>, ComponentProps<typeof HeroUIWebCard<"div">>> & {
    variant?: CardVariant;
    /** Additional root content, after content and before footer. */
    children?: ReactNode;
    content?: RenderProp<CardRenderContext>;
    contentProps?: CardContentProps;
    contentClassName?: string;
    description?: RenderProp<CardRenderContext>;
    descriptionProps?: CardDescriptionProps;
    descriptionClassName?: string;
    footer?: RenderProp<CardRenderContext>;
    footerProps?: CardFooterProps;
    footerClassName?: string;
    /** Custom header replaces title and description; null/false uses the default header. */
    header?: RenderProp<CardRenderContext>;
    headerProps?: CardHeaderProps;
    headerClassName?: string;
    title?: RenderProp<CardRenderContext>;
    titleProps?: CardTitleProps;
    titleClassName?: string;
};
export {};
