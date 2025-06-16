
// import { useState, useEffect } from "react"
// import { useSelector } from "react-redux"
// import { Link, useNavigate } from "react-router"
// import type { StoreType } from "../store/store"
// import { PlayCircle, ListMusic, Download, Share2,  Star,  Zap, Heart, Users, Sparkles } from "lucide-react"
// import "./style/Home.css"
// import "./style/Home2.css"
// import { motion } from "framer-motion"

// const Home = () => {
//   const authState = useSelector((state: StoreType) => state.user.authState)
//   const [isVisible, setIsVisible] = useState<{ [key: string]: boolean }>({
//     features: false,
//     discover: false,
//     howItWorks: false,
//     testimonials: false,
//     cta: false,
//   })
//   const navigate = useNavigate()

//   useEffect(() => {
//     const handleScroll = () => {
//       const sections = ["features", "discover", "howItWorks", "testimonials", "cta"]

//       sections.forEach((section) => {
//         const element = document.getElementById(section)
//         if (element) {
//           const rect = element.getBoundingClientRect()
//           const isInView = rect.top <= window.innerHeight * 0.75 && rect.bottom >= 0

//           setIsVisible((prev) => ({
//             ...prev,
//             [section]: isInView,
//           }))
//         }
//       })
//     }

//     window.addEventListener("scroll", handleScroll)
//     // Trigger once on mount to check initial visibility
//     handleScroll()

//     return () => {
//       window.removeEventListener("scroll", handleScroll)
//     }
//   }, [])

//   return (
//     <div className="home-page">
//       {/* Color Splash Background */}
//       {/* <ColorSplashBackground /> */}

//       {/* Content Container - adds a subtle glass effect to improve readability */}
//       <div className="content-container">
//         {/* Hero Section */}
//          <section className="hero-section">
//         {/* <ColorSplashBackground /> */}
//         <div className="hero-content">
//           <motion.h1
//             className="hero-title"
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.8, delay: 0.2 }}
//           >
//             Your Music,<br></br> <span className="gradient-text">Your Way</span>
//           </motion.h1>
//           <motion.p
//             className="hero-subtitle"
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.8, delay: 0.4 }}
//           >
//             Discover, create, and share music like never before. Join our community of music lovers and artists.
//           </motion.p>
//           <motion.div
//             className="hero-buttons"
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.8, delay: 0.6 }}
//           >
//             {!authState ? (
//               <button className="primary-button" onClick={() => navigate("/auth")}>
//                 Get Started
//               </button>
//             ) : (
//               <button className="primary-button" onClick={() => navigate("/discover")}>
//                 Explore Music
//               </button>
//             )}
//             <button
//               className="secondary-button"
//               onClick={() => {
//                 const featuresSection = document.getElementById("features-section")
//                 if (featuresSection) {
//                   featuresSection.scrollIntoView({ behavior: "smooth" })
//                 }
//               }}
//             >
//               Learn More
//             </button>
//           </motion.div>
//         </div>
//         <div className="hero-visual">
//           <motion.div
//             className="floating-album"
//             initial={{ opacity: 0, scale: 0.8 }}
//             animate={{ opacity: 1, scale: 1 }}
//             transition={{ duration: 1, delay: 0.8 }}
//           >
//             <img src="/images/musical-notes.png" alt="Album cover" className="album-cover" />
//             <div className="album-reflection"></div>
//           </motion.div>
//           <motion.div
//             className="floating-waves"
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 0.7 }}
//             transition={{ duration: 1, delay: 1 }}
//           >
//             <svg width="200" height="100" viewBox="0 0 200 100">
//               <path
//                 d="M0,50 C20,30 40,70 60,50 C80,30 100,70 120,50 C140,30 160,70 180,50 C200,30 220,70 240,50"
//                 stroke="url(#gradient)"
//                 strokeWidth="2"
//                 fill="none"
//               />
//               <defs>
//                 <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
//                   <stop offset="0%" stopColor="var(--gradient-start)" />
//                   <stop offset="50%" stopColor="var(--gradient-middle)" />
//                   <stop offset="100%" stopColor="var(--gradient-end)" />
//                 </linearGradient>
//               </defs>
//             </svg>
//           </motion.div>
//         </div>
//           <div className="hero-image-container">
//             <div className="hero-image-wrapper">
//               <div className="floating-music-note note-1">♪</div>
//               <div className="floating-music-note note-2">♫</div>
//               <div className="floating-music-note note-3">♩</div>
//             </div>
//           </div>
//       </section>

//         {/* Stats Section */}
//         <section className="stats-section">
//           <div className="stats-container">
//             <div className="stat-item">
//               <h3 className="stat-number">10K+</h3>
//               <p className="stat-label">Songs</p>
//             </div>
//             <div className="stat-divider"></div>
//             <div className="stat-item">
//               <h3 className="stat-number">5K+</h3>
//               <p className="stat-label">Users</p>
//             </div>
//             <div className="stat-divider"></div>
//             <div className="stat-item">
//               <h3 className="stat-number">2K+</h3>
//               <p className="stat-label">Playlists</p>
//             </div>
//             <div className="stat-divider"></div>
//             <div className="stat-item">
//               <h3 className="stat-number">24/7</h3>
//               <p className="stat-label">Music</p>
//             </div>
//           </div>
//         </section>

//         {/* Features Section */}
//         <section id="features" className={`features-section ${isVisible.features ? "visible" : ""}`}>
//           <div className="section-header">
//             <h2 className="home-section-title">Why Choose Our Platform</h2>
//             <p className="section-subtitle">Experience music like never before with our feature-rich platform</p>
//           </div>

//           <div className="features-grid">
//             <div className="feature-card">
//               <div className="feature-icon-wrapper ">
//                 <ListMusic size={24} className="feature-icon" />
//               </div>
//               <h3 className="feature-title">Custom Playlists</h3>
//               <p className="feature-description">
//                 Create and customize your own playlists with your favorite tracks. Organize your music your way.
//               </p>
//             </div>

//             <div className="feature-card">
//               <div className="feature-icon-wrapper">
//                 <Share2 size={24} className="feature-icon" />
//               </div>
//               <h3 className="feature-title">Share with Friends</h3>
//               <p className="feature-description">
//                 Share your playlists with friends and discover what they're listening to. Music is better together.
//               </p>
//             </div>

//             <div className="feature-card">
//               <div className="feature-icon-wrapper">
//                 <Download size={24} className="feature-icon" />
//               </div>
//               <h3 className="feature-title">Download Music</h3>
//               <p className="feature-description">
//                 Download your favorite tracks and playlists to listen offline, anytime and anywhere.
//               </p>
//             </div>

//             <div className="feature-card">
//               <div className="feature-icon-wrapper">
//                 <Sparkles size={24} className="feature-icon" />
//               </div>
//               <h3 className="feature-title">AI Transcription</h3>
//               <p className="feature-description">
// Get automatic transcription of your songs using advanced artificial intelligence.              </p>
//             </div>
//           </div>
//         </section>

//         {/* Experience Section */}
//         <section className="app-preview-section">
//         <div className="app-preview-content">
//           <motion.div
//             className="app-preview-text"
//             initial={{ opacity: 0, x: -30 }}
//             whileInView={{ opacity: 1, x: 0 }}
//             viewport={{ once: true }}
//             transition={{ duration: 0.6 }}
//           >
//             <h2 className="home-section-title">Experience the Future of Music</h2>
//             <p className="section-description">
//               Our platform is designed to give you the best music experience possible. With intuitive controls,
//               high-quality streaming, and a beautiful interface, you'll never want to listen to music any other way.
//             </p>
//             <ul className="feature-list">
//               <li>
//                 <Zap size={16} /> High-quality audio streaming
//               </li>
//               <li>
//                 <Heart size={16} /> Personalized recommendations
//               </li>
//               <li>
//                 <Users size={16} /> Collaborative playlists
//               </li>
//               <li>
//                 <PlayCircle size={16} /> Seamless playback across devices
//               </li>
//             </ul>
//             <button className="primary-button" onClick={() => navigate(authState ? "/discover" : "/auth")}>
//               {authState ? "Explore Now" : "Get Started"}
//             </button>
//           </motion.div>
//           <motion.div
//             className="app-preview-visual"
//             initial={{ opacity: 0, scale: 0.9 }}
//             whileInView={{ opacity: 1, scale: 1 }}
//             viewport={{ once: true }}
//             transition={{ duration: 0.6 }}
//           >
//             <div className="app-screenshot">
//               <img src="/images/image.png" alt="App screenshot" />
//               <div className="app-screenshot-reflection"></div>
//             </div>
//           </motion.div>
//         </div>
//       </section>
//         {/* How It Works Section */}
//         <section id="howItWorks" className={`how-it-works-section ${isVisible.howItWorks ? "visible" : ""}`}>
//           <div className="section-header">
//             <h2 className="home-section-title">How It Works</h2>
//             <p className="section-subtitle">Get started with our platform in just a few simple steps</p>
//           </div>

//           <div className="steps-container">
//             <div className="step-item">
//               <div className="step-number">1</div>
//               <div className="step-content">
//                 <h3 className="step-title">Create an Account</h3>
//                 <p className="step-description">Sign up for free and create your personal profile to get started.</p>
//               </div>
//             </div>

//             <div className="step-connector"></div>

//             <div className="step-item">
//               <div className="step-number">2</div>
//               <div className="step-content">
//                 <h3 className="step-title">Browse Music</h3>
//                 <p className="step-description">
//                   Explore our vast library of songs across different genres and artists.
//                 </p>
//               </div>
//             </div>

//             <div className="step-connector"></div>

//             <div className="step-item">
//               <div className="step-number">3</div>
//               <div className="step-content">
//                 <h3 className="step-title">Create Playlists</h3>
//                 <p className="step-description">
//                   Create custom playlists with your favorite songs and organize your music.
//                 </p>
//               </div>
//             </div>

//             <div className="step-connector"></div>

//             <div className="step-item">
//               <div className="step-number">4</div>
//               <div className="step-content">
//                 <h3 className="step-title">Share & Enjoy</h3>
//                 <p className="step-description">Share your playlists with friends and enjoy music together.</p>
//               </div>
//             </div>
//           </div>
//         </section>

//         {/* Testimonials Section */}
//         <section id="testimonials" className={`testimonials-section ${isVisible.testimonials ? "visible" : ""}`}>
//           <div className="section-header">
//             <h2 className="home-section-title">What Our Users Say</h2>
//             <p className="section-subtitle">Join thousands of satisfied users who love our platform</p>
//           </div>

//           <div className="testimonials-grid">
//             <div className="testimonial-card">
//               <div className="testimonial-rating">
//                 <Star size={16} className="star-icon filled" />
//                 <Star size={16} className="star-icon filled" />
//                 <Star size={16} className="star-icon filled" />
//                 <Star size={16} className="star-icon filled" />
//                 <Star size={16} className="star-icon filled" />
//               </div>
//               <p className="testimonial-text">
//                 "This platform has completely changed how I discover and enjoy music. The playlist features are
//                 amazing!"
//               </p>
//               <div className="testimonial-author">
//                 <div className="testimonial-avatar">
//                   <img src="/placeholder.svg?height=50&width=50" alt="User" />
//                 </div>
//                 <div className="testimonial-info">
//                   <h4 className="testimonial-name">Sarah Johnson</h4>
//                   <p className="testimonial-title">Music Enthusiast</p>
//                 </div>
//               </div>
//             </div>

//             <div className="testimonial-card">
//               <div className="testimonial-rating">
//                 <Star size={16} className="star-icon filled" />
//                 <Star size={16} className="star-icon filled" />
//                 <Star size={16} className="star-icon filled" />
//                 <Star size={16} className="star-icon filled" />
//                 <Star size={16} className="star-icon filled" />
//               </div>
//               <p className="testimonial-text">
//                 "I love how easy it is to share my playlists with friends. The sound quality is exceptional too!"
//               </p>
//               <div className="testimonial-author">
//                 <div className="testimonial-avatar">
//                   <img src="/placeholder.svg?height=50&width=50" alt="User" />
//                 </div>
//                 <div className="testimonial-info">
//                   <h4 className="testimonial-name">Michael Chen</h4>
//                   <p className="testimonial-title">DJ & Producer</p>
//                 </div>
//               </div>
//             </div>

//             <div className="testimonial-card">
//               <div className="testimonial-rating">
//                 <Star size={16} className="star-icon filled" />
//                 <Star size={16} className="star-icon filled" />
//                 <Star size={16} className="star-icon filled" />
//                 <Star size={16} className="star-icon filled" />
//                 <Star size={16} className="star-icon" />
//               </div>
//               <p className="testimonial-text">
//                 "The personalized recommendations are spot on! I've discovered so many new artists I now love."
//               </p>
//               <div className="testimonial-author">
//                 <div className="testimonial-avatar">
//                   <img src="/placeholder.svg?height=50&width=50" alt="User" />
//                 </div>
//                 <div className="testimonial-info">
//                   <h4 className="testimonial-name">Emily Rodriguez</h4>
//                   <p className="testimonial-title">Student</p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </section>

//         {/* CTA Section */}
//         <section id="cta" className={`cta-section ${isVisible.cta ? "visible" : ""}`}>
//           <div className="cta-content">
//             <h2 className="cta-title">Ready to Start Your Musical Journey?</h2>
//             <p className="cta-description">
//               Join our community today and experience the best way to discover, create, and share music.
//             </p>
//             <div className="cta-buttons">
//               {!authState ? (
//                 <Link to="/auth" className="cta-primary-button">
//                   Sign Up Now
//                 </Link>
//               ) : (
//                 <Link to="/music" className="cta-primary-button">
//                   Explore Music
//                 </Link>
//               )}
//               <Link to="/about" className="cta-secondary-button">
//                 Learn More
//               </Link>
//             </div>
//           </div>
//           <div className="cta-background">
//             <div className="cta-shape shape-1"></div>
//             <div className="cta-shape shape-2"></div>
//             <div className="cta-shape shape-3"></div>
//           </div>
//         </section>
//       </div>
//     </div>
//   )
// }

// export default Home


"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router"
import { PlayCircle, ListMusic, Download, Share2, Star, Zap, Heart, Users, Sparkles, Mic } from "lucide-react"
import { motion } from "framer-motion"
import "./style/Home.css"
const Home = () => {
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
    handleScroll()

    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  return (
    <div className="home-page">
      {/* Mysterious Color Splash Background */}
      <div className="color-splash-background">
        <div className="color-splash splash-1"></div>
        <div className="color-splash splash-2"></div>
        <div className="color-splash splash-3"></div>
        <div className="color-splash splash-4"></div>
        <div className="color-splash splash-5"></div>
      </div>

      {/* Content Container */}
      <div className="content-container">
        {/* Hero Section */}
        <section className="hero-section">
          <div className="hero-content">
            <motion.h1
              className="hero-title"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.2 }}
            >
              Your Music,
              <br />
              <span className="gradient-text">Your Way</span>
            </motion.h1>
            <motion.p
              className="hero-subtitle"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.4 }}
            >
              Discover, create, and share music like never before. Experience the future of music with AI transcription,
              collaborative playlists, and a community of passionate music lovers.
            </motion.p>
            <motion.div
              className="hero-buttons"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.6 }}
            >
              <button className="primary-button">
                <PlayCircle size={20} />
                Start Your Journey
              </button>
              <button
                className="secondary-button"
                onClick={() => {
                  const featuresSection = document.getElementById("features")
                  if (featuresSection) {
                    featuresSection.scrollIntoView({ behavior: "smooth" })
                  }
                }}
              >
                Discover More
              </button>
            </motion.div>
          </div>

          <div className="hero-visual">
            <motion.div
              className="floating-album"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.2, delay: 0.8 }}
            >
              <img src="/images/musical-notes.png" alt="Album cover" className="album-cover" />
              <div className="album-reflection"></div>
            </motion.div>
            <motion.div
              className="floating-waves"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.8 }}
              transition={{ duration: 1.2, delay: 1 }}
            >
<svg width="300" height="150" viewBox="0 0 300 150">
  <path
    d="M0,75 C30,45 60,105 90,75 C120,45 150,105 180,75 C210,45 240,105 270,75 C300,45 330,105 360,75"
    stroke="url(#gradient)"
    strokeWidth="3"
    fill="none"
  />
  <defs>
    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stopColor="#f05371" />
      <stop offset="50%" stopColor="#bd4ed5" />
      <stop offset="100%" stopColor="#7940d4" />
    </linearGradient>
  </defs>
</svg>
            </motion.div>
            <div className="floating-music-note note-1">♪</div>
            <div className="floating-music-note note-2">♫</div>
            <div className="floating-music-note note-3">♩</div>
            {/* <div className="floating-music-note note-4">♬</div> */}
          </div>
        </section>

        {/* Stats Section */}
        <section className="stats-section">
          <div className="stats-container">
            <div className="stat-item">
              <h3 className="stat-number">50K+</h3>
              <p className="stat-label">Songs</p>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <h3 className="stat-number">25K+</h3>
              <p className="stat-label">Users</p>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <h3 className="stat-number">10K+</h3>
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
            <h2 className="home-section-title">Revolutionary Music Experience</h2>
            <p className="section-subtitle">
              Discover the future of music with cutting-edge features designed for the modern music lover
            </p>
          </div>

          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon-wrapper">
                <ListMusic size={32} className="feature-icon" />
              </div>
              <h3 className="feature-title">Public Song Requests</h3>
              <p className="feature-description">
                Suggest songs for everyone to enjoy – easily send a request to add your favorite song to the public library.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon-wrapper">
                <Mic size={32} className="feature-icon" />
              </div>
              <h3 className="feature-title">AI Transcription</h3>
              <p className="feature-description">
                Get instant, accurate transcriptions of your favorite songs using advanced artificial intelligence.
                Perfect for karaoke, learning lyrics, or understanding foreign language tracks.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon-wrapper">
                <Share2 size={32} className="feature-icon" />
              </div>
              <h3 className="feature-title">Playlist Sharing</h3>
              <p className="feature-description">
                Share your musical discoveries with others – create personal or collaborative playlists, send secure links to friends, and let them add songs too.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon-wrapper">
                <Download size={32} className="feature-icon" />
              </div>
              <h3 className="feature-title">Offline Experience</h3>
              <p className="feature-description">
                Download your favorite tracks and playlists for offline listening. Never miss a beat, whether you're
                traveling, commuting, or in areas with poor connectivity.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon-wrapper">
                <Sparkles size={32} className="feature-icon" />
              </div>
              <h3 className="feature-title">Smart Global Player</h3>
              <p className="feature-description">
                Listen to music from any page – the player stays open and continues playing in the background.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon-wrapper">
                <Heart size={32} className="feature-icon" />
              </div>
              <h3 className="feature-title">Advanced Filtering & Search</h3>
              <p className="feature-description">
                Find exactly what you're looking for – filter songs by genre, language, or category, and search easily across songs and playlists.
              </p>
            </div>
          </div>
        </section>

        {/* Experience Section */}
        <section className="app-preview-section">
          <div className="app-preview-content">
            <motion.div
              className="app-preview-text"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="home-section-title">Experience the Future of Music</h2>
              <p className="section-description">
                Our platform combines cutting-edge technology with intuitive design to deliver an unparalleled music
                experience. From AI-powered transcriptions to collaborative playlist sharing, every feature is designed
                to enhance your musical journey.
              </p>
              <ul className="feature-list">
                <li>
                  <Zap size={20} /> Ultra high-quality audio streaming
                </li>
                <li>
                  <Users size={20} /> Real-time collaborative playlists
                </li>
                <li>
                  <PlayCircle size={20} /> Seamless cross-device synchronization
                </li>
                <li>
                  <Mic size={20} /> Instant AI transcription and lyrics
                </li>
                <li>
                  <Share2 size={20} /> Advanced playlist sharing features
                </li>
              </ul>
              <button className="primary-button">
                <PlayCircle size={20} />
                Start Exploring
              </button>
            </motion.div>
            <motion.div
              className="app-preview-visual"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="app-screenshot">
                <img src="/images/image.png" alt="App screenshot" />
                <div className="app-screenshot-reflection"></div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="howItWorks" className={`how-it-works-section ${isVisible.howItWorks ? "visible" : ""}`}>
          <div className="section-header">
            <h2 className="home-section-title">Your Musical Journey Starts Here</h2>
            <p className="section-subtitle">Get started with our revolutionary platform in just a few simple steps</p>
          </div>

          <div className="steps-container">
            <div className="step-item">
              <div className="step-number">1</div>
              <div className="step-content">
                <h3 className="step-title">Create Your Account</h3>
                <p className="step-description">
                  Sign up for free and create your personal profile to get started. We value your privacy and
                  security.
                </p>
              </div>
            </div>

            <div className="step-connector"></div>

            <div className="step-item">
              <div className="step-number">2</div>
              <div className="step-content">
                <h3 className="step-title">Discover & Transcribe</h3>
                <p className="step-description">
                  Browse the public library and get accurate AI-powered transcriptions – great for karaoke, learning, or understanding lyrics.
                </p>
              </div>
            </div>

            <div className="step-connector"></div>

            <div className="step-item">
              <div className="step-number">3</div>
              <div className="step-content">
                <h3 className="step-title">Create & Collaborate</h3>
                <p className="step-description">
                 Create personal or shared playlists, send secure links to friends, and let them add songs too.
                </p>
              </div>
            </div>

            <div className="step-connector"></div>

            <div className="step-item">
              <div className="step-number">4</div>
              <div className="step-content">
                <h3 className="step-title">Share & Suggest to the Public</h3>
                <p className="step-description">
Share the music you love and suggest new tracks to the public library – any user can submit, admin-approved.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section id="testimonials" className={`testimonials-section ${isVisible.testimonials ? "visible" : ""}`}>
          <div className="section-header">
            <h2 className="home-section-title">What Our Community Says</h2>
            <p className="section-subtitle">
              Join thousands of music lovers who have transformed their listening experience
            </p>
          </div>

          <div className="testimonials-grid">
            <div className="testimonial-card">
              <div className="testimonial-rating">
                <Star size={18} className="star-icon filled" />
                <Star size={18} className="star-icon filled" />
                <Star size={18} className="star-icon filled" />
                <Star size={18} className="star-icon filled" />
                <Star size={18} className="star-icon filled" />
              </div>
              <p className="testimonial-text">
                "The AI transcription feature is incredible! I can finally understand the lyrics to all my favorite
                foreign songs. The playlist sharing makes music discovery so much more social and fun."
              </p>
              <div className="testimonial-author">
                <div className="testimonial-avatar">
                  <img src="/placeholder.svg?height=60&width=60" alt="User" />
                </div>
                <div className="testimonial-info">
                  <h4 className="testimonial-name">Sarah Johnson</h4>
                  <p className="testimonial-title">Music Enthusiast</p>
                </div>
              </div>
            </div>

            <div className="testimonial-card">
              <div className="testimonial-rating">
                <Star size={18} className="star-icon filled" />
                <Star size={18} className="star-icon filled" />
                <Star size={18} className="star-icon filled" />
                <Star size={18} className="star-icon filled" />
                <Star size={18} className="star-icon filled" />
              </div>
              <p className="testimonial-text">
                "Collaborative playlists completely changed the way I enjoy music with friends. Everyone adds songs in real time, and it all flows together. It's more than just a playlist — it's a shared experience!"
              </p>
              <div className="testimonial-author">
                <div className="testimonial-avatar">
                  <img src="/placeholder.svg?height=60&width=60" alt="User" />
                </div>
                <div className="testimonial-info">
                  <h4 className="testimonial-name">Michael Chen</h4>
                  <p className="testimonial-title">DJ & Producer</p>
                </div>
              </div>
            </div>

            <div className="testimonial-card">
              <div className="testimonial-rating">
                <Star size={18} className="star-icon filled" />
                <Star size={18} className="star-icon filled" />
                <Star size={18} className="star-icon filled" />
                <Star size={18} className="star-icon filled" />
                <Star size={18} className="star-icon" />
              </div>
              <p className="testimonial-text">
                "This platform revolutionized my music experience. The AI transcription helps me learn songs faster, and
                sharing playlists with my study group has made our sessions so much better!"
              </p>
              <div className="testimonial-author">
                <div className="testimonial-avatar">
                  <img src="/placeholder.svg?height=60&width=60" alt="User" />
                </div>
                <div className="testimonial-info">
                  <h4 className="testimonial-name">Emily Rodriguez</h4>
                  <p className="testimonial-title">Student & Musician</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section id="cta" className={`cta-section ${isVisible.cta ? "visible" : ""}`}>
          <div className="cta-content">
            <h2 className="cta-title">Ready to Transform Your Music Experience?</h2>
            <p className="cta-description">
              Join our revolutionary platform today and discover the future of music. Experience AI transcription,
              collaborative playlists, and a community that shares your passion for music.
            </p>
            <div className="cta-buttons">
              <Link to="/signup" className="cta-primary-button">
                <PlayCircle size={20} />
                Start Your Journey
              </Link>
              <Link to="/about" className="cta-secondary-button">
                Learn More
              </Link>
            </div>
          </div>
          {/* <div className="cta-background">
            <div className="cta-shape shape-1"></div>
            <div className="cta-shape shape-2"></div>
            <div className="cta-shape shape-3"></div>
          </div> */}
        </section>
      </div>
    </div>
  )
}

export default Home
