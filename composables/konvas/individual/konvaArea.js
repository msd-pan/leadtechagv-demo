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

    // inner box's rackParameters given
    outBox.rackParameters = rackParameters;

    // initialize all the racks' clicked parameter to false
    outBox.rackParameters.clicked = false;

    let color;
    // 通用的状态和颜色处理函数
    const determineColorAndState = (parameters) => {
      const { status, colors, singleOrDouble } = parameters;

      // if (singleOrDouble === 'single') {
      //   if (status.firstFloor !== 0 && status.firstAppointment === 0) {
      //     return { color: colors.originGreen, disabled: false, visible: true };
      //   } else {
      //     return { color: colors.disableGray, disabled: true, visible: true };
      //   }
      // }

      // if (singleOrDouble === 'double')
      if (status) {
        if (status.secondFloor === null) {
          return { color: null, disabled: false, visible: false }; // Hide outBox
        }
        if (status.secondFloor === 4) {
          return { color: colors.disableGray, disabled: true, visible: true };
        }
        if (status.secondFloor !== 0 && status.secondAppointment === 0) {
          return { color: colors.lightBlue, disabled: false, visible: true };
        }
        if (status.secondFloor === 0) {
          if (status.firstFloor !== 0 && status.firstAppointment === 0) {
            return {
              color: colors.originGreen,
              disabled: false,
              visible: true,
            };
          } else {
            return { color: colors.disableGray, disabled: true, visible: true };
          }
        }
      }

      // 默认状态
      return { color: colors.disableGray, disabled: true, visible: true };
    };

    // 改进后的逻辑
    if (ifChangeStatus) {
      // 改变置场状态
      text.text('');
      let color = outBox.rackParameters.colors.backGroundColor,
        luggageAmount = 0;
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
          color = outBox.rackParameters.colors.disableGray;
        }
      }

      if (outBox.rackParameters.status.firstFloor == 3) {
        color = outBox.rackParameters.colors.selectedDarkGreen;
      }

      box.fill(color);
    } else {
      // 开始地和目的地的通用逻辑
      let { color, disabled, visible } = determineColorAndState(
        outBox.rackParameters,
      );

      if (color !== null) {
        box.fill(color);
      }
      outBox.disabled = disabled;
      outBox.visible(visible);

      if (rackParameters.startOrGoal === 'goal') {
        if (rackParameters.singleOrDouble === 'single') {
          outBox.rackParameters.status.firstFloor === 0 &&
          outBox.rackParameters.status.firstAppointment === 0
            ? ((outBox.disabled = false),
              (color = outBox.rackParameters.colors.originGreen))
            : ((outBox.disabled = true),
              (color = outBox.rackParameters.colors.disableGray));
        } else if (rackParameters.singleOrDouble === 'double') {
          if (outBox.rackParameters.status.secondFloor === null) {
            outBox.visible(false);
          } else {
            (outBox.rackParameters.status.firstFloor === 0 &&
              outBox.rackParameters.status.firstAppointment === 0) ||
            (outBox.rackParameters.status.secondFloor === 0 &&
              outBox.rackParameters.status.secondAppointment === 0)
              ? ((outBox.disabled = false),
                (color = outBox.rackParameters.colors.originGreen))
              : ((outBox.disabled = true),
                (color = outBox.rackParameters.colors.disableGray));
          }
        }
        box.fill(color);
      }
    }

    const statusChangeClick = () => {
      outBox.rackParameters.statusChangeClick({
        outBox,
        allUiRacks: outBox.rackParameters.allUiRacks,
      });
    };
    // statusChangeClick();

    const boxClick = () => {
      // console.log(outBox.rackParameters.selectedAmount);
      let notEmptyRackNum = 0,
        emptyRackNum = 0;

      // 计算当前数组中的状态
      const recalculateStatus = () => {
        notEmptyRackNum = 0;
        emptyRackNum = 0;
        outBox.rackParameters.selectingRackInfo.rackArray.forEach((rack) => {
          if (rack.status.firstFloor != 0) {
            notEmptyRackNum += 1;
          } else emptyRackNum += 1;

          if (rack.status.secondFloor != 0) {
            notEmptyRackNum += 1;
          } else emptyRackNum += 1;
        });
      };

      recalculateStatus(); // 初始计算
      // 如果该方块没有被点击
      if (!outBox.rackParameters.clicked) {
        if (outBox.rackParameters.singleOrDouble == 'single') {
          // console.log(outBox.rackParameters.selectingRackInfo.rackArray);
          if (
            outBox.rackParameters.selectingRackInfo.rackArray.length +
              outBox.rackParameters.selectedAmount <
            outBox.rackParameters.luggageAmount
          ) {
            outBox.rackParameters.clicked = true;
            box.fill(outBox.rackParameters.colors.clickedOrange);

            // 将点击的盒子加入 startRackArray，并更新 startRackNo
            outBox.rackParameters.selectingRackInfo.rackArray.push({
              name: outBox.rackParameters.name,
              status: outBox.rackParameters.status,
            });
            recalculateStatus(); // 更新计算
          }
        } else if (outBox.rackParameters.singleOrDouble == 'double') {
          // 检查是否可以点击
          const canClick =
            rackParameters.startOrGoal == 'start'
              ? notEmptyRackNum < outBox.rackParameters.luggageAmount
              : emptyRackNum + outBox.rackParameters.selectedAmount <
                outBox.rackParameters.luggageAmount;
          if (canClick) {
            // 更新 clicked 状态
            outBox.rackParameters.clicked = true;
            box.fill(outBox.rackParameters.colors.clickedOrange);

            // 将当前矩形的状态加入数组
            outBox.rackParameters.selectingRackInfo.rackArray.push({
              name: outBox.rackParameters.name,
              status: outBox.rackParameters.status,
            });

            recalculateStatus();
          }
        }
      }
      // 如果该方块已经被点击
      else if (outBox.rackParameters.clicked) {
        outBox.rackParameters.clicked = false;

        if (outBox.rackParameters.startOrGoal == 'start') {
          if (
            outBox.rackParameters.status.secondFloor != 0 &&
            outBox.rackParameters.status.secondFloor != 4
          ) {
            box.fill(outBox.rackParameters.colors.lightBlue);
          } else box.fill(outBox.rackParameters.colors.originGreen);
        } else {
          box.fill(outBox.rackParameters.colors.originGreen);
        }

        // 从 start 或 goal 中移除点击的盒子，并更新计数
        const index =
          outBox.rackParameters.selectingRackInfo.rackArray.findIndex(
            (item) => item.name === outBox.rackParameters.name,
          );

        if (index !== -1) {
          outBox.rackParameters.selectingRackInfo.rackArray.splice(index, 1);
        }

        recalculateStatus();
      }
      outBox.rackParameters.updateEvents.handleRackClick({
        name: outBox.rackParameters.name,
        status: outBox.rackParameters.status,
        notEmptyRackNum,
        emptyRackNum,
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

  createCheboxArea() {},

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
