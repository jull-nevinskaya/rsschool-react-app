import { useState, useEffect } from "react";

const useSearchTerm = (): [string, (term: string) => void] => {
  const [searchTerm, setSearchTerm] = useState<string>(
    localStorage.getItem("searchTerm") ?? ""
  );

  useEffect(() => {
    localStorage.setItem("searchTerm", searchTerm);
  }, [searchTerm]);

  return [searchTerm, setSearchTerm];
};

export default useSearchTerm;
