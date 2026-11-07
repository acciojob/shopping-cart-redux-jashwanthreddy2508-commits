import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  applyCoupon,
  clearCoupon,
  decreaseQuantity,
  increaseQuantity,
  removeFromCart,
} from '../features/cart/cartSlice.js'

function Cart() {
  const dispatch = useDispatch()
  const { items, appliedCoupon, couponMessage, couponStatus } = useSelector(
    (state) => state.cart,
  )
  const [couponCode, setCouponCode] = useState('')
  const subtotal = items.reduce((total, item) => total + item.price * item.quantity, 0)
  const discount = appliedCoupon
    ? appliedCoupon.type === 'percent'
      ? subtotal * (appliedCoupon.value / 100)
      : Math.min(subtotal, appliedCoupon.value)
    : 0
  const total = Math.max(0, subtotal - discount)

  const submitCoupon = (event) => {
    event.preventDefault()
    if (couponCode.trim()) dispatch(applyCoupon(couponCode))
  }

  return (
    <section>
      <h2>Cart</h2>
      {items.length === 0 ? <p>Your cart is empty.</p> : (
        <div>
          <div className="cart-items">
            {items.map((item) => (
              <article className="cart-item" key={item.id}>
                <img src={item.image} alt={item.title} />
                <div>
                  <h3>{item.title}</h3>
                  <p>${item.price.toFixed(2)} × {item.quantity}</p>
                  <button onClick={() => dispatch(decreaseQuantity(item.id))}>−</button>
                  <button onClick={() => dispatch(increaseQuantity(item.id))}>+</button>
                  <button onClick={() => dispatch(removeFromCart(item.id))}>Remove</button>
                </div>
                <strong>${(item.price * item.quantity).toFixed(2)}</strong>
              </article>
            ))}
          </div>

          <aside className="order-summary">
            <h3>Order summary</h3>
            <form className="coupon-form" onSubmit={submitCoupon}>
              <div className="coupon-input-row">
                <input
                  id="coupon-code"
                  aria-label="Coupon code"
                  placeholder="Enter code"
                  value={couponCode}
                  onChange={(event) => setCouponCode(event.target.value)}
                  aria-describedby="coupon-message"
                />
                <button type="submit">Apply coupon</button>
              </div>
              <p id="coupon-message" className={`coupon-message ${couponStatus}`} aria-live="polite">
                {couponMessage || 'Use SAVE10 for 10% off.'}
              </p>
              {appliedCoupon && (
                <button
                  type="button"
                  className="remove-coupon"
                  onClick={() => {
                    dispatch(clearCoupon())
                    setCouponCode('')
                  }}
                >
                  Remove coupon
                </button>
              )}
            </form>

            <div className="summary-lines">
              <div><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
              {appliedCoupon && (
                <div className="discount-line">
                  <span>Discount ({appliedCoupon.code})</span><span>−${discount.toFixed(2)}</span>
                </div>
              )}
            </div>
            <div className="summary-total"><span>Total</span><strong>${total.toFixed(2)}</strong></div>
          </aside>
        </div>
      )}
    </section>
  )
}

export default Cart
