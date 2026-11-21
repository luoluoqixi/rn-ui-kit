import { useState } from "react";
import { Mail } from "lucide-react-native";
import { Icon, TextField } from "rn-ui-kit/core";
import { ExampleSection, ExampleStack } from "../shared";
export function TextFieldExample() {
  const [email, setEmail] = useState("");
  const invalid = email.length > 0 && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  return (
    <ExampleStack>
      <ExampleSection
        title="完整字段"
        description="标签、输入与说明通过 props 一次配置。"
      >
        <TextField
          label="工作区名称"
          description="可在设置中随时修改。"
          placeholder="为工作区命名"
          isRequired
        />
      </ExampleSection>
      <ExampleSection title="图标字段">
        <TextField
          label="联系邮箱"
          placeholder="name@example.com"
          type="email"
          inputGroupProps={{
            prefix: <Icon as={Mail} size="sm" color="muted" />,
            prefixProps: { isDecorative: true },
          }}
        />
      </ExampleSection>
      <ExampleSection
        title="内联校验"
        description="输入不完整邮箱时显示错误，补全后自动恢复。"
      >
        <TextField
          label="通知邮箱"
          value={email}
          onChangeText={setEmail}
          type="email"
          isRequired
          isInvalid={invalid}
          errorMessage="请输入有效的电子邮箱地址。"
          description="此地址仅用于重要通知。"
          placeholder="name@example.com"
        />
      </ExampleSection>
      <ExampleSection title="禁用与多行">
        <TextField label="账户" defaultValue="已归档账户" isDisabled />
        <TextField
          multiline
          rows={4}
          label="补充说明"
          description="多行字段沿用同一套说明与校验参数。"
          placeholder="提供更多背景…"
        />
      </ExampleSection>
    </ExampleStack>
  );
}
