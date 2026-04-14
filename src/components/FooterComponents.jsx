import "../styles/FooterComponents.css";
import logoApp from "../assets/img/logo-sin-BG.png";
import facebookIcon from "../assets/icons/facebook.png";
import instagramIcon from "../assets/icons/instagram.png";

export default function FooterComponents() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-left">
          <img src={logoApp} alt="Logo CeDiVE" className="footer-logo" />
        </div>

        <div className="footer-center">
          <a
            href="https://www.facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-social-link"
            aria-label="Facebook"
          >
            <img src={facebookIcon} alt="Facebook" className="footer-social-icon" />
            <span>Facebook</span>
          </a>

          <a
            href="https://www.instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-social-link"
            aria-label="Instagram"
          >
            <img src={instagramIcon} alt="Instagram" className="footer-social-icon" />
            <span>Instagram</span>
          </a>
        </div>

        <div className="footer-right">
          <iframe
            title="Ubicacion Centro Medico Veterinario"
            className="footer-map"
            src="https://www.google.com/maps?q=Eva%20Peron%20319,%20Ensenada,%20Buenos%20Aires,%20Argentina&z=15&output=embed"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>

      <div className="footer-divider" />

      <p className="footer-copy">&copy; {currentYear} CeDiVE</p>
    </footer>
  );
}
