import { useEffect, useState } from "react";

export const useDebounce = (value: any, ms = 500) => {
  const [debounceValue, setDebounceValue] = useState("");
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebounceValue(value);
    }, ms);
    return () => clearTimeout(timeoutId);
  }, [value]);
  return debounceValue;
};
