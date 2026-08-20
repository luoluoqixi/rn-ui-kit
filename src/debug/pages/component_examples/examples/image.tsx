import { StyleSheet, View } from "react-native";

import { Image } from "rn-ui-kit/core";

import { ExampleBlock, ExampleStack } from "../shared";

const styles = StyleSheet.create({
  avatarRow: { alignItems: "center", flexDirection: "row", flexWrap: "wrap", gap: 16 },
  imageHost: { alignSelf: "center", width: "100%" },
  verticalSeparatorRow: { alignItems: "center", flexDirection: "row", gap: 12, height: 40 },
});

export function ImageExample() {
  return (
    <ExampleStack>
      <ExampleBlock
        description="使用 cover、固定容器、圆角和替代文本组成内容预览。"
        title="文章封面"
      >
        <View style={styles.imageHost}>
          <Image
            alt="组件示例图片"
            borderRadius={16}
            height={220}
            objectFit="cover"
            src="https://picsum.photos/640/440"
            width="100%"
          />
        </View>
      </ExampleBlock>
    </ExampleStack>
  );
}
