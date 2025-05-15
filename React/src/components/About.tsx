"use client"

import { useState, useEffect } from "react"
import { Users, Music, Globe, Headphones } from "lucide-react"
import "./style/StaticPages.css"

const About = () => {
  const [isVisible, setIsVisible] = useState({
    intro: false,
    mission: false,
    features: false,
    team: false,
  })

  useEffect(() => {
    const handleScroll = () => {
      const sections = ["intro", "mission", "features", "team"]

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
    setTimeout(handleScroll, 100)

    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  return (
    <div className="static-page-container">
      <div className="page-header">
        <h1 className="page-title">About MusicApp</h1>
        <p className="page-subtitle">Discover our story, mission, and the team behind the music</p>
      </div>

      <section id="intro" className={`page-section ${isVisible.intro ? "visible" : ""}`}>
        <div className="section-content">
          <h2 className="section-title">Our Story</h2>
          <p className="section-text">
            MusicApp was founded in 2023 with a simple yet powerful vision: to create a platform where music lovers can
            discover, share, and enjoy their favorite songs without limitations. What started as a small project among
            friends has grown into a vibrant community of music enthusiasts from around the world.
          </p>
          <p className="section-text">
            Our journey began when we noticed how fragmented the music experience had become across different platforms.
            We wanted to build something that puts the focus back on what matters most – the music itself and the
            connections it creates between people.
          </p>
        </div>
        <div className="section-image">
          <img src="/placeholder.svg?height=300&width=400" alt="MusicApp Story" className="about-image" />
        </div>
      </section>

      <section id="mission" className={`page-section alt-bg ${isVisible.mission ? "visible" : ""}`}>
        <div className="section-image">
          <img src="/placeholder.svg?height=300&width=400" alt="Our Mission" className="about-image" />
        </div>
        <div className="section-content">
          <h2 className="section-title">Our Mission</h2>
          <p className="section-text">
            At MusicApp, our mission is to empower music discovery and sharing in a way that respects both artists and
            listeners. We believe that music is a universal language that brings people together, transcending cultural
            and geographical boundaries.
          </p>
          <p className="section-text">We're committed to building a platform that:</p>
          <ul className="mission-list">
            <li>Supports artists by promoting their work</li>
            <li>Creates meaningful connections between music lovers</li>
            <li>Makes discovering new music an exciting journey</li>
            <li>Provides a seamless and enjoyable listening experience</li>
          </ul>
        </div>
      </section>

      <section id="features" className={`page-section features-section ${isVisible.features ? "visible" : ""}`}>
        <h2 className="section-title centered">What Makes Us Different</h2>
        <p className="section-subtitle">Discover the features that set MusicApp apart</p>

        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon-wrapper purple">
              <Music size={24} className="feature-icon" />
            </div>
            <h3 className="feature-title">Personalized Experience</h3>
            <p className="feature-description">
              Create custom playlists and discover new music tailored to your unique taste and preferences.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon-wrapper blue">
              <Users size={24} className="feature-icon" />
            </div>
            <h3 className="feature-title">Community Sharing</h3>
            <p className="feature-description">
              Share your favorite music with friends and discover what others are listening to in real-time.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon-wrapper green">
              <Headphones size={24} className="feature-icon" />
            </div>
            <h3 className="feature-title">High-Quality Audio</h3>
            <p className="feature-description">
              Experience crystal-clear sound quality that brings your music to life with every beat.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon-wrapper pink">
              <Globe size={24} className="feature-icon" />
            </div>
            <h3 className="feature-title">Global Music Library</h3>
            <p className="feature-description">
              Access music from around the world, spanning different cultures, genres, and eras.
            </p>
          </div>
        </div>
      </section>

      <section id="team" className={`page-section team-section ${isVisible.team ? "visible" : ""}`}>
        <h2 className="section-title centered">Meet Our Team</h2>
        <p className="section-subtitle">The passionate people behind MusicApp</p>

        <div className="team-grid">
          <div className="team-member">
            <div className="member-avatar">
              <img src="/placeholder.svg?height=200&width=200" alt="Team Member" />
            </div>
            <h3 className="member-name">Alex Johnson</h3>
            <p className="member-role">Founder & CEO</p>
            <p className="member-bio">
              Music enthusiast with over 10 years of experience in the tech industry. Alex founded MusicApp with the
              vision of creating a better way to experience music.
            </p>
          </div>

          <div className="team-member">
            <div className="member-avatar">
              <img src="/placeholder.svg?height=200&width=200" alt="Team Member" />
            </div>
            <h3 className="member-name">Sarah Chen</h3>
            <p className="member-role">Lead Developer</p>
            <p className="member-bio">
              Full-stack developer with a passion for creating intuitive user experiences. Sarah leads our development
              team and architecture decisions.
            </p>
          </div>

          <div className="team-member">
            <div className="member-avatar">
              <img src="/placeholder.svg?height=200&width=200" alt="Team Member" />
            </div>
            <h3 className="member-name">Michael Rodriguez</h3>
            <p className="member-role">Music Curator</p>
            <p className="member-bio">
              Former DJ and music producer with an ear for discovering emerging artists. Michael ensures our music
              library stays fresh and diverse.
            </p>
          </div>

          <div className="team-member">
            <div className="member-avatar">
              <img src="/placeholder.svg?height=200&width=200" alt="Team Member" />
            </div>
            <h3 className="member-name">Emma Wilson</h3>
            <p className="member-role">UX Designer</p>
            <p className="member-bio">
              Award-winning designer focused on creating beautiful and functional interfaces. Emma is responsible for
              MusicApp's sleek and intuitive design.
            </p>
          </div>
        </div>
      </section>

      <section className="page-section cta-section">
        <div className="cta-content">
          <h2 className="cta-title">Join Our Community</h2>
          <p className="cta-text">
            Become part of the MusicApp family and start discovering, sharing, and enjoying music like never before.
          </p>
          <button className="cta-button">Get Started Today</button>
        </div>
      </section>
    </div>
  )
}

export default About
