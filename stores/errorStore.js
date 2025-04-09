import { defineStore } from 'pinia';

export const useErrorStore = defineStore('errorStore', {
  state: () => {
    return {
      errorCode: '',
      carNo: '',
      occurTime: '',
    };
  },
  getters: {
    getErrorCode(state) {
      return state.errorCode;
    },
    getCarNo(state) {
      return state.carNo;
    },
    getOccurTime(state) {
      return state.occurTime;
    },
  },
  actions: {
    setErrorCode(data) {
      this.errorCode = data;
    },
    setCarNo(data) {
      this.carNo = data;
    },
    setOccurTime(data) {
      this.occurTime = data;
    },
  },
});
