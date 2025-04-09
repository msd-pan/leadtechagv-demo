import { useTaskStore } from '@/stores/taskStore';

export const useOkiba = () => {
  const getOkibaInfo = async () => {
    const parks = await fetch('/parks.json')
      .then((res) => res.json())
      .catch(() => false);

    if (!parks) return false;

    const groupedData = parks
      .map((item) => {
        const parts = item.ParkNo.split('-');
        return {
          id: item.id,
          ParkNo: item.ParkNo,
          Status: item.Status,
          Appointment: item.Appointment,
          ParkGroup: parts[0],
          FirstNumberPart: parts[1],
          SecondNumberPart: parts[2],
        };
      })
      .sort((a, b) => {
        if (a.ParkGroup !== b.ParkGroup)
          return a.ParkGroup.localeCompare(b.ParkGroup);
        if (parseInt(a.FirstNumberPart) !== parseInt(b.FirstNumberPart))
          return parseInt(a.FirstNumberPart) - parseInt(b.FirstNumberPart);
        return parseInt(a.SecondNumberPart) - parseInt(b.SecondNumberPart);
      })
      .reduce((result, item) => {
        if (!result[item.ParkGroup]) result[item.ParkGroup] = {};
        if (!result[item.ParkGroup][item.FirstNumberPart])
          result[item.ParkGroup][item.FirstNumberPart] = [];
        result[item.ParkGroup][item.FirstNumberPart].push({
          id: item.id,
          name: item.ParkNo,
          status: item.Status,
          appointment: item.Appointment,
        });
        return result;
      }, {});

    return groupedData;
  };

  const handleOkibaInfos = async (data) => {
    const okibaInfo = await getOkibaInfo();
    if (!okibaInfo) return;

    const okibaKeys = Object.keys(okibaInfo).filter(
      (key) => key && !/^\d+$/.test(key),
    );

    okibaKeys.forEach((key) => {
      const rowsArray = Object.keys(okibaInfo[key]);
      let emptyRack = 0,
        totalRack = 0;
      for (let i = 0; i < rowsArray.length; i++) {
        okibaInfo[key][rowsArray[i]].forEach((rack) => {
          if (rack.status == 0 || rack.status == 4) emptyRack += 1;
          totalRack += 1;
        });
      }
      data.storages.push({ name: key, totalRack, emptyRack });
    });
  };

  const handleShowingInfos = (data, task) => {
    if (task.ifChangeStatus) {
      data.ifHideSideBar = true;
      data.title = '現状入力する置場を選択してください';
    } else {
      task.deliveryTask.ifStartConfirmed
        ? (data.title = '搬送先の置場を選択してください')
        : (data.title = '搬送元の置場を選択してください');

      if (task.deliveryTask.ifStartConfirmed) {
        data.minStartRow = task.deliveryTask.start.minStartRow;
        data.maxStartRow = task.deliveryTask.start.maxStartRow;
      }
    }
  };

  const initializeTaskState = (data, task) => {
    data.luggageAmount = task.deliveryTask.luggageAmount;
    data.startOkiba =
      task.deliveryTask.start.startArea === 'conveyor'
        ? 'conveyor'
        : '置場' + task.deliveryTask.start.startArea;
    data.goalOkibas = task.deliveryTask.goal.goalOkibas;

    if (task.deliveryTask.okibaSelectWay === 'individual') {
      data.wholeGoalRacks = task.deliveryTask.goal.goalRacks.reduce(
        (count, goalRack) => {
          let result = 0;
          if (goalRack.status.firstFloor === 0) result++;
          if (
            goalRack.status.secondFloor === 0 &&
            task.deliveryTask.deliveryType === 2
          )
            result++;
          return count + result;
        },
        0,
      );
    } else if (task.deliveryTask.okibaSelectWay === 'row') {
      data.wholeGoalRacks = task.deliveryTask.rowSelectedLuggageAmount;
    }

    data.fetched = true;
  };

  const goBack = (router) => {
    router.go(-1);
  };

  const toNextPage = (data, task, router) => {
    if (data.selectedLocation !== '') {
      if (task.ifChangeStatus && task.statusChange.selectedOkiba !== '') {
        if (task.statusChange.okibaSelectWay !== '') {
          router.push(
            task.statusChange.okibaSelectWay === 'row'
              ? '/rack-select/row'
              : '/rack-select',
          );
        }
      } else if (task.deliveryTask.okibaSelectWay !== '') {
        router.push(
          task.deliveryTask.okibaSelectWay === 'row'
            ? '/rack-select/row'
            : '/rack-select',
        );
      }
    }
  };

  const handleOkibaSelection = (name, data, task) => {
    const taskStore = useTaskStore();
    data.selectedLocation = data.selectedLocation === name ? '' : name;

    if (task.ifChangeStatus) {
      taskStore.setTaskProperty(
        'statusChange.selectedOkiba',
        data.selectedLocation,
      );
      return;
    }

    const goalOkibas = task.deliveryTask.goal.goalOkibas;
    const initialGoalOkibasLength = goalOkibas.length;

    if (task.deliveryTask.start.startArea === 'conveyor') {
      taskStore.setTaskProperty(
        'deliveryTask.goal.goalArea',
        data.selectedLocation,
      );

      if (data.selectedLocation === '') {
        if (goalOkibas.length > initialGoalOkibasLength) {
          goalOkibas.pop();
        }
      } else {
        const existingIndex = goalOkibas.findIndex(
          (okiba) => okiba.name === data.selectedLocation,
        );

        if (existingIndex === -1) {
          if (goalOkibas.length < initialGoalOkibasLength + 1) {
            goalOkibas.push({
              name: data.selectedLocation,
              minStartRow: '',
              maxStartRow: '',
            });
          } else {
            goalOkibas[goalOkibas.length - 1] = {
              name: data.selectedLocation,
              minStartRow: '',
              maxStartRow: '',
            };
          }
        }
        data.ifChangedOkibaSelect = true;
      }
    } else {
      if (!task.deliveryTask.ifStartConfirmed) {
        taskStore.setTaskProperty(
          'deliveryTask.start.startArea',
          data.selectedLocation,
        );
        data.startOkiba = '置場' + data.selectedLocation;
      } else {
        taskStore.setTaskProperty(
          'deliveryTask.goal.goalArea',
          data.selectedLocation,
        );

        if (data.selectedLocation === '') {
          if (goalOkibas.length > initialGoalOkibasLength) {
            goalOkibas.pop();
          }
        } else {
          const existingIndex = goalOkibas.findIndex(
            (okiba) => okiba.name === data.selectedLocation,
          );

          if (existingIndex === -1) {
            if (goalOkibas.length < initialGoalOkibasLength + 1) {
              goalOkibas.push({
                name: data.selectedLocation,
                minStartRow: '',
                maxStartRow: '',
              });
            } else {
              goalOkibas[goalOkibas.length - 1] = {
                name: data.selectedLocation,
                minStartRow: '',
                maxStartRow: '',
              };
            }
          }
          data.ifChangedOkibaSelect = true;
        }
      }
    }
  };

  return {
    getOkibaInfo,
    handleOkibaInfos,
    handleShowingInfos,
    initializeTaskState,
    goBack,
    toNextPage,
    handleOkibaSelection,
  };
};
