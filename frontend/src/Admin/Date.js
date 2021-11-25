import { useState, useMemo } from "react";
import { Tooltip, Button, DatePicker } from "antd";
import { EditOutlined } from "@ant-design/icons";
import moment from "moment";
import styled from "styled-components";
import _ from "lodash";

import Flex from "../Basic/Flex";

const dateFormat = "dddd, DD/MM/YY, h:mm a";

const Wrapper = styled(Flex)`
  line-height: 2;
  width: 240px;
`;

const Expiration = styled.span`
  color: red;
`;

const Date = ({ update, expiresAt }) => {
  const [isEditingDate, setIsEditingDate] = useState(false);

  const toggleDateEdit = () =>
    setIsEditingDate((prevIsEditingDate) => !prevIsEditingDate);

  const dateObject = useMemo(() => {
    return moment(expiresAt);
  }, [expiresAt]);

  const saveUpdate = (date) => {
    if (!_.isEqual(moment(expiresAt), date)) {
      update(date);
    }
  };

  return (
    <Wrapper space>
      {isEditingDate ? (
        <DatePicker
          showTime
          format={dateFormat}
          allowClear={false}
          onOk={saveUpdate}
          onOpenChange={toggleDateEdit}
          open={isEditingDate}
          showNow={false}
        />
      ) : dateObject?.isBefore(moment()) ? (
        <Tooltip title="Expired!">
          <Expiration onClick={toggleDateEdit}>
            {dateObject?.format(dateFormat)}
          </Expiration>
        </Tooltip>
      ) : (
        <span onClick={toggleDateEdit}>{dateObject?.format(dateFormat)}</span>
      )}
      {!isEditingDate && (
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
