import { createContext, useState } from "react";

export const StoriesContext = createContext();

export const StoriesContextProvider = ({ children }) => {
  const [stories, setStories] = useState([]);

  return (
    <StoriesContext.Provider value={{ setStories, stories }}>
      {children}
    </StoriesContext.Provider>
  );
};
