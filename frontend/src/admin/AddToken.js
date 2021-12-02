import { useState } from "react";
import {
  Space,
  Button,
  DatePicker,
  Popover,
  Input,
  Tooltip,
  Switch,
} from "antd";
import {
  SaveOutlined,
  CloudDownloadOutlined,
  SafetyOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import moment from "moment";
import styled from "styled-components";

import Documents from "./Documents";
import Flex from "../Basic/Flex";

export const Safe = styled(SafetyOutlined)`
  color: green;
`;

const defaultExpiration = moment().add(14, "days");
const dateFormat = "dddd, MM/DD/YY, h:mm a";

const AddToken = ({ createMutation, documentOptions, toggleIsAddingToken }) => {
  const [title, setTitle] = useState(null);
  const [expiresAt, setExpiresAt] = useState(defaultExpiration);
  const [documents, setDocuments] = useState([]);
  const [isDownloadable, setIsDownloadable] = useState(undefined);

  const setTitleValue = (event) => setTitle(event.target.value);

  const add = async () => {
    createMutation.mutate({
      title,
      expiresAt,
      documents,
      isDownloadable,
    });
  };

  return (
    <Popover
      destroyTooltipOnHide
      visible={true}
      content={
        <Flex column>
          <Flex justify="end">
            <Button
              type="text"
              shape="circle"
              icon={<CloseCircleOutlined />}
              onClick={toggleIsAddingToken}
            />
          </Flex>
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
        </Flex>
      }
    />
  );
};

export default AddToken;
