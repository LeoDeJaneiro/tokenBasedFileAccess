import { useMemo } from "react";
import { Table, Space, Button, Popconfirm, Tooltip, Switch } from "antd";
import {
  DeleteOutlined,
  CopyOutlined,
  DisconnectOutlined,
  LinkOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import moment from "moment";

import Date from "./Date";
import Documents from "./Documents";

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
          title: "Title",
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
          title: "Updated at",
          dataIndex: "updatedAt",
          key: "updatedAt",
          render: (updatedAt) => (
            <>{moment(updatedAt).format("DD/MM/YY h:mm a")}</>
          ),
        },
        {
          title: (
            <>
              Documents
              <Tooltip
                trigger="click"
                title={`Select documents from your Google Drive folder "${
                  process.env.REACT_APP_GOOGLE_DRIVE_FOLDER || ""
                }" to enable token-based access. An internal ID is used for the assignment so that, as a result, future renaming of documents is possible without loosing assignment. However, it is not possible to keep a document-assignment, if a file gets replaced by another one with the same name.`}
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
              <Tooltip title={isRejected ? "Enable token" : "Reject token"}>
                <Switch
                  checkedChildren={<LinkOutlined />}
                  unCheckedChildren={<DisconnectOutlined />}
                  checked={!isRejected}
                  onChange={reject(_id)}
                />
              </Tooltip>
              <Popconfirm
                title="Delete this token?"
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
