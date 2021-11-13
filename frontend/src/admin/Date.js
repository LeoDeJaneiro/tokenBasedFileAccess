import { useState, useMemo } from "react";
import { Tooltip, Button, DatePicker } from "antd";
import { EditOutlined, SaveOutlined } from "@ant-design/icons";
import moment from "moment";
import styled from "styled-components";

import Flex from "../Basic/Flex";

const dateFormat = "dddd, DD/MM/YY, h:mm a";

const Wrapper = styled(Flex)`
  line-height: 2;
  width: 240px;
`;

const Expiration = styled.span`
  color: red;
`;

const now = moment();

const Date = ({ update, expiresAt }) => {
  const [isEditingDate, setIsEditingDate] = useState(false);
  const [newDate, setNewDate] = useState(expiresAt);
  const date = useMemo(() => moment(newDate), [newDate]);

  const toggleDateEdit = () =>
    setIsEditingDate((prevIsEditingDate) => !prevIsEditingDate);

  const saveUpdate = () => {
    update(newDate);
    toggleDateEdit();
  };

  return (
    <Wrapper space>
      {isEditingDate ? (
        <DatePicker
          showTime
          onChange={setNewDate}
          value={date}
          format={dateFormat}
          allowClear={false}
        />
      ) : date.isBefore(now) ? (
        <Tooltip title="Expired!">
          <Expiration onClick={toggleDateEdit}>
            {date.format(dateFormat)}
          </Expiration>
        </Tooltip>
      ) : (
        <span onClick={toggleDateEdit}>{date.format(dateFormat)}</span>
      )}
      {isEditingDate ? (
        <Button
          type="link"
          shape="circle"
          icon={<SaveOutlined />}
          onClick={saveUpdate}
        />
      ) : (
        <Tooltip title="Edit expiration date">
          <Button
            type="link"
            shape="circle"
            icon={<EditOutlined />}
            onClick={toggleDateEdit}
          />
        </Tooltip>
      )}
    </Wrapper>
  );
};

export default Date;
