const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const crypto = require('crypto');
const Razorpay = require('razorpay');

const app = express();

app.use(cors());
app.use(bodyParser.json());

const key_id = 'rzp_test_l7BK8gNVAXOMxw';
const key_secret = 'dZTEB9B0Tp99SUMr39EVSmGm';

const razorpay = new Razorpay({
  key_id,
  key_secret,
});

app.post('/api/initiate-payment', (req, res) => {
  const amount = req.body.amount;
  const options = {
    amount: amount * 100, 
    currency: 'INR',
    receipt: 'receipt_1', 
  };

  razorpay.orders.create(options, (err, order) => {
    if (err) {
      console.error('Error creating order:', err);
      return res.status(500).send({ error: 'Payment initiation failed' });
    }

    res.send({ orderId: order.id });
  });
});

app.post('/api/capture-payment', (req, res) => {
  const { paymentId, orderId, signature } = req.body;

 
  const expectedSignature = crypto
    .createHmac('sha256', key_secret)
    .update(orderId + '|' + paymentId)
    .digest('hex');

  if (expectedSignature !== signature) {
    console.error('Payment signature mismatch');
    return res.status(500).send({ error: 'Payment verification failed' });
  }

  res.send({ success: true });
});

const port = 5000;
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});