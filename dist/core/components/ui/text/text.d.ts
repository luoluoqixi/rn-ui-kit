import * as React from "react";
import { Text as RNText } from "react-native";
import { TextProps } from "./types";
import { textVariants } from "./variants";
declare const TextClassContext: React.Context<string | undefined>;
declare const Text: React.ForwardRefExoticComponent<Omit<TextProps, "ref"> & React.RefAttributes<RNText>>;
export { Text, TextClassContext, textVariants };
