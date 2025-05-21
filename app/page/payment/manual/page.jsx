"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import styles from "@/app/styles/manualPayment.module.css";

export default function ManualPayment() {
  const searchParams = useSearchParams();

  const [paymentDetails, setPaymentDetails] = useState(null);
  const countryCode = searchParams.get("country") || "";
  const price = searchParams.get("price") || "";

  useEffect(() => {
    const getPaymentDetails = () => {
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
          currency: "GHC",
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
        sa: {
          currency: "ZAR",
          method: "Bitcoin / Skrill / PayPal",
          name: "Multiple Methods",
          phone: "",
          description: "Use Bitcoin address, Skrill (contact@sportypredict.com) or PayPal (murithicollo24@gmail.com)",
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
          description: "Use Airtel Money app, select international transfer and choose Kenya",
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

    setPaymentDetails(getPaymentDetails());
  }, [countryCode]);

  if (!paymentDetails) return null;

  return (
    <div className={styles.manualContainer}>
      <h3>Manual Payment</h3>

      {paymentDetails.methods ? (
        <>
          {paymentDetails.methods.map((method, index) => (
            <div key={index} className={styles.methodItem}>
              <h4 className={styles.methodName}>{method.name}</h4>
              <ul className={styles.instructionsList}>
                <li>
                  Name: <span>{method.contactName}</span>{" "}
                </li>
                <li>
                  Email / Address: <span>{method.contactInfo}</span>{" "}
                </li>
                <li>
                  Amount to pay: <span>{price}</span>{" "}
                </li>
                <li>{method.description}</li>
              </ul>
            </div>
          ))}
        </>
      ) : (
        <ul className={styles.instructionsList}>
          <li>
            Name: <span>{paymentDetails.name}</span>
          </li>
          <li>
            Phone / Account: <span>{paymentDetails.phone}</span>{" "}
          </li>
          <li>
            Amount to pay: <span>{price}</span>{" "}
          </li>
          <li>{paymentDetails.description}</li>
        </ul>
      )}
    </div>
  );
}
