import { NextResponse } from 'next/server';

// Simulation of a database for idempotency
const processedTransactions = new Map<string, any>();

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { transactionId } = body;
    const idempotencyKey = req.headers.get('X-Idempotency-Key');

    // Idempotency Check: If we've seen this ID/Key before, return the cached result
    const key = idempotencyKey || transactionId;
    if (key && processedTransactions.has(key)) {
      return NextResponse.json(processedTransactions.get(key));
    }
    
    // Simulate network latency
    await new Promise(resolve => setTimeout(resolve, 1500));

    const random = Math.random();

    // 15% -> Delay 8 seconds (Timeout Simulation)
    if (random < 0.15) {
      await new Promise(resolve => setTimeout(resolve, 8000));
      return NextResponse.json({ success: true, message: 'Delayed Success' });
    }

    // 25% -> Failed (with reason)
    if (random < 0.40) {
      const reasons = [
        'Insufficient funds',
        'Card expired',
        'Incorrect CVV',
        'Bank server busy',
        'Transaction declined by issuer'
      ];
      const error = reasons[Math.floor(Math.random() * reasons.length)];
      const response = { success: false, error };
      if (key) processedTransactions.set(key, response);
      return NextResponse.json(response, { status: 400 });
    }

    // 60% -> Success
    const successResponse = {
      success: true,
      transactionId: transactionId || crypto.randomUUID(),
      message: 'Payment processed successfully'
    };
    if (key) processedTransactions.set(key, successResponse);
    return NextResponse.json(successResponse);

  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
