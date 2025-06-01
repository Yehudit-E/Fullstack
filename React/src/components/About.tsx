
import { useState, useEffect } from "react"
import { Users, Music, Globe, Headphones } from "lucide-react"
import "./style/StaticPages.css"
import { useNavigate } from "react-router"

const About = () => {
  const [isVisible, setIsVisible] = useState({
    intro: false,
    mission: false,
    features: false,
  })
 const navigator=useNavigate()
  useEffect(() => {
    const handleScroll = () => {
      const sections = ["intro", "mission", "features"]

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
    setTimeout(handleScroll, 100)

    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  return (
    <div className="static-page-container">
      <div className="page-header">
        <h1 className="page-title">About MusiX</h1>
        <p className="page-subtitle">Discover the story and mission behind our platform</p>
      </div>

      <section id="intro" className={`page-section ${isVisible.intro ? "visible" : ""}`}>
        <div className="section-content">
          <h2 className="home-section-title">Our Story</h2>
          <p className="section-text">
            MusiX was born from a shared passion for music and technology. In 2023, a small group of friends set out to create a digital space where music could be freely explored, enjoyed, and shared. The idea was simple: provide a unified experience that celebrates the diversity and emotion found in music.
          </p>
          <p className="section-text">
            Over time, what began as a small idea blossomed into a growing community of listeners who wanted more than just a streaming service — they wanted connection, discovery, and a deeper appreciation of the art. MusiX bridges that gap, bringing music lovers together through innovative tools and curated content.
          </p>
        </div>
        <div className="section-image">
          <img src="/placeholder.svg?height=300&width=400" alt="MusiX Story" className="about-image" />
        </div>
      </section>

      <section id="mission" className={`page-section alt-bg ${isVisible.mission ? "visible" : ""}`}>
        <div className="section-image">
          <img src="/placeholder.svg?height=300&width=400" alt="Our Mission" className="about-image" />
        </div>
        <div className="section-content">
          <h2 className="home-section-title">Our Mission</h2>
          <p className="section-text">
            At MusiX, our mission is to redefine the way people engage with music. We aim to create an environment where artists are recognized, where users feel empowered to discover new sounds, and where technology serves the emotional depth of musical expression.
          </p>
          <p className="section-text">
            We believe in music as a global force that transcends language, geography, and culture. Our platform is designed to:
          </p>
          <ul className="mission-list">
            <li>Highlight artists and amplify their reach</li>
            <li>Connect listeners through meaningful shared experiences</li>
            <li>Encourage musical exploration beyond mainstream boundaries</li>
            <li>Deliver high-quality, user-friendly tools for listening and sharing</li>
          </ul>
        </div>
      </section>

      <section id="features" className={`page-section features-section ${isVisible.features ? "visible" : ""}`}>
        <h2 className="home-section-title centered">Key Features</h2>
        <p className="section-subtitle">What makes MusiX a unique place for music lovers?</p>

        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon-wrapper ">
              <Music size={24} className="feature-icon" />
            </div>
            <h3 className="feature-title">Personalized Experience</h3>
            <p className="feature-description">
              Build playlists that match your mood, discover new songs tailored to your preferences, and relive your favorite moments through music.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon-wrapper">
              <Users size={24} className="feature-icon" />
            </div>
            <h3 className="feature-title">Community Sharing</h3>
            <p className="feature-description">
              Share your musical discoveries with others and see what your friends and the community are listening to — all in real time.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon-wrapper">
              <Headphones size={24} className="feature-icon" />
            </div>
            <h3 className="feature-title">Immersive Sound</h3>
            <p className="feature-description">
              Enjoy music in pristine quality with audio features designed to make each beat and melody come alive.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon-wrapper">
              <Globe size={24} className="feature-icon" />
            </div>
            <h3 className="feature-title">Global Music Library</h3>
            <p className="feature-description">
              Explore tracks from across the globe, diving into genres and styles that reflect the world’s rich musical heritage.
            </p>
          </div>
        </div>
      </section>

      <section >
        <div className="cta-content">
          <h2 className="cta-title">Be Part of the Movement</h2>
          <p className="cta-text">
            Join thousands of users who are reshaping how we experience music. Whether you're an artist or a listener, MusiX welcomes you to a world of creativity, connection, and sound.
          </p>
          <button className="cta-button" onClick={() => navigator("/auth")}>Get Started Today</button>
        </div>
      </section>
    </div>
  )
}

export default About