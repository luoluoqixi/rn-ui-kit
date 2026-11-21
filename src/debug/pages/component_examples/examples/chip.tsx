import { Bell, Circle, Plus, Star, X } from "lucide-react-native";
import { Chip, Icon, type ChipColor, type ChipVariant } from "rn-ui-kit/core";
import { ExampleRow, ExampleSection, ExampleStack } from "../shared";

const colors: { color: ChipColor; label: string }[] = [
  { color: "accent", label: "强调" }, { color: "default", label: "默认" },
  { color: "success", label: "成功" }, { color: "warning", label: "警告" }, { color: "danger", label: "危险" },
];
const variants: { variant: ChipVariant; title: string }[] = [
  { variant: "primary", title: "Primary 实色" }, { variant: "secondary", title: "Secondary 中性背景" },
  { variant: "tertiary", title: "Tertiary 透明背景" }, { variant: "soft", title: "Soft 柔和背景" },
];

export function ChipExample() {
  return (
    <ExampleStack>
      <ExampleSection title="三种尺寸">
        <ExampleRow><Chip size="sm" label="小标签" /><Chip size="md" label="中标签" /><Chip size="lg" label="大标签" /></ExampleRow>
      </ExampleSection>
      <ExampleSection title="四种样式">
        <ExampleRow>{variants.map(({ variant }) => <Chip key={variant} variant={variant} label={variant} />)}</ExampleRow>
      </ExampleSection>
      {variants.map(({ variant, title }) => (
        <ExampleSection key={variant} title={title}>
          <ExampleRow>{colors.map(({ color, label }) => <Chip key={color} color={color} variant={variant} label={label} />)}</ExampleRow>
        </ExampleSection>
      ))}
      <ExampleSection title="前置图标与状态点">
        <ExampleRow>
          <Chip icon={Bell} variant="tertiary" label="精选" />
          <Chip icon={Plus} variant="secondary" color="success" label="新内容" />
          <Chip icon={Star} size="lg" variant="soft" color="warning" label="收藏" />
        </ExampleRow>
        <ExampleRow>
          <Chip variant="secondary" color="success" label="已完成" startContent={<Icon as={Circle} size={6} fill="currentColor" strokeWidth={0} className="mr-1 text-success" />} />
          <Chip variant="secondary" color="warning" label="待处理" startContent={<Icon as={Circle} size={6} fill="currentColor" strokeWidth={0} className="mr-1 text-warning" />} />
          <Chip variant="secondary" color="danger" label="未通过" startContent={<Icon as={Circle} size={6} fill="currentColor" strokeWidth={0} className="mr-1 text-danger" />} />
        </ExampleRow>
      </ExampleSection>
      <ExampleSection title="后置内容">
        <ExampleRow>
          <Chip size="sm" variant="secondary" label="尾部图标" endContent={<Icon as={X} size={12} />} />
          <Chip color="danger" label="状态标签" endContent={<Icon as={X} size={14} />} />
          <Chip size="lg" variant="secondary" color="default" label="附加内容" endContent={<Icon as={Plus} size={14} />} />
        </ExampleRow>
      </ExampleSection>
      <ExampleSection title="自定义样式">
        <ExampleRow>
          <Chip label="自定义间距" className="bg-purple-600 px-6" labelClassName="text-white" />
          <Chip label="调整圆角" variant="soft" className="rounded-sm bg-purple-100" labelClassName="text-purple-800" />
          <Chip label="强调文字" size="lg" color="success" labelClassName="font-bold" />
        </ExampleRow>
      </ExampleSection>
    </ExampleStack>
  );
}
