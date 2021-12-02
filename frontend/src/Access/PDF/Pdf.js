import { useMemo, useState, createRef } from "react";
import { useQuery } from "react-query";
import { Spin } from "antd";
import _ from "lodash";
import { Document, Page, pdfjs } from "react-pdf/dist/esm/entry.webpack";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import styled from "styled-components";

import Flex from "../../Basic/Flex";
import { getFileAccess } from "../../Basic/api";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const ResponsivePDF = styled(Document)`
  width: 100vw;
`;

const Pdf = ({ id, token, name }) => {
  const [width, setWidth] = useState(window?.innerWidth);
  const [numPages, setNumPages] = useState(0);
  const refs = useMemo(
    () =>
      new Array(numPages)
        .fill()
        .reduce((acc, _, index) => ({ ...acc, [index + 1]: createRef() }), {}),
    [numPages]
  );

  const { isLoading, error, data } = useQuery(
    "pdf",
    getFileAccess({ documentId: id, token }),
    {
      refetchOnWindowFocus: false,
    }
  );

  const url = useMemo(() => {
    if (data) {
      const blob = new Blob([data], { type: "application/pdf" });
      return URL.createObjectURL(blob);
    }
  }, [data]);

  const handleLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  const onItemClick = ({ pageNumber }) => {
    refs[pageNumber].current.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };
  const handleResize = () => {
    setWidth(window.innerWidth);
  };

  window.addEventListener("resize", handleResize);

  if (isLoading || (!url && !error)) {
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

  return (
    url && (
      <ResponsivePDF
        file={{ url }}
        options={{ workerSrc: "/pdf.worker.js" }}
        onLoadSuccess={handleLoadSuccess}
        onItemClick={onItemClick}
      >
        {_.map(refs, (_, index) => (
          <div ref={refs[index]}>
            <Page pageNumber={parseInt(index)} key={index} width={width} />
          </div>
        ))}
      </ResponsivePDF>
    )
  );
};

export default Pdf;
