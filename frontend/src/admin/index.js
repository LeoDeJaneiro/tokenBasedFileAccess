import { useState } from "react";
import { notification } from "antd";
import { useQuery, useMutation } from "react-query";
import _ from "lodash";
import styled from "styled-components";

import Flex from "../Basic/Flex";
import {
  getDocuments,
  getTokens,
  updateToken,
  deleteToken,
} from "../Basic/api";
import AddToken from "./AddToken";
import Table from "./Table";

const notificationConfig = { placement: "bottomRight", duration: 2 };

const Wrapper = styled(Flex)`
  padding: 10px;
`;

const Admin = ({ addToUndo = () => {} }) => {
  const [page, setPage] = useState(1);

  const { isLoading, error, data, refetch } = useQuery(
    ["tokens", page],
    getTokens(page),
    { keepPreviousData: true }
  );
  const mutation = useMutation(
    (newToken) => {
      const { _id, ...mutation } = newToken;
      return updateToken({ _id, mutation });
    },
    {
      onSuccess: () => refetch(),
    }
  );

  const {
    isLoading: isLoadingDocuments,
    error: errorOfDocuments,
    data: documentOptions,
  } = useQuery(["documents"], getDocuments);

  const update = (key, _id) => (value) => {
    mutation.mutate({
      _id,
      [key]: value,
    });
    let message;
    switch (key) {
      case "isRejected":
        message = `Token has been ${value ? "rejected" : "activated"}`;
        break;
      case "expiresAt":
        message = `Expiration date has been updated`;
        break;
      case "documents":
        message = `Documents have been updated`;
        break;
      default:
        message = `Token has been updated`;
        break;
    }
    notification.success({
      ...notificationConfig,
      message,
    });
  };

  const reject = (_id) => (isRejected) => {
    update("isRejected", _id)(!isRejected);
  };

  const remove = (_id) => () => {
    addToUndo(_.find(data, { _id }));
    deleteToken(_id);
    refetch();
  };

  const copyToClipboard = (token) => () => {
    const url = `${window?.location?.origin}/${token}`;
    navigator.clipboard.writeText(url);
    notification.success({
      ...notificationConfig,
      message: "URL copied to clipboard.",
    });
  };

  if (error) {
    return <Flex>An error has occurred: {error?.message}</Flex>;
  }

  return (
    <Wrapper column>
      <Table
        data={data}
        isLoading={isLoading}
        setPage={setPage}
        update={update}
        documentOptions={documentOptions}
        isLoadingDocuments={isLoadingDocuments}
        errorOfDocuments={errorOfDocuments}
        copyToClipboard={copyToClipboard}
        reject={reject}
        remove={remove}
      />
      <AddToken refetch={refetch} documentOptions={documentOptions} />
    </Wrapper>
  );
};
export default Admin;
