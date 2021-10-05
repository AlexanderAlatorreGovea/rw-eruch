import React from "react";

//custom hooks conventions
//start the custom hook with use
//return the values as an array
//to avoid overwritting our value, we need to pass in the key and initialState

export const useSemiPersistentState = (key, initialState) => {
  const [value, setValue] = React.useState(
    localStorage.getItem(key) || initialState
  );

  React.useEffect(() => {
    localStorage.setItem(key, value);
  }, [value, key]);

  return [value, setValue];
};
