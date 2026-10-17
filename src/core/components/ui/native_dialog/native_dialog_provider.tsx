import { type ReactNode, useCallback, useEffect, useRef, useState } from "react";

import { AlertDialog } from "../alert_dialog";
import { Text } from "../text";
import { triggerNativeHaptics } from "../utils";

import { runNativeDialogButton, setNativeDialogHandler } from "./native_dialog";
import type { NativeDialogButton, NativeDialogRequest, NativeDialogResult } from "./types";

function getButtonComponent(button: NativeDialogButton) {
  if (button.style === "cancel") {
    return AlertDialog.Cancel;
  }
  return AlertDialog.Action;
}

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
      const Action = getButtonComponent(button);
      return (
        <Action
          className={button.style === "destructive" ? "bg-destructive" : undefined}
          key={button.key}
          onPress={() => {
            // NativeDialog previously used a haptic-enabled Button for every action.
            triggerNativeHaptics(true);
            void settle(button.key, button);
          }}
        >
          <Text>{button.text}</Text>
        </Action>
      );
    }) ?? null;

  return (
    <>
      {children}
      <AlertDialog onOpenChange={handleOpenChange} open={request != null}>
        <AlertDialog.Content>
          <AlertDialog.Header>
            <AlertDialog.Title>{request?.options.title}</AlertDialog.Title>
            {request?.options.message == null ? null : (
              <AlertDialog.Description>{request.options.message}</AlertDialog.Description>
            )}
          </AlertDialog.Header>
          <AlertDialog.Footer>{actions}</AlertDialog.Footer>
        </AlertDialog.Content>
      </AlertDialog>
    </>
  );
}
