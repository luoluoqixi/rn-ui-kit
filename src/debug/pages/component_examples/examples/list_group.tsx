import { useState } from "react";

import { ListGroup, Text } from "rn-ui-kit/core";

import { ExampleBlock, ExampleStack } from "../shared";

export function ListGroupExample() {
  const [lastAction, setLastAction] = useState("尚未点击");

  return (
    <ExampleStack>
      <ExampleBlock
        description="ListGroup 适合承载一组带标题、说明和连续分隔线的入口。"
        title="内容库"
      >
        <ListGroup
          items={[
            {
              onPress: () => setLastAction("最近文件"),
              subTitle: "显示最近访问的文件",
              title: "最近文件",
            },
            {
              onPress: () => setLastAction("收藏夹"),
              subTitle: "显示收藏内容",
              title: "收藏夹",
            },
            {
              onPress: () => setLastAction("共享给团队"),
              subTitle: "管理外部协作者可以访问的内容",
              title: "共享与权限",
            },
          ]}
          rounded="$4"
          separator
          size="$4"
        />
        <Text opacity={0.6}>最近动作：{lastAction}</Text>
      </ExampleBlock>
    </ExampleStack>
  );
}
