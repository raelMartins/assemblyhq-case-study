import axios from 'axios';

export const query_github = async ({
  query,
  org = false,
  page = 1,
}: {
  query: string | string[];
  org?: boolean;
  page?: number;
}) => {
  const res = await axios({
    method: `GET`,
    url: `https://api.github.com/search/users?q=${query}${org ? `+type:org` : ``}&page=${page}`,
  });

  return res?.data?.items || [];
};
