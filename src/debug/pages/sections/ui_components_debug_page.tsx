import { StyleSheet, View } from "react-native";

import { Text } from "../../../core/components/ui";
import type { RnUiKitUiComponentsDebugPageProps } from "../../types";
import { componentExampleDefinitions } from "../component_examples/catalog";
import { ComponentExampleEmbeddedProvider } from "../component_examples/presentation_context";
import type { ComponentExampleDefinition } from "../component_examples/types";
import { ExampleStack } from "../component_examples/shared";

function ExampleEntry({ definition }: { definition: ComponentExampleDefinition }) {
  const Example = definition.Component;
  return (
    <View style={definition.layout === "fill" ? styles.fillEntry : undefined}>
      <Text className="mb-2 font-semibold">{definition.label}</Text>
      <Example />
    </View>
  );
}

export function RnUiKitUiComponentsDebugPage({ header }: RnUiKitUiComponentsDebugPageProps) {
  return (
    <ComponentExampleEmbeddedProvider>
      <View style={styles.root}>
        {header}
        <ExampleStack>
          {componentExampleDefinitions.map((definition) => (
            <ExampleEntry definition={definition} key={definition.key} />
          ))}
        </ExampleStack>
        <Text className="text-muted-foreground text-center text-xs">
          组件总览与组件示例使用相同的实现和交互逻辑。
        </Text>
      </View>
    </ComponentExampleEmbeddedProvider>
  );
}

const styles = StyleSheet.create({
  root: {
    gap: 16,
    padding: 16,
    paddingBottom: 48,
  },
  fillEntry: {
    minHeight: 420,
  },
});
