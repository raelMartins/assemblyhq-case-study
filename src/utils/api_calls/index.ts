import axios from 'axios';

export const query_qithub = async () => {
  const res = await axios({
    method: `GET`,
    url: `https://api.github.com`
  });

  return res.data;
};
