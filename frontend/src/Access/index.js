import { useCallback } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "react-query";
import { Spin, Button } from "antd";
import { CloudDownloadOutlined } from "@ant-design/icons";

import PDF from "./PDF";
import Flex from "../Basic/Flex";
import { getAccess, getFileAccess } from "../Basic/api";

const DocumentForToken = () => {
  const { token } = useParams();
  const { isLoading, error, data } = useQuery("access", getAccess(token), {
    refetchOnWindowFocus: false,
  });

  const handleDownload = useCallback(
    ({ documentId, name }) =>
      async () => {
        const fileBuffer = await getFileAccess({ documentId, token })();
        const url = window.URL.createObjectURL(fileBuffer);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", name);
        document.body.appendChild(link);
        link.click();
      },
    [token]
  );

  if (isLoading) {
    return (
      <Flex>
        <Spin size="large" />
      </Flex>
    );
  }

  if (error) {
    return <Flex>An error has occurred: {error?.message}</Flex>;
  }

  if (data?.error) {
    switch (data.error) {
      case "Internal Server Error":
        return (
          <Flex>
            <h2>{data.error}</h2>
          </Flex>
        );
      default:
        return (
          <Flex>
            <h2>Token is {data.error}.</h2>
          </Flex>
        );
    }
  }

  return data?.isDownloadable ? (
    data.files?.map(({ id, name }) => {
      return (
        <Flex column>
          <Button
            key={id}
            icon={<CloudDownloadOutlined />}
            onClick={handleDownload({
              documentId: id,
              name: name,
            })}
          >
            {name}
          </Button>
        </Flex>
      );
    })
  ) : (
    <PDF files={data?.files} token={token} />
  );
};

export default DocumentForToken;
