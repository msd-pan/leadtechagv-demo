import { checkRowAvailableRacks } from '@/composables/rackTask';
import { useTaskStore } from '../stores/taskStore';

export const handleRackClickRow = async (obj, data) => {
  const taskStore = useTaskStore();
  const task = computed(() => taskStore.task);
  data.selectedRacks = obj.selectingRackInfo.rackArray;
  // console.log(data.selectedRacks);
  // console.log(obj);
  // 现状入力
  if (task.value.ifChangeStatus) {
    data.emptyNumber = 0;
    data.allUiRacks = obj.allUiRacks;
    data.allUiRacks.forEach((uiRack) => {
      if (uiRack.rackParameters.status.firstFloor == 0) {
        uiRack.rackParameters.racks.forEach((subRack) => {
          if (
            subRack.name.split('-')[subRack.name.split('-').length - 1] == '1'
          ) {
            data.emptyNumber += 1;
          }
        });
      }

      if (uiRack.rackParameters.status.secondFloor == 0) {
        uiRack.rackParameters.racks.forEach((subRack) => {
          if (
            subRack.name.split('-')[subRack.name.split('-').length - 1] == '2'
          ) {
            data.emptyNumber += 1;
          }
        });
      }
    });
  } else {
    const taskStore = useTaskStore();
    const task = computed(() => taskStore.task);

    // 判断是否能够提交
    // 输入start或者goal
    data.nowSelectingLugAmount = 0;
    data.minRowNo = null; // 未定义最小值
    data.maxRowNo = null; // 未定义最大值

    if (data.selectedRacks.length == 0) {
      data.minRowNo = 0;
      data.maxRowNo = 0;
    }
    for (const row of data.selectedRacks) {
      // 等待异步操作完成
      const availableRacks = await checkRowAvailableRacks(
        data.startOrGoal,
        data.selectedOkiba,
        row.rowName,
        task.value.deliveryTask.cargoType,
        task.value.deliveryTask.deliveryType,
        task.value.deliveryTask.start.startArea,
      );

      // 更新当前选择的总量
      data.nowSelectingLugAmount += availableRacks;

      // 将 rowName 转换为数字
      const rowNo = +row.rowName;

      if (data.minRowNo === null || rowNo < data.minRowNo) {
        data.minRowNo = rowNo;
      }
      if (data.maxRowNo === null || rowNo > data.maxRowNo) {
        data.maxRowNo = rowNo;
      }
    }
    data.wholeGoalRacks =
      task.value.deliveryTask.rowSelectedLuggageAmount +
      data.nowSelectingLugAmount;
    data.nowSelectingLugAmount >= data.luggageAmount
      ? (data.ifSubmittble = true)
      : (data.ifSubmittble = false);

    // 选择start时在侧边栏显示
    if (!task.value.deliveryTask.ifStartConfirmed) {
      taskStore.setTaskProperty(
        'deliveryTask.start.minStartRow',
        data.minRowNo,
      );
      taskStore.setTaskProperty(
        'deliveryTask.start.maxStartRow',
        data.maxRowNo,
      );

      data.minStartRow = data.minRowNo;
      data.maxStartRow = data.maxRowNo;
    } else {
    }

    if (
      data.selectedRacks.some((rack) => rack.rowName === obj.rackObj.rowName)
    ) {
      // 如果包含目标对象，且 goalRacks 不重复，则添加
      if (data.startOrGoal == 'goal') {
        if (
          !data.goalRacks.some((rack) => rack.rowName === obj.rackObj.rowName)
        ) {
          data.goalRacks.push({
            rowName: data.selectedOkiba + '-' + obj.rackObj.rowName,
          });
        }
      } else {
        if (
          !data.startRacks.some((rack) => rack.rowName === obj.rackObj.rowName)
        ) {
          data.startRacks.push({
            rowName: data.selectedOkiba + '-' + obj.rackObj.rowName,
          });
        }
      }
    } else {
      if (data.startOrGoal == 'goal') {
        const index = data.goalRacks.findIndex(
          (rack) =>
            rack.rowName === data.selectedOkiba + '-' + obj.rackObj.rowName,
        );
        if (index !== -1) {
          data.goalRacks.splice(index, 1);
        }
      } else {
        const index = data.startRacks.findIndex(
          (rack) =>
            rack.rowName === data.selectedOkiba + '-' + obj.rackObj.rowName,
        );
        if (index !== -1) {
          data.startRacks.splice(index, 1);
        }
      }
    }
  }
  // console.log('data.selectedRacks', data.selectedRacks);
  // console.log('startRacks', data.startRacks);
  // console.log('goalRacks', data.goalRacks);
  // console.log('obj.rackObj', obj.rackObj);
};
