import { useTaskStore } from '@/stores/taskStore';

export const resetTaskStore = () => {
  const taskStore = useTaskStore();
  const taskInfoArray = [
    { key: 'ifChangeStatus', value: false },
    { key: 'statusChange.selectedOkiba', value: '' },
    { key: 'statusChange.okibaSelectWay', value: '' },
    { key: 'deliveryTask.luggageAmount', value: 0 },
    { key: 'deliveryTask.rowSelectedLuggageAmount', value: 0 },
    { key: 'deliveryTask.cargoType', value: 0 },
    { key: 'deliveryTask.deliveryType', value: 0 },
    { key: 'deliveryTask.okibaSelectWay', value: '' },
    { key: 'deliveryTask.ifStartConfirmed', value: false },
    { key: 'deliveryTask.start.startArea', value: '' },
    { key: 'deliveryTask.start.startRacks.length', value: 0 },
    { key: 'deliveryTask.start.minStartRow', value: '' },
    { key: 'deliveryTask.start.maxStartRow', value: '' },
    { key: 'deliveryTask.goal.goalArea', value: '' },
    { key: 'deliveryTask.goal.goalRacks.length', value: 0 },
    { key: 'deliveryTask.goal.goalOkibas.length', value: 0 },
  ];

  taskInfoArray.forEach((taskInfo) => {
    taskStore.setTaskProperty(taskInfo.key, taskInfo.value);
  });
};

export const handleNowTask = () => {
  const taskStore = useTaskStore();
  const task = computed(() => taskStore.task);

  if (task.value.deliveryTask.goal.goalArea) {
    const { start, goal } = task.value.deliveryTask;
    console.log('start', start);
    console.log('goal', goal);

    if (start.startArea === 'conveyor') {
      if (task.value.deliveryTask.okibaSelectWay === 'row') {
        const destinationParts = goal.goalRacks[0].rowName.split('-');
        data.runningTask = `ベルトコンベアー　→　置場${destinationParts[0]} 列${destinationParts[1]}`;
      } else {
        const destinationParts = goal.goalRacks[0].name.split('-');
        data.runningTask = `ベルトコンベアー　→　置場${destinationParts[0]} 列${destinationParts[1]}ラック${destinationParts[2]}`;
      }
    } else {
      if (task.value.deliveryTask.okibaSelectWay === 'row') {
        const sourceParts = start.startRacks[0].rowName.split('-');
        const destinationParts = goal.goalRacks[0].rowName.split('-');
        data.runningTask = `置場${sourceParts[0]} 列${sourceParts[1]}　→　置場${destinationParts[0]} 列${destinationParts[1]}`;
      } else {
        const sourceParts = start.startRacks[0].name.split('-');
        const destinationParts = goal.goalRacks[0].name.split('-');
        data.runningTask = `置場${sourceParts[0]} 列${sourceParts[1]}ラック${sourceParts[2]}　→　置場${destinationParts[0]} 列${destinationParts[1]}ラック${destinationParts[2]}`;
      }
    }
  }
};
