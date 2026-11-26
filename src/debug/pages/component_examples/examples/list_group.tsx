import { useState } from "react";
import { Bell, UserRound, Palette } from "lucide-react-native";
import { Icon, ListGroup, Text } from "rn-ui-kit/core";
import { ExampleBlock, ExampleStack } from "../shared";
export function ListGroupExample() {
  const [last, setLast] = useState("尚未操作");
  const [selected, setSelected] = useState(new Set(["system"]));
  return <ExampleStack>
    <ExampleBlock title="分组列表" description="图标、标题与说明直接通过 items 配置。">
      <ListGroup showSeparators showChevron sections={[
        { id: "account", title: "账户", items: [{ id: "profile", title: "个人资料", description: "管理姓名与头像", startContent: <Icon as={UserRound} />, onPress: () => setLast("个人资料") }] },
        { id: "preferences", title: "偏好设置", items: [
          { id: "appearance", title: "外观", description: "主题与显示设置", startContent: <Icon as={Palette} />, onPress: () => setLast("外观") },
          { id: "notifications", title: "通知", description: "声音与提醒方式", startContent: <Icon as={Bell} />, onPress: () => setLast("通知") },
          { id: "unavailable", title: "暂不可用", isDisabled: true },
        ] },
      ]} /><Text color="muted">最近操作：{last}</Text>
    </ExampleBlock>
    <ExampleBlock title="单选列表"><ListGroup selectionMode="single" disallowEmptySelection selectedKeys={selected} onSelectionChange={setSelected}
      items={[{ id: "system", title: "跟随系统" }, { id: "light", title: "浅色" }, { id: "dark", title: "深色" }]} /></ExampleBlock>
  </ExampleStack>;
}
