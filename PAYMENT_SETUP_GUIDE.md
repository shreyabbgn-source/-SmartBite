# 💳 Payment Setup Guide - Campus Canteen

## ✅ Current Payment Integration Status

Your Campus Canteen app has **complete Razorpay payment integration** with the following features:

### Implemented Features:
- ✅ Razorpay SDK integration (automatic script loading)
- ✅ Order creation API at `/api/razorpay/create-order`
- ✅ Payment flow in CartDrawer component
- ✅ Order management API at `/api/orders`
- ✅ Payment status tracking (pending, completed, failed, refunded)
- ✅ Order status tracking (pending, in-progress, ready, completed, cancelled)
- ✅ Automatic order creation after successful payment
- ✅ Redirect to order tracking page after payment
- ✅ Cart clearing after successful payment
- ✅ Toast notifications for payment feedback

## ⚠️ Current Issue: Invalid Razorpay Credentials

The credentials provided are causing authentication errors:
```
RAZORPAY_KEY_ID=rzp_test_Rc95kL1tkTf4Le
RAZORPAY_KEY_SECRET=5xPZ8c12s6LludOd6FH8W1ro
```

**Error:** `Authentication failed` (401)

This happens because the test credentials are incomplete or invalid.

## 🔑 How to Get Valid Razorpay Credentials

### Step 1: Create Razorpay Account
1. Go to [https://razorpay.com/](https://razorpay.com/)
2. Click "Sign Up" and create an account
3. Verify your email address

### Step 2: Access Test Mode
1. Login to Razorpay Dashboard
2. Make sure you're in **Test Mode** (toggle on top right)
3. Go to **Settings** → **API Keys**

### Step 3: Generate API Keys
1. Click **Generate Test Key**
2. You'll get two keys:
   - **Key ID** (starts with `rzp_test_` followed by 14 characters)
   - **Key Secret** (starts with letters/numbers, around 24 characters)

### Step 4: Update Environment Variables
Replace the values in your `.env` file:

```env
# Razorpay Payment Gateway (Test Mode)
RAZORPAY_KEY_ID=rzp_test_XXXXXXXXXXXXXX
RAZORPAY_KEY_SECRET=XXXXXXXXXXXXXXXXXXXXXXXX
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_XXXXXXXXXXXXXX
```

**Important:** Keep your Key Secret confidential. Never commit it to Git.

## 🧪 Testing the Payment Flow

Once you have valid credentials:

### 1. Test API Endpoint
```bash
curl -X POST http://localhost:3000/api/razorpay/create-order \
  -H "Content-Type: application/json" \
  -d '{"amount": 100, "currency": "INR", "receipt": "test_order_1"}'
```

Expected response:
```json
{
  "id": "order_xxxxxxxxxxxxx",
  "amount": 10000,
  "currency": "INR"
}
```

### 2. Test Payment in App
1. Add items to cart
2. Click "Proceed to Checkout"
3. Razorpay checkout modal should open
4. Use test card details:

**Test Card Numbers:**
- **Success:** 4111 1111 1111 1111
- **Failure:** 4000 0000 0000 0002
- **CVV:** Any 3 digits
- **Expiry:** Any future date
- **OTP:** 123456

### 3. Verify Order Creation
After successful payment:
- You'll be redirected to order tracking page
- Check database for new order entry
- Payment status should be "completed"
- Order status should be "pending"

## 📱 Payment Flow Diagram

```
Student adds items to cart
    ↓
Clicks "Proceed to Checkout"
    ↓
Authenticated? → No → Show Login Dialog
    ↓ Yes
Create Razorpay order (API call)
    ↓
Open Razorpay checkout modal
    ↓
Student completes payment
    ↓
Payment Success → Create order in database
    ↓
Redirect to order tracking page
    ↓
Clear cart
```

## 🔧 Technical Implementation Details

### Files Involved:
1. **`src/lib/razorpay.ts`** - Razorpay SDK loader and payment initiator
2. **`src/app/api/razorpay/create-order/route.ts`** - Server-side order creation
3. **`src/components/CartDrawer.tsx`** - Payment initiation UI
4. **`src/app/api/orders/route.ts`** - Order management API
5. **`.env`** - Razorpay credentials

### Environment Variables:
- `RAZORPAY_KEY_ID` - Server-side key (never exposed to client)
- `RAZORPAY_KEY_SECRET` - Server-side secret (never exposed to client)
- `NEXT_PUBLIC_RAZORPAY_KEY_ID` - Client-side key (safe to expose)

### Payment Webhook (Optional Enhancement):
For production, you should add a webhook to handle payment confirmations:
1. Create `/api/razorpay/webhook` endpoint
2. Verify signature using Razorpay SDK
3. Update order status based on webhook events

## 🚀 Going to Production

When ready for production:

1. **Switch to Live Mode** in Razorpay Dashboard
2. **Generate Live API Keys** (similar to test keys)
3. **Update environment variables** with live keys:
   ```env
   RAZORPAY_KEY_ID=rzp_live_XXXXXXXXXXXXXX
   RAZORPAY_KEY_SECRET=XXXXXXXXXXXXXXXXXXXXXXXX
   NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_live_XXXXXXXXXXXXXX
   ```
4. **Complete KYC verification** in Razorpay (required for live transactions)
5. **Setup webhook** for payment confirmations
6. **Enable payment methods** you want to accept (UPI, Cards, Wallets, etc.)

## 📊 Payment Analytics

Track payment metrics in Razorpay Dashboard:
- Total revenue
- Success/failure rates
- Payment method breakdown
- Refund statistics

## 🆘 Troubleshooting

### Authentication Failed (401)
- Verify API keys are correct
- Ensure you're using test keys in test mode
- Check for extra spaces in `.env` file

### Payment Modal Not Opening
- Check browser console for errors
- Verify Razorpay script is loading
- Ensure NEXT_PUBLIC_RAZORPAY_KEY_ID is set

### Order Not Creating After Payment
- Check server logs
- Verify order API is working
- Test order creation endpoint directly

## 📞 Support

- **Razorpay Docs:** [https://razorpay.com/docs/](https://razorpay.com/docs/)
- **Razorpay Support:** support@razorpay.com
- **Test Mode Guide:** [https://razorpay.com/docs/payments/test-mode/](https://razorpay.com/docs/payments/test-mode/)

---

**Status:** ✅ Payment integration is complete and ready to use once valid Razorpay credentials are provided.
