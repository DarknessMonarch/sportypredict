"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import LoadingLogo from "@/app/components/LoadingLogo";
import styles from "@/app/style/payment.module.css";
import { usePaymentStore } from "@/app/store/Payment";
import Nopayment from "@/public/assets/nopayment.png";
import countryData from "@/app/utility/Countries";
import { useAuthStore } from "@/app/store/Auth";
import Nothing from "@/app/components/Nothing";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import {
  RiArrowDropDownLine as DropdownIcon,
  RiSearch2Line as SearchIcon,
} from "react-icons/ri";

const SearchBar = ({ value, onChange }) => (
  <div className={styles.searchContainer}>
    <SearchIcon className={styles.searchIcon} aria-label="Search" />
    <input
      type="text"
      value={value}
      onChange={onChange}
      placeholder="Search country..."
      className={styles.searchInput}
    />
  </div>
);

const PaymentCard = ({ plan, currency, amount, type, onSelect, duration }) => {
  if (!amount || amount <= 0) return null;

  return (
    <div className={styles.payCard}>
      <h1>{type} plan</h1>
      <div className={styles.payCardInner}>
        <div className={styles.paymentInfo}>
          <span>{currency}</span>
          <h2>{amount.toLocaleString()}</h2>
          <span>/{type.toLowerCase()}</span>
        </div>
        <button
          onClick={() => onSelect(amount, type, duration)}
          className={styles.chooseButton}
        >
          Choose plan
        </button>
      </div>
    </div>
  );
};

const countryOptions = [
  { currency: "KE", label: "Kenya" },
  { currency: "NG", label: "Nigeria" },
  { currency: "CM", label: "Cameroon" },
  { currency: "GH", label: "Ghana" },
  { currency: "ZA", label: "South Africa" },
  { currency: "TZ", label: "Tanzania" },
  { currency: "UG", label: "Uganda" },
  { currency: "ZM", label: "Zambia" },
  { currency: "RW", label: "Rwanda" },
  { currency: "MW", label: "Malawi" },
  { currency: "USD", label: "Other" },
];

export default function Payment() {
  const [country, setCountry] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [paymentPlans, setPaymentPlans] = useState([]);
  const [fetchError, setFetchError] = useState(null);
  const dropdownRef = useRef(null);
  const router = useRouter();

  const { country: userCountry, isAuth } = useAuthStore();
  const { getPaymentPlanByCountry, loading } = usePaymentStore();

  const isCountryInOptions = (countryName) => {
    return countryOptions.some(
      (option) => option.label.toLowerCase() === countryName.toLowerCase()
    );
  };

  const fetchPaymentPlans = useCallback(
    async (selectedCountry) => {
      if (!selectedCountry) return;

      try {
        const countryToUse = isCountryInOptions(selectedCountry)
          ? selectedCountry
          : "Other";
        const result = await getPaymentPlanByCountry(countryToUse);

        if (result.success) {
          setPaymentPlans([result.data]);
          setFetchError(null);
          toast.success(`Payment plans loaded for ${selectedCountry}`);
        } else {
          setPaymentPlans([]);
          setFetchError(result.message);
          toast.error(result.message);
        }
      } catch (error) {
        setPaymentPlans([]);
        setFetchError("Failed to fetch payment plans");
        toast.error("Failed to fetch payment plans");
      }
    },
    [getPaymentPlanByCountry]
  );

  useEffect(() => {
    if (isAuth && userCountry) {
      setCountry(userCountry);
      fetchPaymentPlans(userCountry);
    }
  }, [isAuth, userCountry, fetchPaymentPlans]);

  const handleSelect = async (option) => {
    setCountry(option.name);
    setSearch("");
    setIsOpen(false);
    await fetchPaymentPlans(option.name);
  };

  const handleInputChange = (e) => {
    setSearch(e.target.value);
    setIsOpen(true);
  };

  const filteredCountries = countryData.filter((country) =>
    country.name.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const goToPayment = (price, plan, duration) => {
    if (paymentPlans.length === 0) return;
    const currency = paymentPlans[0].currency || "USD";
    router.push(
      `payment/${country}?plan=${plan}&price=${price}&currency=${currency}&duration=${duration}`,
      { scroll: false }
    );
  };

  const renderContent = () => {
    if (loading) {
      return <LoadingLogo />;
    }

    if (fetchError || paymentPlans.length === 0) {
      return (
        <Nothing
          Alt="No payment plans"
          NothingImage={Nopayment}
          Text={fetchError || "No payment plans available"}
        />
      );
    }

    return paymentPlans.map((data, index) => (
      <div key={`payment-section-${index}`} className={styles.paymentSection}>
        <PaymentCard
          plan={data}
          currency={data.currency}
          amount={data.weekly}
          type="Weekly"
          duration={7}
          onSelect={goToPayment}
        />
        <PaymentCard
          plan={data}
          currency={data.currency}
          amount={data.monthly}
          type="Monthly"
          duration={30}
          onSelect={goToPayment}
        />
        <PaymentCard
          plan={data}
          currency={data.currency}
          amount={data.yearly}
          type="Yearly"
          duration={365}
          onSelect={goToPayment}
        />
      </div>
    ));
  };

  const goVip = () => {
    router.push("/vip");
  };

  return (
    <>
      <div className={styles.paymentContainer}>
        <div className={styles.paymentHeader}>
          <h1>Payment method is determined by your country</h1>
          <h1>
            Your <span>VIP account</span> will be activated once your payment is
            received
          </h1>
        </div>

        <div className={styles.searchDropdownWrapper}>
          <SearchBar value={search} onChange={handleInputChange} />
          <div className={styles.dropdownContainer} ref={dropdownRef}>
            <div
              className={styles.dropdownInput}
              onClick={() => setIsOpen(!isOpen)}
            >
              <span>{country || "Select Country"}</span>
              <DropdownIcon className={styles.dropdownIcon} />
            </div>

            {(isOpen || search) && (
              <div className={styles.dropdownArea}>
                {filteredCountries.map((country) => (
                  <span
                    key={country.code}
                    className={styles.dropdownOption}
                    onClick={() => handleSelect(country)}
                  >
                    {country.name}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {renderContent()}
        
        <div className={styles.Question}>
          <div className={styles.QuestionCon}>
            <h1>Q: How guaranteed are your games?</h1>
            <p>
              <span>Answer:</span> We have a team of top-notch,
              well-researched/informed experts that score up to 96% in their
              accuracy rate. You are guaranteed to make substantial profits.
            </p>
          </div>
          <div className={styles.QuestionCon}>
            <h1>Q: What happens for failed predictions?</h1>
            <p>
              <span>Answer:</span> Keep in mind that in case of any loss, we
              will add an extra one day FREE as a replacement on your
              subscription. We will keep adding an extra day until you WIN! This
              is exclusive for VIP subscribers ONLY.
            </p>
          </div>
          <div className={styles.QuestionCon}>
            <h1>Q: How do I get these daily games sent to me?</h1>
            <p>
              <span>Answer:</span> We post games on our platform:
              <span onClick={goVip}>VIP</span>. You need to log in on the
              website using your email and password or through social accounts
              to view games.
            </p>
          </div>
          <div className={styles.QuestionCon}>
            <h1>Q: Why don&apos;t we post results?</h1>
            <p>
              <span>Answer:</span>We don&apos;t disclose results because
              fraudsters take screenshots and swindle unsuspecting victims.
            </p>
          </div>
        </div>
        
      </div>
    </>
  );
}