import { useTaskStore } from '@/stores/taskStore';
import {
  processRacks,
  sendRowInfosToWcs,
  delay,
  handleRackTypeShowing,
  getValidParks,
  taskInsert,
  setRackStatus,
} from '@/composables/rackTask';

export const handleRackTaskConfirm = async (
  data,
  task,
  router,
  taskStore,
  mode = 'row', // 可为 'row' 或 'individual'
) => {
  console.log('task', task);
  console.log('data', data);
  const { deliveryTask, ifChangeStatus } = task;
  const {
    start,
    goal,
    luggageAmount,
    deliveryType,
    cargoType,
    ifStartConfirmed,
  } = deliveryTask;

  const parksSet = new Set();
  const confirmable = data.wholeGoalRacks >= data.luggageAmount;

  // ✅ 现状入力
  if (ifChangeStatus) {
    const updates =
      mode === 'row'
        ? data.statusChangedArray.flatMap((rack) => {
            const rows = [
              {
                Status: rack.rackParameters.status.firstFloor,
                ParkNo: `${rack.rackParameters.name}-1`,
              },
            ];
            if (rack.rackParameters.status.secondFloor != null) {
              rows.push({
                Status: rack.rackParameters.status.secondFloor,
                ParkNo: `${rack.rackParameters.name}-2`,
              });
            }
            return rows;
          })
        : data.clickedRacks;

    if (!data.ifShowMessageBar) {
      data.ifShowMessageBar = true;
      data.line1 = `置場${data.selectedOkiba}の現状を`;
      data.line2 = `在：${data.totalNumber - data.emptyNumber}　空：${
        data.emptyNumber
      }`;
      data.line3 = `変更しました`;
    } else {
      await setRackStatus(updates);
      router.push('/');
    }
    return;
  }

  const goToOS1 = () => router.push('/okiba-select');

  // 🛞 Conveyor 模式
  if (start.startArea === 'conveyor') {
    if (confirmable) {
      if (!data.ifShowMessageBar) {
        data.line1 = 'ベルトコンベアから';
        data.line2 = processRacks(goal.goalRacks);
        data.line3 = `へ${luggageAmount}個　搬送します`;
        data.ifShowMessageBar = true;
      } else {
        const parks =
          mode === 'row'
            ? goal.goalRacks.map((r) => r.rowName)
            : getValidParks(
                goal.goalRacks,
                'goal',
                deliveryType,
                luggageAmount,
              );

        router.push('/');
        await taskInsert('ConveyorIn', parks);
      }
    } else {
      taskStore.setTaskProperty(
        'deliveryTask.rowSelectedLuggageAmount',
        data.wholeGoalRacks,
      );
      goToOS1();
    }
  }

  // 🚛 普通搬送
  else {
    if (!ifStartConfirmed) {
      if (confirmable) {
        taskStore.setTaskProperty('deliveryTask.ifStartConfirmed', true);
        goToOS1();
      }
    } else {
      if (confirmable) {
        if (!data.ifShowMessageBar) {
          data.line1 = `${processRacks(start.startRacks)}から`;
          data.line2 = processRacks(goal.goalRacks);
          data.line3 = `へ${luggageAmount}個　搬送します`;
          data.ifShowMessageBar = true;
        } else {
          const parksStart =
            mode === 'row'
              ? start.startRacks.map((r) => r.rowName)
              : getValidParks(
                  start.startRacks,
                  'start',
                  deliveryType,
                  luggageAmount,
                );

          const startStatus = await taskInsert('Out', parksStart);

          if (startStatus === 200) {
            const parksGoal =
              mode === 'row'
                ? goal.goalRacks.map((r) => r.rowName)
                : getValidParks(
                    goal.goalRacks,
                    'goal',
                    deliveryType,
                    luggageAmount,
                  );

            await delay(1000);
            await taskInsert('In', parksGoal);
          }

          router.push('/');
        }
      } else {
        taskStore.setTaskProperty(
          'deliveryTask.rowSelectedLuggageAmount',
          data.wholeGoalRacks,
        );
        goToOS1();
      }
    }
  }
};

export const confirmAndSendRackTask = async (
  task,
  router,
  mode = 'row', // 'individual' or 'row'
  data = null, // individual 模式下必须传 data
) => {
  const { deliveryTask } = task;
  const { start, goal, luggageAmount, deliveryType, cargoType } = deliveryTask;

  if (start.startArea === 'conveyor') {
    if (mode === 'row') {
      // ✅ ROW 模式下发 conveyor → goal
      await sendRowInfosToWcs(
        goal.goalRacks,
        luggageAmount,
        deliveryType,
        'ConveyorInRow',
      );
    } else {
      // ✅ INDIVIDUAL 模式下发 conveyor → goal
      const parks = getValidParks(
        goal.goalRacks,
        'goal',
        deliveryType,
        luggageAmount,
      );
      await taskInsert('ConveyorIn', parks);
    }

    router.push('/');
    return;
  }

  // 🚚 StartArea ≠ conveyor：需要先出库，再入库
  if (mode === 'row') {
    const startStatus = await sendRowInfosToWcs(
      start.startRacks,
      luggageAmount,
      deliveryType,
      'OutRow',
      cargoType,
    );

    if (startStatus === 200) {
      await delay(1000);
      await sendRowInfosToWcs(
        goal.goalRacks,
        luggageAmount,
        deliveryType,
        'InRow',
      );
    }
  } else {
    // individual 模式
    const parksOut = getValidParks(
      data.startRacks,
      'start',
      deliveryType,
      luggageAmount,
    );
    const startStatus = await taskInsert('Out', parksOut);

    if (startStatus === 200) {
      const parksIn = getValidParks(
        data.goalRacks,
        'goal',
        deliveryType,
        luggageAmount,
      );
      await delay(1000);
      await taskInsert('In', parksIn);
    }
  }

  router.push('/');
};

export const confirmSelection = (cargoType, mode = 'row') => {
  const taskStore = useTaskStore();
  taskStore.setTaskProperty('deliveryTask.cargoType', +cargoType);
  if (mode === 'individual') handleRackTypeShowing();
};
