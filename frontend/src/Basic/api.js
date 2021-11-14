import axios from "axios";
const backend = process.env.REACT_APP_API || "http://localhost:36912/api/v1";

const getTokens = (page) => async () => {
  const data = await axios.get(`${backend}/token`, { params: { page } });
  return data.data.result;
};

const getDocuments = async () => {
  const data = await axios.get(`${backend}/document`);
  return data.data;
};

const postToken = async ({ user, expiresAt }) =>
  axios({
    method: "post",
    url: `${backend}/token`,
    data: {
      user,
      expiresAt,
    },
  });

const updateToken = async ({ _id, mutation }) =>
  axios({
    method: "put",
    url: `${backend}/token/${_id}`,
    data: mutation,
  });

const deleteToken = async (_id) =>
  axios({
    method: "delete",
    url: `${backend}/token/${_id}`,
  });

export { getTokens, postToken, updateToken, deleteToken, getDocuments };
