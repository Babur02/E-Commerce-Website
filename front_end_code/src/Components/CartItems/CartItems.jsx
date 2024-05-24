import React, { useContext } from 'react'
import './CartItems.css'
import { ShopContext } from '../../Context/ShopContext'
import remove_icon from '../Assests/cart_cross_icon.png'
import StripeCheckout from 'react-stripe-checkout'


const CartItems = () => {

  const { getTotalCartAmount, all_product, cartItems, removeFromCart } = useContext(ShopContext);
  const makePayment = token => {
    const body = {
      token
    }
    const headers = {
      "Content-Type": "application/json"
    }
    return fetch('http://localhost:8282/payment', {
method: "POST",
      headers,
      body: JSON.stringify(body)
}).then(response => {
    console.log("RESPONSE", response)
    const { status } = response;
    console.log("STATUS", status)
  })
    .catch(error => console.error())
}

// let data = {
//   name: "Babar",
//   amount: 1,
//   number: '9999999999',
//   MID: 'MID' + Date.now(),
//   transactionId: 'T' + Date.now()
// }
// const HandleClick = async () => {
//   try {
//     await axios.post('http://localhost:4000/order', data).then(res => {
//       console.log(res.data)
//     }).catch(err => {
//       console.log(err)
//     })
//   } catch (error) {
//     console.log(error)
//   }
// }

return (
  <div className='cartitems'>
    <div className="cartitems-format-main">
      <p>Products</p>
      <p>Title</p>
      <p>Price</p>
      <p>Quantity</p>
      <p>Total</p>
      <p>Remove</p>
    </div>
    <hr />
    {all_product.map((e) => {
      if (cartItems[e.id] > 0) {
        return <div>
          <div className="cartitems-format cartitems-format-main">
            <img src={e.image} alt="" className='carticon-product-icon' />
            <p>{e.name}</p>
            <p>₹{e.new_price}</p>
            <button className='cartitems-quantity'>{cartItems[e.id]}</button>
            <p>₹{e.new_price * cartItems[e.id]}</p>
            <img className='cartitems-remove-icon' src={remove_icon} onClick={() => { removeFromCart(e.id) }} alt="" />
          </div>
          <hr />
        </div>
      }
      return null;
    })}
    <div className="cartitems-down">
      <div className="cartitems-total">
        <h1>cart Totals</h1>
        <div>
          <div className="cartitems-total-item">
            <p>Subtotal</p>
            <p>₹{getTotalCartAmount()}</p>
          </div>
          <hr />
          <div className="cartitems-total-item">
            <p>Shipping Fee</p>
            <p>Free</p>
          </div>
          <hr />
          <div className="cartitems-total-item">
            <h3>Total</h3>
            <h3>₹{getTotalCartAmount()}</h3>
          </div>
        </div>
        <StripeCheckout
          stripeKey='pk_test_51P9mVoSGAwfzaSvRFhnxFvM5RMRiaD8WTmTZWnBq6IFRyg3FiqxnWuSyBVNj1wgTwNwLwQMj7AFZuPKpmrATTBAm00KPhvE4wk'
          token={makePayment}
          amount={getTotalCartAmount() * 100}>
          <button >Pay Now</button>
        </StripeCheckout>

      </div>
      <div className="cartitems-promocode">
        <p>If you have a promo code, Enter it here</p>
        <div className="cartitems-promobox">
          <input type="text" placeholder='promo code' />
          <button>Submit</button>
        </div>
      </div>
    </div>
  </div>
)
}

export default CartItems
