# Payment Edge Cases Skill

Handle every possible payment scenario with Square integration. Never lose a sale to technical issues.

## Common Edge Cases & Solutions

### 1. Webhook Delivery Failures
```typescript
// Implement webhook retry with exponential backoff
const processWebhookWithRetry = async (
  event: SquareWebhookEvent,
  attempt = 1
): Promise<void> => {
  try {
    await processPayment(event);
  } catch (error) {
    if (attempt <= 5) {
      const delay = Math.pow(2, attempt) * 1000; // 2s, 4s, 8s, 16s, 32s
      console.log(`Webhook retry attempt ${attempt} in ${delay}ms`);
      
      // Store failed webhook for retry
      await supabase
        .from('webhook_queue')
        .insert({
          event_id: event.id,
          event_type: event.type,
          payload: event,
          attempt,
          next_retry: new Date(Date.now() + delay).toISOString(),
          status: 'pending'
        });
      
      setTimeout(() => processWebhookWithRetry(event, attempt + 1), delay);
    } else {
      // Alert admin after 5 failures
      await notifyAdminOfWebhookFailure(event);
    }
  }
};
```

### 2. Duplicate Payment Prevention
```typescript
// Idempotency key to prevent double charges
const createPaymentLink = async (request: PaymentRequest) => {
  const idempotencyKey = crypto.randomUUID();
  
  // Check if payment already exists for this user/product
  const existing = await supabase
    .from('purchases')
    .select('*')
    .eq('user_id', request.userId)
    .eq('product', request.product)
    .eq('status', 'completed')
    .single();
    
  if (existing.data) {
    return {
      error: 'Already purchased',
      existingPurchase: existing.data,
      redirect: '/course' // Send directly to content
    };
  }

  // Create payment with idempotency
  const response = await fetch(`${SQUARE_API}/online-checkout/payment-links`, {
    method: 'POST',
    headers: {
      'Square-Version': '2024-01-18',
      'Authorization': `Bearer ${SQUARE_ACCESS_TOKEN}`,
      'Content-Type': 'application/json',
      'Idempotency-Key': idempotencyKey
    },
    body: JSON.stringify({
      // ... payment details
    })
  });

  // Store idempotency key for tracking
  await supabase
    .from('payment_intents')
    .insert({
      idempotency_key: idempotencyKey,
      user_id: request.userId,
      product: request.product,
      status: 'pending'
    });
};
```

### 3. Payment Status Polling
```typescript
// Handle users who close payment window early
const PaymentStatusPoller = ({ paymentIntentId, onSuccess }) => {
  const [attempts, setAttempts] = useState(0);
  const maxAttempts = 30; // Poll for 60 seconds max

  useEffect(() => {
    const checkStatus = async () => {
      const { data } = await supabase
        .from('purchases')
        .select('status')
        .eq('payment_intent_id', paymentIntentId)
        .single();

      if (data?.status === 'completed') {
        onSuccess();
        return;
      }

      if (attempts < maxAttempts) {
        setTimeout(() => setAttempts(a => a + 1), 2000);
      }
    };

    checkStatus();
  }, [attempts, paymentIntentId]);

  return (
    <div className="text-center py-8">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600 mx-auto mb-4" />
      <p className="text-sky-700">
        Confirming your payment...
      </p>
      <p className="text-sm text-sky-600 mt-2">
        This usually takes just a few seconds
      </p>
      
      {attempts > 15 && (
        <div className="mt-4 text-sm">
          <p className="text-amber-600 mb-2">
            Taking longer than usual...
          </p>
          <Button variant="outline" size="sm" onClick={checkManually}>
            Check Payment Status
          </Button>
        </div>
      )}
    </div>
  );
};
```

### 4. Failed Payment Recovery
```typescript
// Gracefully handle declined cards
const handlePaymentFailure = async (error: SquarePaymentError) => {
  const recovery = {
    'card_declined': {
      message: "Your card was declined. Please try a different card.",
      action: 'retry_payment',
      showAlternatives: true
    },
    'insufficient_funds': {
      message: "Insufficient funds. Please try another payment method.",
      action: 'retry_payment',
      showAlternatives: true
    },
    'expired_card': {
      message: "Your card has expired. Please use a different card.",
      action: 'update_card'
    },
    'processing_error': {
      message: "Payment couldn't process. Please try again in a moment.",
      action: 'retry_later',
      retryAfter: 60 // seconds
    },
    'rate_limited': {
      message: "Too many attempts. Please wait a few minutes.",
      action: 'retry_later',
      retryAfter: 300
    }
  };

  const errorType = error.code || 'processing_error';
  const recoveryPlan = recovery[errorType] || recovery.processing_error;

  // Log for analysis
  await supabase
    .from('payment_errors')
    .insert({
      user_id: error.userId,
      error_code: errorType,
      error_message: error.message,
      recovery_action: recoveryPlan.action,
      timestamp: new Date().toISOString()
    });

  return (
    <div className="max-w-md mx-auto text-center">
      <div className="bg-red-50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
        <XCircle className="w-8 h-8 text-red-600" />
      </div>
      
      <h3 className="text-xl font-semibold mb-2">
        Payment Unsuccessful
      </h3>
      
      <p className="text-gray-600 mb-6">
        {recoveryPlan.message}
      </p>

      <div className="space-y-3">
        {recoveryPlan.action === 'retry_payment' && (
          <Button onClick={retryPayment} className="w-full">
            Try Again
          </Button>
        )}

        {recoveryPlan.showAlternatives && (
          <Button variant="outline" onClick={showAlternativePayments}>
            Other Payment Options
          </Button>
        )}

        <Button variant="ghost" onClick={contactSupport}>
          Need Help?
        </Button>
      </div>
    </div>
  );
};
```

### 5. Webhook Signature Verification
```typescript
// Bulletproof webhook verification
const verifySquareWebhook = (
  body: string,
  signature: string
): boolean => {
  try {
    const hmac = createHmac('sha256', SQUARE_WEBHOOK_SIGNATURE_KEY);
    hmac.update(body);
    const expectedSignature = hmac.digest('base64');
    
    // Timing-safe comparison
    const signatureBuffer = Buffer.from(signature);
    const expectedBuffer = Buffer.from(expectedSignature);
    
    if (signatureBuffer.length !== expectedBuffer.length) {
      console.error('Webhook signature length mismatch');
      return false;
    }
    
    return timingSafeEqual(signatureBuffer, expectedBuffer);
  } catch (error) {
    console.error('Webhook verification error:', error);
    return false;
  }
};

// API route with verification
export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get('x-square-hmacsha256-signature');
  
  if (!signature || !verifySquareWebhook(body, signature)) {
    // Log suspicious activity
    await logSuspiciousWebhook(request);
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }
  
  // Process verified webhook
  const event = JSON.parse(body);
  await processWebhookWithRetry(event);
  
  // Always return 200 to Square
  return NextResponse.json({ received: true });
}
```

### 6. Currency & International Payments
```typescript
// Handle international payments properly
const createInternationalPayment = async (request: PaymentRequest) => {
  const userCountry = await detectUserCountry(request.userId);
  
  // Currency conversion if needed
  const pricing = {
    US: { amount: 9999, currency: 'USD' },
    CA: { amount: 13499, currency: 'CAD' },
    GB: { amount: 7999, currency: 'GBP' },
    EU: { amount: 8999, currency: 'EUR' },
    AU: { amount: 14999, currency: 'AUD' }
  };
  
  const { amount, currency } = pricing[userCountry] || pricing.US;
  
  const paymentLink = await createSquarePaymentLink({
    ...request,
    amount_money: {
      amount,
      currency
    },
    checkout_options: {
      accepted_payment_methods: {
        apple_pay: true,
        google_pay: true,
        cash_app_pay: true,
        afterpay_clearpay: userCountry === 'AU'
      }
    }
  });
  
  return paymentLink;
};
```

### 7. Refund Handling
```typescript
// Process refunds cleanly
const processRefund = async (purchaseId: string, reason: string) => {
  // Get original purchase
  const { data: purchase } = await supabase
    .from('purchases')
    .select('*')
    .eq('id', purchaseId)
    .single();
    
  if (!purchase || purchase.status !== 'completed') {
    throw new Error('Invalid purchase for refund');
  }
  
  // Create Square refund
  const refundResponse = await fetch(
    `${SQUARE_API}/refunds`,
    {
      method: 'POST',
      headers: {
        'Square-Version': '2024-01-18',
        'Authorization': `Bearer ${SQUARE_ACCESS_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        idempotency_key: crypto.randomUUID(),
        amount_money: {
          amount: purchase.amount_cents,
          currency: 'USD'
        },
        payment_id: purchase.square_payment_id,
        reason
      })
    }
  );
  
  if (refundResponse.ok) {
    // Update purchase record
    await supabase
      .from('purchases')
      .update({
        status: 'refunded',
        refunded_at: new Date().toISOString(),
        refund_reason: reason
      })
      .eq('id', purchaseId);
    
    // Revoke access
    await supabase.auth.admin.updateUserById(
      purchase.user_id,
      {
        user_metadata: {
          has_course_access: false
        }
      }
    );
    
    // Send confirmation email
    await sendRefundConfirmationEmail({
      email: purchase.email,
      amount: (purchase.amount_cents / 100).toFixed(2),
      reason
    });
  }
};
```

### 8. Subscription Management (Future)
```typescript
// Handle recurring payments
interface SubscriptionManager {
  create: async (userId: string, plan: 'monthly' | 'annual') => {
    const prices = {
      monthly: 9900, // $99/month
      annual: 99900  // $999/year (2 months free)
    };
    
    // Create Square subscription
    const subscription = await createSquareSubscription({
      customer_id: await getOrCreateSquareCustomer(userId),
      plan_id: plan === 'monthly' ? MONTHLY_PLAN_ID : ANNUAL_PLAN_ID,
      price: prices[plan]
    });
    
    // Store locally
    await supabase
      .from('subscriptions')
      .insert({
        user_id: userId,
        square_subscription_id: subscription.id,
        plan,
        status: 'active',
        current_period_end: subscription.current_period_end
      });
  },
  
  cancel: async (subscriptionId: string) => {
    // Cancel at period end
    await cancelSquareSubscription(subscriptionId, {
      cancel_at_period_end: true
    });
    
    await supabase
      .from('subscriptions')
      .update({
        status: 'canceling',
        cancel_at: getCurrentPeriodEnd()
      })
      .eq('id', subscriptionId);
  },
  
  handleWebhook: async (event: SquareSubscriptionEvent) => {
    switch (event.type) {
      case 'subscription.created':
      case 'subscription.updated':
        await syncSubscriptionStatus(event.subscription);
        break;
        
      case 'invoice.payment_failed':
        await handleFailedPayment(event.invoice);
        await notifyUserOfPaymentFailure(event.invoice.customer_id);
        break;
        
      case 'subscription.canceled':
        await revokeAccess(event.subscription.customer_id);
        break;
    }
  }
};
```

### 9. Testing & Monitoring
```typescript
// Automated payment testing
const runPaymentTests = async () => {
  const testCases = [
    { card: '4111111111111111', expect: 'success' },
    { card: '4000000000000002', expect: 'declined' },
    { card: '4000000000000069', expect: 'expired' },
    { card: '4000000000000127', expect: 'insufficient_funds' }
  ];
  
  for (const test of testCases) {
    try {
      const result = await simulatePayment(test.card);
      console.log(`Test ${test.card}: ${result.status === test.expect ? '✅' : '❌'}`);
    } catch (error) {
      console.error(`Test ${test.card} failed:`, error);
    }
  }
};

// Real-time payment monitoring
const monitorPayments = () => {
  // Alert if no successful payments in last hour
  setInterval(async () => {
    const { count } = await supabase
      .from('purchases')
      .select('*', { count: 'exact' })
      .eq('status', 'completed')
      .gte('created_at', new Date(Date.now() - 3600000).toISOString());
      
    if (count === 0) {
      await notifyAdmin('No successful payments in last hour');
    }
  }, 3600000); // Check hourly
};
```

### 10. Admin Dashboard
```tsx
// Payment oversight dashboard
const PaymentsDashboard = () => {
  const [stats, setStats] = useState({
    todayRevenue: 0,
    failureRate: 0,
    pendingWebhooks: 0,
    refundRequests: 0
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <StatCard
        title="Today's Revenue"
        value={`$${stats.todayRevenue.toFixed(2)}`}
        change="+12%"
        status="success"
      />
      <StatCard
        title="Failure Rate"
        value={`${stats.failureRate.toFixed(1)}%`}
        change="-2%"
        status={stats.failureRate > 5 ? 'warning' : 'success'}
      />
      <StatCard
        title="Pending Webhooks"
        value={stats.pendingWebhooks}
        status={stats.pendingWebhooks > 0 ? 'warning' : 'success'}
      />
      <StatCard
        title="Refund Requests"
        value={stats.refundRequests}
        action={
          <Button size="sm" variant="outline">
            Review
          </Button>
        }
      />
    </div>
  );
};
```
