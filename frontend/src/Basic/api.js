import axios from "axios";
const backend = process.env.REACT_APP_API || "http://localhost:36912/api/v1";

// interceptor is invocated before promise evaluation
axios.interceptors.response.use(
  (okResponse) => {
    return okResponse;
  },
  (nonOkResponse) => {
    if (nonOkResponse.response?.status === 403) {
      window.location.assign(`${window.location.origin}/login`);
    } else if (nonOkResponse.message === "Network Error") {
      window.location.assign(`${window.location.origin}/login`);
    } else {
      return Promise.reject(nonOkResponse);
    }
  }
);

const handleResponse = async (response) => {
  return response
    .then((data) => {
      return data?.data;
    })
    .catch((error) => {
      console.error(error);
    });
};

const getTokens = (page) => async () => {
  const data = await handleResponse(
    axios({
      url: `${backend}/token`,
      params: { page },
      withCredentials: true,
    })
  );
  return data?.result;
};

const getDocuments = async () =>
  await handleResponse(
    axios({
      url: `${backend}/document`,
      withCredentials: true,
    })
  );

const postToken = ({ user, expiresAt }) =>
  handleResponse(
    axios({
      method: "post",
      url: `${backend}/token`,
      data: {
        user,
        expiresAt,
      },
      withCredentials: true,
    })
  );

const updateToken = ({ _id, mutation }) =>
  handleResponse(
    axios({
      method: "put",
      url: `${backend}/token/${_id}`,
      data: mutation,
      withCredentials: true,
    })
  );

const deleteToken = (_id) =>
  handleResponse(
    axios({
      method: "delete",
      url: `${backend}/token/${_id}`,
      withCredentials: true,
    })
  );

export {
  getTokens,
  postToken,
  updateToken,
  deleteToken,
  getDocuments,
  backend,
};
