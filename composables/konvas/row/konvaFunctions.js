import konvaArea from './konvaArea';

// the colors
let colors = {
  originGreen: '#35a16b',
  clickedOrange: '#ff7f00',
  lightOrange: '#f0a459',
  selectedDarkGreen: '#275339',
  disableGray: '#b5b5b6',
  backGroundColor: '#585858',
  lightBlue: '#90cbfb',
};

const recWidth = 40;
const recHeight = 20;

const recGap = 5;

const stageOffset = { x: 220, y: 50 };

const konvaFunctions = {
  createLayer(canvasHeight) {
    const layer = new Konva.Layer();

    return layer;
  },

  createItems(stage, layer, updateEvents, parks, paraObj) {
    let maxRowNum = -100;
    if (!paraObj.ifChangeStatus) {
      const rows = Object.keys(parks[paraObj.selectedOkiba]).length;
      // console.log(lengthOfKeys);
      for (let i = 0; i < rows; i++) {
        let park,
          firstFloor = 0,
          secondFloor = 0;
        const racks =
          parks[paraObj.selectedOkiba][
            Object.keys(parks[paraObj.selectedOkiba])[i]
          ];

        let x = i * recWidth + i * recGap,
          y = 10;
        if (paraObj.selectedOkiba == 'C') {
          y =
            10 * 35 -
            Math.ceil(racks.length / 2) * 30 -
            (Math.ceil(racks.length / 2) - 1) * recGap;
        }

        if (paraObj.selectedOkiba == 'D') {
          (x =
            -100 +
            (60 - Object.keys(parks[paraObj.selectedOkiba])[i]) * recWidth +
            (60 - Object.keys(parks[paraObj.selectedOkiba])[i]) * recGap),
            (y =
              10 * 65 -
              Math.ceil(racks.length / 2) * 30 -
              (Math.ceil(racks.length / 2) - 1) * recGap);
        }
        park = konvaArea.createRec(
          {
            x: x + stageOffset.x,
            y: y + stageOffset.y,
          },
          recWidth,
          Math.ceil(racks.length / 2) * 30 +
            (Math.ceil(racks.length / 2) - 1) * recGap,
          {
            colors,
            no: Object.keys(parks[paraObj.selectedOkiba])[i],
            status: {
              firstFloor,
              secondFloor,
            },
            racks,
            updateEvents,
            luggageAmount: paraObj.luggageAmount(),
            startOrGoal: paraObj.startOrGoal,
            singleOrDouble: paraObj.singleOrDouble,
            selectingRackInfo: paraObj.selectingRackInfo,
          },
          paraObj.ifChangeStatus,
        );

        // park.scaleY(-1);
        layer.add(park);

        paraObj.allUiRacks.push(park);
      }
    } else {
      const keys = Object.keys(parks[paraObj.selectedOkiba]);
      const onlyOneLayerRacks = [
        'C-76-1',
        'C-76-2',
        'D-53-18',
        'D-50-16',
        'D-51-16',
      ];

      for (let i = 0; i < keys.length; i++) {
        const subKey = keys[i]; // 获取当前的键
        const parkArray = parks[paraObj.selectedOkiba][subKey]; // 通过键名访问数组
        let park;

        // 先将方块创建出来
        for (let j = 0; j < parkArray.length; j++) {
          const outParts = parkArray[j].name.split('-');

          if (outParts[outParts.length - 1] === '1') {
            let firstFloor = -1,
              secondFloor = -1;
            // 根据其一二层有没有货来
            for (let j = 0; j < parkArray.length; j++) {
              const parts = parkArray[j].name.split('-');
              if (
                parts[parts.length - 4] +
                  '-' +
                  parts[parts.length - 3] +
                  '-' +
                  parts[parts.length - 2] ==
                outParts[outParts.length - 4] +
                  '-' +
                  outParts[outParts.length - 3] +
                  '-' +
                  outParts[outParts.length - 2]
              ) {
                if (parts[parts.length - 1] === '1') {
                  firstFloor = parkArray[j].status;
                }

                if (parts[parts.length - 1] === '2') {
                  secondFloor = parkArray[j].status;
                }

                if (
                  onlyOneLayerRacks.includes(
                    parts[parts.length - 4] +
                      '-' +
                      parts[parts.length - 3] +
                      '-' +
                      parts[parts.length - 2],
                  )
                ) {
                  secondFloor = null;
                }
              }
            }

            let x = i * recWidth + i * recGap + 60,
              y =
                10 * 35 -
                +outParts[outParts.length - 2] * recHeight -
                +outParts[outParts.length - 2] * recGap;

            if (paraObj.selectedOkiba == 'D') {
              (x =
                -100 +
                (60 - +outParts[outParts.length - 3]) * recWidth +
                (60 - +outParts[outParts.length - 3]) * recGap),
                (y =
                  10 * 72 -
                  +outParts[outParts.length - 2] * recHeight -
                  +outParts[outParts.length - 2] * recGap);
            }
            park = konvaArea.statusChangeRec(
              {
                x: x + stageOffset.x,
                y: y + stageOffset.y,
              },
              recWidth,
              recHeight,
              {
                colors,
                // id: parkArray[j].id,
                name:
                  outParts[outParts.length - 4] +
                  '-' +
                  outParts[outParts.length - 3] +
                  '-' +
                  outParts[outParts.length - 2],
                no: outParts[outParts.length - 2],
                status: {
                  firstFloor,
                  secondFloor,
                },
                statusChangeClick: paraObj.statusChangeClick,
              },
            );

            layer.add(park);
            paraObj.allUiRacks.push(park);

            const key = outParts[outParts.length - 3];

            // 如果目标对象不存在，则初始化
            if (!paraObj.selectingRackInfo.statusChangeArray[key]) {
              paraObj.selectingRackInfo.statusChangeArray[key] = {
                ['singleRacks']: [],
                ['rowRack']: {},
              };
            }

            paraObj.selectingRackInfo.statusChangeArray[
              outParts[outParts.length - 3]
            ]['singleRacks'].push(park);

            // 获取列中最多多少个一层库位
            if (maxRowNum < +outParts[outParts.length - 2]) {
              maxRowNum = outParts[outParts.length - 2];
            }
          }
        }
      }

      // 创建下面的列名
      const rows = Object.keys(parks[paraObj.selectedOkiba]);
      for (let i = 0; i < rows.length; i++) {
        let park;
        const racks =
          parks[paraObj.selectedOkiba][
            Object.keys(parks[paraObj.selectedOkiba])[i]
          ];

        let y = 10 * 35 - maxRowNum * recHeight - maxRowNum * recGap,
          x = i * recWidth + i * recGap + 60;

        // 特殊情况特殊处理
        if (paraObj.selectedOkiba == 'C') {
          y =
            10 * 35 -
            Math.ceil(racks.length / 2) * recHeight -
            (Math.ceil(racks.length / 2) - 1) * recGap;

          if (rows[i] == '76') {
            y =
              10 * 35 -
              Math.ceil(racks.length) * recHeight -
              (Math.ceil(racks.length) - 1) * recGap;
          }
        }

        if (paraObj.selectedOkiba == 'D') {
          (x = -100 + (60 - rows[i]) * recWidth + (60 - rows[i]) * recGap),
            (y =
              10 * 72 -
              Math.ceil(racks.length / 2) * recHeight -
              (Math.ceil(racks.length / 2) - 1) * recGap);

          park = konvaArea.statusChangeRec(
            {
              x: 345 - i * recWidth - i * recGap + stageOffset.x,
              y: 730 + stageOffset.y,
            },
            recWidth,
            20,
            { colors, no: rows[i] },
          );
        } else {
          park = konvaArea.statusChangeRec(
            {
              x: i * recWidth + i * recGap - 3 + 60 + stageOffset.x,
              y: 360 + stageOffset.y,
            },
            recWidth,
            20,
            { colors, no: rows[i] },
          );
        }

        park.children[0].fill('transparent');
        park.children[1].fill(colors.selectedDarkGreen);

        // park.scaleY(-1);
        layer.add(park);

        // 创建一整列的矩形
        const singleRow = konvaArea.statusChangeRec(
          {
            x: x + stageOffset.x,
            y: y + stageOffset.y,
          },
          recWidth,
          Math.ceil(racks.length / 2) * recHeight +
            (Math.ceil(racks.length / 2) - 1) * recGap,
          {
            colors,
            no: rows[i],
            rowName: paraObj.selectedOkiba + '-' + rows[i],
            statusChangeClick: paraObj.statusChangeClick,
          },
        );

        if (rows[i] == '76') {
          singleRow.children[0].height(2 * recHeight + recGap);
          singleRow.children[1].y(24);
        }

        singleRow.visible(false);

        layer.add(singleRow);

        paraObj.selectingRackInfo.statusChangeArray[rows[i]]['rowRack'] =
          singleRow;
      }

      // 创建左右的列中的行名
      for (let i = 0; i < maxRowNum; i++) {
        let y = 10 * 35 - (i + 1) * recHeight - (i + 1) * recGap,
          leftX = 10,
          rightX = rows.length * 52;

        if (paraObj.selectedOkiba == 'D') {
          y = 10 * 72 - (i + 1) * recHeight - (i + 1) * recGap;
          (leftX = -10), (rightX = rows.length * 48);
        }
        const leftLineNum = konvaArea.statusChangeRec(
          {
            x: leftX + stageOffset.x,
            y: y + stageOffset.y,
          },
          recWidth,
          20,
          { colors, no: i + 1 },
        );

        leftLineNum.children[0].fill('transparent');
        leftLineNum.children[1].fill(colors.selectedDarkGreen);

        const rightLineNum = konvaArea.statusChangeRec(
          {
            x: rightX + stageOffset.x,
            y: y + stageOffset.y,
          },
          recWidth,
          20,
          { colors, no: i + 1 },
        );

        rightLineNum.children[0].fill('transparent');
        rightLineNum.children[1].fill(colors.selectedDarkGreen);

        layer.add(leftLineNum, rightLineNum);
      }
    }

    stage.add(layer);
    return [layer];
  },
};

export default konvaFunctions;
