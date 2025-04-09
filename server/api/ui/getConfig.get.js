import config from '../../server_config';

export default defineEventHandler(async (event) => {
  const query = getQuery(event);

  const res = {
    method: getMethod(event),
    response: {},
  };

  if (res.method != 'GET') {
    return res;
  }

  res.response = config;

  return res;
});
