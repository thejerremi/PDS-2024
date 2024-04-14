import { ref } from 'vue';

export function useAlert() {
  const alertVisible = ref(false);
  const alertType = ref<"success" | "error" | undefined>(undefined);
  const alertMessage = ref('');

  const showAlert = (type: "success" | "error", message: string) => {
    console.log("showAlert", type, message);
    alertType.value = type;
    alertMessage.value = message;
    alertVisible.value = true;
    setTimeout(() => {
      alertVisible.value = false;
    }, 5000); // Ukryj alert po 5 sekundach
  }

  return {
    alertVisible,
    alertType,
    alertMessage,
    showAlert
  };
}
