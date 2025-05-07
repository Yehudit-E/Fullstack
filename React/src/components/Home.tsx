"use client"

import { useState, useEffect } from "react"
import { useSelector } from "react-redux"
import { Link } from "react-router"
import type { StoreType } from "../store/store"
import { Music, PlayCircle, ListMusic, Download, Share2, Headphones, Radio, Star, ChevronRight } from "lucide-react"
import "./style/Home.css"

const Home = () => {
  const authState = useSelector((state: StoreType) => state.user.authState)
  const [isVisible, setIsVisible] = useState<{ [key: string]: boolean }>({
    features: false,
    discover: false,
    howItWorks: false,
    testimonials: false,
    cta: false,
  })

  useEffect(() => {
    const handleScroll = () => {
      const sections = ["features", "discover", "howItWorks", "testimonials", "cta"]

      sections.forEach((section) => {
        const element = document.getElementById(section)
        if (element) {
          const rect = element.getBoundingClientRect()
          const isInView = rect.top <= window.innerHeight * 0.75 && rect.bottom >= 0

          setIsVisible((prev) => ({
            ...prev,
            [section]: isInView,
          }))
        }
      })
    }

    window.addEventListener("scroll", handleScroll)
    // Trigger once on mount to check initial visibility
    handleScroll()

    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            Your Music, <span className="gradient-text">Your Way</span>
          </h1>
          <p className="hero-subtitle">
            Discover, create, and share your favorite music with friends. The ultimate music experience starts here.
          </p>
          <div className="hero-buttons">
            {!authState ? (
              <Link to="/auth" className="primary-button">
                <PlayCircle size={20} />
                Get Started
              </Link>
            ) : (
              <Link to="/music" className="primary-button">
                <Music size={20} />
                Explore Music
              </Link>
            )}
            <Link to="/music" className="secondary-button">
              <Headphones size={20} />
              Browse Library
            </Link>
          </div>
        </div>
        <div className="hero-image-container">
          <div className="hero-image-wrapper">
            <img src="/placeholder.svg?height=500&width=500" alt="Music Experience" className="hero-image" />
            <div className="floating-music-note note-1">♪</div>
            <div className="floating-music-note note-2">♫</div>
            <div className="floating-music-note note-3">♩</div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="stats-container">
          <div className="stat-item">
            <h3 className="stat-number">10K+</h3>
            <p className="stat-label">Songs</p>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-item">
            <h3 className="stat-number">5K+</h3>
            <p className="stat-label">Users</p>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-item">
            <h3 className="stat-number">2K+</h3>
            <p className="stat-label">Playlists</p>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-item">
            <h3 className="stat-number">24/7</h3>
            <p className="stat-label">Music</p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className={`features-section ${isVisible.features ? "visible" : ""}`}>
        <div className="section-header">
          <h2 className="section-title">Why Choose Our Platform</h2>
          <p className="section-subtitle">Experience music like never before with our feature-rich platform</p>
        </div>

        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon-wrapper purple">
              <ListMusic size={24} className="feature-icon" />
            </div>
            <h3 className="feature-title">Custom Playlists</h3>
            <p className="feature-description">
              Create and customize your own playlists with your favorite tracks. Organize your music your way.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon-wrapper blue">
              <Share2 size={24} className="feature-icon" />
            </div>
            <h3 className="feature-title">Share with Friends</h3>
            <p className="feature-description">
              Share your playlists with friends and discover what they're listening to. Music is better together.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon-wrapper pink">
              <Download size={24} className="feature-icon" />
            </div>
            <h3 className="feature-title">Download Music</h3>
            <p className="feature-description">
              Download your favorite tracks and playlists to listen offline, anytime and anywhere.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon-wrapper green">
              <Radio size={24} className="feature-icon" />
            </div>
            <h3 className="feature-title">High Quality Audio</h3>
            <p className="feature-description">
              Enjoy crystal clear sound quality that brings your music to life with every beat.
            </p>
          </div>
        </div>
      </section>

      {/* Discover Section */}
      <section id="discover" className={`discover-section ${isVisible.discover ? "visible" : ""}`}>
        <div className="discover-content">
          <h2 className="discover-title">Discover New Music Every Day</h2>
          <p className="discover-description">
            Our platform is constantly updated with the latest tracks from various genres. Expand your musical horizons
            and discover your next favorite song.
          </p>
          <ul className="discover-features">
            <li className="discover-feature-item">
              <span className="discover-feature-icon">✓</span>
              Personalized recommendations based on your taste
            </li>
            <li className="discover-feature-item">
              <span className="discover-feature-icon">✓</span>
              New releases from your favorite artists
            </li>
            <li className="discover-feature-item">
              <span className="discover-feature-icon">✓</span>
              Curated playlists for every mood and occasion
            </li>
            <li className="discover-feature-item">
              <span className="discover-feature-icon">✓</span>
              Trending charts updated weekly
            </li>
          </ul>
          <Link to="/music" className="discover-button">
            Start Discovering
            <ChevronRight size={16} />
          </Link>
        </div>
        <div className="discover-image-container">
          <div className="discover-image-wrapper">
            <img src="/placeholder.svg?height=400&width=400" alt="Discover Music" className="discover-image" />
            <div className="discover-image-overlay"></div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="howItWorks" className={`how-it-works-section ${isVisible.howItWorks ? "visible" : ""}`}>
        <div className="section-header">
          <h2 className="section-title">How It Works</h2>
          <p className="section-subtitle">Get started with our platform in just a few simple steps</p>
        </div>

        <div className="steps-container">
          <div className="step-item">
            <div className="step-number">1</div>
            <div className="step-content">
              <h3 className="step-title">Create an Account</h3>
              <p className="step-description">Sign up for free and create your personal profile to get started.</p>
            </div>
          </div>

          <div className="step-connector"></div>

          <div className="step-item">
            <div className="step-number">2</div>
            <div className="step-content">
              <h3 className="step-title">Browse Music</h3>
              <p className="step-description">Explore our vast library of songs across different genres and artists.</p>
            </div>
          </div>

          <div className="step-connector"></div>

          <div className="step-item">
            <div className="step-number">3</div>
            <div className="step-content">
              <h3 className="step-title">Create Playlists</h3>
              <p className="step-description">
                Create custom playlists with your favorite songs and organize your music.
              </p>
            </div>
          </div>

          <div className="step-connector"></div>

          <div className="step-item">
            <div className="step-number">4</div>
            <div className="step-content">
              <h3 className="step-title">Share & Enjoy</h3>
              <p className="step-description">Share your playlists with friends and enjoy music together.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className={`testimonials-section ${isVisible.testimonials ? "visible" : ""}`}>
        <div className="section-header">
          <h2 className="section-title">What Our Users Say</h2>
          <p className="section-subtitle">Join thousands of satisfied users who love our platform</p>
        </div>

        <div className="testimonials-grid">
          <div className="testimonial-card">
            <div className="testimonial-rating">
              <Star size={16} className="star-icon filled" />
              <Star size={16} className="star-icon filled" />
              <Star size={16} className="star-icon filled" />
              <Star size={16} className="star-icon filled" />
              <Star size={16} className="star-icon filled" />
            </div>
            <p className="testimonial-text">
              "This platform has completely changed how I discover and enjoy music. The playlist features are amazing!"
            </p>
            <div className="testimonial-author">
              <div className="testimonial-avatar">
                <img src="/placeholder.svg?height=50&width=50" alt="User" />
              </div>
              <div className="testimonial-info">
                <h4 className="testimonial-name">Sarah Johnson</h4>
                <p className="testimonial-title">Music Enthusiast</p>
              </div>
            </div>
          </div>

          <div className="testimonial-card">
            <div className="testimonial-rating">
              <Star size={16} className="star-icon filled" />
              <Star size={16} className="star-icon filled" />
              <Star size={16} className="star-icon filled" />
              <Star size={16} className="star-icon filled" />
              <Star size={16} className="star-icon filled" />
            </div>
            <p className="testimonial-text">
              "I love how easy it is to share my playlists with friends. The sound quality is exceptional too!"
            </p>
            <div className="testimonial-author">
              <div className="testimonial-avatar">
                <img src="/placeholder.svg?height=50&width=50" alt="User" />
              </div>
              <div className="testimonial-info">
                <h4 className="testimonial-name">Michael Chen</h4>
                <p className="testimonial-title">DJ & Producer</p>
              </div>
            </div>
          </div>

          <div className="testimonial-card">
            <div className="testimonial-rating">
              <Star size={16} className="star-icon filled" />
              <Star size={16} className="star-icon filled" />
              <Star size={16} className="star-icon filled" />
              <Star size={16} className="star-icon filled" />
              <Star size={16} className="star-icon" />
            </div>
            <p className="testimonial-text">
              "The personalized recommendations are spot on! I've discovered so many new artists I now love."
            </p>
            <div className="testimonial-author">
              <div className="testimonial-avatar">
                <img src="/placeholder.svg?height=50&width=50" alt="User" />
              </div>
              <div className="testimonial-info">
                <h4 className="testimonial-name">Emily Rodriguez</h4>
                <p className="testimonial-title">Student</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="cta" className={`cta-section ${isVisible.cta ? "visible" : ""}`}>
        <div className="cta-content">
          <h2 className="cta-title">Ready to Start Your Musical Journey?</h2>
          <p className="cta-description">
            Join our community today and experience the best way to discover, create, and share music.
          </p>
          <div className="cta-buttons">
            {!authState ? (
              <Link to="/auth" className="cta-primary-button">
                Sign Up Now
              </Link>
            ) : (
              <Link to="/music" className="cta-primary-button">
                Explore Music
              </Link>
            )}
            <Link to="/music" className="cta-secondary-button">
              Learn More
            </Link>
          </div>
        </div>
        <div className="cta-background">
          <div className="cta-shape shape-1"></div>
          <div className="cta-shape shape-2"></div>
          <div className="cta-shape shape-3"></div>
        </div>
      </section>

      {/* Footer */}
      <footer className="home-footer">
        <div className="footer-content">
          <div className="footer-logo">
            <img src="/images/musical-notes.png" alt="Logo" className="footer-logo-image" />
            <span className="footer-logo-text">MusicApp</span>
          </div>
          <p className="footer-copyright">© {new Date().getFullYear()} MusicApp. All rights reserved.</p>
          <div className="footer-links">
            <a href="#" className="footer-link">
              Privacy Policy
            </a>
            <a href="#" className="footer-link">
              Terms of Service
            </a>
            <a href="#" className="footer-link">
              Contact Us
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Home