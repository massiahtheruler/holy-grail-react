import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./pages/App.jsx";
import Search from "./pages/Search.jsx";
import Shop from "./pages/Shop.jsx";
import Cart from "./pages/Cart.jsx";

const CART_STORAGE_KEY = "holy-grails-react-cart";

const RootApp = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [cartItems, setCartItems] = useState(() => {
    const storedCart = window.localStorage.getItem(CART_STORAGE_KEY);

    if (!storedCart) {
      return [];
    }

    try {
      return JSON.parse(storedCart);
    } catch {
      return [];
    }
  });

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    document.body.classList.toggle("dark-theme", isDarkMode);
    return () => {
      document.body.classList.remove("dark-theme");
    };
  }, [isDarkMode]);

  useEffect(() => {
    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
  }, [cartItems]);

  const toggleTheme = () => {
    setIsDarkMode((current) => !current);
  };

  const addToCart = (item) => {
    setCartItems((current) => {
      const existingItem = current.find((cartItem) => cartItem.key === item.key);

      if (existingItem) {
        return current.map((cartItem) =>
          cartItem.key === item.key
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem,
        );
      }

      return [...current, { ...item, quantity: 1 }];
    });
  };

  const increaseCartQuantity = (key) => {
    setCartItems((current) =>
      current.map((item) =>
        item.key === key ? { ...item, quantity: item.quantity + 1 } : item,
      ),
    );
  };

  const decreaseCartQuantity = (key) => {
    setCartItems((current) =>
      current
        .map((item) =>
          item.key === key ? { ...item, quantity: item.quantity - 1 } : item,
        )
        .filter((item) => item.quantity > 0),
    );
  };

  const removeCartItem = (key) => {
    setCartItems((current) => current.filter((item) => item.key !== key));
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<App onThemeToggle={toggleTheme} cartCount={cartCount} />}
        />
        <Route
          path="/search"
          element={<Search onThemeToggle={toggleTheme} cartCount={cartCount} />}
        />
        <Route
          path="/shop"
          element={
            <Shop
              onThemeToggle={toggleTheme}
              cartCount={cartCount}
              onAddToCart={addToCart}
            />
          }
        />
        <Route
          path="/cart"
          element={
            <Cart
              onThemeToggle={toggleTheme}
              cartItems={cartItems}
              cartCount={cartCount}
              onIncreaseQuantity={increaseCartQuantity}
              onDecreaseQuantity={decreaseCartQuantity}
              onRemoveItem={removeCartItem}
            />
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default RootApp;
