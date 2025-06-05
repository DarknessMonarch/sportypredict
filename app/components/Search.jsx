"use client";

import Loader from "@/app/components/Loader";
import styles from "@/app/style/filter.module.css";
import { useEffect, useState, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";

import { IoIosSearch  as SearchIcon} from "react-icons/io";

export default function SearchComponent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const performSearch = useCallback(
    (searchValue) => {
      const params = new URLSearchParams(searchParams);
      if (searchValue) {
        params.set("q", searchValue);
      } else {
        params.delete("q");
      }
      setIsSearching(false);
      router.replace(`?${params.toString()}`);
    },
    [searchParams, router]
  );

  useEffect(() => {
    if (search.trim() !== "") {
      setIsSearching(true);
      performSearch(search);
    } else {
      setIsSearching(false);
      performSearch("");
    }
  }, [search, performSearch]);

  const handleInputChange = (event) => {
    setSearch(event.target.value);
  };

  return (
    <div className={styles.searchContainer}>
      <SearchIcon className={styles.searchIcon} height={24} alt="Search icon" />
      <input
        type="text"
        value={search}
        onChange={handleInputChange}
        placeholder="Search for game..."
        className={styles.searchInput}
      />
      <div
        className={`${styles.loadingSearch} ${
          isSearching ? styles.showLoading : ""
        }`}
      >
        <Loader />
      </div>
    </div>
  );
}
