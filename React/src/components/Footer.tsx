
import { Link } from "react-router"
import { Heart, Github } from "lucide-react"
import "./style/Footer.css"

const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (

    <footer className="app-footer">
      <div className="footer-container">
        <div className="footer-logo" >
          {/* <img src="/images/musical-notes.png" alt="Logo" className="footer-logo-image" /> */}
          <span className="footer-logo-text">MusiX</span>
        </div>

        <div className="footer-links">
          <Link to="/about" className="footer-link">
            About
          </Link>
          {/* <span className="footer-divider">•</span>
          <Link to="/privacy" className="footer-link">
            Privacy
          </Link> */}
          <span className="footer-divider">•</span>
          <Link to="/terms" className="footer-link">
            Terms
          </Link>
          <span className="footer-divider">•</span>
          <Link to="/contact" className="footer-link">
            Contact
          </Link>
        </div>

        <div className="footer-social">
          <a href="https://github.com/yehudit-e/fullstack" className="social-icon" aria-label="Github">
            <Github size={16} />
          </a>
          {/* <a href="#" className="social-icon" aria-label="Twitter">
            <Twitter size={16} />
          </a>
          <a href="#" className="social-icon" aria-label="Instagram">
            <Instagram size={16} />
          </a> */}
        </div>

        <div className="footer-copyright">
          <span>© {currentYear} MusiX. All rights reserved.</span>
          <span className="made-with">
            Made with <Heart size={12} className="heart-icon" /> by MusiX Team
          </span>
        </div>
      </div>
    </footer>
  )
}

export default Footer
