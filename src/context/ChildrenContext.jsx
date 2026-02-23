import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "@clerk/clerk-react";

const ChildrenContext = createContext(null);

const BASE_URL = import.meta.env.VITE_API_URL;

export function ChildrenProvider({ children }) {
  const { getToken, isSignedIn } = useAuth();
  const [childrenList, setChildrenList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  async function fetchChildren() {
    try {
      setIsLoading(true);
      const token = await getToken();
      const res = await fetch(`${BASE_URL}/children`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("HTTP error " + res.status);

      const data = await res.json();
      setChildrenList(data.children);
    } catch (err) {
      console.error("Error loading children:", err);
      setChildrenList([]);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (isSignedIn) {
      fetchChildren();
    } else {
      setChildrenList([]);
    }
  }, [isSignedIn]);

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
