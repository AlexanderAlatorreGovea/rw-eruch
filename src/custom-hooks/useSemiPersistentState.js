import React from "react";

//custom hooks conventions
//start the custom hook with use
//return the values as an array

const useSemiPersistentState = () => {
  const [searchTerm, setSearchTerm] = useState(
    localStorage.getItem("search") || "React"
  );

  useEffect(() => {
    localStorage.setItem("search", searchTerm);
  }, [searchTerm]);
};

export default useSemiPersistentState;
