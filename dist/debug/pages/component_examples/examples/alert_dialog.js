import { jsx as _jsx } from "react/jsx-runtime";
import { useState } from "react";
import { AlertDialog, Button } from "rn-ui-kit/core";
import { ExampleBlock, ExampleStack } from "../shared";
export function AlertDialogExample() {
    const [open, setOpen] = useState(false);
    const [result, setResult] = useState("尚未操作");
    return (_jsx(ExampleStack, { children: _jsx(ExampleBlock, { description: `最近结果：${result}`, title: "\u5371\u9669\u64CD\u4F5C\u786E\u8BA4", children: _jsx(AlertDialog, { cancelLabel: "\u53D6\u6D88", contentProps: { style: { width: "90%", maxWidth: 420 } }, destructiveLabel: "\u5220\u9664", description: "\u5148\u5728\u5F39\u7A97\u4E2D\u505A\u6700\u540E\u786E\u8BA4\uFF1B\u6B64\u64CD\u4F5C\u4EC5\u7528\u4E8E\u6F14\u793A\uFF0C\u4E0D\u4F1A\u5220\u9664\u771F\u5B9E\u6570\u636E\u3002", onOpenChange: setOpen, open: open, title: "\u5220\u9664 3 \u4E2A\u8349\u7A3F\uFF1F", trigger: _jsx(Button, { onPress: () => setOpen(true), children: "\u6253\u5F00 AlertDialog" }), actions: _jsx(Button, { onPress: () => {
                        setResult("确认删除");
                        setOpen(false);
                    }, theme: "red", children: "\u81EA\u5B9A\u4E49\u52A8\u4F5C" }) }) }) }));
}
