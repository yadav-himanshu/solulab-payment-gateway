'use client';

import { PaymentForm } from "@/components/PaymentForm";
import { CardPreview } from "@/components/CardPreview";
import { TransactionHistory } from "@/components/TransactionHistory";
import { usePaymentStore } from "@/store/usePaymentStore";

export const MainDashboard = () => {
  const { draftPayment, cardType } = usePaymentStore();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
      <PaymentForm />

      <div className="space-y-8 sticky top-8">
        <CardPreview 
          cardNumber={draftPayment.cardNumber}
          cardholderName={draftPayment.cardholderName}
          expiry={draftPayment.expiry}
          cardType={cardType}
        />
        
        <TransactionHistory />
      </div>
    </div>
  );
};
