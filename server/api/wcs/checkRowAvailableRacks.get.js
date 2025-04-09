import fs from 'fs';
import path from 'path';
import { info, danger, success } from '../logger.js';

export default defineEventHandler(async (event) => {
  const req = getQuery(event);
  console.log('req', req);

  let res = {
    method: getMethod(event),
    response: 'null',
    subResponse: {},
  };

  try {
    const response = await fetch('http://localhost:6547/parks.json');
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const parks = await response.json();

    let availableSpots = 0;
    let filteredParks = [];

    // **替代 SQL 查询：按条件筛选 JSON 数据**
    if (req.startArea === 'conveyor') {
      filteredParks = parks.filter((p) =>
        p.ParkNo.startsWith(`${req.okibaName}-${req.rowName}-`),
      );

      if (req.deliveryType === 2) {
        availableSpots = filteredParks
          .sort((a, b) => {
            let aParts = a.ParkNo.split('-');
            let bParts = b.ParkNo.split('-');
            return (
              parseInt(aParts[2]) - parseInt(bParts[2]) ||
              parseInt(bParts[3]) - parseInt(aParts[3])
            );
          })
          .reduce((count, p) => (p.Status !== 0 ? count : count + 1), 0);
      } else {
        availableSpots = filteredParks
          .filter((p) => p.ParkNo.split('-')[3] === '1')
          .sort((a, b) => {
            let aParts = a.ParkNo.split('-');
            let bParts = b.ParkNo.split('-');
            return (
              parseInt(aParts[2]) - parseInt(bParts[2]) ||
              parseInt(bParts[3]) - parseInt(aParts[3])
            );
          })
          .reduce((count, p) => (p.Status !== 0 ? count : count + 1), 0);
      }
    } else {
      if (req.startOrGoal === 'start') {
        filteredParks = parks.filter((p) =>
          p.ParkNo.startsWith(`${req.okibaName}-${req.rowName}`),
        );

        availableSpots = filteredParks
          .sort((a, b) => {
            let aParts = a.ParkNo.split('-');
            let bParts = b.ParkNo.split('-');
            return (
              parseInt(aParts[2]) - parseInt(bParts[2]) ||
              parseInt(aParts[3]) - parseInt(bParts[3])
            );
          })
          .reduce((count, p) => {
            if (p.Status !== 0 && p.Status !== req.cargoType) return count;
            return count + 1;
          }, 0);
      } else if (req.startOrGoal === 'goal' && req.deliveryType === 2) {
        filteredParks = parks.filter((p) =>
          p.ParkNo.startsWith(`${req.okibaName}-${req.rowName}`),
        );

        availableSpots = filteredParks
          .sort((a, b) => {
            let aParts = a.ParkNo.split('-');
            let bParts = b.ParkNo.split('-');
            return (
              parseInt(aParts[2]) - parseInt(bParts[2]) ||
              parseInt(bParts[3]) - parseInt(aParts[3])
            );
          })
          .reduce((count, p) => {
            if (p.Status !== 0 || p.Appointment !== 0) return count;
            return count + 1;
          }, 0);

        // 获取第一个 `Status != 0 OR Appointment != 0` 的车位
        const firstUnavailablePark = filteredParks.find(
          (p) => p.Status !== 0 || p.Appointment !== 0,
        );

        if (firstUnavailablePark) {
          res.subResponse = firstUnavailablePark;

          // 如果最后一部分是 '1'，需要减少 1 个可用车位
          const nameParts = firstUnavailablePark.ParkNo.split('-');
          if (
            nameParts[nameParts.length - 1] === '1' &&
            ((req.cargoType === '1' && firstUnavailablePark.Status === 2) ||
              (req.cargoType === '2' && firstUnavailablePark.Status === 1))
          ) {
            availableSpots -= 1;
          }
        }
      } else if (req.startOrGoal === 'goal') {
        filteredParks = parks.filter(
          (p) =>
            p.ParkNo.startsWith(`${req.okibaName}-${req.rowName}`) &&
            p.ParkNo.split('-')[3] === '1',
        );

        availableSpots = filteredParks
          .sort((a, b) => {
            let aParts = a.ParkNo.split('-');
            let bParts = b.ParkNo.split('-');
            return (
              parseInt(aParts[2]) - parseInt(bParts[2]) ||
              parseInt(bParts[3]) - parseInt(aParts[3])
            );
          })
          .reduce((count, p) => {
            if (p.Status !== 0 || p.Appointment !== 0) return count;
            return count + 1;
          }, 0);
      }
    }

    res.response = availableSpots;
    success(`Successfully fetched available spots: ${availableSpots}`);
  } catch (err) {
    danger(`Failed to fetch park data: ${err.message}`);
  }

  return res;
});
