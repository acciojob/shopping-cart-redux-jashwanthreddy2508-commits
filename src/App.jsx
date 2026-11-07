import { useState } from 'react'
import { useSelector } from 'react-redux'
import Cart from './components/Cart.jsx'
import ProductDetails from './components/ProductDetails.jsx'
import './App.css'

function App() {
  const [page, setPage] = useState('products')
  const cartCount = useSelector((state) =>
    state.cart.items.reduce((count, item) => count + item.quantity, 0),
  )

  return (
    <div className="app">
      <header className="header">
        <h1>Shopping Cart</h1>
        <nav>
          <button onClick={() => setPage('products')}>Products</button>
          <button onClick={() => setPage('wishlist')}>Wishlist</button>
          <button onClick={() => setPage('cart')}>Cart ({cartCount})</button>
        </nav>
      </header>
      <main>
        {page === 'cart'
          ? <Cart />
          : <ProductDetails showWishlist={page === 'wishlist'} />}
      </main>
    </div>
  )
}

export default App
