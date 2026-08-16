import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { ListGroup, Text } from "rn-ui-kit/core";
import { ExampleBlock, ExampleStack } from "../shared";
export function ListGroupExample() {
    const [lastAction, setLastAction] = useState("尚未点击");
    return (_jsx(ExampleStack, { children: _jsxs(ExampleBlock, { description: "ListGroup \u9002\u5408\u627F\u8F7D\u4E00\u7EC4\u5E26\u6807\u9898\u3001\u8BF4\u660E\u548C\u8FDE\u7EED\u5206\u9694\u7EBF\u7684\u5165\u53E3\u3002", title: "\u5185\u5BB9\u5E93", children: [_jsx(ListGroup, { items: [
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
                    ], rounded: "$4", separator: true, size: "$4" }), _jsxs(Text, { opacity: 0.6, children: ["\u6700\u8FD1\u52A8\u4F5C\uFF1A", lastAction] })] }) }));
}
