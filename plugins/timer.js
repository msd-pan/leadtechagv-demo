// plugins/timer.js
import { useTimerStore } from '../stores/timerStore';

export default defineNuxtPlugin(() => {
  const timerStore = useTimerStore();

  // 启动全局计时器
  timerStore.startTimer();
});
