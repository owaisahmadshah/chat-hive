import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";

export const useClearParamsOnEscape = () => {
  const [, setSearchParams] = useSearchParams();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSearchParams({});
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [setSearchParams]);
};
