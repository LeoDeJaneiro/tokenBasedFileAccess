import { useMemo, useState } from "react";
import { useQuery } from "react-query";
import { Spin } from "antd";
import { Document, Page, pdfjs } from "react-pdf/dist/esm/entry.webpack";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";

import Flex from "../Basic/Flex";
import { getFileAccess } from "../Basic/api";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const PDF = ({ id, token, name }) => {
  const [pages, setPages] = useState(0);
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
    setPages(numPages);
  };

  const onItemClick = ({ pageNumber: itemPageNumber }) => {
    console.log("itemPageNumber: ", itemPageNumber);
    setPages(itemPageNumber);
  };

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
      <Document
        file={{ url }}
        options={{ workerSrc: "/pdf.worker.js" }}
        onLoadSuccess={handleLoadSuccess}
        onRenderAnnotationLayerSuccess={console.log}
        onRenderAnnotationLayerError={console.error}
        onGetAnnotationsError={console.error}
        onItemClick={onItemClick}
      >
        {new Array(pages).fill().map((_, index) => (
          <div>
            <Page pageNumber={index + 1 || 1} key={index} />
          </div>
        ))}
      </Document>
    )
  );
};

export default PDF;
