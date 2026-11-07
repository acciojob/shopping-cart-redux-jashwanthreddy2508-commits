import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addToCart, toggleWishlist } from '../features/cart/cartSlice.js'
import { fetchProducts } from '../features/products/productsSlice.js'

function ProductDetails({ showWishlist }) {
  const dispatch = useDispatch()
  const { items: products, status, error } = useSelector((state) => state.products)
  const wishlist = useSelector((state) => state.cart.wishlist)
  const displayedProducts = showWishlist
    ? products.filter((product) => wishlist.some((item) => item.id === product.id))
    : products

  useEffect(() => {
    if (status === 'idle') dispatch(fetchProducts())
  }, [dispatch, status])

  if (status === 'loading' || status === 'idle') {
    return <p>Loading products...</p>
  }

  if (status === 'failed') {
    return (
      <section role="alert">
        <h2>Could not load products</h2>
        <p>{error}</p>
        <button onClick={() => dispatch(fetchProducts())}>Try again</button>
      </section>
    )
  }

  return (
    <section>
      <h2>{showWishlist ? 'Wishlist' : 'Products'}</h2>
      <div className="product-list">
        {displayedProducts.length === 0 && <p>Your wishlist is empty.</p>}
        {displayedProducts.map((product) => {
          const isWishlisted = wishlist.some((item) => item.id === product.id)

          return (
            <article className="product" key={product.id}>
              <img src={product.image} alt={product.title} />
              <h3>{product.title}</h3>
              <p>${product.price.toFixed(2)}</p>
              <button onClick={() => dispatch(addToCart(product))}>Add to cart</button>
              <button onClick={() => dispatch(toggleWishlist(product))}>
                {isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
              </button>
            </article>
          )
        })}
      </div>
    </section>
  )
}

export default ProductDetails
