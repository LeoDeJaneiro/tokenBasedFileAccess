import axios from "axios";
const backend = process.env.REACT_APP_API || "http://localhost:36912";

const getTokens = (page) => async () => {
  const data = await axios.get(`${backend}/api/v1/token`, { params: { page } });
  return data.data.result;
};

const postToken = async ({ user, expiresAt }) =>
  axios({
    method: "post",
    url: `${backend}/api/v1/token`,
    data: {
      user,
      expiresAt,
    },
  });

const updateToken = async ({ _id, mutation }) => {
  console.log("mutation: ", mutation);
  return axios({
    method: "put",
    url: `${backend}/api/v1/token/${_id}`,
    data: mutation,
  });
};

const deleteToken = async (_id) =>
  axios({
    method: "delete",
    url: `${backend}/api/v1/token/${_id}`,
  });

export { getTokens, postToken, updateToken, deleteToken };
