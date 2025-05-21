"use client"

import { useState, useEffect } from "react"
import { useSelector } from "react-redux"
import { Link, useNavigate } from "react-router"
import type { StoreType } from "../store/store"
import { Music, PlayCircle, ListMusic, Download, Share2, Headphones, Radio, Star, ChevronRight, Zap, Heart, Users } from "lucide-react"
import "./style/Home.css"
import ColorSplashBackground from "./color-splash-background"
import { motion } from "framer-motion"

const Home = () => {
  const authState = useSelector((state: StoreType) => state.user.authState)
  const [isVisible, setIsVisible] = useState<{ [key: string]: boolean }>({
    features: false,
    discover: false,
    howItWorks: false,
    testimonials: false,
    cta: false,
  })
  const navigate = useNavigate()

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
      {/* Color Splash Background */}
      {/* <ColorSplashBackground /> */}

      {/* Content Container - adds a subtle glass effect to improve readability */}
      <div className="content-container">
        {/* Hero Section */}
         <section className="hero-section">
        {/* <ColorSplashBackground /> */}
        <div className="hero-content">
          <motion.h1
            className="hero-title"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Your Music, <span className="gradient-text">Your Way</span>
          </motion.h1>
          <motion.p
            className="hero-subtitle"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Discover, create, and share music like never before. Join our community of music lovers and artists.
          </motion.p>
          <motion.div
            className="hero-buttons"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            {!authState ? (
              <button className="primary-button" onClick={() => navigate("/auth")}>
                Get Started
              </button>
            ) : (
              <button className="primary-button" onClick={() => navigate("/discover")}>
                Explore Music
              </button>
            )}
            <button
              className="secondary-button"
              onClick={() => {
                const featuresSection = document.getElementById("features-section")
                if (featuresSection) {
                  featuresSection.scrollIntoView({ behavior: "smooth" })
                }
              }}
            >
              Learn More
            </button>
          </motion.div>
        </div>
        <div className="hero-visual">
          <motion.div
            className="floating-album"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
          >
            <img src="/images/musical-notes.png" alt="Album cover" className="album-cover" />
            <div className="album-reflection"></div>
          </motion.div>
          <motion.div
            className="floating-waves"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.7 }}
            transition={{ duration: 1, delay: 1 }}
          >
            <svg width="200" height="100" viewBox="0 0 200 100">
              <path
                d="M0,50 C20,30 40,70 60,50 C80,30 100,70 120,50 C140,30 160,70 180,50 C200,30 220,70 240,50"
                stroke="url(#gradient)"
                strokeWidth="2"
                fill="none"
              />
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="var(--gradient-start)" />
                  <stop offset="50%" stopColor="var(--gradient-middle)" />
                  <stop offset="100%" stopColor="var(--gradient-end)" />
                </linearGradient>
              </defs>
            </svg>
          </motion.div>
        </div>
          <div className="hero-image-container">
            <div className="hero-image-wrapper">
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

        {/* Experience Section */}
        <section className="app-preview-section">
        <div className="app-preview-content">
          <motion.div
            className="app-preview-text"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="section-title">Experience the Future of Music</h2>
            <p className="section-description">
              Our platform is designed to give you the best music experience possible. With intuitive controls,
              high-quality streaming, and a beautiful interface, you'll never want to listen to music any other way.
            </p>
            <ul className="feature-list">
              <li>
                <Zap size={16} /> High-quality audio streaming
              </li>
              <li>
                <Heart size={16} /> Personalized recommendations
              </li>
              <li>
                <Users size={16} /> Collaborative playlists
              </li>
              <li>
                <PlayCircle size={16} /> Seamless playback across devices
              </li>
            </ul>
            <button className="primary-button" onClick={() => navigate(authState ? "/discover" : "/auth")}>
              {authState ? "Explore Now" : "Get Started"}
            </button>
          </motion.div>
          <motion.div
            className="app-preview-visual"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="app-screenshot">
              <img src="/placeholder.svg?height=600&width=300" alt="App screenshot" />
              <div className="app-screenshot-reflection"></div>
            </div>
          </motion.div>
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
                <p className="step-description">
                  Explore our vast library of songs across different genres and artists.
                </p>
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
                "This platform has completely changed how I discover and enjoy music. The playlist features are
                amazing!"
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
              <Link to="/about" className="cta-secondary-button">
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
      </div>
    </div>
  )
}

export default Home