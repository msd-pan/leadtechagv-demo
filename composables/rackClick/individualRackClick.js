import { useTaskStore } from '../stores/taskStore';

export const handleRackClickInd = (obj, data) => {
  const taskStore = useTaskStore();
  const task = computed(() => taskStore.task);
  data.allUiRacks = obj.allUiRacks;
  // console.log(obj.allUiRacks);
  // 输入start或者goal

  if (!data.ifChangeStatus) {
    data.selectedRacks = obj.selectingRackInfo.rackArray;
    if (task.value.deliveryTask.deliveryType == 1) {
      data.sidebarSelectedNum = data.selectedRacks.length;
      data.sidebarSelectedNum == data.luggageAmount
        ? (data.ifSubmittble = true)
        : (data.ifSubmittble = false);
    } else {
      data.startOrGoal == 'start'
        ? (data.sidebarSelectedNum = obj.rackObj.notEmptyRackNum)
        : (data.sidebarSelectedNum = obj.rackObj.emptyRackNum);

      data.sidebarSelectedNum >= data.luggageAmount
        ? (data.ifSubmittble = true)
        : (data.ifSubmittble = false);
    }

    const { deliveryType } = task.value.deliveryTask;

    if (data.selectedRacks.some((rack) => rack.name === obj.rackObj.name)) {
      // 如果包含目标对象，且 goalRacks 不重复，则添加
      if (data.startOrGoal == 'goal') {
        if (!data.goalRacks.some((rack) => rack.name === obj.rackObj.name)) {
          data.goalRacks.push(obj.rackObj);
        }
      } else {
        if (!data.startRacks.some((rack) => rack.name === obj.rackObj.name)) {
          data.startRacks.push(obj.rackObj);
        }
      }
    } else {
      if (data.startOrGoal == 'goal') {
        const index = data.goalRacks.findIndex(
          (rack) => rack.name === obj.rackObj.name,
        );
        if (index !== -1) {
          data.goalRacks.splice(index, 1);
        }
      } else {
        const index = data.startRacks.findIndex(
          (rack) => rack.name === obj.rackObj.name,
        );
        if (index !== -1) {
          data.startRacks.splice(index, 1);
        }
      }
    }

    data.wholeGoalRacks = 0;
    if (data.startOrGoal == 'goal') {
      data.goalRacks.forEach((goalRack) => {
        if (goalRack.status.firstFloor == 0) {
          data.wholeGoalRacks += 1;
        }

        if (goalRack.status.secondFloor == 0 && deliveryType == 2) {
          data.wholeGoalRacks += 1;
        }
      });
    } else {
      console.log('data.startRacks', data.startRacks);
      data.startRacks.forEach((startRack) => {
        if (startRack.status.firstFloor != 0) {
          data.wholeGoalRacks += 1;
        }

        if (
          startRack.status.secondFloor != 0 &&
          startRack.status.secondFloor != 4 &&
          deliveryType == 2
        ) {
          data.wholeGoalRacks += 1;
        }
      });
    }

    // console.log('data.selectedRacks', data.selectedRacks);
    // console.log('goalRacks', data.goalRacks);
    // console.log('obj.rackObj', obj.rackObj);
  }
};
