import { useErrorStore } from '@/stores/errorStore';
import { useRouter } from 'vue-router';

const specialErrorCodesSet = new Set([
  '02400a41',
  '02400025',
  '02400017',
  '0240002a',
  '06400903',
  '02400027',
  '0430004c',
  '0430004d',
  '02400289',
  '07301204',
  '02400071',
]);

export const useErrorChecker = () => {
  console.log('errorChecker调用');
  const errorStore = useErrorStore();
  const router = useRouter();

  const getTasksAndAgvInfos = async () => {
    const returnData = await $fetch('/api/rcs/getTasksAndAgvInfo', {
      method: 'GET',
    }).catch(() => false);

    return returnData ? returnData.response : false;
  };

  const getDbErrorMsg = async (code) => {
    const data = await $fetch('/api/db/getErrorFromDb', {
      method: 'GET',
      query: { errorCode: code },
    }).catch((error) => error.data);

    return data;
  };

  const checkIfErrorHistoryExist = async (taskId, errorCode) => {
    const data = await $fetch('/api/db/checkIfErrorHistoryExist', {
      method: 'POST',
      body: { taskId, errorCode },
    }).catch((error) => error.data);

    return data;
  };

  const recordErrors = async (errors) => {
    const data = await $fetch('/api/db/recordErrorHistory', {
      method: 'POST',
      body: { errors },
    }).catch((error) => error.data);

    return data;
  };

  const checkIfHasError = async () => {
    const allInfos = await getTasksAndAgvInfos();
    if (!allInfos) return;

    const errors = [];

    for (const task of allInfos.orders || []) {
      for (const code of task.errors || []) {
        const ifExist = await getDbErrorMsg(code);
        const ifErrorHistoryExist = task.id
          ? await checkIfErrorHistoryExist(task.id, code)
          : { ifExist: false };

        if (
          ifExist.response !== 'null' &&
          ifExist.response.e_no &&
          ifExist.response.e_show === 1 &&
          !ifErrorHistoryExist.ifExist
        ) {
          errors.push({ id: task.id, code });
        }
      }
    }

    for (const agvInfo of allInfos.agvInfos || []) {
      for (const code of agvInfo.errors || []) {
        const ifExist = await getDbErrorMsg(code);
        if (
          ifExist.response !== 'null' &&
          ifExist.response.e_no &&
          ifExist.response.e_show === 1
        ) {
          errors.push({ id: agvInfo.id, code });
        }
      }
    }

    if (errors.length > 0) {
      // 取第一个错误为主，避免覆盖
      const firstError = errors[0];
      const hexCode = '0' + parseInt(firstError.code, 10).toString(16);

      errorStore.setErrorCode(firstError.code);
      errorStore.setCarNo(firstError.id);

      errorStore.setOccurTime(
        new Date().toLocaleString('en-US', {
          timeZone: 'Asia/Tokyo',
          hour12: false,
        }),
      );

      await recordErrors(errors);

      router.push('/error/popup');
    }
  };

  return { checkIfHasError };
};
