import Konva from 'konva';

const konvaArea = {
  createBgImg(canvasWidth, canvasHeight) {
    const backgroundComponent = new Konva.Image({
      image: background,
      width: canvasWidth,
      height: canvasHeight,
      x: 0,
      y: 0,
      rotation: 0, //旋转角度
      offset: {
        x: 0, // 图形中心点的 x 坐标
        y: 0, // 图形中心点的 y 坐标
      },
    });
    return backgroundComponent;
  },

  statusChangeRec: (coordinate, width, height, rackParameters) => {
    const outBox = new Konva.Label({
      x: coordinate.x,
      y: coordinate.y,
      opacity: 1,
      visible: true,
      width: width,
      height: height,
    });

    let box = new Konva.Rect({
      x: 0,
      y: 0,
      width: width,
      height: height,
      fill: rackParameters.colors.originGreen,
    });
    outBox.add(box);

    const text = new Konva.Text({
      x: 15,
      y: Math.min(height / 2, height - 20),
      text: rackParameters.no,
      fontSize: 18,
      fontStyle: 'bold',
      fill: 'white',
    });

    outBox.add(text);

    // inner box's rackParameters given
    outBox.rackParameters = rackParameters;

    // 改变置场状态

    let color = outBox.rackParameters.colors.backGroundColor,
      luggageAmount = 0;

    if (outBox.rackParameters.status) {
      text.text('');
      if (outBox.rackParameters.status.firstFloor !== 0) {
        luggageAmount += 1;
        text.text(luggageAmount);
        color = outBox.rackParameters.colors.disableGray;
      }

      if (outBox.rackParameters.status.secondFloor !== null) {
        if (
          outBox.rackParameters.status.secondFloor !== 0 &&
          outBox.rackParameters.status.secondFloor !== 4
        ) {
          luggageAmount += 1;
          text.text(luggageAmount);
        }
      }
    }

    box.fill(color);

    const statusChangeClick = () => {
      let rowName,
        ifSingle = false;
      if (outBox.rackParameters.name) {
        const fullName = outBox.rackParameters.name;
        rowName = fullName.split('-').slice(0, 2).join('-');
        ifSingle = true;
      }

      if (outBox.rackParameters.rowName) {
        rowName = outBox.rackParameters.rowName;
      }

      outBox.rackParameters.statusChangeClick({
        rowName,
        ifSingle,
      });
    };

    if (outBox.rackParameters.name || outBox.rackParameters.rowName) {
      outBox.boxClickFunc = statusChangeClick;
      outBox.off('click tap');
      outBox.on('click tap', statusChangeClick);
    }

    return outBox;
  },

  createRec: (
    coordinate,
    width,
    height,
    rackParameters,
    ifChangeStatus = false,
  ) => {
    const outBox = new Konva.Label({
      x: coordinate.x,
      y: coordinate.y,
      opacity: 1,
      visible: true,
      width: width,
      height: height,
    });
    let box = new Konva.Rect({
      x: 0,
      y: 0,
      width: width,
      height: height,
      fill: rackParameters.colors.originGreen,
    });
    outBox.add(box);

    const text = new Konva.Text({
      x: 15,
      y: height - 20,
      text: rackParameters.no,
      fontSize: 18,
      fontStyle: 'bold',
      fill: 'white',
    });

    outBox.add(text);
    outBox.rackParameters = rackParameters;
    outBox.rackParameters.clicked = false;

    // console.log(rackParameters.racks);

    // status :1 / 0
    const checkRacksStatus = (rackArray, status) => {
      let statusBool = true;
      rackArray.forEach((rack) => {
        if (rack.status != status) statusBool = false;
      });

      return statusBool;
    };

    let color;
    const ifAllEmpty = checkRacksStatus(rackParameters.racks, 0);
    // console.log(ifAllEmpty);
    if (ifChangeStatus) {
      // 默认全一二层无货
      color = outBox.rackParameters.colors.disableGray;

      box.fill(color);
    }
    // 当要选择搬的开始地时
    else if (rackParameters.startOrGoal == 'start') {
      // console.log('进入');
      !ifAllEmpty
        ? (color = outBox.rackParameters.colors.originGreen)
        : ((outBox.disabled = true),
          (color = outBox.rackParameters.colors.disableGray));

      box.fill(color);
    }
    // 当是选择要搬到的目的地时
    else if (rackParameters.startOrGoal == 'goal') {
      // console.log(rackParameters);
      rackParameters.racks[0].status == 0
        ? (color = outBox.rackParameters.colors.originGreen)
        : ((outBox.disabled = true),
          (color = outBox.rackParameters.colors.disableGray));

      box.fill(color);
    }

    const boxClick = () => {
      // 如果该方块没有被点击
      if (!outBox.rackParameters.clicked) {
        // if (outBox.rackParameters.singleOrDouble == 'single') {
        if (
          outBox.rackParameters.selectingRackInfo.rackArray.length <
          outBox.rackParameters.luggageAmount
        ) {
          outBox.rackParameters.clicked = true;
          box.fill(outBox.rackParameters.colors.clickedOrange);

          // 将点击的盒子加入 startRackArray，并更新 startRackNo
          outBox.rackParameters.selectingRackInfo.rackArray.push({
            rowName: outBox.rackParameters.no,
            racks: outBox.rackParameters.racks,
          });
        }
      }
      // 如果该方块已经被点击
      else if (outBox.rackParameters.clicked) {
        outBox.rackParameters.clicked = false;
        box.fill(outBox.rackParameters.colors.originGreen);

        // 从 start 或 goal 中移除点击的盒子，并更新计数
        const index =
          outBox.rackParameters.selectingRackInfo.rackArray.findIndex(
            (item) => item.rowName === outBox.rackParameters.no,
          );
        if (index !== -1) {
          outBox.rackParameters.selectingRackInfo.rackArray.splice(index, 1);
        }
      }
      outBox.rackParameters.updateEvents.handleRackClick({
        rowName: outBox.rackParameters.no,
      });
    };

    if (!outBox.disabled) {
      if (ifChangeStatus) {
        outBox.boxClickFunc = statusChangeClick;
        outBox.off('click tap');
        outBox.on('click tap', statusChangeClick);
      } else {
        outBox.boxClickFunc = boxClick;
        outBox.off('click tap');
        outBox.on('click tap', boxClick);
      }
    }

    return outBox;
  },

  imgObj(x, y, imgSrc, width, height) {
    let imageObj = new Image();
    imageObj.src = imgSrc;
    let imgObj = new Konva.Image({
      x: x,
      y: y,
      image: imageObj,
      width: width,
      height: height,
      offset: {
        x: width / 2,
        y: height / 2,
      },
    });

    return imgObj;
  },
};

export default konvaArea;
