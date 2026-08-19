import { StyleSheet, View } from "react-native";

import { Avatar } from "rn-ui-kit/core";

import { ExampleBlock, ExampleStack } from "../shared";

const styles = StyleSheet.create({
  avatarRow: { alignItems: "center", flexDirection: "row", flexWrap: "wrap", gap: 16 },
  imageHost: { alignSelf: "center", width: "100%" },
  verticalSeparatorRow: { alignItems: "center", flexDirection: "row", gap: 12, height: 40 },
});

export function AvatarExample() {
  return (
    <ExampleStack>
      <ExampleBlock
        description="在成员列表中混合展示远程头像、缩写 fallback 和不同尺寸。"
        title="协作者"
      >
        <View style={styles.avatarRow}>
          <Avatar
            alt="Ada Lovelace"
            fallback="AL"
            size="$6"
            src="https://i.pravatar.cc/160?img=47"
          />
          <Avatar fallback="RN" size="$6" />
          <Avatar fallback="UI" size="$5" />
          <Avatar fallback="KIT" size="$4" />
        </View>
      </ExampleBlock>
    </ExampleStack>
  );
}
