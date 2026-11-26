import { useState } from "react";
import { FolderSearch } from "lucide-react-native";
import { Icon, SearchField, Text } from "rn-ui-kit/core";
import { ExampleSection, ExampleStack } from "../shared";
export function SearchFieldExample() {
  const [query, setQuery] = useState("");
  const [submitted, setSubmitted] = useState("");
  const [cleared, setCleared] = useState(0);
  return <ExampleStack>
    <ExampleSection title="基础搜索" description="输入关键词，按回车或键盘搜索键提交。">
      <SearchField nativeHaptics value={query} onChangeText={setQuery} onSubmit={setSubmitted} onClear={() => setCleared(cleared + 1)} placeholder="搜索文章…" />
      <Text color="muted">已提交：{submitted || "无"}；已清除 {cleared} 次</Text>
    </ExampleSection>
    <ExampleSection title="标签与说明" description="标签、辅助说明与输入自动关联。"><SearchField nativeHaptics label="项目" description="按名称或关键词查找项目。" defaultValue="设计" /></ExampleSection>
    <ExampleSection title="自定义内容" description="可以隐藏或替换搜索图标，也可以关闭清除按钮。">
      <SearchField nativeHaptics showSearchIcon={false} placeholder="不显示搜索图标" />
      <SearchField nativeHaptics searchIcon={<Icon as={FolderSearch} color="muted" size={18} />} isClearable={false} variant="secondary" placeholder="搜索文件夹…" />
    </ExampleSection>
    <ExampleSection title="状态" description="禁用、只读与错误分别表达字段的可用性和校验结果。">
      <SearchField nativeHaptics label="禁用搜索" isDisabled defaultValue="受管理的内容" />
      <SearchField nativeHaptics label="只读搜索" isReadOnly defaultValue="归档项目" />
      <SearchField nativeHaptics label="搜索条件" isInvalid errorMessage="请提供更具体的关键词。" defaultValue="a" />
    </ExampleSection>
  </ExampleStack>;
}
