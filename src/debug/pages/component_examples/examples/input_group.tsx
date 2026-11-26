import { useState } from "react";
import { Eye, EyeOff, Search, Mail } from "lucide-react-native";
import { Button, Icon, InputGroup, TextField } from "rn-ui-kit/core";
import { ExampleSection, ExampleStack } from "../shared";
export function InputGroupExample() {
  const [visible, setVisible] = useState(false);
  return (
    <ExampleStack>
      <ExampleSection
        title="前后缀"
        description="文本装饰与输入框作为一个整体。"
      >
        <InputGroup
          accessibilityLabel="网站地址"
          prefix="https://"
          suffix=".com"
          placeholder="your-site"
          prefixProps={{ isDecorative: true }}
          suffixProps={{ isDecorative: true }}
        />
      </ExampleSection>
      <ExampleSection title="前置图标">
        <InputGroup
          accessibilityLabel="搜索"
          prefix={<Icon as={Search} size="sm" color="muted" />}
          prefixProps={{ isDecorative: true }}
          placeholder="搜索工作区…"
        />
      </ExampleSection>
      <ExampleSection title="交互式后缀">
        <InputGroup
          accessibilityLabel="密码"
          prefix={<Icon as={Mail} size="sm" color="muted" />}
          prefixProps={{ isDecorative: true }}
          type={visible ? "text" : "password"}
          placeholder="输入密码"
          suffix={
            <Button
              variant="ghost"
              size="sm"
              accessibilityLabel={visible ? "隐藏密码" : "显示密码"}
              onPress={() => setVisible(!visible)}
            >
              <Icon as={visible ? EyeOff : Eye} size="sm" />
            </Button>
          }
        />
      </ExampleSection>
      <ExampleSection title="完整字段">
        <TextField
          label="预算"
          description="金额以人民币计算。"
          inputMode="decimal"
          placeholder="0.00"
          inputGroupProps={{
            prefix: "¥",
            suffix: "CNY",
            prefixProps: { isDecorative: true },
            suffixProps: { isDecorative: true },
          }}
        />
        <InputGroup
          accessibilityLabel="禁用搜索"
          isDisabled
          prefix={<Icon as={Search} size="sm" />}
          placeholder="暂不可搜索"
        />
      </ExampleSection>
    </ExampleStack>
  );
}
