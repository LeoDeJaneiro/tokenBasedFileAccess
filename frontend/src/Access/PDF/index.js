import { useMediaQueries } from "@react-hook/media-query";

import Flex from "../../Basic/Flex";
import Pdf from "./Pdf";

const PDF = ({ files, token }) => {
  const isDesktop = useMediaQueries({
    screen: "screen",
    width: "(min-width: 1335px)",
  });

  const handleMouseDown = (event) => {
    console.log("event: ", event);
  };

  return (
    <Flex onMouseDown={handleMouseDown}>
      {files?.map(({ id, name }) => {
        return isDesktop.matchesAll
          ? name.endsWith("desktop.pdf") && (
              <Pdf token={token} id={id} key={id} name={name} />
            )
          : !name.endsWith("desktop.pdf") && (
              <Pdf token={token} id={id} key={id} name={name} />
            );
      })}
    </Flex>
  );
};

export default PDF;
