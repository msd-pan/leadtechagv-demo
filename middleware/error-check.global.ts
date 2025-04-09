import { useErrorChecker } from '@/composables/errorChecker';

export default defineNuxtRouteMiddleware(async (to) => {
  if (to.path === '/error/popup') return;
  const { checkIfHasError } = useErrorChecker();
  //   await checkIfHasError();
});
