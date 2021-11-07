import { useState, useMemo } from "react";
import {
  Table,
  Space,
  Button,
  Spin,
  notification,
  Popconfirm,
  DatePicker,
  Popover,
  Input,
} from "antd";
import {
  CloseCircleOutlined,
  EditOutlined,
  CopyOutlined,
  DisconnectOutlined,
  LinkOutlined,
  SaveOutlined,
  PlusOutlined,
  UserOutlined,
} from "@ant-design/icons";
import moment from "moment";
import { useQuery, useMutation } from "react-query";
import _ from "lodash";
import axios from "axios";

import Flex from "../Basic/Flex";

const backend = process.env.REACT_APP_API || "http://localhost:36912";
const host = process.env.REACT_APP_HOST || "http://localhost:3000";
const dateFormat = "dddd, MM/DD/YY, h:mm a";
const notificationConfig = { placement: "bottomRight", duration: 2 };
const getTokens = (page) => () =>
  fetch(`${backend}/api/v1/token`).then((res) => res.json());

const postToken = async ({ user, expiresAt }) =>
  axios({
    method: "post",
    url: `${backend}/api/v1/token`,
    data: {
      user,
      expiresAt,
    },
  });

const AddToken = ({ refetch }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [user, setUser] = useState(null);
  console.log("user: ", user);
  const [expiresAt, setExpiresAt] = useState(null);
  console.log("expiresAt: ", expiresAt);

  const setUserValue = (event) => setUser(event.target.value);

  const add = async () => {
    if (user && expiresAt) {
      try {
        const result = await postToken({ user, expiresAt });
        setIsVisible(false);
        refetch();
        notification.success({
          ...notificationConfig,
          message: "New Token has been created",
        });
        console.log("result: ", result);
      } catch (err) {
        notification.error({
          ...notificationConfig,
          message: "New Token has been created",
        });
      }
    }
  };

  const toggleIsVisible = () => setIsVisible((prevIsVisible) => !prevIsVisible);

  return (
    <Popover
      destroyTooltipOnHide
      visible={isVisible}
      onVisibleChange={toggleIsVisible}
      content={
        <Space>
          <Input
            placeholder="User"
            onChange={setUserValue}
            prefix={<UserOutlined />}
          />
          <DatePicker
            showTime
            onChange={setExpiresAt}
            format={dateFormat}
            placeholder="Expiration Date"
          />
          <Button
            type="link"
            shape="circle"
            icon={<SaveOutlined />}
            onClick={add}
          />
        </Space>
      }
      trigger="click"
    >
      <Button icon={<PlusOutlined />}>Add token</Button>
    </Popover>
  );
};

const Date = ({ update, expiresAt }) => {
  const [isEditingDate, setIsEditingDate] = useState(false);
  const toggleDateEdit = () =>
    setIsEditingDate((prevIsEditingDate) => !prevIsEditingDate);

  return (
    <Space>
      {isEditingDate ? (
        <DatePicker
          showTime
          onChange={update}
          value={moment(expiresAt)}
          format={dateFormat}
        />
      ) : (
        <>{moment(expiresAt).format(dateFormat)}</>
      )}
      <Button
        type="link"
        shape="circle"
        icon={isEditingDate ? <SaveOutlined /> : <EditOutlined />}
        onClick={toggleDateEdit}
      />
    </Space>
  );
};

const Admin = () => {
  const [page, setPage] = useState(0);
  const { isLoading, error, data, refetch } = useQuery(
    ["tokens", page],
    getTokens(page),
    { keepPreviousData: true }
  );

  const dataWithKey = useMemo(
    () => data?.map((entity) => ({ ...entity, key: entity._id })),
    [data]
  );

  const changeTable = (value) => {
    console.log("value: ", value);
  };

  const update = (key, _id) => (value) => {};
  const remove = (_id) => () => {};
  const copyToClipboard = (token) => () => {
    const url = `${host}/${token}`;
    try {
      navigator.clipboard.writeText(url);
      notification.success({
        ...notificationConfig,
        message: "URL copied to clipboard.",
      });
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
    <>
      <Table
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
                    icon={
                      isRejected ? <LinkOutlined /> : <DisconnectOutlined />
                    }
                    {...(isRejected ? {} : { danger: true })}
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
        dataSource={dataWithKey}
      />
      <AddToken refetch={refetch} />
    </>
  );
};
export default Admin;
