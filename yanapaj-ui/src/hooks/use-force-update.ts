import { useState } from "react";

export const useForceUpdate = () => {
  const [, setTick] = useState(0);
  return () => setTick((tick) => tick + 1);
};
