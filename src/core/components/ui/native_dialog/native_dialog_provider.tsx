import { type ReactNode, useCallback, useEffect, useRef, useState } from "react";

import { AlertDialog } from "../alert_dialog";
import { Button } from "../button";
import { Text } from "../text";

import { runNativeDialogButton, setNativeDialogHandler } from "./native_dialog";
import type { NativeDialogButton, NativeDialogRequest, NativeDialogResult } from "./types";

export function NativeDialogProvider({ children }: { children: ReactNode }) {
  const [request, setRequest] = useState<NativeDialogRequest | null>(null);
  const requestRef = useRef<NativeDialogRequest | null>(null);

  useEffect(() => {
    setNativeDialogHandler((nextRequest) => {
      requestRef.current = nextRequest;
      setRequest(nextRequest);
    });
    return () => {
      setNativeDialogHandler(null);
    };
  }, []);

  const settle = useCallback(async (result: NativeDialogResult, button?: NativeDialogButton) => {
    const currentRequest = requestRef.current;
    if (currentRequest == null) {
      return;
    }

    requestRef.current = null;
    setRequest(null);

    if (button != null) {
      await runNativeDialogButton(button);
    }

    currentRequest.resolve(result);
  }, []);

  const handleOpenChange = useCallback(
    (open: boolean) => {
      if (!open) {
        void settle("dismiss");
      }
    },
    [settle],
  );

  const actions =
    request?.buttons.map((button) => {
      return (
        <Button
          nativeHaptics
          key={button.key}
          variant={button.style === "cancel" ? "tertiary" : button.style === "destructive" ? "danger" : "primary"}
          onPress={() => {
            void settle(button.key, button);
          }}
        >
          <Text>{button.text}</Text>
        </Button>
      );
    }) ?? null;

  return (
    <>
      {children}
      <AlertDialog onOpenChange={handleOpenChange} open={request != null}
        title={request?.options.title} description={request?.options.message} actions={actions} />
    </>
  );
}
