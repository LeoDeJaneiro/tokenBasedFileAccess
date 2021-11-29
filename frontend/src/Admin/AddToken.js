import { useState } from "react";
import {
  Space,
  Button,
  notification,
  DatePicker,
  Popover,
  Input,
  Tooltip,
  Switch,
} from "antd";
import {
  SaveOutlined,
  PlusOutlined,
  CloudDownloadOutlined,
  SafetyOutlined,
} from "@ant-design/icons";
import moment from "moment";
import styled from "styled-components";

import { postToken } from "../Basic/api";
import Documents from "./Documents";

export const Safe = styled(SafetyOutlined)`
  color: green;
`;

const defaultExpiration = moment().add(14, "days");
const dateFormat = "dddd, MM/DD/YY, h:mm a";
const notificationConfig = { placement: "bottomRight", duration: 2 };

const AddToken = ({ refetch, documentOptions }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [title, setTitle] = useState(null);
  const [expiresAt, setExpiresAt] = useState(defaultExpiration);
  const [documents, setDocuments] = useState([]);
  const [isDownloadable, setIsDownloadable] = useState(undefined);

  const setTitleValue = (event) => setTitle(event.target.value);

  const add = async () => {
    if (title && expiresAt) {
      const token = await postToken({
        title,
        expiresAt,
        documents,
        isDownloadable,
      });
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
        setTitle(null);
        setIsVisible(false);
        setExpiresAt(defaultExpiration);
        setDocuments([]);
      }

      setIsDownloadable(undefined);
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
            placeholder="PDF-Document Access"
          />

          <Tooltip
            title={
              isDownloadable
                ? "Download Access"
                : "Embedded and not downloadbale"
            }
          >
            <Switch
              checkedChildren={<CloudDownloadOutlined />}
              unCheckedChildren={<Safe />}
              checked={isDownloadable}
              onChange={setIsDownloadable}
            />
          </Tooltip>
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
      <Button icon={<PlusOutlined />}>Add Access-Link</Button>
    </Popover>
  );
};

export default AddToken;
