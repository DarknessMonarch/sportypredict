"use client";

import Image from "next/image";
import { toast } from "sonner";
import PaystackPop from "@paystack/inline-js";
import Nothing from "@/app/components/Nothing";
import LoadingLogo from "@/app/components/LoadingLogo";
import Dropdown from "@/app/components/SearchableDropdown";
import styles from "@/app/style/payment.module.css";
import { usePaymentStore } from "@/app/store/Payment";
import { useAuthStore } from "@/app/store/Auth";
import Nopayment from "@/public/assets/nopayment.png";
import CardImage from "@/public/assets/card.png";
import MpesaImage from "@/public/assets/mpesa.png";
import manualImage from "@/public/assets/manual.png";
import CoinbaseImage from "@/public/assets/crypto.png";
import PaypalImage from "@/public/assets/paypal.png";
import countryData from "@/app/utility/Countries";
import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback, useMemo } from "react";
import { RiCheckLine as CheckIcon } from "react-icons/ri";
import { MdOutlineLanguage as GlobeIcon } from "react-icons/md";

const PAYMENT_CONFIG = {
  CLIENT_ID: process.env.NEXT_PUBLIC_CLIENT_ID_PAYPAL,
  COINBASE_KEY: process.env.NEXT_PUBLIC_COINBASE_KEY,
  PAYSTACK_KEY: process.env.NEXT_PUBLIC_PAYSTACK_KEY,
  SERVER_HOST: process.env.NEXT_PUBLIC_SERVER_HOST,
  STRIPE_KEY: process.env.NEXT_PUBLIC_STRIPE_KEY,
};

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
      method: "Bitcoin / PayPal",
      name: "Multiple Methods",
      phone: "",
      description: "Use Bitcoin address or PayPal (murithicollo24@gmail.com)",
    },
    zm: {
      currency: "ZMW",
      method: "Manual Transfer",
      name: "John",
      phone: "(+254) 783 719 791",
      description: "Contact for manual payment instructions",
    },
    mw: {
      currency: "MWK",
      method: "Manual Transfer",
      name: "John",
      phone: "(+254) 783 719 791",
      description: "Contact for manual payment instructions",
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

const SubscriptionPeriodCard = ({
  type,
  price,
  currency,
  duration,
  isSelected,
  onClick,
  isPromo = false,
  promoText = "",
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
          <div className={styles.subscriptionInfoInner}>
            <h3>{type}</h3>
            {isPromo && <span className={styles.promoLabel}>Recommended</span>}
          </div>
          {promoText && <span className={styles.promoText}>{promoText}</span>}
        </div>

        <div className={styles.subscriptionPrice}>
          <span className={styles.currency}>{currency}</span>
          <h2 className={styles.price}>{price.toLocaleString()}</h2>
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
        <div className={styles.paymentMethodImageWrapper}>
          <Image
            className={styles.paymentMethodImage}
            src={image}
            alt={alt}
            fill
            sizes="100%"
            quality={100}
            style={{
              objectFit: "contain",
            }}
            priority={true}
          />
        </div>
        <span className={styles.paymentMethodTitle}>{title}</span>
      </div>
      {children}
    </div>
  );
};

const ManualPaymentInfo = ({
  countryCode,
  price,
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
                  <p><strong>Name:</strong> {method.contactName}</p>
                  <p><strong>Email/Address:</strong> {method.contactInfo}</p>
                  <p><strong>Amount:</strong> {formatPrice()}</p>
                  <p>{method.description}</p>
                </div>
              </div>
            ))}
          </>
        ) : (
          <div className={styles.manualInstructions}>
            <p><strong>Name:</strong> {paymentDetails.name}</p>
            <p><strong>Phone/Account:</strong> {paymentDetails.phone}</p>
            <p><strong>Amount:</strong> {formatPrice()}</p>
            <p>{paymentDetails.description}</p>
          </div>
        )}
      </div>
  );
};

const ManualPaymentCard = ({
  countryCode,
  price,
  currency,
  isSelected,
  onClick,
}) => {
  return (
    <>
      <PaymentMethodCard
        image={manualImage}
        alt="Manual Payment"
        title="Pay Manually"
        isSelected={isSelected}
        onClick={onClick}
      />
      
      {isSelected && (
        <ManualPaymentInfo
          countryCode={countryCode}
          price={price}
          currency={currency}
        />
      )}
    </>
  );
};

export default function Payment() {
  const router = useRouter();
  const [country, setCountry] = useState(null);
  const [paymentPlans, setPaymentPlans] = useState([]);
  const [fetchError, setFetchError] = useState(null);

  const [selectedPlan, setSelectedPlan] = useState(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);

  const { 
    country: userCountry, 
    isAuth, 
    email, 
    userId, 
    accessToken, 
    updateUser 
  } = useAuthStore();
  
  const { getPaymentPlanByCountry, loading } = usePaymentStore();

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
        } else {
          setPaymentPlans([]);
          setFetchError(`Payment plans not available for ${selectedCountry}`);
        }
      } catch (error) {
        setPaymentPlans([]);
        setFetchError(`Payment plans not available for ${selectedCountry}`);
      }
    },
    [getPaymentPlanByCountry, countryOptions]
  );

  useEffect(() => {
    // Handle payment success returns from external providers
    const urlParams = new URLSearchParams(window.location.search);
    const paymentStatus = urlParams.get('payment');
    const paymentMethod = urlParams.get('method');
    
    if (paymentStatus === 'success') {
      if (paymentMethod === 'coinbase') {
        const pendingPayment = sessionStorage.getItem('pendingPayment');
        if (pendingPayment) {
          const paymentData = JSON.parse(pendingPayment);
          toast.success("Cryptocurrency payment successful! Processing your VIP access...");
          
          setSelectedPlan(paymentData.plan);
          
          setTimeout(() => {
            addVIPAccess(paymentData.chargeId);
          }, 1000);
          
          sessionStorage.removeItem('pendingPayment');
          
          window.history.replaceState({}, document.title, window.location.pathname);
        }
      }
    }
  }, []);

  useEffect(() => {
    if (isAuth && userCountry) {
      setCountry(userCountry);
      fetchPaymentPlans(userCountry);
    }
  }, [isAuth, userCountry, fetchPaymentPlans]);

  const handleCountrySelect = async (selectedCountry) => {
    setCountry(selectedCountry.name);
    setSelectedPlan(null);
    setSelectedPaymentMethod(null);
    await fetchPaymentPlans(selectedCountry.name);
  };

  const getCountryCode = (countryName) => {
    if (!countryName) return null;
    const country = countryData.find(
      (c) => c.name.toLowerCase() === countryName.toLowerCase()
    );
    return country ? country.code.toLowerCase() : null;
  };

  const countryCode = getCountryCode(country);

  const getCountryMapping = (countryName) => {
    if (!countryName) return null;

    const mappings = {
      kenya: "kenya",
      nigeria: "nigeria",
      cameroon: "cameroon",
      ghana: "ghana",
      "south africa": "southA",
      tanzania: "tanzania",
      uganda: "uganda",
      zambia: "zambia",
      rwanda: "rwanda",
      malawi: "malawi",
    };

    return mappings[countryName.toLowerCase()] || "others";
  };

  const getAvailablePaymentMethods = (countryName) => {
    if (!countryName) return [];

    const selectedCountry = getCountryMapping(countryName);
    const methods = [];

    if (
      [
        "kenya",
        "others",
        "nigeria",
        "cameroon",
        "ghana",
        "southA",
        "tanzania",
        "uganda",
        "zambia",
        "rwanda",
        "malawi",
      ].includes(selectedCountry)
    ) {
      methods.push({
        id: "stripe",
        title: "Pay with card",
        image: CardImage,
        alt: "Stripe Card",
      });
    }

    if (
      [
        "others",
        "kenya",
        "nigeria",
        "cameroon",
        "ghana",
        "southA",
        "tanzania",
        "uganda",
        "zambia",
        "rwanda",
        "malawi",
      ].includes(selectedCountry)
    ) {
      methods.push({
        id: "paypal",
        title: "PayPal",
        image: PaypalImage,
        alt: "PayPal",
      });
    }

    if (["kenya"].includes(selectedCountry)) {
      methods.push({
        id: "mpesa",
        title: "Pay with MPESA",
        image: MpesaImage,
        alt: "MPESA",
      });
    }

    if (
      [
        "kenya",
        "others",
        "nigeria",
        "cameroon",
        "ghana",
        "southA",
        "tanzania",
        "uganda",
        "zambia",
        "rwanda",
        "malawi",
      ].includes(selectedCountry)
    ) {
      methods.push({
        id: "coinbase",
        title: "Pay with crypto",
        image: CoinbaseImage,
        alt: "Cryptocurrency",
      });
    }

    return methods;
  };

  const shouldShowManualPayment = (countryName) => {
    if (!countryName) return false;
    
    const selectedCountry = getCountryMapping(countryName);
    return !["others"].includes(selectedCountry) && selectedCountry !== "";
  };

  const handlePaymentMethodSelect = (methodId) => {
    setSelectedPaymentMethod(methodId);
    
    if (methodId === "stripe") {
      handleCheckout();
    } else if (methodId === "mpesa") {
      payMpesa();
    } else if (methodId === "coinbase") {
      coinbasePay();
    } else if (methodId === "manual") {
      payManually();
    }
  };

  const handlePlanSelect = (plan, type, duration) => {
    setSelectedPlan({
      plan: plan,
      type: type,
      duration: duration,
      price: plan[type.toLowerCase()],
      currency: plan.currency,
    });
    setSelectedPaymentMethod(null);
  };

  const handleCheckout = () => {
    if (!selectedPlan) {
      toast.error("Please select a plan first");
      return;
    }

    const checkoutUrl = selectedPlan.type === "Weekly"
      ? "https://buy.stripe.com/6oE4jh3oEh1R4jCeV2"
      : "https://buy.stripe.com/7sI3fd3oE26X4jCaEN";
    
    toast.info("Redirecting to Stripe checkout...");
    
    const stripeWindow = window.open(checkoutUrl, "_blank");
    
    if (!stripeWindow) {
      toast.error("Please allow popups for this site");
      return;
    }

    toast.success("Payment initiated! Processing your VIP access...");
    // addVIPAccess(`stripe_${Date.now()}`);
  };

  const payMpesa = () => {
    if (isAuth && email) {
      try {
        const paystack = new PaystackPop();
        paystack.newTransaction({
          key: PAYMENT_CONFIG.PAYSTACK_KEY,
          email: email,
          amount: selectedPlan?.price * 100,
          currency: "KES",
          ref: `ref_${Math.floor(Math.random() * 1000000000 + 1)}`,
          callback: function(response) {
            if (response.status === "success") {
              toast.success("Payment successful! Processing your VIP access...");
              addVIPAccess(response.reference);
            } else {
              toast.error("Payment failed. Please try again.");
            }
          },
          onClose: function() {
            toast.error("Payment was cancelled");
          }
        });
      } catch (error) {
        console.error("Paystack initialization error:", error);
        toast.error("Failed to initialize payment. Please try again.");
      }
    } else {
      toast.error("Please log in to make a payment");
    }
  };

  const coinbasePay = async () => {
    const countryMapping = getCountryMapping(country);
    let amount = selectedPlan?.price;

    if (
      [
        "kenya",
        "nigeria",
        "cameroon",
        "ghana",
        "southA",
        "tanzania",
        "uganda",
        "zambia",
        "rwanda",
        "malawi",
      ].includes(countryMapping)
    ) {
      amount = selectedPlan?.type === "Weekly" ? 25 : selectedPlan?.type === "Monthly" ? 45 : selectedPlan?.price;
    }

    try {
      const response = await fetch("https://api.commerce.coinbase.com/charges/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CC-Api-Key": PAYMENT_CONFIG.COINBASE_KEY,
        },
        body: JSON.stringify({
          name: "VIP Subscription",
          description: `Subscribe for VIP ${selectedPlan?.type} plan`,
          pricing_type: "fixed_price",
          local_price: {
            amount: amount,
            currency: "USD",
          },
          cancel_url: window.location.href,
          success_url: `${window.location.origin}/vip?payment=success&method=coinbase`,
        }),
      });

      const data = await response.json();
      if (response.ok && data.data?.hosted_url) {
        toast.info("Redirecting to Coinbase Commerce...");
        
        sessionStorage.setItem('pendingPayment', JSON.stringify({
          method: 'coinbase',
          plan: selectedPlan,
          chargeId: data.data.id
        }));
        
        window.location.href = data.data.hosted_url;
      } else {
        toast.error("Failed to initialize cryptocurrency payment");
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while setting up cryptocurrency payment");
    }
  };

  const payManually = () => {
    toast.success("Please follow the manual payment instructions above");
  };

  const addVIPAccess = async (paymentReference = null) => {
    if (isAuth && userId && accessToken) {
      try {
        const currentDate = new Date();
        const formattedDate = `${
          currentDate.getMonth() + 1
        }-${currentDate.getDate()}-${currentDate.getFullYear()}`;

        const durationDays = selectedPlan?.type === "Weekly" ? 7 : selectedPlan?.type === "Monthly" ? 30 : 365;
        const expirationDate = new Date(currentDate.getTime() + durationDays * 24 * 60 * 60 * 1000);

        const requestBody = {
          plan: selectedPlan?.type,
          duration: durationDays,
          amount: selectedPlan?.price,
          currency: selectedPlan?.currency,
          activationDate: formattedDate,
        };

        if (paymentReference) {
          requestBody.paymentReference = paymentReference;
        }

        const response = await fetch(
          `${PAYMENT_CONFIG.SERVER_HOST}/auth/process-payment`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify(requestBody),
          }
        );

        const data = await response.json();

        if (response.ok && data.status === 'success') {
          updateUser({
            isVip: true,
            vipPlan: selectedPlan?.type?.toLowerCase(),
            vipPlanDisplayName: selectedPlan?.type,
            duration: durationDays,
            activation: formattedDate,
            expires: expirationDate.toISOString(),
            payment: selectedPlan?.price,
          });

          toast.success("Payment successful! VIP access activated!");
          router.push("vip");
        } else {
          toast.error(data.message || "Payment validation failed");
        }
      } catch (err) {
        console.error("Update error:", err);
        toast.error("An error occurred while processing payment. Please contact support if payment was deducted.");
      }
    } else {
      toast.error("Please log in to complete payment");
    }
  };

  useEffect(() => {
    if (selectedPaymentMethod === "paypal" && selectedPlan) {
      const countryMapping = getCountryMapping(country);
      let amount = selectedPlan.price;

      if (
        [
          "kenya",
          "nigeria",
          "cameroon",
          "ghana",
          "southA",
          "tanzania",
          "uganda",
          "zambia",
          "rwanda",
          "malawi",
        ].includes(countryMapping)
      ) {
        amount = selectedPlan.type === "Weekly" ? 25 : 45;
      }

      const loadScript = (src) =>
        new Promise((resolve, reject) => {
          const script = document.createElement("script");
          script.src = src;
          script.onload = resolve;
          script.onerror = reject;
          document.head.appendChild(script);
        });

      const initPayPal = async () => {
        try {
          await loadScript(
            `https://www.paypal.com/sdk/js?client-id=${PAYMENT_CONFIG.CLIENT_ID}&currency=USD`
          );

          if (window.paypal) {
            window.paypal
              .Buttons({
                createOrder: (data, actions) => {
                  return actions.order.create({
                    purchase_units: [
                      {
                        amount: {
                          value: amount,
                        },
                      },
                    ],
                  });
                },
                onApprove: (data, actions) => {
                  return actions.order.capture().then((details) => {
                    toast.success("PayPal payment successful! Processing your VIP access...");
                    addVIPAccess(details.id);
                  });
                },
                onError: (err) => {
                  toast.error("Payment failed");
                  console.error("PayPal error:", err);
                },
                onCancel: () => {
                  toast.error("Payment cancelled");
                },
              })
              .render("#paypal-button-container");
          }
        } catch (error) {
          console.error("Error loading PayPal SDK:", error);
          toast.error("An error occurred while loading PayPal SDK");
        }
      };

      initPayPal();
    }
  }, [selectedPaymentMethod, selectedPlan, country]);

  return (
    <div className={styles.paymentContainer}>
      <div className={styles.paymentHeader}>
        <div className={styles.paymentHeaderInner}>
          <h1>Choose your country</h1>
          <p>
            Your <span>VIP account</span> will be activated after payment
          </p>

          <div className={styles.countryDropdownWrapper}>
            <Dropdown
              options={countryData}
              onSelect={handleCountrySelect}
              Icon={<GlobeIcon className={styles.globeIcon} />}
              dropPlaceHolder={country || "Select Country"}
            />
          </div>
        </div>
      </div>

      <div className={styles.paymentPlans}>
        {loading ? (
          <LoadingLogo />
        ) : (
          <>
            {(fetchError || paymentPlans.length === 0) && (
              <Nothing
                NothingImage={Nopayment}
                Text={fetchError || "No payment plans available for this country"}
                Alt="No payment plans available"
              />
            )}

            {country && paymentPlans.length > 0 && !fetchError && (
              <div className={styles.subscriptionSection}>
                <div className={styles.subscriptionPeriods}>
                  {paymentPlans[0].yearly > 0 && (
                    <SubscriptionPeriodCard
                      type="Yearly"
                      price={paymentPlans[0].yearly}
                      currency={paymentPlans[0].currency}
                      duration={365}
                      isSelected={selectedPlan?.type === "Yearly"}
                      onClick={() =>
                        handlePlanSelect(paymentPlans[0], "Yearly", 365)
                      }
                    />
                  )}

                  {paymentPlans[0].monthly > 0 && (
                    <SubscriptionPeriodCard
                      type="Monthly"
                      price={paymentPlans[0].monthly}
                      currency={paymentPlans[0].currency}
                      duration={30}
                      isSelected={selectedPlan?.type === "Monthly"}
                      onClick={() =>
                        handlePlanSelect(paymentPlans[0], "Monthly", 30)
                      }
                      isPromo={true}
                      promoText={`Most subscribed`}
                    />
                  )}

                  {paymentPlans[0].weekly > 0 && (
                    <SubscriptionPeriodCard
                      type="Weekly"
                      price={paymentPlans[0].weekly}
                      currency={paymentPlans[0].currency}
                      duration={7}
                      isSelected={selectedPlan?.type === "Weekly"}
                      onClick={() => handlePlanSelect(paymentPlans[0], "Weekly", 7)}
                    />
                  )}
                </div>
              </div>
            )}

            {country && paymentPlans.length === 0 && !fetchError && (
              <Nothing
                NothingImage={Nopayment}
                Text="No payment plans available for this country"
                Alt="No payment plans"
              />
            )}

            {selectedPlan && (
              <div className={styles.paymentMethodSection}>
                <h2>Payment Method</h2>

                {(() => {
                  const availableMethods = getAvailablePaymentMethods(country);
                  const showManualPayment = shouldShowManualPayment(country);

                  if (availableMethods.length === 0 && !showManualPayment) {
                    return (
                      <Nothing
                        NothingImage={Nopayment}
                        Text="No payment methods available for this country"
                        Alt="No payment methods"
                      />
                    );
                  }

                  return (
                    <div className={styles.paymentMethods}>
                      {availableMethods.map((method) => (
                        <PaymentMethodCard
                          key={method.id}
                          image={method.image}
                          alt={method.alt}
                          title={method.title}
                          isSelected={selectedPaymentMethod === method.id}
                          onClick={() => handlePaymentMethodSelect(method.id)}
                        >
                          {selectedPaymentMethod === method.id &&
                            method.id === "paypal" && (
                              <div
                                id="paypal-button-container"
                                style={{ marginTop: "10px" }}
                              ></div>
                            )}
                        </PaymentMethodCard>
                      ))}

                      {showManualPayment && (
                        <ManualPaymentCard
                          countryCode={countryCode}
                          price={selectedPlan.price}
                          currency={selectedPlan.currency}
                          isSelected={selectedPaymentMethod === "manual"}
                          onClick={() => handlePaymentMethodSelect("manual")}
                        />
                      )}
                    </div>
                  );
                })()}
              </div>
            )}
          </>
        )}
      </div>

      <div className={styles.Question}>
        <div className={styles.QuestionCon}>
          <h1>How guaranteed are your games?</h1>
          <p>
            <span>Answer:</span> We have a team of top-notch,
            well-researched/informed experts that score up to 96% in their
            accuracy rate. You are guaranteed to make substantial profits.
          </p>
        </div>
        <div className={styles.QuestionCon}>
          <h1>What happens for failed predictions?</h1>
          <p>
            <span>Answer:</span> Keep in mind that in case of any loss, we will
            add an extra one day FREE as a replacement on your subscription. We
            will keep adding an extra day until you WIN! This is exclusive for
            VIP subscribers ONLY.
          </p>
        </div>
        <div className={styles.QuestionCon}>
          <h1>How do I get these daily games sent to me?</h1>
          <p>
            <span>Answer:</span> We post games on our platform:
            <span onClick={() => router.push("vip")}>VIP</span>. You need to
            log in on the website using your email and password or through
            social accounts to view games.
          </p>
        </div>
        <div className={styles.QuestionCon}>
          <h1>Why don&apos;t we post results?</h1>
          <p>
            <span>Answer:</span>We don&apos;t disclose results because
            fraudsters take screenshots and swindle unsuspecting victims.
          </p>
        </div>
      </div>

    </div>
  );
}