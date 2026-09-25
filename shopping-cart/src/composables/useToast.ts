import { push } from "notivue";

export function useToast() {
  return {
    success: (message: string) => push.success(message),
    error: (message: string) => push.error(message),
    info: (message: string) => push.info(message),
  };
}
