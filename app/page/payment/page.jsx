"use client";

import Image from "next/image";
import Script from "next/script";
import axios from "axios";
import { toast } from "sonner";

import Nothing from "@/app/components/Nothing";
import LoadingLogo from "@/app/components/LoadingLogo";
import styles from "@/app/style/payment.module.css";
import { usePaymentStore } from "@/app/store/Payment";
import { useAuthStore } from "@/app/store/Auth";
import Nopayment from "@/public/assets/nopayment.png";
import CardImage from "@/public/assets/card.png";
import AirtelImage from "@/public/assets/airtel.png";
import MpesaImage from "@/public/assets/mpesa.png";
import manualImage from "@/public/assets/manual.png";
import CoinbaseImage from "@/public/assets/crypto.png";
import PaypalImage from "@/public/assets/paypal.png";
import countryData from "@/app/utility/Countries";
import { useEffect, useState, useRef, useCallback, useMemo } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import {
  RiArrowDropDownLine as DropdownIcon,
  RiSearch2Line as SearchIcon,
  RiPhoneLine as PhoneIcon,
  RiCheckLine as CheckIcon,
} from "react-icons/ri";

// Payment Configuration
const PAYMENT_CONFIG = {
  AIRTEL_AUTH: process.env.NEXT_PUBLIC_AIRTEL_AUTH,
  AIRTEL_PIN: process.env.NEXT_PUBLIC_AIRTEL_PIN,
  AIRTEL_CLIENT_SECRET: process.env.NEXT_PUBLIC_AIRTEL_CLIENT_SECRET,
  AIRTEL_URL: process.env.NEXT_PUBLIC_AIRTEL_URL,
  CLIENT_ID: process.env.NEXT_PUBLIC_CLIENT_ID_PAYPAL,
  COINBASE_KEY: process.env.NEXT_PUBLIC_COINBASE_KEY,
  PAYSTACK_KEY: process.env.NEXT_PUBLIC_PAYSTACK_KEY,
  SERVER_HOST: process.env.NEXT_PUBLIC_SERVER_HOST,
};

// Manual Payment Data
const getManualPaymentDetails = (countryCode) => {
  const africanPayments = {
    ke: {
      currency: "KES",
      method: "MPESA",
      name: "Thwell Gichovi",
      phone: "0703 147 237",
      description: "Send payment via MPESA to Thwell Gichovi",
    },
    ng: {
      currency: "NGN",
      method: "Bank Transfer",
      name: "Daniel Joy",
      phone: "Access Bank - 0046776317",
      description: "Send payment via Access Bank to Daniel Joy",
    },
    gh: {
      currency: "GHS",
      method: "Mobile Money",
      name: "David Agyevi",
      phone: "0594577146",
      description: "Send payment via Mobile Money to David Agyevi",
    },
    cm: {
      currency: "XAF",
      method: "MTN Mobile Money",
      name: "Promise Amadi",
      phone: "(+237) 678 832 736",
      description: "Send payment via MTN Mobile Money to Promise Amadi",
    },
    ug: {
      currency: "UGX",
      method: "MTN Uganda to Mpesa Kenya",
      name: "Thwell Gichovi",
      phone: "(+254) 703 147 237",
      description: "Dial *165# or use MPESA App to send to Thwell Gichovi",
    },
    tz: {
      currency: "TZS",
      method: "MPESA",
      name: "Thwell Gichovi",
      phone: "(+254) 703 147 237",
      description: "Send payment via MPESA to Thwell Gichovi",
    },
    za: {
      currency: "ZAR",
      method: "Bitcoin / Skrill / PayPal",
      name: "Multiple Methods",
      phone: "",
      description:
        "Use Bitcoin address, Skrill (contact@sportypredict.com) or PayPal (murithicollo24@gmail.com)",
    },
    zm: {
      currency: "ZMW",
      method: "Airtel Money",
      name: "John",
      phone: "(+254) 783 719 791",
      description: "Dial *778# or use Airtel Money mobile app, select Kenya",
    },
    mw: {
      currency: "MWK",
      method: "Airtel Money",
      name: "John",
      phone: "(+254) 783 719 791",
      description:
        "Use Airtel Money app, select international transfer and choose Kenya",
    },
    rw: {
      currency: "RWF",
      method: "MTN Line to MPESA Kenya",
      name: "Thwell Gichovi",
      phone: "(+254) 703 147 237",
      description: "Dial *830# and send money to Kenya MPESA (Thwell Gichovi)",
    },
  };

  const defaultPayment = {
    currency: "USD",
    methods: [
      {
        name: "SKRILL",
        contactName: "SportyPredict",
        contactInfo: "contact@sportypredict.com",
        description: "Send payment via Skrill",
      },
      {
        name: "PAYPAL",
        contactName: "Murithi Collo",
        contactInfo: "murithicollo24@gmail.com",
        description: "Send payment via PayPal",
      },
      {
        name: "BITCOIN",
        contactName: "SportyPredict",
        contactInfo: "bc1qvzny5ffjym462y35qw7qqr6ucgtkcqcu402dl5",
        description: "Send payment to Bitcoin address",
      },
    ],
  };

  return africanPayments[countryCode] || defaultPayment;
};

// Components
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

// Subscription Period Card Component
const SubscriptionPeriodCard = ({
  type,
  price,
  currency,
  duration,
  isSelected,
  onClick,
  isPromo = false,
  promoText = "",
  originalPrice = null,
}) => {
  return (
    <div
      className={`${styles.subscriptionCard} ${
        isSelected ? styles.selectedCard : ""
      } ${isPromo ? styles.promoCard : ""}`}
      onClick={onClick}
    >
      <div className={styles.subscriptionCardContent}>
        <div className={styles.subscriptionInfo}>
          <h3 className={styles.subscriptionType}>
            {type}
            {isPromo && <span className={styles.promoLabel}>Promo</span>}
          </h3>
          {promoText && <p className={styles.promoText}>{promoText}</p>}
        </div>
        <div className={styles.subscriptionPrice}>
          <span className={styles.currency}>{currency}</span>
          <span className={styles.amount}>{price.toLocaleString()}</span>
        </div>
        {isSelected && (
          <div className={styles.checkIcon}>
            <CheckIcon />
          </div>
        )}
      </div>
    </div>
  );
};

const PaymentMethodCard = ({
  image,
  alt,
  title,
  isSelected,
  onClick,
  children,
}) => {
  return (
    <div
      className={`${styles.paymentMethodCard} ${
        isSelected ? styles.selectedPaymentCard : ""
      }`}
      onClick={onClick}
    >
      <div className={styles.paymentMethodContent}>
        <div className={styles.paymentMethodIcon}>
          <Image
            src={image}
            alt={alt}
            width={40}
            height={40}
            className={styles.paymentMethodImage}
          />
        </div>
        <span className={styles.paymentMethodTitle}>{title}</span>
        {isSelected && (
          <div className={styles.checkIcon}>
            <CheckIcon />
          </div>
        )}
      </div>
      {children}
    </div>
  );
};

// Terms Checkbox Component
const TermsCheckbox = ({ isChecked, onChange }) => (
  <div className={styles.termsContainer}>
    <label className={styles.termsLabel}>
      <input
        type="checkbox"
        checked={isChecked}
        onChange={onChange}
        className={styles.termsCheckbox}
      />
      <span className={styles.checkboxCustom}>
        {isChecked && <CheckIcon />}
      </span>
      <span className={styles.termsText}>
        I accept the{" "}
        <a href="#" className={styles.termsLink}>
          Billing Terms
        </a>
      </span>
    </label>
  </div>
);

// Manual Payment Details Component
const ManualPaymentDetails = ({
  countryCode,
  price,
  plan,
  duration,
  currency,
}) => {
  const paymentDetails = getManualPaymentDetails(countryCode);

  const formatPrice = () => {
    const numericPrice = parseFloat(price);
    if (isNaN(numericPrice)) return price;

    const displayCurrency = currency || paymentDetails?.currency || "USD";
    return `${displayCurrency} ${numericPrice.toLocaleString()}`;
  };

  return (
    <div className={styles.manualDetailsContainer}>
      <h4 className={styles.manualDetailsTitle}>Payment Instructions</h4>

      {paymentDetails.methods ? (
        <>
          {paymentDetails.methods.map((method, index) => (
            <div key={index} className={styles.manualMethodItem}>
              <h5 className={styles.manualMethodName}>{method.name}</h5>
              <div className={styles.manualInstructions}>
                <p>
                  <strong>Name:</strong> {method.contactName}
                </p>
                <p>
                  <strong>Email/Address:</strong> {method.contactInfo}
                </p>
                <p>
                  <strong>Amount:</strong> {formatPrice()}
                </p>
                <p>{method.description}</p>
              </div>
            </div>
          ))}
        </>
      ) : (
        <div className={styles.manualInstructions}>
          <p>
            <strong>Name:</strong> {paymentDetails.name}
          </p>
          <p>
            <strong>Phone/Account:</strong> {paymentDetails.phone}
          </p>
          <p>
            <strong>Amount:</strong> {formatPrice()}
          </p>
          <p>{paymentDetails.description}</p>
        </div>
      )}
    </div>
  );
};

// Phone Input Component for Airtel
const PhoneInputForm = ({ formData, errors, onChange, onSubmit }) => (
  <div className={styles.phoneInputContainer}>
    <div className={styles.phoneInputWrapper}>
      <PhoneIcon className={styles.phoneIcon} />
      <input
        type="tel"
        name="phoneNumber"
        value={formData.phoneNumber}
        onChange={onChange}
        placeholder="2547xxxxxxxx"
        maxLength={12}
        className={styles.phoneInput}
      />
    </div>
    {errors.phoneNumber && (
      <p className={styles.errorText}>{errors.phoneNumber}</p>
    )}
  </div>
);

// Main Combined Component
export default function CombinedPayment() {
  const [currentStep, setCurrentStep] = useState("search");
  const [country, setCountry] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [paymentPlans, setPaymentPlans] = useState([]);
  const [fetchError, setFetchError] = useState(null);

  // New state for the redesigned flow
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [showManualDetails, setShowManualDetails] = useState(false);
  const [formData, setFormData] = useState({ phoneNumber: "" });
  const [errors, setErrors] = useState({});

  const dropdownRef = useRef(null);

  const { country: userCountry, isAuth } = useAuthStore();
  const { getPaymentPlanByCountry, loading, validatePayment } =
    usePaymentStore();

  const countryOptions = useMemo(
    () => [
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
    ],
    []
  );

  const fetchPaymentPlans = useCallback(
    async (selectedCountry) => {
      if (!selectedCountry) return;

      const isCountryInOptions = (countryName) => {
        return countryOptions.some(
          (option) => option.label.toLowerCase() === countryName.toLowerCase()
        );
      };

      try {
        const countryToUse = isCountryInOptions(selectedCountry)
          ? selectedCountry
          : "Other";
        const result = await getPaymentPlanByCountry(countryToUse);

        if (result.success) {
          setPaymentPlans([result.data]);
          setFetchError(null);
          setCurrentStep("payment");
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
    [getPaymentPlanByCountry, countryOptions]
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

  const getCountryCode = (countryName) => {
    if (!countryName) return null;

    const country = countryData.find(
      (c) => c.name.toLowerCase() === countryName.toLowerCase()
    );
    return country ? country.code.toLowerCase() : null;
  };
  const countryCode = getCountryCode(country);

  const getAvailablePaymentMethods = (countryCode) => {
    if (!countryCode) return [];

    const methods = [];

    // Bank Card (Stripe) - available for all countries
    methods.push({
      id: "stripe",
      title: "Bank Card",
      image: CardImage,
      alt: "Bank Card",
    });

    // Wallet Pay (PayPal) - available for all countries
    methods.push({
      id: "paypal",
      title: "Wallet Pay",
      image: PaypalImage,
      alt: "PayPal",
    });

    // MPESA - for Kenya, Uganda, Tanzania
    if (["ke", "ug", "tz"].includes(countryCode)) {
      methods.push({
        id: "mpesa",
        title: "MPESA",
        image: MpesaImage,
        alt: "MPESA",
      });
    }

    // Airtel Money - for Kenya, Malawi, Zambia
    if (["ke", "mw", "zm"].includes(countryCode)) {
      methods.push({
        id: "airtel",
        title: "Airtel Money",
        image: AirtelImage,
        alt: "Airtel Money",
      });
    }

    // Crypto - for all countries
    methods.push({
      id: "coinbase",
      title: "Crypto",
      image: CoinbaseImage,
      alt: "Cryptocurrency",
    });

    // Manual Payment - for all except 'other'
    if (countryCode !== "other") {
      methods.push({
        id: "manual",
        title: "Manual Payment",
        image: manualImage,
        alt: "Manual Payment",
      });
    }

    return methods;
  };

  const formatPhoneNumber = (value) => {
    if (!value) return value;
    const phoneNumber = value.replace(/[^\d]/g, "");
    if (phoneNumber.startsWith("254")) {
      return phoneNumber.slice(0, 12);
    } else if (phoneNumber.startsWith("0")) {
      return `254${phoneNumber.slice(1)}`.slice(0, 12);
    } else if (phoneNumber.startsWith("7")) {
      return `254${phoneNumber}`.slice(0, 12);
    }
    return `254${phoneNumber}`.slice(0, 12);
  };

  const handlePhoneNumberChange = (e) => {
    const formattedPhoneNumber = formatPhoneNumber(e.target.value);
    setFormData((prev) => ({ ...prev, phoneNumber: formattedPhoneNumber }));
    setErrors((prev) => ({ ...prev, phoneNumber: "" }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = "Phone number is required";
    } else if (!/^2547\d{8}$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = "Phone number must be in the format 2547xxxxxxxx";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePaymentMethodSelect = (methodId) => {
    setSelectedPaymentMethod(methodId);
    setShowManualDetails(methodId === "manual");
  };

  const handlePlanSelect = (plan, type, duration) => {
    setSelectedPlan({
      plan: plan,
      type: type,
      duration: duration,
      price: plan[type.toLowerCase()],
      currency: plan.currency,
    });
  };

  const handleBackToSearch = () => {
    setCurrentStep("search");
    setCountry(null);
    setPaymentPlans([]);
    setFetchError(null);
    setSelectedPlan(null);
    setSelectedPaymentMethod(null);
    setTermsAccepted(false);
    setShowManualDetails(false);
  };

  const renderSearchStep = () => (
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
            <span>Answer:</span> Keep in mind that in case of any loss, we will
            add an extra one day FREE as a replacement on your subscription. We
            will keep adding an extra day until you WIN! This is exclusive for
            VIP subscribers ONLY.
          </p>
        </div>
        <div className={styles.QuestionCon}>
          <h1>Q: How do I get these daily games sent to me?</h1>
          <p>
            <span>Answer:</span> We post games on our platform:
            <span onClick={() => (window.location.href = "/vip")}>VIP</span>.
            You need to log in on the website using your email and password or
            through social accounts to view games.
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
  );

  const renderPaymentStep = () => {
    if (loading) {
      return (
        <div className={styles.paymentContainer}>
          <LoadingLogo />
        </div>
      );
    }

    if (fetchError || paymentPlans.length === 0) {
      return (
        <div className={styles.paymentContainer}>
          <div className={styles.backButton}>
            <button onClick={handleBackToSearch} className={styles.btnBack}>
              ← Back to Country Selection
            </button>
          </div>
          <Nothing
            Alt="No payment plans"
            NothingImage={Nopayment}
            Text={fetchError || "No payment plans available"}
          />
        </div>
      );
    }

    const planData = paymentPlans[0];
    const availablePaymentMethods = getAvailablePaymentMethods();

    return (
      <div className={styles.paymentContainer}>
        <div className={styles.backButton}>
          <button onClick={handleBackToSearch} className={styles.btnBack}>
            ← Back to Country Selection
          </button>
        </div>

        {/* Subscription Periods Section */}
        <div className={styles.subscriptionSection}>
          <h2 className={styles.sectionTitle}>Subscription Periods</h2>
          <div className={styles.subscriptionPeriods}>
            {/* Yearly Plan */}
            {planData.yearly > 0 && (
              <SubscriptionPeriodCard
                type="Year"
                price={planData.yearly}
                currency={planData.currency}
                duration={365}
                isSelected={selectedPlan?.type === "Yearly"}
                onClick={() => handlePlanSelect(planData, "Yearly", 365)}
              />
            )}

            {/* Monthly Plan with Promo */}
            {planData.monthly > 0 && (
              <SubscriptionPeriodCard
                type="1 Month"
                price={planData.monthly}
                currency={planData.currency}
                duration={30}
                isSelected={selectedPlan?.type === "Monthly"}
                onClick={() => handlePlanSelect(planData, "Monthly", 30)}
                isPromo={true}
                promoText={`First month for only ${planData.currency}${(
                  planData.monthly * 0.8
                ).toFixed(2)} and then ${planData.currency}${
                  planData.monthly
                } per month thereafter`}
              />
            )}

            {/* Weekly Plan */}
            {planData.weekly > 0 && (
              <SubscriptionPeriodCard
                type="1 Week"
                price={planData.weekly}
                currency={planData.currency}
                duration={7}
                isSelected={selectedPlan?.type === "Weekly"}
                onClick={() => handlePlanSelect(planData, "Weekly", 7)}
              />
            )}
          </div>
        </div>

        {/* Payment Method Section - Only show if a plan is selected */}
        {selectedPlan && (
          <div className={styles.paymentMethodSection}>
            <h2 className={styles.sectionTitle}>Payment Method</h2>
            <div className={styles.paymentMethods}>
              {availablePaymentMethods.map((method) => (
                <PaymentMethodCard
                  key={method.id}
                  image={method.image}
                  alt={method.alt}
                  title={method.title}
                  isSelected={selectedPaymentMethod === method.id}
                  onClick={() => handlePaymentMethodSelect(method.id)}
                >
                  {/* Show phone input for Airtel */}
                  {selectedPaymentMethod === method.id &&
                    method.id === "airtel" && (
                      <PhoneInputForm
                        formData={formData}
                        errors={errors}
                        onChange={handlePhoneNumberChange}
                      />
                    )}
                </PaymentMethodCard>
              ))}
            </div>

            {/* Manual Payment Details */}
            {showManualDetails && (
              <ManualPaymentDetails
                countryCode={countryCode}
                price={selectedPlan.price}
                plan={selectedPlan.type}
                duration={selectedPlan.duration}
                currency={selectedPlan.currency}
              />
            )}

            {/* Terms and Conditions */}
            <TermsCheckbox
              isChecked={termsAccepted}
              onChange={(e) => setTermsAccepted(e.target.checked)}
            />

            {/* Amount to be charged */}
            {selectedPlan && (
              <div className={styles.amountContainer}>
                <p className={styles.amountText}>
                  Amount to be charged: {selectedPlan.currency}
                  {selectedPlan.price.toLocaleString()} or the equivalent in
                  local currency
                </p>
              </div>
            )}

            {/* Payment Button */}
            {selectedPaymentMethod && selectedPlan && (
              <div className={styles.paymentButtonContainer}>
                <button
                  className={`${styles.paymentButton} ${
                    !termsAccepted ||
                    (selectedPaymentMethod === "airtel" &&
                      !formData.phoneNumber)
                      ? styles.paymentButtonDisabled
                      : ""
                  }`}
                  disabled={
                    !termsAccepted ||
                    (selectedPaymentMethod === "airtel" &&
                      !formData.phoneNumber)
                  }
                  onClick={() => {
                    // Handle payment processing based on selected method
                    if (selectedPaymentMethod === "manual") {
                      toast.success(
                        "Please follow the manual payment instructions above"
                      );
                    } else {
                      // Implement other payment methods
                      toast.info(
                        `Processing ${selectedPaymentMethod} payment...`
                      );
                    }
                  }}
                >
                  {selectedPaymentMethod === "stripe" && "Add Bank Card"}
                  {selectedPaymentMethod === "paypal" && "Continue with PayPal"}
                  {selectedPaymentMethod === "mpesa" && "Pay with MPESA"}
                  {selectedPaymentMethod === "airtel" &&
                    "Pay with Airtel Money"}
                  {selectedPaymentMethod === "coinbase" && "Pay with Crypto"}
                  {selectedPaymentMethod === "manual" &&
                    "Confirm Manual Payment"}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  // Render based on current step
  switch (currentStep) {
    case "search":
      return renderSearchStep();
    case "payment":
      return renderPaymentStep();
    default:
      return renderSearchStep();
  }
}
