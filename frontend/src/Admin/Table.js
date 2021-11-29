import { useMemo } from "react";
import { Table, Space, Button, Popconfirm, Tooltip, Switch } from "antd";
import {
  DeleteOutlined,
  CopyOutlined,
  DisconnectOutlined,
  LinkOutlined,
  InfoCircleOutlined,
  CloudDownloadOutlined,
} from "@ant-design/icons";
import moment from "moment";
import styled from "styled-components";

import Date from "./Date";
import Documents from "./Documents";
import { Safe } from "./AddToken";

const Rejected = styled(DisconnectOutlined)`
  color: red;
`;

const AdminTable = ({
  data,
  isLoading,
  page,
  setPage,
  update,
  documentOptions,
  isLoadingDocuments,
  errorOfDocuments,
  copyToClipboard,
  reject,
  remove,
}) => {
  const dataWithKey = useMemo(
    () => data?.map((entity) => ({ ...entity, key: entity._id })),
    [data]
  );

  return (
    <Table
      loading={isLoading}
      pagination={{
        total: data?.totalCount,
        current: page,
        onChange: setPage,
      }}
      columns={[
        {
          title: "Link Title",
          dataIndex: "title",
          key: "title",
          render: (text) => <>{text}</>,
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
          title: (
            <>
              Accessible PDF-Documents
              <Tooltip
                trigger="click"
                title={`Select PDFs from your Google Drive folder "${
                  process.env.REACT_APP_GOOGLE_DRIVE_FOLDER || ""
                }" to enable link-based file-access. `}
              >
                <Button
                  type="link"
                  shape="circle"
                  icon={<InfoCircleOutlined />}
                />
              </Tooltip>
            </>
          ),
          dataIndex: "documents",
          key: "documents",
          render: (documents, { _id }) => (
            <Documents
              isLoading={isLoadingDocuments}
              error={errorOfDocuments}
              update={update("documents", _id)}
              documents={documents}
              documentOptions={documentOptions}
            />
          ),
        },
        {
          title: "Access Type",
          dataIndex: "isDownloadable",
          key: "isDownloadable",
          render: (isDownloadable, { _id }) => (
            <Tooltip title={isDownloadable ? "Download" : "Embedded"}>
              <Switch
                checkedChildren={<CloudDownloadOutlined />}
                unCheckedChildren={<Safe />}
                checked={isDownloadable}
                onChange={update("isDownloadable", _id)}
              />
            </Tooltip>
          ),
        },
        {
          title: "Last Updated",
          dataIndex: "updatedAt",
          key: "updatedAt",
          render: (updatedAt) => (
            <>{moment(updatedAt).format("DD/MM/YY h:mm a")}</>
          ),
        },
        {
          title: "Link Usage",
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
              <Tooltip title="Copy Link">
                <Button
                  type="link"
                  shape="circle"
                  icon={<CopyOutlined />}
                  onClick={copyToClipboard(_id)}
                />
              </Tooltip>
              <Tooltip title={isRejected ? "Enable Link" : "Reject Link"}>
                <Switch
                  checkedChildren={<LinkOutlined />}
                  unCheckedChildren={<Rejected />}
                  checked={!isRejected}
                  onChange={reject(_id)}
                />
              </Tooltip>
              <Popconfirm
                title="Delete this Link?"
                onConfirm={remove(_id)}
                okText="Yes"
                cancelText="No"
              >
                <Button
                  type="text"
                  danger
                  shape="circle"
                  icon={<DeleteOutlined />}
                />
              </Popconfirm>
            </Space>
          ),
        },
      ]}
      dataSource={dataWithKey}
    />
  );
};
export default AdminTable;
