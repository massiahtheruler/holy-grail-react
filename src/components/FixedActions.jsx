import { FaEnvelope } from "react-icons/fa";
import { FaCircleHalfStroke, FaBagShopping } from "react-icons/fa6";
import { Link } from "react-router-dom";

const FixedActions = ({ onThemeClick, onContactClick, cartCount = 0 }) => {
  return (
    <div className="fixed__actions">
      <button className="floating__btn" type="button" onClick={onThemeClick}>
        <FaCircleHalfStroke />
      </button>
      <button className="mail__btn click" type="button" onClick={onContactClick}>
        <FaEnvelope />
      </button>
      <Link className="cart__btn" to="/cart" aria-label={`Cart with ${cartCount} items`}>
        <FaBagShopping />
        <span className="cart__count">{cartCount}</span>
      </Link>
    </div>
  );
};

export default FixedActions;
