import { useState, useMemo } from "react";

// type Object or Array

function useReactState<T extends any[] | Record<string, any>>(initialState: T) {
  const [, setValue] = useState(initialState);
  const proxy = useMemo(
    () =>
      new Proxy(initialState, {
        set(target, prop, value) {
          target[prop as keyof typeof target] = value;
          setValue((prev) => ({ ...prev, [prop]: value }));
          return true;
        },
      }),
    []
  );
  return proxy;
}

export default useReactState;
