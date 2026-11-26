import { Star, UserRound } from "lucide-react-native";
import { View } from "react-native";
import { Avatar, Icon, type AvatarColor } from "rn-ui-kit/core";
import { ExampleRow, ExampleSection, ExampleStack } from "../shared";

const assets = "https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/";
const colors: { color: AvatarColor; initials: string; name: string }[] = [
  { color: "accent", initials: "AC", name: "强调色" },
  { color: "default", initials: "DF", name: "中性色" },
  { color: "success", initials: "SC", name: "成功色" },
  { color: "warning", initials: "WR", name: "警告色" },
  { color: "danger", initials: "DG", name: "危险色" },
];
const members = [
  { name: "林青", initials: "LQ", image: "blue.jpg" },
  { name: "江禾", initials: "JH", image: "green.jpg" },
  { name: "陈星", initials: "CX", image: "purple.jpg" },
  { name: "周橙", initials: "ZC", image: "orange.jpg" },
];

export function AvatarExample() {
  return (
    <ExampleStack>
      <ExampleSection title="三种尺寸">
        <ExampleRow>
          <Avatar size="sm" alt="小头像" src={assets + "blue.jpg"} fallback="SM" />
          <Avatar size="md" alt="中头像" src={assets + "purple.jpg"} fallback="MD" />
          <Avatar size="lg" alt="大头像" src={assets + "red.jpg"} fallback="LG" />
        </ExampleRow>
      </ExampleSection>
      <ExampleSection title="文字回退">
        <ExampleRow>{colors.map(({ color, initials, name }) => <Avatar key={color} color={color} alt={name + "文字头像"} fallback={initials} />)}</ExampleRow>
      </ExampleSection>
      <ExampleSection title="柔和背景与文字">
        <ExampleRow>{colors.map(({ color, initials, name }) => <Avatar key={color} color={color} variant="soft" alt={name + "柔和头像"} fallback={initials} />)}</ExampleRow>
      </ExampleSection>
      <ExampleSection title="默认人物图标">
        <ExampleRow>{colors.map(({ color, name }) => <Avatar key={color} color={color} alt={name + "人物头像"} />)}</ExampleRow>
      </ExampleSection>
      <ExampleSection title="柔和背景与图标">
        <ExampleRow>{colors.map(({ color, name }) => <Avatar key={color} color={color} variant="soft" alt={name + "柔和人物头像"} />)}</ExampleRow>
      </ExampleSection>
      <ExampleSection title="自定义回退内容">
        <ExampleRow>
          <Avatar alt="星标成员" fallback={<Icon as={Star} size={22} className="text-warning" />} />
          <Avatar alt="自定义文字" className="bg-accent" fallbackClassName="bg-accent" fallback="UI" fallbackTextClassName="text-accent-foreground" />
          <Avatar alt="自定义人物图标" fallback={<Icon as={UserRound} size={22} className="text-muted" />} />
        </ExampleRow>
      </ExampleSection>
      <ExampleSection title="重叠头像组">
        <View className="flex-row">
          {members.map((member, index) => <Avatar key={member.name} alt={member.name} src={assets + member.image} fallback={member.initials}
            className={"rounded-full border-2 border-background" + (index > 0 ? " -ml-3" : "")} />)}
        </View>
        <View className="flex-row">
          {members.slice(0, 3).map((member, index) => <Avatar key={member.name} alt={member.name} src={assets + member.image} fallback={member.initials}
            className={"rounded-full border-2 border-background" + (index > 0 ? " -ml-3" : "")} />)}
          <Avatar alt="另外两位成员" fallback="+2" className="-ml-3 rounded-full border-2 border-background" />
        </View>
      </ExampleSection>
      <ExampleSection title="自定义尺寸、形状与状态">
        <ExampleRow>
          <Avatar alt="自定义大头像" src={assets + "blue.jpg"} fallback="XL" className="size-20" />
          <Avatar alt="方形头像" src={assets + "green.jpg"} fallback="SQ" className="rounded-lg" fallbackClassName="rounded-lg" />
          <Avatar alt="描边头像" src={assets + "purple.jpg"} fallback="BD" size="lg" className="border-2 border-accent" />
          <View className="relative">
            <Avatar alt="在线成员" src={assets + "orange.jpg"} fallback="ON" size="lg" />
            <View className="absolute bottom-0.5 right-0.5 size-3.5 rounded-full border-2 border-background bg-success" />
          </View>
        </ExampleRow>
      </ExampleSection>
    </ExampleStack>
  );
}
