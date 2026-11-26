import type { FieldMetadata } from "./field_types";
import { FieldMessagesHeroUI } from "./field_parts_heroui";
export type FieldMessagesProps = Pick<
  FieldMetadata,
  | "description"
  | "descriptionProps"
  | "descriptionClassName"
  | "errorMessage"
  | "errorMessageProps"
  | "errorMessageClassName"
> & { isInvalid?: boolean; descriptionID?: string; errorID?: string };
export function FieldMessages(props: FieldMessagesProps) {
  return <FieldMessagesHeroUI {...props} />;
}
