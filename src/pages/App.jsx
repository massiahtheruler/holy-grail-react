import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Footer from "../components/Footer.jsx";
import FixedActions from "../components/FixedActions.jsx";
import ContactModal from "../components/ContactModal.jsx";

const preventDefault = (event) => {
  event.preventDefault();
};

const App = ({ onThemeToggle, cartCount = 0 }) => {
  const navigate = useNavigate();
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [homeQuery, setHomeQuery] = useState("");
  const openContactModal = () => setIsContactOpen(true);
  const closeContactModal = () => setIsContactOpen(false);

  const handleHomeSearch = (event) => {
    event.preventDefault();
    const cleanQuery = homeQuery.trim();

    if (!cleanQuery) {
      navigate("/search");
      return;
    }

    navigate(`/search?query=${encodeURIComponent(cleanQuery)}`);
  };

  return (
    <>
      <FixedActions
        onThemeClick={onThemeToggle}
        onContactClick={openContactModal}
        cartCount={cartCount}
      />

      <div className="container page-section page-section--1">
        <div className="row">
          <nav>
            <div className="container nav__container">
              <div className="row nav__row">
                <div className="nav">
                  <div className="nav__content">
                    <div className="pic">
                      <img
                        src="/assets/king massiah white background-Photoroom.png"
                        className="nav__logo"
                        alt="King Massiah logo"
                      />
                    </div>

                    <div className="header__banner">
                      <img
                        src="/assets/new-design (2).png"
                        className="header__banner-img header__banner-img--desktop"
                        alt=""
                      />
                      <img
                        src="/assets/color-est-layout (1)-Photoroom.png"
                        className="header__banner-img header__banner-img--mobile"
                        alt=""
                      />
                    </div>

                    <div className="nav__list">
                      <div className="nav__link--anchor link__hover-effect link__hover-effect--black">
                        <Link to="/">Home</Link>
                      </div>
                      <div className="nav__link--anchor link__hover-effect link__hover-effect--black">
                        <Link to="/shop">Products</Link>
                      </div>
                      <div className="nav__link--anchor link__hover-effect link__hover-effect--black">
                        <Link to="/cart">Cart{cartCount ? ` (${cartCount})` : ""}</Link>
                      </div>
                      <div className="link nav__link--primary">
                        <button
                          onClick={openContactModal}
                          className="nav__contact"
                          id="click"
                          type="button"
                        >
                          Contact
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </nav>

          <img
            src="/assets/Louis_Vuitton-Logo.wine.png"
            className="shape shape--0"
            alt=""
          />
          <img
            src="/assets/Vibrant 90s squiggly rainbow shape.png"
            className="shape shape--1"
            alt=""
          />
          <img
            src="/assets/BAPE-Logo.png"
            className="shape shape--2"
            alt=""
          />
          <img
            src="/assets/Supreme-Emblem.png"
            className="shape shape--3"
            alt=""
          />
          <img
            src="/assets/Logo_NIKE.svg"
            className="shape shape--4"
            alt=""
          />
          <img
            src="/assets/Icon-Nike-500x281.png"
            className="shape shape--5"
            alt=""
          />
          <img
            src="/assets/Vibrant turquoise circle with bold outline.png"
            className="shape shape--6"
            alt=""
          />
          <img
            src="/assets/Yeezy_Logo.webp"
            className="shape shape--11"
            alt=""
          />
          <img
            src="/assets/Turquoise squiggle with bold outline.png"
            className="shape shape--12"
            alt=""
          />
          <img
            src="/assets/adidas_hwxvee.png"
            className="shape shape--10"
            alt=""
          />
          <img
            src="/assets/Bold purple triangle with jagged border.png"
            className="shape shape--9"
            alt=""
          />

          <section id="header" className="page-section page-section--2">
            <div className="header__container">
              <div className="header__row">
                <div className="header__content">
                  <figure className="header__img">
                    <div className="header__img--wrapper">
                      <img
                        src="/assets/color-icon-on-top-layout (2).png"
                        className="header__logo"
                        alt=""
                      />
                    </div>
                  </figure>

                  <h1 className="title header__title">
                    Welcome
                    <br />
                  </h1>

                  <br />

                  <h2 className="subtitle header__subtitle">
                    Hub for<span className="gold"> Holy Grail</span>, Footwear /
                    Streetwear <br />
                    and accessory<span className="gold"> collections</span>
                  </h2>
                </div>
              </div>
            </div>
          </section>

          <section id="landing__page" className="page-section page-section--3">
            <div className="container landing__container">
              <div className="row landing__row">
                <figure className="landing__img--wrapper">
                  <Link to="/shop" className="landing__card showroom-card glass-sheen">
                    <img
                      src="/assets/new-design (1).png"
                      id="img__link"
                      className="landing__img"
                      alt=""
                    />
                  </Link>
                  <Link
                    to="/search?query=yeezy"
                    className="landing__card showroom-card glass-sheen"
                  >
                    <img
                      src="/assets/download.png"
                      id="img__link"
                      className="landing__img"
                      alt=""
                    />
                  </Link>
                  <Link
                    to="/search?query=jordan"
                    className="landing__card showroom-card glass-sheen"
                  >
                    <img
                      src="/assets/new-design.png"
                      id="img__link"
                      className="landing__img"
                      alt=""
                    />
                  </Link>
                </figure>

                <form className="grail__search-form" onSubmit={handleHomeSearch}>
                  <input
                    type="search"
                    name="query"
                    id="grail__search"
                    className="grail__search home__search"
                    placeholder="Your GRAILS Here"
                    value={homeQuery}
                    onChange={(event) => setHomeQuery(event.target.value)}
                  />
                  <button className="search_btn" type="submit">
                    HUNT
                  </button>
                </form>
              </div>
            </div>
          </section>

          <Footer
            sectionClass="page-section page-section--4"
            onContactClick={(event) => {
              preventDefault(event);
              openContactModal();
            }}
            cartCount={cartCount}
          />
        </div>
      </div>

      <ContactModal
        isOpen={isContactOpen}
        onClose={closeContactModal}
        aboutTitle="Here's more about me"
        aboutContent={
          <>
            King Massiah&apos;s Holy Grails is the bridge between the plug and
            the pavement. For when your not taking L for an answer. Our mission
            is to scale the culture by linking buyers and resellers faster then
            bots on drop day. This is your hub for luxury shoes and elite
            streetwear. No gatekeeping, no lag just massive inventory and
            competitive pricing for those who know the difference.
            <b>Because your grails shouldn&apos;t be myths.</b>
          </>
        }
        formText={
          <>
            Buy or sell, we have the solutions and resources. Hit us up today to
            link and see how we can holy fulfil your grail necessities today.
          </>
        }
      />
    </>
  );
};

export default App;
