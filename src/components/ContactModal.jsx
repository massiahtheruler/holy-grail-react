import { useEffect } from "react";

const preventDefault = (event) => {
  event.preventDefault();
};

const lockPageScroll = () => {
  const scrollY = window.scrollY;
  document.body.dataset.scrollLockY = String(scrollY);
  document.body.classList.add("body--modal-open");
  document.body.style.position = "fixed";
  document.body.style.top = `-${scrollY}px`;
  document.body.style.left = "0";
  document.body.style.right = "0";
  document.body.style.width = "100%";
  document.body.style.overflow = "hidden";
  document.documentElement.style.overflow = "hidden";
};

const unlockPageScroll = () => {
  const scrollY = Number(document.body.dataset.scrollLockY || "0");
  document.body.classList.remove("body--modal-open");
  document.body.style.position = "";
  document.body.style.top = "";
  document.body.style.left = "";
  document.body.style.right = "";
  document.body.style.width = "";
  document.body.style.overflow = "";
  document.documentElement.style.overflow = "";
  delete document.body.dataset.scrollLockY;
  window.scrollTo(0, scrollY);
};

const ContactModal = ({
  isOpen,
  onClose,
  aboutTitle,
  aboutContent,
  formText,
}) => {
  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    lockPageScroll();

    return () => {
      unlockPageScroll();
    };
  }, [isOpen]);

  const handleTiltMove = (event) => {
    if (!window.matchMedia("(pointer: fine)").matches) {
      return;
    }

    const card = event.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;
    const rotateY = (x - 0.5) * 6;
    const rotateX = (0.5 - y) * 4;

    card.style.transform = `perspective(1600px) rotateX(${rotateX.toFixed(
      2,
    )}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-3px) scale(1)`;
  };

  const resetTilt = (event) => {
    event.currentTarget.style.transform = "scale(1)";
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="contact-panel contact-panel--open" data-contact-modal>
      <div className="contact-panel__backdrop" onClick={onClose}></div>

      <div
        className="contact-panel__card"
        onMouseMove={handleTiltMove}
        onMouseLeave={resetTilt}
      >
        <button className="contact-panel__close" type="button" onClick={onClose}>
          Close
        </button>

        <div className="contact-panel__half contact-panel__about">
          <h2 className="contact-panel__title">{aboutTitle}</h2>
          <div className="contact-panel__text">{aboutContent}</div>

          <div className="contact-panel__chips">
            <img src="/assets/color-arc-layout.png" className="cmodal__img" alt="" />
            <img src="/assets/color-est-layout (2).png" className="cmodal__img" alt="" />
            <img src="/assets/color-rectangle-layout.png" className="cmodal__img" alt="" />
          </div>
        </div>

        <div className="contact-panel__half contact-panel__form-half">
          <h2 className="contact-panel__title">Send a message</h2>
          <div className="contact-panel__text">{formText}</div>

          <form className="contact-panel__form" onSubmit={preventDefault}>
            <div className="form__item">
              <label className="form__item--label">
                <input className="input" name="user_name" type="text" placeholder="Name" aria-label="Name" />
              </label>
            </div>
            <div className="form__item">
              <label className="form__item--label">
                <input className="input" name="user_email" type="text" placeholder="Email" aria-label="Email" />
              </label>
            </div>
            <div className="form__item">
              <label className="form__item--label">
                <textarea className="input" name="user_message" placeholder="Message" aria-label="Message"></textarea>
              </label>
            </div>
            <button className="form__submit" type="submit">
              Send Message
            </button>
            <div className="contact-panel__status modal__overlay modal__overlay--load">Loading...</div>
            <div className="contact-panel__status modal__overlay modal__overlay--success">
              Thanks for the message! Looking forward to speaking with you.
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactModal;
