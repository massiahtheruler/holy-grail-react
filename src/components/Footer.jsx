import { Link } from "react-router-dom";

const Footer = ({ sectionClass = "page-section", onContactClick, cartCount = 0 }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <section className={`footer ${sectionClass}`}>
      <div className="container footer__container">
        <div className="row footer__row">
          <button className="footer__logo-link" type="button" onClick={scrollToTop}>
            <figure className="footer_img">
              <img
                src="/assets/liquid logo white-Photoroom.png"
                className="footer__logo"
                alt=""
              />
            </figure>
          </button>
          <div className="footer__list">
            <Link
              to="/"
              className="link__hover-effect--white nav__link--anchor link__hover-effect"
            >
              Home
            </Link>
            <Link
              to="/shop"
              className="link__hover-effect--white nav__link--anchor link__hover-effect"
            >
              Shop
            </Link>
            <Link
              to="/search"
              className="link__hover-effect--white nav__link--anchor link__hover-effect"
            >
              Search
            </Link>
            <Link
              to="/cart"
              className="link__hover-effect--white nav__link--anchor link__hover-effect"
            >
              Cart{cartCount ? ` (${cartCount})` : ""}
            </Link>
            <a
              href="#"
              className="link__hover-effect--white nav__link--disabled nav__link--anchor link__hover-effect"
            >
              Insta
            </a>
            <a
              href="#"
              className="link__hover-effect--white nav__link--anchor link__hover-effect"
              onClick={onContactClick}
            >
              Contact
            </a>
          </div>
          <p className="footer__copyrite">King Massiah The Ruler &copy; 2020</p>
        </div>
      </div>
    </section>
  );
};

export default Footer;
