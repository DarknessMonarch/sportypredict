"use client";

import { toast } from "sonner";
import Image from "next/image";
import Script from "next/script";
import axios from "axios";
import CardImage from "@/public/assets/card.png";
import AirtelImage from "@/public/assets/airtel.png";
import MpesaImage from "@/public/assets/mpesa.png";
import CountriesData from "@/app/utility/Countries";
import manualImage from "@/public/assets/manual.png";
import CoinbaseImage from "@/public/assets/crypto.png";
import PaypalImage from "@/public/assets/paypal.png";
import { useState, useEffect, useCallback } from "react";
import styles from "@/app/style/paymentmethod.module.css";
import { useSearchParams, useRouter } from "next/navigation";
import { usePaymentStore } from "@/app/store/Payment";
import { MdOutlineLocalPhone as PhoneIcon } from "react-icons/md";

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

const getTokenAirtel = () => {
  const { AIRTEL_AUTH, AIRTEL_CLIENT_SECRET, AIRTEL_URL } = PAYMENT_CONFIG;
  return fetch(`${AIRTEL_URL}/auth/oauth2/token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      client_id: AIRTEL_AUTH,
      client_secret: AIRTEL_CLIENT_SECRET,
      grant_type: "client_credentials",
    }),
  });
};

const AFRICAN_COUNTRIES = CountriesData.filter((country) => [
  "KE",
  "NG",
  "CM",
  "GH",
  "ZA",
  "TZ",
  "UG",
  "ZM",
  "RW",
  "MW",
]).map((country) => country.code.toLowerCase());

export default function PaymentMethods({ params }) {
  const [paymentState, setPaymentState] = useState({
    isPaid: false,
    isCancel: false,
    status: "",
    result: null,
  });
  const [errors, setErrors] = useState({});
  const [customerId, setCustomerId] = useState("");
  const [formData, setFormData] = useState({
    phoneNumber: "",
  });
  const [paymentPlan, setPaymentPlan] = useState(null);
  const [loading, setLoading] = useState(true);

  const router = useRouter();
  const searchParams = useSearchParams();
  const { validatePayment, getPaymentPlanByCountry } = usePaymentStore();
  
  const slug = decodeURIComponent(params.slug || "");
  const currentCountry = slug?.trim() || "";
  const selectedPrice = parseFloat(searchParams.get("price")) || 0;
  const selectedPlan = searchParams.get("plan") || "";
  const selectedCurrency = searchParams.get("currency") || "";
  const selectedDuration = parseInt(searchParams.get("duration")) || 30; // duration in days

  const getCountryCode = (countryName) => {
    const country = CountriesData.find(
      (c) => c.name.toLowerCase() === countryName.toLowerCase()
    );
    return country ? country.code.toLowerCase() : null;
  };

  // Load and validate payment plan data
  useEffect(() => {
    const loadPaymentPlan = async () => {
      if (currentCountry) {
        setLoading(true);
        try {
          const result = await getPaymentPlanByCountry(currentCountry);
          if (result.success) {
            setPaymentPlan(result.data);
            
            // Validate the payment amount
            const validation = await validatePayment(currentCountry, selectedDuration, selectedPrice);
            if (validation.success && !validation.data.isValid) {
              toast.error(`Invalid payment amount. Expected: ${validation.data.expectedAmount}, Received: ${selectedPrice}`);
            }
          } else {
            toast.error(`No payment plan found for ${currentCountry}`);
          }
        } catch (error) {
          console.error("Error loading payment plan:", error);
          toast.error("Failed to load payment information");
        } finally {
          setLoading(false);
        }
      }
    };

    loadPaymentPlan();
  }, [currentCountry, selectedPrice, selectedDuration, getPaymentPlanByCountry, validatePayment]);

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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

  const [showMethods, setShowMethods] = useState({
    mpesa: false,
    coinbase: false,
    paypal: false,
    stripe: false,
    manual: false,
    airtel: false,
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      setCustomerId(localStorage.getItem("id") || null);
    }
  }, []);

  useEffect(() => {
    if (currentCountry) {
      const countryCode = getCountryCode(currentCountry);

      setShowMethods({
        mpesa:
          countryCode === "ke" || countryCode === "ug" || countryCode === "tz",
        manual: countryCode !== "other",
        airtel:
          countryCode === "ke" || countryCode === "mw" || countryCode === "zm",
        coinbase: countryCode ? true : false,
        stripe: countryCode ? true : false,
        paypal: countryCode ? true : false,
      });
    }
  }, [currentCountry]);

  const addVIPAccess = useCallback(async () => {
    const getDaysFromPlan = (planType) => {
      switch (planType?.toLowerCase()) {
        case "weekly":
          return 7;
        case "monthly":
          return 30;
        case "yearly":
          return 365;
        default:
          return selectedDuration;
      }
    };
    if (!paymentState.isPaid) {
      toast.error("Payment failed");
      return;
    }

    if (!customerId) {
      toast.error("Login or create an account to pay");
      return;
    }

    try {
      const token = JSON.parse(localStorage.getItem("token"));
      const currentDate = new Date();
      const formattedDate = `${
        currentDate.getMonth() + 1
      }-${currentDate.getDate()}-${currentDate.getFullYear()}`;
      const account = JSON.parse(localStorage.getItem("account"));

      const response = await fetch(
        `${PAYMENT_CONFIG.SERVER_HOST}/auth/update/${customerId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            paid: true,
            plan: selectedPlan,
            activationDate: formattedDate,
            days: getDaysFromPlan(selectedPlan),
          }),
        }
      );

      if (!response.ok) throw new Error("Failed to update account");

      account.status = true;
      localStorage.setItem("account", JSON.stringify(account));
      localStorage.setItem("paid", "true");

      toast.success("Payment successful!");
      window.location.href = "https://www.tips90predict.com/page/vip";
    } catch (err) {
      toast.error("An error occurred while updating your account.");
    }
  }, [paymentState.isPaid, customerId, selectedDuration, selectedPlan]);

  const handlePayManually = (countryCode, amount) => {
    router.push(`manual/?country=${countryCode}&price=${amount}&plan=${selectedPlan}&duration=${selectedDuration}`, {
      scroll: false,
    });
  };

  const handleAirtelPayment = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const { phoneNumber } = formData;

    const inputBody = {
      subscriber: {
        msisdn: phoneNumber,
      },
      transaction: {
        amount: selectedPrice.toString(),
        id: `txn_${Date.now()}`,
      },
      additional_info: [
        {
          key: "transactionId",
          value: `txn_${Date.now()}`,
        },
        {
          key: "plan",
          value: selectedPlan,
        },
        {
          key: "duration",
          value: selectedDuration.toString(),
        },
      ],
      reference: "vip subscription",
      pin: `${PAYMENT_CONFIG.AIRTEL_PIN}`,
    };

    const headers = {
      "Content-Type": "application/json",
      Accept: "*/*",
      "X-Country": getCountryCode(currentCountry).toUpperCase(),
      "X-Currency": selectedCurrency,
      Authorization: `Bearer ${PAYMENT_CONFIG.AIRTEL_AUTH}`,
    };

    try {
      const response = await axios.post(
        `${PAYMENT_CONFIG.AIRTEL_URL}`,
        inputBody,
        {
          headers,
        }
      );
      
      if (response.data.status === "success") {
        setPaymentState((prev) => ({
          ...prev,
          isPaid: true,
          status: "success",
        }));
        addVIPAccess();
      } else {
        toast.error("Airtel payment failed");
      }
    } catch (error) {
      console.error("Airtel payment error:", error);
      toast.error("Airtel payment failed");
    }
  };

  const handleStripeCheckout = () => {
    // You can customize these URLs based on your Stripe setup
    const checkoutUrl = selectedPlan === "Weekly"
      ? `https://buy.stripe.com/weekly?amount=${selectedPrice}&currency=${selectedCurrency}`
      : selectedPlan === "Monthly" 
      ? `https://buy.stripe.com/monthly?amount=${selectedPrice}&currency=${selectedCurrency}`
      : `https://buy.stripe.com/yearly?amount=${selectedPrice}&currency=${selectedCurrency}`;
    
    window.open(checkoutUrl, "_blank");
    
    // For demo purposes, we'll simulate successful payment
    // In production, you'd handle this via Stripe webhooks
    setTimeout(() => {
      setPaymentState((prev) => ({
        ...prev,
        isPaid: true,
        status: "success",
      }));
      addVIPAccess();
    }, 2000);
  };

  const handleMpesaPayment = () => {
    const email = localStorage.getItem("email");
    if (!email) {
      toast.error("Login or create an account to pay");
      return;
    }

    const PaystackPop = require("@paystack/inline-js");
    const paystack = new PaystackPop();

    paystack.newTransaction({
      key: PAYMENT_CONFIG.PAYSTACK_KEY,
      email,
      amount: Math.round(selectedPrice * 100), // Convert to kobo/cents
      currency: selectedCurrency,
      ref: `ref_${Math.floor(Math.random() * 1000000000 + 1)}`,
      metadata: {
        plan: selectedPlan,
        duration: selectedDuration,
        country: currentCountry,
      },
      callback: (response) => {
        if (response.status === "success") {
          setPaymentState((prev) => ({
            ...prev,
            isPaid: true,
            status: "success",
          }));
          addVIPAccess();
        } else {
          setPaymentState((prev) => ({
            ...prev,
            isCancel: true,
            status: "cancelled",
          }));
          toast.error("Payment failed");
        }
      },
      onClose: () => {
        setPaymentState((prev) => ({
          ...prev,
          isCancel: true,
          status: "cancelled",
        }));
        toast.error("Payment cancelled");
      },
    });
  };

  const handleCoinbasePayment = async () => {
    try {
      const response = await fetch(
        "https://api.commerce.coinbase.com/charges/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-CC-Api-Key": PAYMENT_CONFIG.COINBASE_KEY,
          },
          body: JSON.stringify({
            name: `VIP Subscription - ${selectedPlan}`,
            description: `${selectedPlan} VIP subscription for ${currentCountry}`,
            pricing_type: "fixed_price",
            local_price: {
              amount: selectedPrice.toString(),
              currency: selectedCurrency,
            },
            metadata: {
              plan: selectedPlan,
              duration: selectedDuration,
              country: currentCountry,
            },
            cancel_url: window.location.href,
            success_url: "https://www.tips90predict.com/page/vip",
          }),
        }
      );

      if (!response.ok) throw new Error("Coinbase payment failed");

      const data = await response.json();
      window.location.href = data.data.hosted_url;
    } catch (error) {
      console.error(error);
      toast.error("Coinbase payment initialization failed");
    }
  };

  useEffect(() => {
    const loadPayPalScript = async () => {
      if (!window.paypal) return;

      try {
        await window.paypal
          .Buttons({
            createOrder: (data, actions) => {
              return actions.order.create({
                purchase_units: [
                  {
                    amount: {
                      value: selectedPrice.toString(),
                      currency_code: selectedCurrency,
                    },
                    description: `${selectedPlan} VIP Subscription`,
                  },
                ],
              });
            },
            onApprove: async (data, actions) => {
              const details = await actions.order.capture();
              setPaymentState((prev) => ({
                ...prev,
                result: details,
                isPaid: true,
                status: "success",
              }));
              addVIPAccess();
            },
            onError: (err) => {
              setPaymentState((prev) => ({
                ...prev,
                isCancel: true,
                status: "error",
              }));
              toast.error("PayPal payment failed");
              console.error("PayPal error:", err);
            },
            onCancel: () => {
              setPaymentState((prev) => ({
                ...prev,
                isCancel: true,
                status: "cancelled",
              }));
              toast.error("PayPal payment cancelled");
            },
          })
          .render("#paypal-button-container");
      } catch (error) {
        console.error("Error rendering PayPal buttons:", error);
      }
    };

    if (showMethods.paypal && selectedPrice > 0) {
      loadPayPalScript();
    }
  }, [
    currentCountry,
    selectedCurrency,
    selectedPlan,
    selectedPrice,
    showMethods.paypal,
    addVIPAccess,
  ]);

  const PaymentOption = ({ image, alt, onClick, buttonText }) => (
    <div className={styles.payController}>
      <div className={styles.paymentImageWp}>
        <Image
          className={styles.paymentImage}
          src={image}
          alt={alt}
          fill
          sizes="100%"
          objectFit="contain"
          priority={true}
        />
      </div>

      <div className={styles.btnWp}>
        <button type="button" onClick={onClick} className={styles.btnPay}>
          {buttonText}
        </button>
      </div>
    </div>
  );

  const AirtelPayment = ({ image, alt, onClick, buttonText }) => (
    <div className={styles.payController}>
      <div className={styles.paymentImageWp}>
        <Image
          className={styles.paymentImage}
          src={image}
          alt={alt}
          fill
          sizes="100%"
          objectFit="contain"
          priority={true}
        />
      </div>
      <form onSubmit={handleAirtelPayment} className={styles.formContainer}>
        <div className={styles.authInputContainer}>
          <div className={styles.authInput}>
            <PhoneIcon
              className={styles.authIcon}
              alt="Phone icon"
              width={30}
              height={30}
            />
            <input
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handlePhoneNumberChange}
              placeholder="2547xxxxxxxx"
              maxLength={12}
            />
          </div>
          {errors.phoneNumber && (
            <p className={styles.errorText}>{errors.phoneNumber}</p>
          )}
        </div>

        <div className={styles.btnWp}>
          <button type="submit" className={styles.btnPay}>
            {buttonText}
          </button>
        </div>
      </form>
    </div>
  );

  if (loading) {
    return (
      <div className={styles.paymentContainer}>
        <div className={styles.paymentDivider}>
          <div className={styles.paymentContainerHeader}>
            <h1>Loading payment options...</h1>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.paymentContainer}>
      <Script
        src={`https://www.paypal.com/sdk/js?client-id=${PAYMENT_CONFIG.CLIENT_ID}&currency=${selectedCurrency}`}
        strategy="lazyOnload"
      />
      <div className={styles.paymentDivider}>
        <div className={styles.paymentContainerHeader}>
          <h1>Choose your payment method</h1>
          <p>
            {selectedPlan} Plan - {selectedCurrency} {selectedPrice.toLocaleString()} 
            {paymentPlan && ` (${paymentPlan.country})`}
          </p>
        </div>

        <div className={styles.paymentLayout}>
          {showMethods.manual && (
            <div className={styles.payController}>
              <div className={styles.paymentImageWp}>
                <Image
                  className={styles.paymentImage}
                  src={manualImage}
                  alt="manual image"
                  fill
                  sizes="100%"
                  objectFit="cover"
                  priority={true}
                />
              </div>
              <h1>Manual payment</h1>
              <p>Manual option is also available</p>
              <button
                onClick={() =>
                  handlePayManually(
                    getCountryCode(currentCountry),
                    selectedPrice
                  )
                }
                type="button"
                className={styles.btnPay}
              >
                Pay manually
              </button>
            </div>
          )}

          {showMethods.mpesa && (
            <PaymentOption
              image={MpesaImage}
              alt="mpesa logo"
              onClick={handleMpesaPayment}
              buttonText="Pay Now"
            />
          )}
          
          {showMethods.airtel && (
            <AirtelPayment
              image={AirtelImage}
              alt="airtel logo"
              onClick={handleAirtelPayment}
              buttonText="Pay Now"
            />
          )}

          {showMethods.stripe && (
            <PaymentOption
              image={CardImage}
              alt="card logo"
              onClick={handleStripeCheckout}
              buttonText="Pay with card"
            />
          )}

          {showMethods.paypal && (
            <div className={styles.payController} id="paypal-button-container">
              <Image
                src={PaypalImage}
                alt="paypal logo"
                width={200}
                height={100}
                className={styles.paymentPaypalImage}
              />
            </div>
          )}
          
          {showMethods.coinbase && (
            <PaymentOption
              image={CoinbaseImage}
              alt="coinbase logo"
              onClick={handleCoinbasePayment}
              buttonText="Pay with crypto"
            />
          )}
        </div>
      </div>
    </div>
  );
}