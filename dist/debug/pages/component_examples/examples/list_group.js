import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { Bell, UserRound, Palette } from "lucide-react-native";
import { Icon, ListGroup, Text } from "rn-ui-kit/core";
import { ExampleBlock, ExampleStack } from "../shared";
export function ListGroupExample() {
    const [last, setLast] = useState("尚未操作");
    const [selected, setSelected] = useState(new Set(["system"]));
    return _jsxs(ExampleStack, { children: [_jsxs(ExampleBlock, { title: "\u5206\u7EC4\u5217\u8868", description: "\u56FE\u6807\u3001\u6807\u9898\u4E0E\u8BF4\u660E\u76F4\u63A5\u901A\u8FC7 items \u914D\u7F6E\u3002", children: [_jsx(ListGroup, { showSeparators: true, showChevron: true, sections: [
                            { id: "account", title: "账户", items: [{ id: "profile", title: "个人资料", description: "管理姓名与头像", startContent: _jsx(Icon, { as: UserRound }), onPress: () => setLast("个人资料") }] },
                            { id: "preferences", title: "偏好设置", items: [
                                    { id: "appearance", title: "外观", description: "主题与显示设置", startContent: _jsx(Icon, { as: Palette }), onPress: () => setLast("外观") },
                                    { id: "notifications", title: "通知", description: "声音与提醒方式", startContent: _jsx(Icon, { as: Bell }), onPress: () => setLast("通知") },
                                    { id: "unavailable", title: "暂不可用", isDisabled: true },
                                ] },
                        ] }), _jsxs(Text, { color: "muted", children: ["\u6700\u8FD1\u64CD\u4F5C\uFF1A", last] })] }), _jsx(ExampleBlock, { title: "\u5355\u9009\u5217\u8868", children: _jsx(ListGroup, { selectionMode: "single", disallowEmptySelection: true, selectedKeys: selected, onSelectionChange: setSelected, items: [{ id: "system", title: "跟随系统" }, { id: "light", title: "浅色" }, { id: "dark", title: "深色" }] }) })] });
}
