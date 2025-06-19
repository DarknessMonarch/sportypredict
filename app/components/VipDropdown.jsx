"use client";

import { useState, useRef, useEffect } from "react";
import styles from "@/app/style/vipDropdown.module.css";
import { MdOutlineKeyboardArrowDown as DropdownIcon} from "react-icons/md";


export default function Dropdown({
  options,
  onSelect,
  Icon,
  dropPlaceHolder,
}) {
  const [selectedOption, setSelectedOption] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const triggerRef = useRef(null);

  const handleSelect = (option) => {
    setSelectedOption(option);
    onSelect(option);
    setIsOpen(false);
  };

  return (
    <div className={styles.dropdownContainer} ref={dropdownRef}>
      <div
        className={styles.dropdownInput}
        onClick={() => setIsOpen(!isOpen)}
        ref={triggerRef}
      >
        {Icon}
        <span>{selectedOption || dropPlaceHolder}</span>
        <DropdownIcon className={styles.dropdownIcon} width={24} height={24} />
      </div>
      {isOpen && options && options.length > 0 && (
        <div className={styles.dropdownArea}>
          {options.map((option, index) => (
            <span key={index} onClick={() => handleSelect(option)}>
              {option}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
