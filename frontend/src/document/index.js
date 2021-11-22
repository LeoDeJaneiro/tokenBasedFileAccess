import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "react-query";
import { Spin } from "antd";

import Flex from "../Basic/Flex";
import { getDocumentsForToken } from "../Basic/api";

const Document = () => {
  let { token } = useParams();
  const { isLoading, error, data } = useQuery(
    "documentsForToken",
    getDocumentsForToken(token)
  );

  useEffect(() => {
    if (data) {
      console.log("data: ", data);
      data.forEach((file) => {
        const url = window.URL.createObjectURL(new Blob([file]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "file.pdf"); //or any other extension
        document.body.appendChild(link);
        link.click();
      });
    }
  }, [data]);

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

  return <div>doc</div>;
};
export default Document;
