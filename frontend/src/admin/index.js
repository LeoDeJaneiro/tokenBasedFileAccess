import { useState, useMemo } from "react";
import {
  Table,
  Space,
  Button,
  notification,
  Popconfirm,
  Tooltip,
  Switch,
} from "antd";
import {
  CloseCircleOutlined,
  CopyOutlined,
  DisconnectOutlined,
  LinkOutlined,
} from "@ant-design/icons";
import moment from "moment";
import { useQuery, useMutation } from "react-query";
import _ from "lodash";
import styled from "styled-components";

import Flex from "../Basic/Flex";
import Date from "./Date";
import AddToken from "./AddToken";
import Documents from "./Documents";
import {
  getDocuments,
  getTokens,
  updateToken,
  deleteToken,
} from "../Basic/api";

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
      console.log("newToken: ", newToken);
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

  const dataWithKey = useMemo(
    () => data?.map((entity) => ({ ...entity, key: entity._id })),
    [data]
  );

  const update = (key, _id) => (value) => {
    console.log("value: ", value);
    mutation.mutate({
      _id,
      [key]: value,
    });
    let message;
    switch (key) {
      case "isRejected":
        message = `Token has been ${value ? "activated" : "rejected"}`;
        break;
      default:
        message = `Expiration date has been updated`;
        break;
    }
    notification.success({
      ...notificationConfig,
      message,
    });
  };

  const reject = (_id) => (isRejected) => {
    update("isRejected", _id)(isRejected);
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
        loading={isLoading}
        pagination={{
          total: data?.totalCount,
          current: page,
          onChange: setPage,
        }}
        columns={[
          {
            title: "User",
            dataIndex: "user",
            key: "user",
            render: (text) => <>{text}</>,
            onFilter: (value, record) => record.name.indexOf(value) === 0,
          },
          {
            title: "Expiration Date",
            dataIndex: "expiresAt",
            key: "expiresAt",
            render: (expiresAt, { _id }) => (
              <Date update={update("expiresAt", _id)} expiresAt={expiresAt} />
            ),
          },
          {
            title: "Updated at",
            dataIndex: "updatedAt",
            key: "updatedAt",
            render: (updatedAt) => (
              <>{moment(updatedAt).format("DD/MM/YY h:mm a")}</>
            ),
          },
          {
            title: "Documents",
            dataIndex: "documents",
            key: "documents",
            render: (documents, { _id }) => (
              <Documents
                isLoadingDocuments={isLoadingDocuments}
                errorOfDocuments={errorOfDocuments}
                update={update("documents", _id)}
                documents={documents}
                documentOptions={documentOptions}
              />
            ),
          },
          {
            title: "Usage",
            dataIndex: "usageCount",
            key: "usageCount",
            render: (count) => <>{count}</>,
          },
          {
            title: "Actions",
            key: "action",
            dataIndex: "isRejected",
            render: (isRejected, { _id }) => (
              <Space size="middle">
                <Tooltip title="Copy token-URL">
                  <Button
                    type="link"
                    shape="circle"
                    icon={<CopyOutlined />}
                    onClick={copyToClipboard(_id)}
                  />
                </Tooltip>
                <Tooltip title={isRejected ? "Enable token" : "Reject token"}>
                  <Switch
                    checkedChildren={<LinkOutlined />}
                    unCheckedChildren={<DisconnectOutlined />}
                    checked={isRejected}
                    onChange={reject(_id)}
                  />
                </Tooltip>
                <Popconfirm
                  title="Delete this token?"
                  onConfirm={remove(_id)}
                  okText="Yes"
                  cancelText="No"
                >
                  <Tooltip title="Delete token">
                    <Button
                      type="text"
                      danger
                      shape="circle"
                      icon={<CloseCircleOutlined />}
                    />
                  </Tooltip>
                </Popconfirm>
              </Space>
            ),
          },
        ]}
        dataSource={dataWithKey}
      />
      <AddToken refetch={refetch} />
    </Wrapper>
  );
};
export default Admin;
