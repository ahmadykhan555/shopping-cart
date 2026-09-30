import { push } from "notivue";

export function useToast() {
  return {
    showSuccessToast: (message: string) => push.success(message),
    showErrorToast: (message: string) => push.error(message),
    showInfoToast: (message: string) => push.info(message),
  };
}
