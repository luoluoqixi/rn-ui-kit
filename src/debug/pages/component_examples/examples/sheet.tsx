import { useState, type ReactNode } from "react";

import { StyleSheet, useWindowDimensions, View } from "react-native";

import { Button, NativeSheet, Sheet, Switch, Text } from "rn-ui-kit/core";

import { ExampleBlock, ExampleRow, ExampleStack } from "../shared";

type ExampleModalSheetProps = {
  children?: ReactNode;
  content: ReactNode;
  native: boolean;
  onOpenChange: (open: boolean) => void;
  onPositionChange: (position: number) => void;
  open: boolean;
  position: number;
  snapPoints?: Array<string | number>;
  snapPointsMode?: "percent" | "constant" | "fit" | "mixed";
};

function ExampleModalSheet({
  content,
  native,
  onOpenChange,
  onPositionChange,
  open,
  position,
  snapPoints,
  snapPointsMode,
}: ExampleModalSheetProps) {
  const { height: windowHeight, width: windowWidth } = useWindowDimensions();

  if (native) {
    return (
      <View
        pointerEvents="box-none"
        style={[styles.nativeSheetHost, { height: windowHeight, width: windowWidth }]}
      >
        <NativeSheet
          content={content}
          handle
          modal
          onOpenChange={onOpenChange}
          onPositionChange={onPositionChange}
          open={open}
          overlay
          position={position}
          snapPoints={snapPoints}
          snapPointsMode={snapPointsMode}
        />
      </View>
    );
  }

  return (
    <Sheet
      content={content}
      dismissOnSnapToBottom
      handle
      modal
      onOpenChange={onOpenChange}
      onPositionChange={onPositionChange}
      open={open}
      overlay
      position={position}
      snapPoints={snapPoints}
      snapPointsMode={snapPointsMode}
      transition="200ms"
    />
  );
}

function SheetContent({
  children,
  description,
  onClose,
  title,
}: {
  children?: ReactNode;
  description: string;
  onClose: () => void;
  title: string;
}) {
  return (
    <View style={styles.sheetContent}>
      <Text fontSize="$6" fontWeight="700">
        {title}
      </Text>
      <Text opacity={0.6}>{description}</Text>
      {children}
      <Button onPress={onClose} theme="accent">
        关闭 Sheet
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  dialogContent: { gap: 8 },
  nativeSheetHost: { left: 0, position: "absolute", top: 0 },
  popoverContent: { gap: 12, minWidth: 240, padding: 12 },
  sheetContent: { gap: 16, padding: 24 },
  sheetItem: {
    borderColor: "rgba(128, 128, 128, 0.28)",
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
});

export function SheetExample() {
  const [native, setNative] = useState(true);
  const [inlineOpen, setInlineOpen] = useState(false);
  const [inlinePosition, setInlinePosition] = useState(0);
  const [percentOpen, setPercentOpen] = useState(false);
  const [percentPosition, setPercentPosition] = useState(0);
  const [constantOpen, setConstantOpen] = useState(false);
  const [constantPosition, setConstantPosition] = useState(0);
  const [fitOpen, setFitOpen] = useState(false);
  const [fitPosition, setFitPosition] = useState(0);
  const [mixedOpen, setMixedOpen] = useState(false);
  const [mixedPosition, setMixedPosition] = useState(0);
  const [nestedOpen, setNestedOpen] = useState(false);
  const [nestedPosition, setNestedPosition] = useState(0);
  const sheetItems = ["最近工作区", "主题与外观", "同步状态", "导出设置"];

  const openSheet = (setOpen: (open: boolean) => void, setPosition: (position: number) => void) => {
    setPosition(0);
    setOpen(true);
  };

  const renderItems = () =>
    sheetItems.map((item) => (
      <View key={item} style={styles.sheetItem}>
        <Text>{item}</Text>
      </View>
    ));

  return (
    <ExampleStack>
      <ExampleBlock
        description="除基础 Sheet 外，这里覆盖 percent、constant、fit、mixed 和嵌套浮层。"
        title="多种 Sheet 形式"
      >
        <Switch
          checked={native}
          label="使用 NativeSheet"
          labelPosition="end"
          onCheckedChange={setNative}
        />
        <ExampleRow>
          <Button onPress={() => openSheet(setInlineOpen, setInlinePosition)} variant="outlined">
            Inline percent
          </Button>
          <Button onPress={() => openSheet(setPercentOpen, setPercentPosition)} variant="outlined">
            全局 percent
          </Button>
          <Button
            onPress={() => openSheet(setConstantOpen, setConstantPosition)}
            variant="outlined"
          >
            constant
          </Button>
          <Button onPress={() => openSheet(setFitOpen, setFitPosition)} variant="outlined">
            fit
          </Button>
          <Button onPress={() => openSheet(setMixedOpen, setMixedPosition)} variant="outlined">
            mixed
          </Button>
        </ExampleRow>
        <Text opacity={0.6}>
          inline：{inlineOpen ? `打开，position=${inlinePosition}` : "关闭"} · percent：
          {percentOpen ? `打开，position=${percentPosition}` : "关闭"}
        </Text>
        <Text opacity={0.6}>
          constant：{constantOpen ? `打开，position=${constantPosition}` : "关闭"} · fit：
          {fitOpen ? `打开，position=${fitPosition}` : "关闭"} · mixed：
          {mixedOpen ? `打开，position=${mixedPosition}` : "关闭"}
        </Text>

        <Sheet.Controller hidden={false} onOpenChange={setInlineOpen} open={inlineOpen}>
          <Sheet
            content={
              <SheetContent
                description="非 modal 的 inline Sheet 使用 percent snap points，并可在当前页面内拖拽。"
                onClose={() => setInlineOpen(false)}
                title="Inline Sheet"
              >
                {renderItems()}
                <Button onPress={() => setInlinePosition(1)} variant="outlined">
                  切到第二档
                </Button>
              </SheetContent>
            }
            dismissOnSnapToBottom
            handle
            modal={false}
            onOpenChange={setInlineOpen}
            onPositionChange={setInlinePosition}
            open={inlineOpen}
            overlay
            position={inlinePosition}
            snapPoints={["76%", "56%"]}
            snapPointsMode="percent"
            transition="medium"
          />
        </Sheet.Controller>

        <Sheet.Controller hidden={false} onOpenChange={setPercentOpen} open={percentOpen}>
          <ExampleModalSheet
            content={
              <SheetContent
                description="modal 全局 Sheet，百分比档位可适配不同屏幕高度。"
                onClose={() => setPercentOpen(false)}
                title="全局 Sheet · percent"
              >
                {renderItems()}
                <Button
                  onPress={() => openSheet(setNestedOpen, setNestedPosition)}
                  variant="outlined"
                >
                  打开内层 Sheet
                </Button>
                <Sheet.Controller hidden={false} onOpenChange={setNestedOpen} open={nestedOpen}>
                  <ExampleModalSheet
                    content={
                      <SheetContent
                        description="在外层 Sheet 中继续打开 modal Sheet，适合二次确认或补充配置。"
                        onClose={() => setNestedOpen(false)}
                        title="内层 Sheet"
                      >
                        {renderItems()}
                      </SheetContent>
                    }
                    native={native}
                    onOpenChange={setNestedOpen}
                    onPositionChange={setNestedPosition}
                    open={nestedOpen}
                    position={nestedPosition}
                    snapPoints={["72%", "88%"]}
                    snapPointsMode="percent"
                  />
                </Sheet.Controller>
              </SheetContent>
            }
            native={native}
            onOpenChange={(nextOpen) => {
              setPercentOpen(nextOpen);
              if (!nextOpen) setNestedOpen(false);
            }}
            onPositionChange={setPercentPosition}
            open={percentOpen}
            position={percentPosition}
            snapPoints={["62%", "90%"]}
            snapPointsMode="percent"
          />
        </Sheet.Controller>

        <Sheet.Controller hidden={false} onOpenChange={setConstantOpen} open={constantOpen}>
          <ExampleModalSheet
            content={
              <SheetContent
                description="constant 以固定像素高度定义档位，适合内容尺寸明确的操作面板。"
                onClose={() => setConstantOpen(false)}
                title="全局 Sheet · constant"
              >
                {renderItems()}
              </SheetContent>
            }
            native={native}
            onOpenChange={setConstantOpen}
            onPositionChange={setConstantPosition}
            open={constantOpen}
            position={constantPosition}
            snapPoints={[360, 560]}
            snapPointsMode="constant"
          />
        </Sheet.Controller>

        <Sheet.Controller hidden={false} onOpenChange={setFitOpen} open={fitOpen}>
          <ExampleModalSheet
            content={
              <SheetContent
                description="fit 根据内容高度计算面板尺寸，适合内容较短且不需要固定档位的场景。"
                onClose={() => setFitOpen(false)}
                title="全局 Sheet · fit"
              >
                {renderItems()}
              </SheetContent>
            }
            native={native}
            onOpenChange={setFitOpen}
            onPositionChange={setFitPosition}
            open={fitOpen}
            position={fitPosition}
            snapPointsMode="fit"
          />
        </Sheet.Controller>

        <Sheet.Controller hidden={false} onOpenChange={setMixedOpen} open={mixedOpen}>
          <ExampleModalSheet
            content={
              <SheetContent
                description="mixed 可组合 fit 和百分比档位，兼顾内容高度与更大可展开空间。"
                onClose={() => setMixedOpen(false)}
                title="全局 Sheet · mixed"
              >
                {renderItems()}
              </SheetContent>
            }
            native={native}
            onOpenChange={setMixedOpen}
            onPositionChange={setMixedPosition}
            open={mixedOpen}
            position={mixedPosition}
            snapPoints={["fit", "80%"]}
            snapPointsMode="mixed"
          />
        </Sheet.Controller>
      </ExampleBlock>
    </ExampleStack>
  );
}
