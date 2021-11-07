import { useState } from "react";
import {
  Table,
  Space,
  Button,
  Spin,
  notification,
  message,
  Popconfirm,
  DatePicker,
} from "antd";
import {
  CloseCircleOutlined,
  EditOutlined,
  CopyOutlined,
  DisconnectOutlined,
  LinkOutlined,
  CheckOutlined,
} from "@ant-design/icons";
import moment from "moment";
import { useQuery, useMutation } from "react-query";
import _ from "lodash";
import Flex from "../Basic/Flex";

const host = process.env.REACT_APP_HOST || "http://localhost:3000";
const dateFormat = "dddd, MM/DD/YY, h:mm a";

const Admin = () => {
  const [isEditingDate, setIsEditingDate] = useState({});
  const { isLoading, error, data } = useQuery("token", () =>
    fetch(
      `${
        process.env.REACT_APP_SECRET_NAME || "http://localhost:36912"
      }/api/v1/token`
    ).then((res) => res.json())
  );

  const toggleDateEdit = (_id) => () =>
    setIsEditingDate((prevIsEditingDate) => {
      const newIsEditingDate = { ...prevIsEditingDate };
      if (_.get(newIsEditingDate, _id)) {
        _.unset(newIsEditingDate, _id);
      } else {
        _.set(newIsEditingDate, _id, true);
      }
      return newIsEditingDate;
    });

  const update = (key, _id) => () => {};
  const remove = (_id) => () => {};
  const copyToClipboard = (token) => () => {
    const url = `${host}/${token}`;
    try {
      navigator.clipboard.writeText(url);
      message.info(`URL copied to clipboard.`);
    } catch (err) {}
  };

  if (isLoading)
    return (
      <Flex>
        <Spin size="large" />
      </Flex>
    );
  if (error) return <Flex>An error has occurred: {error?.message}</Flex>;
  return (
    <Table
      columns={[
        {
          title: "Name",
          dataIndex: "user",
          key: "user",
          render: (text) => <>{text}</>,
        },
        {
          title: "Expiration Date",
          dataIndex: "expiresAt",
          key: "expiresAt",
          render: (expiresAt, { _id }) => (
            <>
              {_.get(isEditingDate, _id) ? (
                <DatePicker
                  showTime
                  onChange={update("expiresAt", _id)}
                  value={moment(expiresAt)}
                  format={dateFormat}
                />
              ) : (
                <>{moment(expiresAt).format(dateFormat)}</>
              )}
              <Button
                type="link"
                shape="circle"
                icon={
                  _.get(isEditingDate, _id) ? (
                    <CheckOutlined />
                  ) : (
                    <EditOutlined />
                  )
                }
                onClick={toggleDateEdit(_id)}
              />
            </>
          ),
        },
        {
          title: "Created at",
          dataIndex: "expiresAt",
          key: "expiresAt",
          render: (expiresAt) => (
            <>{moment(expiresAt).format("MM/DD/YY h:mm a")}</>
          ),
        },
        {
          title: "Link Usage Count",
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
              <Button
                type="link"
                shape="circle"
                icon={<CopyOutlined />}
                onClick={copyToClipboard(_id)}
              />
              <Popconfirm
                placement="topLeft"
                title={isRejected ? "Enable token?" : "Reject token?"}
                onConfirm={update("isRejected", _id)}
                okText="Yes"
                cancelText="No"
              >
                <Button
                  type={isRejected ? "link" : "text"}
                  shape="circle"
                  icon={isRejected ? <LinkOutlined /> : <DisconnectOutlined />}
                  {...(!isRejected ? { danger: true } : {})}
                />
              </Popconfirm>

              <Popconfirm
                placement="topLeft"
                title="Delete token?"
                onConfirm={remove(_id)}
                okText="Yes"
                cancelText="No"
              >
                <Button
                  type="text"
                  danger
                  shape="circle"
                  icon={<CloseCircleOutlined />}
                />
              </Popconfirm>
            </Space>
          ),
        },
      ]}
      dataSource={data.map((entity) => ({ ...entity, key: entity._id }))}
    />
  );
};
export default Admin;
