import { push } from "notivue";

export default function useToast() {
  return {
    showSuccessToast: (message: string) => push.success(message),
    showErrorToast: (message: string) => push.error(message),
  };
}
