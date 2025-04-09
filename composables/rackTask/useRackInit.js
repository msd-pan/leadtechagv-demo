export const prepareOkibaDisplayState = (
  data,
  task,
  mode = 'row', // 默认 row 模式，可传 'individual'
  handleRackTypeShowingFn = null, // optional 回调函数
) => {
  const delivery = task.deliveryTask;

  if (task.ifChangeStatus) {
    Object.assign(data, {
      ifChangeStatus: true,
      selectedOkiba: task.statusChange.selectedOkiba,
      ifHideSidebar: true,
      ifSubmittble: true,
      title: '置場をタップして荷物の在/空を切り替えてください',
    });
  } else if (delivery.start.startArea === 'conveyor') {
    Object.assign(data, {
      selectedOkiba: delivery.goal.goalArea,
      startOrGoal: 'goal',
      title: '搬送する場所を選択してください',
    });
  } else {
    Object.assign(data, {
      wholeGoalRacks: delivery.rowSelectedLuggageAmount,
    });

    if (delivery.goal.goalArea === '') {
      Object.assign(data, {
        selectedOkiba: delivery.start.startArea,
        startOrGoal: 'start',
        title: '搬送元の荷物を選択してください',
      });
      data.ifShowRackTypeSelect = true;
    } else {
      Object.assign(data, {
        selectedOkiba: delivery.goal.goalArea,
        startOrGoal: 'goal',
        title: '搬送する場所を選択してください',
      });

      if (
        mode === 'individual' &&
        typeof handleRackTypeShowingFn === 'function'
      ) {
        handleRackTypeShowingFn('goal');
      }
    }
  }

  // 通用属性
  data.singleOrDouble = delivery.deliveryType === 1 ? 'single' : 'double';
  data.luggageAmount = delivery.luggageAmount;
  data.startOkiba =
    delivery.start.startArea === 'conveyor'
      ? 'conveyor'
      : '置場' + delivery.start.startArea;
  data.startRacks = delivery.start.startRacks;
  data.goalOkibas = delivery.goal.goalOkibas;
  data.goalRacks = delivery.goal.goalRacks;

  if (delivery.ifStartConfirmed) {
    data.minStartRow = delivery.start.minStartRow;
    data.maxStartRow = delivery.start.maxStartRow;
  }
};
