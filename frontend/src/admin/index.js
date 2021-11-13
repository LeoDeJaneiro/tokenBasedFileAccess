import { useState, useMemo } from "react";
import {
  Table,
  Space,
  Button,
  notification,
  Select,
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
import { getTokens, updateToken, deleteToken } from "../api";

const host = process.env.REACT_APP_HOST || "http://localhost:3000";
const notificationConfig = { placement: "bottomRight", duration: 2 };

const FileAssign = styled(Select)`
  width: 240px;
`;
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

  const dataWithKey = useMemo(
    () => data?.map((entity) => ({ ...entity, key: entity._id })),
    [data]
  );

  const update = (key, _id) => (value) => {
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
    const url = `${host}/${token}`;
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
            title: "Access",
            dataIndex: "files",
            key: "files",
            render: (createdAt) => (
              <FileAssign mode="tags" onChange={() => {}}>
                <Select.Option>test</Select.Option>
              </FileAssign>
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
                <Tooltip title="Reject token">
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
