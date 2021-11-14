import { useState } from "react";
import { Space, Button, notification, DatePicker, Popover, Input } from "antd";
import { SaveOutlined, PlusOutlined, UserOutlined } from "@ant-design/icons";

import { postToken } from "../Basic/api";

const dateFormat = "dddd, MM/DD/YY, h:mm a";
const notificationConfig = { placement: "bottomRight", duration: 2 };

const AddToken = ({ refetch }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [user, setUser] = useState(null);
  const [expiresAt, setExpiresAt] = useState(null);

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

export default AddToken;
