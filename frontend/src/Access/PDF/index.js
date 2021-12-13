import { useMemo, useEffect } from "react";

import Flex from "../../Basic/Flex";
import Pdf from "./Pdf";
import useWindow from "./useWindow";

const minDesktopWidth = 1335;

const PDF = ({ files, token }) => {
  const { width } = useWindow();

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
    return <Pdf token={token} id={filesByResolution.mobile.id} />;
  }

  if (!filesByResolution.mobile) {
    return <Pdf token={token} id={filesByResolution.desktop.id} />;
  }

  return filesByResolution && width >= minDesktopWidth ? (
    <Pdf
      token={token}
      id={filesByResolution.desktop.id}
      key={filesByResolution.desktop.id}
    />
  ) : (
    <Pdf
      token={token}
      id={filesByResolution.mobile.id}
      key={filesByResolution.mobile.id}
    />
  );
};

const RestrictedPDF = ({ files, token }) => {
  useEffect(() => {
    const preventContext = (e) => {
      e.preventDefault();
    };
    document.addEventListener("contextmenu", preventContext);
    return () => document.removeEventListener("contextmenu", preventContext);
  }, []);

  return (
    <Flex className="sc-qebnflwesdvlns">
      <PDF files={files} token={token} />
    </Flex>
  );
};

export default RestrictedPDF;
