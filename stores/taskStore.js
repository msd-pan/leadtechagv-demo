import { defineStore } from 'pinia';

/* 
ifChangeStatus: 是否是现状入力
startArea：从哪个区域搬，有 conveyor 与 okiba 的A，B，C，D
luggageAmount: 要搬送的货物的数量，大于0
deliveryType: 怎么搬送，1代表只有一层，2代表先一层后二层
okibaSelectWay: okiba的放置方法，row代表按列，individual代表每个单独搬送
*/
export const useTaskStore = defineStore('taskStore', {
  state: () => {
    return {
      task: {
        ifChangeStatus: false,
        statusChange: {
          selectedOkiba: '', //A, B, C, D
          okibaSelectWay: '',
        },
        deliveryTask: {
          luggageAmount: 0,
          rowSelectedLuggageAmount: 0,
          cargoType: 0,
          deliveryType: 0,
          okibaSelectWay: '',

          ifStartConfirmed: false,

          start: {
            startArea: '',
            startRacks: [],
            minStartRow: '',
            maxStartRow: '',
          },
          goal: { goalArea: '', goalRacks: [], goalOkibas: [] },
        },
      },
    };
  },
  getters: {
    getTask(state) {
      return state.getTask;
    },
  },
  actions: {
    setTaskProperty(path, value) {
      // `path` 是属性的路径，如 `statusChange.selectedOkiba` 或 `deliveryTask.startArea`
      const keys = path.split('.');
      let target = this.task;

      // 遍历路径并找到目标属性
      keys.slice(0, -1).forEach((key) => {
        target = target[key];
      });

      // 设置最终属性的值
      target[keys[keys.length - 1]] = value;
    },
  },
});
