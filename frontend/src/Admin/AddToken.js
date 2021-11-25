import { useState } from "react";
import { Space, Button, notification, DatePicker, Popover, Input } from "antd";
import { SaveOutlined, PlusOutlined } from "@ant-design/icons";
import moment from "moment";

import { postToken } from "../Basic/api";
import Documents from "./Documents";

const defaultExpiration = moment().add(14, "days");
const dateFormat = "dddd, MM/DD/YY, h:mm a";
const notificationConfig = { placement: "bottomRight", duration: 2 };

const AddToken = ({ refetch, documentOptions }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [title, setTitle] = useState(null);
  const [expiresAt, setExpiresAt] = useState(defaultExpiration);
  const [documents, setDocuments] = useState([]);

  const setTitleValue = (event) => setTitle(event.target.value);

  const add = async () => {
    if (title && expiresAt) {
      const token = await postToken({ title, expiresAt, documents });
      if (!token) {
        notification.error({
          ...notificationConfig,
          message: "Error on Token creation",
        });
      } else {
        refetch();
        notification.success({
          ...notificationConfig,
          message: `New Token >>${token.title}<< has been created`,
        });
      }
      setIsVisible(false);
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
          <Input placeholder="Title" onChange={setTitleValue} />
          <DatePicker
            showTime
            onChange={setExpiresAt}
            value={expiresAt}
            format={dateFormat}
            placeholder="Expiration Date"
          />
          <Documents
            update={setDocuments}
            documents={documents}
            documentOptions={documentOptions}
          />
          <Button
            type="link"
            shape="circle"
            icon={<SaveOutlined />}
            onClick={add}
            disabled={!expiresAt || !title}
          />
        </Space>
      }
      trigger="click"
    >
      <Button icon={<PlusOutlined />}>Add Access-token</Button>
    </Popover>
  );
};

export default AddToken;
