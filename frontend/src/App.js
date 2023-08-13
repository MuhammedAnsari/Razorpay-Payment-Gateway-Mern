import React, { useState } from 'react';
import './App.css';

const App = () => {
  const [amount, setAmount] = useState('');

  const handlePayNowClick = async () => {
    try {
      const response = await fetch('/api/initiate-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount }),
      });

      const responseData = await response.json();
      const orderId = responseData.orderId;

      const options = {
        key: 'rzp_test_l7BK8gNVAXOMxw',
        amount: amount * 100, 
        currency: 'INR',
        name: 'Payment Gateway Test',
        description: 'Test payment',
        order_id: orderId,
        handler: function (response) {
        
          const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = response;
          capturePayment(razorpay_payment_id, razorpay_order_id, razorpay_signature);
        },
        prefill: {
          name: 'Name',
          email: 'example@example.com', 
        },
      };

      const rzp1 = new window.Razorpay(options);
      rzp1.open();
    } catch (error) {
      console.error('Error initiating payment:', error);
    }
  };

  const capturePayment = async (paymentId, orderId, signature) => {
    try {
      const response = await fetch('http://localhost:5000/api/capture-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ paymentId, orderId, signature }),
      });

      const responseData = await response.json();
      if (responseData.success) {
        alert('Payment successful!');
      } else {
        alert('Payment verification failed!');
      }
    } catch (error) {
      console.error('Error capturing payment:', error);
    }
  };

  return (
    <div className="App">
      <h1>Payment Gateway Test</h1>
      <input
        type="number"
        placeholder="Enter amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <button onClick={handlePayNowClick}>Pay Now</button>
    </div>
  );
};

export default App;
