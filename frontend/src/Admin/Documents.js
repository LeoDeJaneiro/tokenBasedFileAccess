import { useMemo } from "react";
import { Tag } from "antd";
import {
  FilePdfOutlined,
  FileOutlined,
  FileExclamationOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import { Select } from "antd";
import { CloudOutlined } from "@ant-design/icons";
import styled from "styled-components";
import _ from "lodash";

import Flex from "../Basic/Flex";

const Wrapper = styled(Flex)`
  width: 370px;
`;
const DocumentAssign = styled(Select)`
  width: 350px;
`;
const Warning = styled.span`
  color: red;
`;

export const Document = ({ mimeType, name }) => {
  switch (mimeType) {
    case "application/pdf":
      return <Tag icon={<FilePdfOutlined />}>{name}</Tag>;
    case "missingFile":
      return (
        <Tag icon={<FileExclamationOutlined />}>
          <Warning>missing file</Warning>
        </Tag>
      );
    default:
      return <Tag icon={<FileOutlined />}>{name}</Tag>;
  }
};

const Documents = ({
  isLoading,
  error,
  update,
  documents,
  documentOptions,
}) => {
  const extendedDocumentOptions = useMemo(() => {
    if (documents && documentOptions) {
      const missingFiles = documents.filter(
        (selectedId) => !documentOptions.find(({ id }) => selectedId === id)
      );
      if (missingFiles.length > 0) {
        return [
          ...documentOptions,
          ...missingFiles.map((fileId) => ({
            id: fileId,
            mimeType: "missingFile",
          })),
        ];
      } else {
        return documentOptions;
      }
    } else {
      return documentOptions;
    }
  }, [documentOptions, documents]);

  const newDocuments = useMemo(() => {
    if (extendedDocumentOptions) {
      return documents?.map((id) => _.find(extendedDocumentOptions, { id }));
    } else {
      return [];
    }
  }, [documents, extendedDocumentOptions]);

  return (
    <Wrapper start>
      <DocumentAssign
        value={newDocuments?.map((file) => file?.id)}
        mode="multiple"
        onChange={update}
        size="large"
        suffixIcon={isLoading ? <LoadingOutlined /> : <CloudOutlined />}
        loading={isLoading}
        disabled={error}
        placeholder={error ? "Error loading drive" : ""}
      >
        {extendedDocumentOptions?.map(({ id, name, mimeType }) => (
          <Select.Option key={id} value={id}>
            <Document name={name} mimeType={mimeType} />
          </Select.Option>
        ))}
      </DocumentAssign>
    </Wrapper>
  );
};

export default Documents;
