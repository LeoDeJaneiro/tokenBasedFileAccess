import { useMemo } from "react";
import { useMediaQueries } from "@react-hook/media-query";

import Flex from "../../Basic/Flex";
import Pdf from "./Pdf";

const PDF = ({ files, token }) => {
  const isDesktop = useMediaQueries({
    screen: "screen",
    width: "(min-width: 1335px)",
  });

  const filesByResolution = useMemo(
    () =>
      files.reduce(
        (acc, file) =>
          file.name.endsWith("desktop.pdf")
            ? { ...acc, desktop: file }
            : { ...acc, mobile: file },
        {}
      ),
    [files]
  );

  if (!filesByResolution.desktop) {
    const { id, name } = filesByResolution.mobile;
    return <Pdf token={token} id={id} name={name} />;
  }

  if (!filesByResolution.mobile) {
    const { id, name } = filesByResolution.desktop;
    return <Pdf token={token} id={id} name={name} />;
  }

  return filesByResolution && isDesktop.matchesAll ? (
    <Pdf
      token={token}
      id={filesByResolution.desktop.id}
      key={filesByResolution.desktop.id}
      name={filesByResolution.desktop.name}
    />
  ) : (
    <Pdf
      token={token}
      id={filesByResolution.mobile.id}
      key={filesByResolution.mobile.id}
      name={filesByResolution.mobile.name}
    />
  );
};

const RestrictedPDF = ({ files, token }) => {
  document.addEventListener("contextmenu", (e) => {
    e.preventDefault();
  });

  return (
    <Flex className="sc-qebnflwesdvlns">
      <PDF files={files} token={token} />
    </Flex>
  );
};

export default RestrictedPDF;
