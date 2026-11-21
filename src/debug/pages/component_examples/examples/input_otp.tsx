import { useState } from "react";
import { InputOTP, Text } from "rn-ui-kit/core";
import { ExampleSection, ExampleStack } from "../shared";
export function InputOTPExample() {
  const [value, setValue] = useState("");
  const [complete, setComplete] = useState("");
  return (
    <ExampleStack>
      <ExampleSection
        title="验证码"
        description="六位数字分为两组；支持输入与粘贴。"
      >
        <InputOTP
          accessibilityLabel="六位验证码"
          value={value}
          onChangeText={(next) => {
            setValue(next);
            setComplete("");
          }}
          onComplete={setComplete}
          groupSize={3}
        />
        <Text color="muted">
          {complete
            ? "已填满：" + complete
            : "已输入 " + value.length + " / 6 位"}
        </Text>
      </ExampleSection>
      <ExampleSection title="四位 PIN">
        <InputOTP accessibilityLabel="四位 PIN" maxLength={4} />
      </ExampleSection>
      <ExampleSection
        title="占位与字母数字"
        description="邀请码允许字母和数字，粘贴时会去掉连接符。"
      >
        <InputOTP
          accessibilityLabel="邀请码"
          pattern="^[a-zA-Z0-9]+$"
          inputMode="text"
          placeholder="------"
          variant="secondary"
          pasteTransformer={(text) => text.replace(/-/g, "")}
        />
      </ExampleSection>
      <ExampleSection title="状态">
        <InputOTP
          accessibilityLabel="禁用验证码"
          defaultValue="123456"
          isDisabled
        />
        <InputOTP
          accessibilityLabel="无效验证码"
          defaultValue="1234"
          maxLength={4}
          isInvalid
        />
        <Text className="text-danger" type="body-sm">
          验证码已过期，请重新获取。
        </Text>
      </ExampleSection>
    </ExampleStack>
  );
}
