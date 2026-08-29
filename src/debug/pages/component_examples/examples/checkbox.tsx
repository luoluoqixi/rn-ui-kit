import { useState } from "react";
import { Checkbox } from "rn-ui-kit/core";
import { ExampleBlock, ExampleRow, ExampleStack } from "../shared";

export function CheckboxExample() {
  const [values, setValues] = useState({
    terms: true,
    terms2: true,
    termsWithDescription: true,
    notifications: false,
    notifications2: false,
    xs: false,
    sm: false,
    md: false,
    lg: false,
    xl: false,
  });

  const update = (key: keyof typeof values) => (checked: boolean) => {
    setValues((current) => ({ ...current, [key]: checked }));
  };

  return (
    <ExampleStack>
      <ExampleBlock title="通知偏好">
        <Checkbox
          checked={values.terms2}
          onCheckedChange={update("terms2")}
          label="接受服务条款 Left"
          labelPosition="left"
          id="checkbox-terms-left"
        />
        <Checkbox
          checked={values.terms}
          onCheckedChange={update("terms")}
          label="接受服务条款"
          id="checkbox-terms"
        />
        <Checkbox
          checked={values.termsWithDescription}
          onCheckedChange={update("termsWithDescription")}
          label="接受服务条款"
          description="勾选此项即表示你同意服务条款和隐私政策。"
          id="checkbox-terms-description"
        />
        <Checkbox label="启用通知" id="checkbox-notifications" disabled />
        <Checkbox
          checked={values.notifications}
          onCheckedChange={update("notifications")}
          label="启用通知 Right"
          description="你可以随时启用或停用通知。"
          labelPosition="right"
          card
          id="checkbox-notifications-card"
          checkedClassName="border-primary bg-primary"
          indicatorClassName="bg-primary"
          iconClassName="text-primary-foreground"
        />
        <Checkbox
          checked={values.notifications2}
          onCheckedChange={update("notifications2")}
          label="启用通知 Left"
          description="你可以随时启用或停用通知。"
          labelPosition="left"
          card
          id="checkbox-notifications-card2"
          checkedClassName="border-primary bg-primary"
          indicatorClassName="bg-primary"
          iconClassName="text-primary-foreground"
        />
      </ExampleBlock>
      <ExampleBlock title="大小示例">
        <Checkbox
          checked={values.xs}
          onCheckedChange={update("xs")}
          label="超小 Checkbox"
          size="xs"
          id="checkbox-xs"
        />
        <Checkbox
          checked={values.sm}
          onCheckedChange={update("sm")}
          label="小 Checkbox"
          size="sm"
          id="checkbox-sm"
        />
        <Checkbox
          checked={values.md}
          onCheckedChange={update("md")}
          label="默认 Checkbox"
          size="md"
          id="checkbox-md"
        />
        <Checkbox
          checked={values.lg}
          onCheckedChange={update("lg")}
          label="大 Checkbox"
          size="lg"
          id="checkbox-lg"
        />
        <Checkbox
          checked={values.xl}
          onCheckedChange={update("xl")}
          label="超大 Checkbox"
          size="xl"
          id="checkbox-xl"
        />
      </ExampleBlock>
    </ExampleStack>
  );
}
