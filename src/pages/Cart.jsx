import { useState } from "react";
import { Link } from "react-router-dom";
import Footer from "../components/Footer.jsx";
import FixedActions from "../components/FixedActions.jsx";
import ContactModal from "../components/ContactModal.jsx";

const TAX_RATE = 0.0825;

const formatCurrency = (value) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);
};

const preventDefault = (event) => {
  event.preventDefault();
};

const Cart = ({
  onThemeToggle,
  cartItems,
  cartCount,
  onIncreaseQuantity,
  onDecreaseQuantity,
  onRemoveItem,
}) => {
  const [isContactOpen, setIsContactOpen] = useState(false);

  const openContactModal = () => setIsContactOpen(true);
  const closeContactModal = () => setIsContactOpen(false);

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const estimatedTax = subtotal * TAX_RATE;
  const total = subtotal + estimatedTax;

  return (
    <>
      <FixedActions
        onThemeClick={onThemeToggle}
        onContactClick={openContactModal}
        cartCount={cartCount}
      />

      <section className="recommendations page-section page-section--1 cart-page">
        <div className="container recommendations__container cart__container">
          <div className="row recommendations__row cart__row">
            <div className="recommendations__hero cart__hero">
              <div className="recommendations__media">
                <img
                  src="/assets/clean-grid-zoom-background (1).png"
                  className="shop__header"
                  alt=""
                />
                <h1 className="shop__title">Cart</h1>
              </div>

              <div className="options shop__options">
                <Link to="/shop" className="shop__back-link">
                  ← Back To Products
                </Link>
              </div>
            </div>

            <p className="shoe__count">
              Holding <span>{cartCount}</span> item{cartCount === 1 ? "" : "s"}
            </p>

            <div className="cart__layout">
              <div className="cart__items">
                {!cartItems.length && (
                  <div className="shoe cart__empty">
                    <div className="shoe__title">Your cart is empty</div>
                    <p className="shoe__sizes">
                      Add some grails from the shop and they&apos;ll stay here
                      while you browse.
                    </p>
                    <Link to="/shop" className="shop__back-link cart__back-link">
                      Browse recommendations
                    </Link>
                  </div>
                )}

                {cartItems.map((item) => (
                  <div key={item.key} className="shoe cart__item">
                    {item.image && (
                      <img
                        className="shoe__img cart__img"
                        src={item.image}
                        alt={item.name}
                      />
                    )}

                    <div className="cart__item-body">
                      <div className="shoe__title">{item.name}</div>
                      {item.subtitle && (
                        <p className="shoe__sizes">{item.subtitle}</p>
                      )}
                      <p className="cart__price">
                        {formatCurrency(item.price)} each
                      </p>

                      <div className="cart__controls">
                        <button
                          type="button"
                          className="cart__qty-btn"
                          onClick={() => onDecreaseQuantity(item.key)}
                        >
                          -
                        </button>
                        <span className="cart__qty">{item.quantity}</span>
                        <button
                          type="button"
                          className="cart__qty-btn"
                          onClick={() => onIncreaseQuantity(item.key)}
                        >
                          +
                        </button>
                        <button
                          type="button"
                          className="cart__remove"
                          onClick={() => onRemoveItem(item.key)}
                        >
                          Remove
                        </button>
                      </div>
                    </div>

                    <div className="cart__line-total">
                      {formatCurrency(item.price * item.quantity)}
                    </div>
                  </div>
                ))}
              </div>

              <aside className="shoe cart__summary">
                <div className="shoe__title">Summary</div>
                <div className="cart__summary-row">
                  <span>Subtotal</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>
                <div className="cart__summary-row">
                  <span>Estimated tax</span>
                  <span>{formatCurrency(estimatedTax)}</span>
                </div>
                <div className="cart__summary-row cart__summary-row--total">
                  <span>Total</span>
                  <span>{formatCurrency(total)}</span>
                </div>
                <p className="cart__summary-note">
                  Demo pricing only for the class project. The real commerce
                  math/backend comes in the full build later.
                </p>
              </aside>
            </div>
          </div>
        </div>
      </section>

      <Footer
        sectionClass="page-section page-section--2"
        onContactClick={(event) => {
          preventDefault(event);
          openContactModal();
        }}
        cartCount={cartCount}
      />

      <ContactModal
        isOpen={isContactOpen}
        onClose={closeContactModal}
        aboutTitle="Cart Questions"
        aboutContent={
          <>
            This version of the cart is a clean class-project stand-in. The
            focus is proving route flow, quantity state, subtotal math, tax,
            and persistence while you keep building the storefront.
          </>
        }
        formText={
          <>Need help with a product bundle or cart flow? Reach out here.</>
        }
      />
    </>
  );
};

export default Cart;
