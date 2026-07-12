import { type ReactNode, useState } from "react";
import { XStack, YStack } from "tamagui";

import {
  Button,
  H2,
  Input,
  Label,
  Paragraph,
  Separator,
  SizableText,
  Switch,
  Text,
} from "../ui";

import type { RnUiKitUiComponentsDebugPageProps } from "./types";

export function RnUiKitUiComponentsDebugPage(props: RnUiKitUiComponentsDebugPageProps) {
  const [switchChecked, setSwitchChecked] = useState(false);
  const [inputValue, setInputValue] = useState("Hello rn_ui_kit");
  const [pressCount, setPressCount] = useState(0);

  return (
    <YStack gap="$4" p="$4" {...props}>
      <Section title="Text">
        <H2 size="$7">Typography</H2>
        <Paragraph>
          Paragraph text rendered through the rn_ui_kit wrapper. Use this page as a quick visual
          regression surface while components are extracted.
        </Paragraph>
        <XStack gap="$2" flexWrap="wrap">
          <SizableText size="$2">Small</SizableText>
          <SizableText size="$4">Base</SizableText>
          <SizableText size="$6">Large</SizableText>
        </XStack>
      </Section>

      <Section title="Button">
        <DemoRow label="Variants">
          <Button nativeHaptics onPress={() => setPressCount((value) => value + 1)}>
            Pressed {pressCount}
          </Button>
          <Button variant="outlined" nativeHaptics="medium">
            Outlined
          </Button>
          <Button chromeless nativeHaptics={false}>
            Chromeless
          </Button>
        </DemoRow>
        <DemoRow label="States">
          <Button disabled>Disabled</Button>
          <Button native title="Native button">
            Native button
          </Button>
        </DemoRow>
      </Section>

      <Section title="Input and Label">
        <YStack gap="$2" maxW={420}>
          <Label htmlFor="rn-ui-kit-debug-input">Debug input</Label>
          <Input
            id="rn-ui-kit-debug-input"
            value={inputValue}
            onChangeText={setInputValue}
            placeholder="Type here"
          />
          <Text color="$color10">Current value: {inputValue}</Text>
        </YStack>
      </Section>

      <Section title="Switch">
        <Switch
          checked={switchChecked}
          label={switchChecked ? "Enabled" : "Disabled"}
          labelPosition="end"
          nativeHaptics
          onCheckedChange={setSwitchChecked}
        />
      </Section>

      <Section title="Separator">
        <YStack gap="$3">
          <Text>Above</Text>
          <Separator />
          <Text>Below</Text>
        </YStack>
      </Section>
    </YStack>
  );
}

function Section({ children, title }: { children: ReactNode; title: string }) {
  return (
    <YStack
      borderColor="$borderColor"
      rounded="$4"
      borderWidth={1}
      gap="$3"
      p="$4"
      style={{ width: "100%" }}
    >
      <Text fontWeight="700">{title}</Text>
      {children}
    </YStack>
  );
}

function DemoRow({ children, label }: { children: ReactNode; label: string }) {
  return (
    <YStack gap="$2">
      <Text color="$color10" fontSize="$2">
        {label}
      </Text>
      <XStack gap="$2" flexWrap="wrap" items="center">
        {children}
      </XStack>
    </YStack>
  );
}

