// stores/timerStore.js
import { defineStore } from 'pinia';

export const useTimerStore = defineStore('timerStore', {
  state: () => ({
    timer: null,
    interval: 10000, // 30秒
    listeners: [], // 用于存储所有页面注册的方法
  }),
  actions: {
    startTimer() {
      if (this.timer) {
        console.log('Timer already running.');
        return;
      }

      // 启动计时器
      this.timer = setInterval(() => {
        console.log('Global timer triggered.');
        // 遍历并调用所有注册的方法
        this.listeners.forEach((listener) => listener());
      }, this.interval);
    },
    stopTimer() {
      if (this.timer) {
        clearInterval(this.timer);
        this.timer = null;
        console.log('Timer stopped.');
      }
    },
    registerListener(listener) {
      if (typeof listener === 'function') {
        this.listeners.push(listener);
        console.log('Listener registered.');
      }
    },
    unregisterListener(listener) {
      this.listeners = this.listeners.filter((l) => l !== listener);
      console.log('Listener unregistered.');
    },
  },
});
