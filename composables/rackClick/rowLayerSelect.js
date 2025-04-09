export const selectLayerRow = (layer, data) => {
  data.statusInputWay = layer;
  let rackType = -1;
  if (data.statusInputWay == '4段') {
    rackType = 1;
  } else if (data.statusInputWay == '5段') {
    rackType = 2;
  }
  // console.log(data.allUiRacks);
  if (layer === null) {
    data.allUiRacks.forEach((uiRack) => {
      let color = uiRack.rackParameters.colors.backGroundColor,
        luggageAmount = 0;
      if (uiRack.rackParameters.status.firstFloor != 0) {
        luggageAmount += 1;
        uiRack.children[1].text(luggageAmount);
        color = uiRack.rackParameters.colors.disableGray;
      }

      if (uiRack.rackParameters.status.secondFloor !== null) {
        if (
          uiRack.rackParameters.status.secondFloor !== 0 &&
          uiRack.rackParameters.status.secondFloor !== 4
        ) {
          luggageAmount += 1;
          uiRack.children[1].text(luggageAmount);
        }
      }
      uiRack.children[0].fill(color);
      // uiRack.off('click tap', uiRack.boxClickFunc);
    });
  } else {
    data.allUiRacks.forEach((uiRack) => {
      let color = uiRack.rackParameters.colors.backGroundColor;

      // layer 1 is occupied
      if (
        uiRack.rackParameters.status.firstFloor == rackType &&
        uiRack.rackParameters.status.secondFloor == 0
      ) {
        color = uiRack.rackParameters.colors.lightOrange;
        uiRack.off('click tap');
        uiRack.on('click tap', uiRack.boxClickFunc);
      }

      // layer1 and layer2 both are occupied
      if (uiRack.rackParameters.status.secondFloor == rackType) {
        color = uiRack.rackParameters.colors.clickedOrange;
        uiRack.off('click tap');
        uiRack.on('click tap', uiRack.boxClickFunc);
      }

      // one of layer1 or layer2 been occupied but not the selected rack type
      if (
        (uiRack.rackParameters.status.firstFloor != rackType &&
          uiRack.rackParameters.status.firstFloor != 0) ||
        (uiRack.rackParameters.status.secondFloor != rackType &&
          uiRack.rackParameters.status.secondFloor != 0)
      ) {
        color = uiRack.rackParameters.colors.disableGray;
        uiRack.off('click tap', uiRack.boxClickFunc);
      }
      uiRack.children[0].fill(color);
    });
  }
};
