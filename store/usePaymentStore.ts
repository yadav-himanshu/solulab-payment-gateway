import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Transaction, PaymentStatus, PaymentPayload, CardType } from '@/types';
import { getFriendlyErrorMessage, PaymentErrorType } from '@/utils/error-handler';

interface PaymentState {
  status: PaymentStatus;
  history: Transaction[];
  currentTransactionId: string | null;
  error: string | null;
  draftPayment: PaymentPayload;
  cardType: CardType;
  retryCount: number;
  
  // Actions
  setDraftPayment: (data: Partial<PaymentPayload>) => void;
  setCardType: (type: CardType) => void;
  setStatus: (status: PaymentStatus) => void;
  setCurrentTransactionId: (id: string | null) => void;
  setError: (error: string | null) => void;
  addTransaction: (transaction: Transaction) => void;
  updateTransaction: (id: string, updates: Partial<Transaction>) => void;
  processPayment: (payload: PaymentPayload, isRetry?: boolean) => Promise<void>;
  retryPayment: () => Promise<void>;
  clearHistory: () => void;
  resetPayment: () => void;
}

export const usePaymentStore = create<PaymentState>()(
  persist(
    (set, get) => ({
      status: 'IDLE',
      history: [],
      currentTransactionId: null,
      error: null,
      draftPayment: {
        cardholderName: '',
        cardNumber: '',
        expiry: '',
        cvv: '',
        amount: 100,
        currency: 'INR',
      },
      cardType: 'unknown',
      retryCount: 0,

      setDraftPayment: (data) => 
        set((state) => ({ draftPayment: { ...state.draftPayment, ...data } })),
      setCardType: (cardType) => set({ cardType }),
      setStatus: (status) => set({ status }),
      setCurrentTransactionId: (id) => set({ currentTransactionId: id }),
      setError: (error) => set({ error }),
      addTransaction: (transaction) => 
        set((state) => ({ history: [transaction, ...state.history] })),
      updateTransaction: (id, updates) =>
        set((state) => ({
          history: state.history.map((t) => 
            t.id === id ? { ...t, ...updates } : t
          ),
        })),
      
      processPayment: async (payload, isRetry = false) => {
        const { currentTransactionId, retryCount, addTransaction, updateTransaction } = get();
        
        const transactionId = isRetry && currentTransactionId 
          ? currentTransactionId 
          : crypto.randomUUID();

        if (!isRetry) {
          addTransaction({
            ...payload,
            id: transactionId,
            status: 'PROCESSING',
            timestamp: Date.now(),
            attempts: 1,
          });
        } else {
          updateTransaction(transactionId, { 
            status: 'PROCESSING', 
            attempts: retryCount + 1 
          });
        }

        set({ 
          status: 'PROCESSING', 
          error: null, 
          currentTransactionId: transactionId,
          retryCount: isRetry ? retryCount + 1 : 1 
        });
        
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 6000);

        try {
          const fetchPromise = fetch('/api/pay', {
            method: 'POST',
            headers: { 
              'Content-Type': 'application/json',
              'X-Idempotency-Key': transactionId
            },
            body: JSON.stringify({ ...payload, transactionId }),
            signal: controller.signal,
          });

          const delayPromise = new Promise(resolve => setTimeout(resolve, 2000));

          const [response] = await Promise.all([fetchPromise, delayPromise]);

          clearTimeout(timeoutId);
          const data = await response.json();

          if (data.success) {
            set({ status: 'SUCCESS', currentTransactionId: data.transactionId });
            updateTransaction(transactionId, { status: 'SUCCESS' });
          } else {
            const errorMsg = getFriendlyErrorMessage(data.error || PaymentErrorType.UNKNOWN);
            set({ status: 'FAILED', error: errorMsg });
            updateTransaction(transactionId, { status: 'FAILED', error: errorMsg });
          }
        } catch (err: unknown) {
          clearTimeout(timeoutId);
          const isAbortError = err instanceof Error && err.name === 'AbortError';

          if (isAbortError) {
            const errorMsg = getFriendlyErrorMessage(PaymentErrorType.TIMEOUT);
            set({ status: 'TIMEOUT', error: errorMsg });
            updateTransaction(transactionId, { status: 'TIMEOUT', error: errorMsg });
          } else {
            const errorMsg = getFriendlyErrorMessage(PaymentErrorType.NETWORK);
            set({ status: 'FAILED', error: errorMsg });
            updateTransaction(transactionId, { status: 'FAILED', error: errorMsg });
          }
        }
      },

      retryPayment: async () => {
        const { draftPayment, retryCount, processPayment } = get();
        if (retryCount >= 3) return;
        
        await processPayment(draftPayment, true);
      },

      resetPayment: () => set({ 
        status: 'IDLE', 
        error: null, 
        currentTransactionId: null,
        retryCount: 0,
        draftPayment: {
          cardholderName: '',
          cardNumber: '',
          expiry: '',
          cvv: '',
          amount: 100,
          currency: 'INR',
        },
        cardType: 'unknown'
      }),
      clearHistory: () => set({ history: [] }),
    }),
    {
      name: 'payment-storage',
      partialize: (state) => ({ history: state.history }),
    }
  )
);
