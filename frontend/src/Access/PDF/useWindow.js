import { useEffect, useState } from "react";

const useWindow = () => {
  const [width, setWidth] = useState(window?.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return { width };
};
export default useWindow;
