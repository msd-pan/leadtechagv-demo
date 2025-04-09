export const handleRackTypeShowing = (allUiRacks, deliveryType, cargoType, startOrGoal = 'start') => {
    allUiRacks.forEach((uiRack) => {
      if (!uiRack.disabled) {
        // 🚛 GOAL 模式（只判断空位）
        if (startOrGoal === 'goal') {
          if (
            deliveryType === 1 &&
            uiRack.rackParameters.status.firstFloor !== 0 &&
            uiRack.rackParameters.status.firstFloor !== cargoType
          ) {
            uiRack.children[0].fill(uiRack.rackParameters.colors.disableGray);
            uiRack.off('click tap', uiRack.boxClickFunc);
          }
        }
        // 📦 START 模式（只判断已存在货物）
        else {
          if (
            uiRack.rackParameters.status.firstFloor !== cargoType
          ) {
            uiRack.children[0].fill(uiRack.rackParameters.colors.disableGray);
            uiRack.off('click tap', uiRack.boxClickFunc);
          }
        }
      }
    });
  };