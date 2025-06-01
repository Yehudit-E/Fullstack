
import type React from "react"

import { useState } from "react"
import { Mail, Phone, MapPin, Send, AlertCircle, CheckCircle } from "lucide-react"
import "./style/StaticPages.css"
import EmailService from "../services/EmailService"
import { ContactEmailRequest } from "../models/ContactEmailRequest"

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })

  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle")

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {}

    if (!formData.name.trim()) {
      newErrors.name = "Name is required"
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = "Email is invalid"
    }

    if (!formData.subject.trim()) {
      newErrors.subject = "Subject is required"
    }

    if (!formData.message.trim()) {
      newErrors.message = "Message is required"
    } else if (formData.message.length < 10) {
      newErrors.message = "Message must be at least 10 characters"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()

  if (!validateForm()) return

  setIsSubmitting(true)
    
  try {
    const emailRequest: ContactEmailRequest = {
      name: formData.name,
      emailAdress: formData.email,
      subject: formData.subject,
      message: formData.message,
    }
    await EmailService.sendContactEmail(emailRequest) // שליחה לסרוויס בפועל
    setSubmitStatus("success")
    setFormData({
      name: "",
      email: "",
      subject: "",
      message: "",
    })
  } catch (error) {
    setSubmitStatus("error")
  } finally {
    setIsSubmitting(false)
    setTimeout(() => {
      setSubmitStatus("idle")
    }, 5000)
  }
}

  return (
    <div className="static-page-container">
      <div className="page-header">
        <h1 className="page-title">Contact Us</h1>
        <p className="page-subtitle">Get in touch with our team for support, feedback, or inquiries</p>
      </div>

      <div className="contact-layout">
        <div className="contact-info">
          <div className="contact-card">
            <div className="contact-icon">
              <Mail size={24} />
            </div>
            <h3>Email Us</h3>
            <p>Our support team is here to help</p>
            <a href="mailto:musix.app.team@gmail.com" className="contact-link">
              musix.app.team@gmail.com
            </a>
          </div>

          <div className="contact-card">
            <div className="contact-icon">
              <Phone size={24} />
            </div>
            <h3>Call Us</h3>
            <p>Mon-Fri from 9am to 5pm</p>
            <a href="tel:+1234567890" className="contact-link">
              +1 (234) 567-890
            </a>
          </div>

          <div className="contact-card">
            <div className="contact-icon">
              <MapPin size={24} />
            </div>
            <h3>Visit Us</h3>
            <p>Our office location</p>
            <address className="contact-address">
              123 Music Street
              <br />
              San Francisco, CA 94103
              <br />
              United States
            </address>
          </div>

          {/* <div className="contact-card">
            <div className="contact-icon">
              <MessageSquare size={24} />
            </div>
            <h3>Live Chat</h3>
            <p>Chat with our support team</p>
            <button className="chat-button">Start Chat</button>
          </div> */}
        </div>

        <div className="contact-form-container">
          <h2 className="form-title">Send us a message</h2>

          {submitStatus === "success" && (
            <div className="form-status success">
              <CheckCircle size={20} />
              <p>Your message has been sent successfully! We'll get back to you soon.</p>
            </div>
          )}

          {submitStatus === "error" && (
            <div className="form-status error">
              <AlertCircle size={20} />
              <p>There was an error sending your message. Please try again.</p>
            </div>
          )}

          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Your Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your name"
                className={errors.name ? "error" : ""}
              />
              {errors.name && <span className="error-message">{errors.name}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className={errors.email ? "error" : ""}
              />
              {errors.email && <span className="error-message">{errors.email}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="subject">Subject</label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="What is this regarding?"
                className={errors.subject ? "error" : ""}
              />
              {errors.subject && <span className="error-message">{errors.subject}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="message">Message</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Type your message here..."
                rows={5}
                className={errors.message ? "error" : ""}
              ></textarea>
              {errors.message && <span className="error-message">{errors.message}</span>}
            </div>

            <button type="submit" className="submit-button" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <div className="spinner"></div>
                  <span>Sending...</span>
                </>
              ) : (
                <>
                  <Send size={18} />
                  <span>Send Message</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>

      {/* <div className="map-container">
        <h2 className="section-title centered">Find Us</h2>
        <div className="map-placeholder">
          <img src="/placeholder.svg?height=400&width=1000" alt="Map Location" className="map-image" />
          <div className="map-overlay">
            <p>Interactive map would be displayed here</p>
          </div>
        </div>
      </div> */}

      <section className="faq-section">
        <h2 className="section-title centered">Frequently Asked Questions</h2>
        <div className="faq-grid">
          <div className="faq-item">
            <h3>How do I create a playlist?</h3>
            <p>
              To create a playlist, log in to your account, navigate to "My Playlists" and click on the "Add Playlist"
              button. Fill in the details and start adding songs to your new playlist.
            </p>
          </div>

          <div className="faq-item">
            <h3>Can I download songs for offline listening?</h3>
            <p>
              Yes, MusicApp allows you to download songs for offline listening. Simply click on the download icon next
              to any song or use the download option in the song menu.
            </p>
          </div>

          <div className="faq-item">
            <h3>How do I share my playlists with friends?</h3>
            <p>
              You can share your playlists by opening the playlist, clicking on the share button, and entering your
              friend's email address. They will receive an invitation to access your playlist.
            </p>
          </div>

          <div className="faq-item">
            <h3>Is MusicApp available on mobile devices?</h3>
            <p>
              Yes, MusicApp is available on both iOS and Android devices. You can download our mobile app from the App
              Store or Google Play Store.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Contact
