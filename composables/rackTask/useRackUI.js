import { useTaskStore } from '@/stores/taskStore';
import {
  isSelectableRack,
  getRackTypeFromLabel,
  checkRowAvailableRacks,
} from '@/composables/rackTask';

export const selectLayerEffect = (uiRack, color, luggageAmount = 0) => {
  uiRack.children[0].fill(color);
  if (uiRack.children[1]) {
    uiRack.children[1].text(luggageAmount);
  }
};

export const applyStatusChangeEffect = (
  rackObj,
  data,
  mode = 'row', // 默认支持 row 模式，也可以传入 'individual'
) => {
  const rackType = getRackTypeFromLabel(data.statusInputWay);

  // ✅ individual 模式逻辑
  if (mode === 'individual') {
    const box = rackObj.outBox;
    const { status, colors, name } = box.rackParameters;

    if (status.firstFloor === 3) {
      status.firstFloor = 0;
      if (status.secondFloor !== null) status.secondFloor = 0;
      box.children[0].fill(colors.backGroundColor);
    } else if (status.firstFloor === 0) {
      status.firstFloor = rackType;
      box.children[0].fill(colors.lightOrange);
    } else if (status.secondFloor === 0) {
      status.secondFloor = rackType;
      box.children[0].fill(colors.clickedOrange);
    } else if (status.secondFloor !== 0) {
      status.firstFloor = 0;
      if (status.secondFloor !== null) status.secondFloor = 0;
      box.children[0].fill(colors.backGroundColor);
    }

    // 更新数量文字
    let count = 0;
    if (status.firstFloor !== 0) count++;
    if (
      status.secondFloor !== null &&
      status.secondFloor !== 0 &&
      status.secondFloor !== 4
    )
      count++;

    box.children[1].text(count > 0 ? String(count) : '');

    // 更新 clickedRacks（防止重复）
    const park1 = name + '-1';
    const park2 = name + '-2';

    const index1 = data.clickedRacks.findIndex((r) => r.ParkNo === park1);
    if (index1 >= 0) data.clickedRacks.splice(index1, 1);
    data.clickedRacks.push({ ParkNo: park1, Status: status.firstFloor });

    const index2 = data.clickedRacks.findIndex((r) => r.ParkNo === park2);
    if (index2 >= 0) data.clickedRacks.splice(index2, 1);

    if (status.secondFloor !== null) {
      data.clickedRacks.push({ ParkNo: park2, Status: status.secondFloor });
    }

    // 重新计算空位
    data.emptyNumber = 0;
    data.allUiRacks.forEach((uiRack) => {
      const s = uiRack.rackParameters.status;
      if (s.firstFloor === 0) data.emptyNumber += 1;
      if (s.secondFloor === 0 || s.secondFloor === 4) data.emptyNumber += 1;
    });

    return;
  }

  // ✅ row 模式逻辑（原封装逻辑）
  const row = rackObj.rowName.split('-')[1];

  if (rackObj.ifSingle) {
    data.statusChangeArray[row].rowRack.children[0].fill(
      data.statusChangeArray[row].rowRack.rackParameters.colors.lightOrange,
    );
    data.statusChangeArray[row].rowRack.children[1].text('1');
    data.statusChangeArray[row].rowRack.visible(true);

    data.statusChangeArray[row].singleRacks.forEach((rack) => {
      rack.visible(false);
      rack.rackParameters.status.firstFloor = rackType;
      if (rack.rackParameters.status.secondFloor != null)
        rack.rackParameters.status.secondFloor = 0;
    });
  } else {
    let ifAllLayer2Empty = true;
    data.statusChangeArray[row].singleRacks.forEach((rack) => {
      if (rack.rackParameters.status.secondFloor !== 0) {
        ifAllLayer2Empty = false;
      }
    });

    if (ifAllLayer2Empty) {
      data.statusChangeArray[row].rowRack.children[0].fill(
        data.statusChangeArray[row].rowRack.rackParameters.colors.clickedOrange,
      );
      data.statusChangeArray[row].rowRack.children[1].text('2');
      data.statusChangeArray[row].singleRacks.forEach((rack) => {
        if (rack.rackParameters.status.secondFloor != null)
          rack.rackParameters.status.secondFloor = rackType;
      });
    } else {
      data.statusChangeArray[row].rowRack.visible(false);
      data.statusChangeArray[row].singleRacks.forEach((rack) => {
        rack.children[0].fill(rack.rackParameters.colors.backGroundColor);
        rack.children[1].text('');
        rack.rackParameters.status.firstFloor = 0;
        if (rack.rackParameters.status.secondFloor != null)
          rack.rackParameters.status.secondFloor = 0;
        rack.visible(true);
      });
    }
  }

  // 更新变更列表
  data.statusChangeArray[row].singleRacks.forEach((rack) => {
    const index = data.statusChangedArray.findIndex(
      (item) => item.rackParameters.name === rack.rackParameters.name,
    );
    if (index !== -1) {
      data.statusChangedArray.splice(index, 1);
    }
    data.statusChangedArray.push(rack);
  });

  // Recalculate empty racks
  data.emptyNumber = 0;
  Object.values(data.statusChangeArray).forEach((entry) => {
    entry.singleRacks.forEach((rack) => {
      if (rack.rackParameters.status.firstFloor === 0) data.emptyNumber++;
      if (rack.rackParameters.status.secondFloor === 0) data.emptyNumber++;
    });
  });
};
