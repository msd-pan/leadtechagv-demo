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
const recHeight = 30;

const recGap = 5;

const konvaFunctions = {
  createLayer(canvasHeight) {
    const layer = new Konva.Layer();

    // layer.scaleY(-1); // 翻转Y轴
    // layer.offsetY(-canvasHeight); // 将原点从上方移动到底部

    return layer;
  },

  createItems(stage, layer, checkboxLayer, updateEvents, parks, paraObj) {
    const keys = Object.keys(parks[paraObj.selectedOkiba]);
    const onlyOneLayerRacks = [
      'C-76-1',
      'C-76-2',
      'D-53-18',
      'D-50-16',
      'D-51-16',
    ];

    let maxRowNum = -100;
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

          let firstAppointment = -1,
            secondAppointment = -1;
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
                firstAppointment = parkArray[j].appointment;
              }

              if (parts[parts.length - 1] === '2') {
                secondFloor = parkArray[j].status;
                secondAppointment = parkArray[j].appointment;
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

          let x = i * recWidth + i * recGap,
            y =
              10 * 49 -
              +outParts[outParts.length - 2] * recHeight -
              +outParts[outParts.length - 2] * recGap;

          if (paraObj.selectedOkiba == 'D') {
            (x =
              -130 +
              (60 - +outParts[outParts.length - 3]) * recWidth +
              (60 - +outParts[outParts.length - 3]) * recGap),
              (y =
                10 * 82 -
                +outParts[outParts.length - 2] * recHeight -
                +outParts[outParts.length - 2] * recGap);
          }
          park = konvaArea.createRec(
            {
              x: x,
              y: y,
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
                firstAppointment,
                secondFloor,
                secondAppointment,
              },
              updateEvents,
              luggageAmount: paraObj.luggageAmount(),
              startOrGoal: paraObj.startOrGoal,
              singleOrDouble: paraObj.singleOrDouble,
              selectingRackInfo: paraObj.selectingRackInfo,
              allUiRacks: paraObj.allUiRacks,
              statusChangeClick: paraObj.statusChangeClick,
              selectedAmount: paraObj.selectedAmount,
            },
            paraObj.ifChangeStatus,
          );

          layer.add(park);
          paraObj.allUiRacks.push(park);

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
      if (paraObj.selectedOkiba == 'D') {
        park = konvaArea.createRec(
          {
            x: 320 - i * recWidth - i * recGap,
            y: 830,
          },
          recWidth,
          20,
          { colors, no: rows[i] },
        );
      } else {
        park = konvaArea.createRec(
          {
            x: i * recWidth + i * recGap,
            y: 500,
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
    }
    if (paraObj.ifChangeStatus) {
      // 创建左右的列中的行名
      for (let i = 0; i < maxRowNum; i++) {
        let y = 10 * 50 - (i + 1) * recHeight - (i + 1) * recGap;

        if (paraObj.selectedOkiba == 'D') {
          y = 10 * 83 - (i + 1) * recHeight - (i + 1) * recGap;
        }
        const leftLineNum = konvaArea.createRec(
          {
            x: -40,
            y: y,
          },
          recWidth,
          20,
          { colors, no: i + 1 },
        );

        leftLineNum.children[0].fill('transparent');
        leftLineNum.children[1].fill(colors.selectedDarkGreen);

        const rightLineNum = konvaArea.createRec(
          {
            x: rows.length * 45,
            y: y,
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
  },
};

export default konvaFunctions;
