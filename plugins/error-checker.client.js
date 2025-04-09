import { useErrorChecker } from '@/composables/errorChecker';

export default defineNuxtPlugin((nuxtApp) => {
  if (process.client) {
    const { checkIfHasError } = useErrorChecker();

    // 每隔30秒检查一次（根据需求调整）
    setInterval(() => {
      checkIfHasError();
    }, 30000);
  }
});
