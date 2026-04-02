import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useAuth } from "@clerk/clerk-react";

const ChildrenContext = createContext(null);



export function ChildrenProvider({ children }) {
  const { getToken, isSignedIn } = useAuth();
  const [childrenList, setChildrenList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);


  const fetchChildren = useCallback(async () => {
    const { fetchChildrenFromApi } = await import("./fetchChildrenFromApi");
    try {
      setIsLoading(true);
      const data = await fetchChildrenFromApi(getToken);
      setChildrenList(data.children);
    } catch (err) {
      console.error("Error loading children:", err);
      setChildrenList([]);
    } finally {
      setIsLoading(false);
    }
  }, [getToken]);

  useEffect(() => {
    if (isSignedIn) {
      fetchChildren();
    } else {
      setChildrenList([]);
    }
  }, [isSignedIn, fetchChildren]);

  return (
    <ChildrenContext.Provider
      value={{
        children: childrenList,
        reloadChildren: fetchChildren,
        isLoading,
      }}
    >
      {children}
    </ChildrenContext.Provider>
  );
}

export function useChildren() {
  return useContext(ChildrenContext);
}
