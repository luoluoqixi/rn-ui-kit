import { jsx as _jsx } from "react/jsx-runtime";
import { useState } from "react";
import { AlertDialog, Button } from "rn-ui-kit/core";
import { ExampleBlock, ExampleStack } from "../shared";
export function AlertDialogExample() {
    const [open, setOpen] = useState(false);
    const [result, setResult] = useState("尚未操作");
    return (_jsx(ExampleStack, { children: _jsx(ExampleBlock, { description: `最近结果：${result}`, title: "\u5371\u9669\u64CD\u4F5C\u786E\u8BA4", children: _jsx(AlertDialog, { dismissOnBackPress: true, dismissOnOverlayPress: true, cancelLabel: "\u53D6\u6D88", destructiveLabel: "\u5220\u9664", description: "\u6B64\u64CD\u4F5C\u4EC5\u7528\u4E8E\u6F14\u793A\uFF0C\u4E0D\u4F1A\u5220\u9664\u771F\u5B9E\u6570\u636E\u3002", destructiveProps: { onPress: () => setResult("确认删除") }, onOpenChange: setOpen, open: open, title: "\u5220\u9664 3 \u4E2A\u8349\u7A3F\uFF1F", trigger: _jsx(Button, { children: "\u6253\u5F00 AlertDialog" }) }) }) }));
}
