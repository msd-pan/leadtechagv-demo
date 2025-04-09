let lastCenter = null;
let lastDist = 0;
let lastSingleTouchPosition = null; // 记录单指触摸的位置

const konvaScaling = {
  getDistance: (p1, p2) => {
    // Math.sqrt 函数返回一个数的平方根
    // Math.pow 函数返回基数（base）的指数（exponent）次幂
    return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
  },
  getCenter: (p1, p2) => {
    return {
      x: (p1.x + p2.x) / 2,
      y: (p1.y + p2.y) / 2,
    };
  },
  addTouchMove: (stage, zoomThresholdFar, zoomThresholdClose) => {
    function reRenderStage(scale, zoomThresholdFar, zoomThresholdClose) {
      scale = scale.x;
    }
    stage.reRenderStage = reRenderStage;

    stage.moving = false;
    stage.on('touchmove', function (e) {
      stage.moving = true;

      e.evt.preventDefault();

      if (e.evt.touches.length === 1 && lastSingleTouchPosition) {
        // 单指拖动逻辑
        const touch = e.evt.touches[0];
        const dx = touch.clientX - lastSingleTouchPosition.x;
        const dy = touch.clientY - lastSingleTouchPosition.y;

        const newPos = {
          x: stage.x() + dx,
          y: stage.y() + dy,
        };

        stage.position(newPos);
        stage.batchDraw();

        lastSingleTouchPosition = {
          x: touch.clientX,
          y: touch.clientY,
        };
      } else if (e.evt.touches.length === 2) {
        stage.draggable(false);

        const touch1 = e.evt.touches[0];
        const touch2 = e.evt.touches[1];
        if (touch1 && touch2) {
          if (stage.isDragging()) {
            stage.stopDrag();
          }

          const p1 = {
            x: touch1.clientX,
            y: touch1.clientY,
          };
          const p2 = {
            x: touch2.clientX,
            y: touch2.clientY,
          };

          if (!lastCenter) {
            lastCenter = konvaScaling.getCenter(p1, p2);
            return;
          }
          const newCenter = konvaScaling.getCenter(p1, p2);

          const dist = konvaScaling.getDistance(p1, p2);

          if (!lastDist) {
            lastDist = dist;
          }

          const pointTo = {
            x: (newCenter.x - stage.x()) / stage.scaleX(),
            y: (newCenter.y - stage.y()) / stage.scaleX(),
          };
          const scale = stage.scaleX() * (dist / lastDist);

          stage.scaleX(scale);
          stage.scaleY(scale);

          const dx = newCenter.x - lastCenter.x;
          const dy = newCenter.y - lastCenter.y;

          const newPos = {
            x: newCenter.x - pointTo.x * scale + dx,
            y: newCenter.y - pointTo.y * scale + dy,
          };

          stage.position(newPos);
          lastDist = dist;
          lastCenter = newCenter;

          stage.reRenderStage(
            yardGroup,
            stage.scale(),
            zoomThresholdFar,
            zoomThresholdClose,
          );
        }
        stage.draggable(true);
      }
    });
    stage.on('touchend', function () {
      stage.moving = false;
      lastDist = 0;
      lastCenter = null;
    });

    stage.tapTimer = null;

    stage.on('dragstart', (e) => {
      stage.moving = true;
    });
    stage.on('dragend', (e) => {
      stage.moving = false;
    });

    stage.on('touchstart', (e) => {
      if (e.evt.touches.length === 1) {
        // 单指触摸，记录触摸位置
        const touch = e.evt.touches[0];
        lastSingleTouchPosition = {
          x: touch.clientX,
          y: touch.clientY,
        };
      } else if (e.evt.touches.length === 2) {
        if (stage.moving || stage.scaleX() >= zoomThresholdClose) {
          return;
        }

        if (stage.tapTimer || e.evt.touches.length > 1) {
          clearTimeout(stage.tapTimer);
          stage.tapTimer = null;
          return;
        }

        const timeOut = 80;

        const original = stage.getPointerPosition();

        stage.tapTimer = setTimeout(function () {
          stage.tapTimer = null;

          const currentPos = stage.getPointerPosition();

          const d = Math.sqrt(
            Math.pow(currentPos.x - original.x, 2) +
              Math.pow(currentPos.y - original.y, 2),
          );
          if (d >= 2) {
            return;
          }

          e.evt.preventDefault();

          const oldScale = stage.scaleX();
          const pointer = stage.getPointerPosition();

          const mousePointTo = {
            x: (pointer.x - stage.x()) / oldScale,
            y: (pointer.y - stage.y()) / oldScale,
          };

          let direction = 1;

          const newScale = 1;

          if (oldScale < zoomThresholdFar) {
            newScale = zoomThresholdFar + 0.001;
          } else if (
            oldScale > zoomThresholdFar &&
            oldScale < zoomThresholdClose
          ) {
            newScale = zoomThresholdClose + 0.001;
          }

          stage.scale({ x: newScale, y: newScale });

          const newPos = {
            x: pointer.x - mousePointTo.x * newScale,
            y: pointer.y - mousePointTo.y * newScale,
          };
          stage.position(newPos);
          stage.reRenderStage(
            yardGroup,
            stage.scale(),
            zoomThresholdFar,
            zoomThresholdClose,
          );
        }, timeOut);
      }
    });

    stage.on('wheel', function (e) {
      e.evt.preventDefault();

      const scaleBy = 1.05;
      const oldScale = stage.scaleX();

      let newScale = e.evt.deltaY > 0 ? oldScale * scaleBy : oldScale / scaleBy;

      // 限制最小和最大缩放值
      newScale = Math.max(0.2, Math.min(5, newScale));

      // 更新舞台的缩放值
      stage.scaleX(newScale);
      stage.scaleY(newScale);

      // 重新绘制舞台
      stage.batchDraw();
    });

    return stage;
  },
};
export default konvaScaling;
