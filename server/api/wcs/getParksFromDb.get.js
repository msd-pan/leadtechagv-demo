import { info, danger, success } from '../logger.js';

export default defineEventHandler(async (event) => {
  const req = getQuery(event);
  console.log('req', req);

  let res = {
    method: getMethod(event),
    response: 'null',
  };

  try {
    // **通过 HTTP 访问 public/parks.json**
    const response = await fetch('http://localhost:6547/parks.json');
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const parks = await response.json();

    // 解析 `ParkNo` 并分类
    const groupedData = parks
      .map((item) => {
        const parts = item.ParkNo.split('-');
        return {
          id: item.id,
          ParkNo: item.ParkNo,
          Status: item.Status,
          Appointment: item.Appointment,
          ParkGroup: parts[0], // 第一部分
          FirstNumberPart: parts[1], // 第二部分
          SecondNumberPart: parts[2], // 第三部分
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

    res.response = groupedData;
    success('Successfully fetched park data from public JSON');
  } catch (err) {
    danger(`Failed to fetch park data: ${err.message}`);
  }

  return res;
});
