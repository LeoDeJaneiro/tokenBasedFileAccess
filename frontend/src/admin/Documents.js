import { useState, useEffect, useMemo } from "react";
import { Tag, Button } from "antd";
import { FilePdfOutlined, FileOutlined, SaveOutlined } from "@ant-design/icons";
import { Select } from "antd";
import { CloudOutlined } from "@ant-design/icons";
import styled from "styled-components";
import _ from "lodash";

import Flex from "../Basic/Flex";

const Document = ({ mimeType, name }) => {
  switch (mimeType) {
    case "application/pdf":
      return <Tag icon={<FilePdfOutlined />}>{name}</Tag>;
    default:
      return <Tag icon={<FileOutlined />}>{name}</Tag>;
  }
};

const Wrapper = styled(Flex)`
  width: 370px;
`;
const DocumentAssign = styled(Select)`
  width: 350px;
`;

const Documents = ({
  isLoadingDocuments,
  errorOfDocuments,
  update,
  documents,
  documentOptions,
}) => {
  const [newDocumentIds, setNewDocumentIds] = useState(documents);
  const newDocuments = useMemo(() => {
    if (newDocumentIds) {
      return newDocumentIds.map((id) => _.find(documentOptions, { id }));
    }
  }, [newDocumentIds, documentOptions]);

  const saveUpdate = () => {
    update(newDocumentIds);
  };

  useEffect(() => {
    if (_.isEqual(newDocuments, documents)) {
      setNewDocumentIds(null);
    }
  }, [documents, newDocuments]);

  return (
    <Wrapper start>
      <DocumentAssign
        value={newDocuments?.map((file) => file?.id)}
        mode="multiple"
        onChange={setNewDocumentIds}
        size="large"
        suffixIcon={<CloudOutlined />}
        loading={isLoadingDocuments}
        disabled={errorOfDocuments}
        placeholder={errorOfDocuments ? "Error loading drive" : ""}
      >
        {documentOptions?.map(({ id, name, mimeType }) => (
          <Select.Option key={id} value={id}>
            <Document name={name} mimeType={mimeType} />
          </Select.Option>
        ))}
      </DocumentAssign>
      {!_.isEqual(newDocumentIds, documents) && (
        <Button
          type="link"
          shape="circle"
          icon={<SaveOutlined />}
          onClick={saveUpdate}
        />
      )}
    </Wrapper>
  );
};

export default Documents;
