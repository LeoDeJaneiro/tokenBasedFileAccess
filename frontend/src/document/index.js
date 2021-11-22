import { useParams } from "react-router-dom";
import { useQuery } from "react-query";
import { Spin } from "antd";
import Flex from "../Basic/Flex";

const Document = () => {
  let { token } = useParams();
  const { isLoading, error, data } = useQuery("doc", () =>
    fetch(
      `${
        process.env.BACKEND_HOST || "http://localhost:36912"
      }/api/v1/document/${token}`
    ).then((res) => res.json())
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

  return <div>doc</div>;
};
export default Document;
