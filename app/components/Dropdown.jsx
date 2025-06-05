"use client";

import { useState, useRef, useEffect } from "react";
import styles from "@/app/style/dropdown.module.css";
import { MdOutlineKeyboardArrowDown as DropdownIcon} from "react-icons/md";

export default function Dropdown({
  options = [],
  onSelect,
  Icon,
  dropPlaceHolder,
}) {
  const [selectedOption, setSelectedOption] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSelect = (option) => {
    setSelectedOption(option.name);
    onSelect(option);
    setIsOpen(false);
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={styles.dropdownContainer} ref={dropdownRef}>
      <div className={styles.dropdownInput} onClick={toggleDropdown}>
        {Icon}
        <span>{selectedOption || dropPlaceHolder}</span>
        <DropdownIcon
          className={styles.dropdownIcon}
          alt="Dropdown icon"
          width={24}
          height={24}
        />
      </div>
      
      {isOpen && (
        <div className={styles.dropdownArea}>
          <div className={styles.optionsList}>
            {options.length > 0 ? (
              options.map((option) => (
                <span
                  key={option.code}
                  onClick={() => handleSelect(option)}
                  className={styles.optionItem}
                >
                  {option.name}
                </span>
              ))
            ) : (
              <span className={styles.noResults}>No options available</span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}