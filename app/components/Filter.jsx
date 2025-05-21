"use client";

import Image from "next/image";
import { useState } from "react";
import styles from "@/app/style/filter.module.css";
import VipResults from "@/app/components/VipResults";
import { useSearchParams, useRouter, usePathname } from "next/navigation";

export default function FilterComponent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [selectedLeague, setSelectedLeague] = useState(searchParams.get("league") || null);
  const [selectedCountry, setSelectedCountry] = useState(searchParams.get("country") || null);

  const leagueData = [
    {
      name: "UEFA Nations League",
      country: "Europe",
      image: "https://res.cloudinary.com/dttvkmjpd/image/upload/v1725776054/cgejwicwont8intkmqvf.png",
      countryImage: "https://res.cloudinary.com/dttvkmjpd/image/upload/v1725776054/cgejwicwont8intkmqvf.png"
    },
    {
      name: "Premier League",
      country: "England",
      image: "https://res.cloudinary.com/dttvkmjpd/image/upload/v1725776054/cgejwicwont8intkmqvf.png",
      countryImage: "https://res.cloudinary.com/dttvkmjpd/image/upload/v1725776054/cgejwicwont8intkmqvf.png"
    },
    {
      name: "La Liga",
      country: "Spain",
      image: "https://res.cloudinary.com/dttvkmjpd/image/upload/v1725776054/cgejwicwont8intkmqvf.png",
      countryImage: "https://res.cloudinary.com/dttvkmjpd/image/upload/v1725776054/cgejwicwont8intkmqvf.png"
    },
    {
      name: "Serie A",
      country: "Italy",
      image: "https://res.cloudinary.com/dttvkmjpd/image/upload/v1725776054/cgejwicwont8intkmqvf.png",
      countryImage: "https://res.cloudinary.com/dttvkmjpd/image/upload/v1725776054/cgejwicwont8intkmqvf.png"
    }
  ];

  const uniqueCountries = [...new Set(leagueData.map(item => item.country))];
  const uniqueLeagues = [...new Set(leagueData.map(item => item.name))];
  
  const getCountryImage = (countryName) => {
    return leagueData.find(item => item.country === countryName)?.countryImage;
  };

  const handleLeagueSelection = (leagueName) => {
    const newLeague = selectedLeague === leagueName ? null : leagueName;
    setSelectedLeague(newLeague);
    updateURLParams("league", newLeague);
  };

  const handleCountrySelection = (countryName) => {
    const newCountry = selectedCountry === countryName ? null : countryName;
    setSelectedCountry(newCountry);
    updateURLParams("country", newCountry);
  };

  const updateURLParams = (paramName, value) => {
    const params = new URLSearchParams(searchParams.toString());

    if (value) {
      params.set(paramName, value);
    } else {
      params.delete(paramName);
    }

    router.push(`${pathname}?${params.toString()}`);
  };

  const renderFilterSection = (type, title) => {
    const isLeagueSection = type === 'leagues';
    
    const allItems = isLeagueSection ? uniqueLeagues : uniqueCountries;
    
    const selectedItem = isLeagueSection ? selectedLeague : selectedCountry;
    const items = selectedItem ? [selectedItem] : allItems;
    
    return (
      <div className={styles.filterWrapperInner}>
        <div className={styles.filterHeader}>
          <h1>{title}</h1>
          {selectedItem && (
            <span
              onClick={() => {
                if (isLeagueSection) {
                  setSelectedLeague(null);
                  updateURLParams("league", null);
                } else {
                  setSelectedCountry(null);
                  updateURLParams("country", null);
                }
              }}
            >
              Clear Filter
            </span>
          )}
        </div>
        <div className={styles.leagueFilterContainer}>
          {items.length > 0 ? (
            items.map((item, index) => {
              const itemData = isLeagueSection 
                ? leagueData.find(data => data.name === item)
                : { country: item, countryImage: getCountryImage(item) };
              
              return (
                <div
                  key={index}
                  className={`${styles.leagueCard} ${
                    (isLeagueSection ? selectedLeague === item : selectedCountry === item) 
                      ? styles.selectedCard 
                      : ""
                  }`}
                  onClick={() => isLeagueSection 
                    ? handleLeagueSelection(item) 
                    : handleCountrySelection(item)
                  }
                >
                  <Image
                    className={styles.leagueImg}
                    priority={true}
                    src={isLeagueSection ? itemData.image : itemData.countryImage}
                    alt={isLeagueSection ? item : `${item} flag`}
                    height={50}
                    width={50}
                  />
                  <div className={styles.leagueCardText}>
                    <h2>{item}</h2>
                  </div>
                </div>
              );
            })
          ) : (
            <div className={styles.noResults}>
              No {isLeagueSection ? 'leagues' : 'countries'} found
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className={styles.filterContainer}>
      <VipResults />
      
      <div className={styles.filterWrapper}>
        {renderFilterSection('leagues', 'Filter Leagues')}
        {renderFilterSection('countries', 'Filter Countries')}
      </div>
    </div>
  );
}