"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"
import "./style/StaticPages.css"

const Terms = () => {
  const [expandedSection, setExpandedSection] = useState<string | null>("terms")

  const toggleSection = (section: string) => {
    if (expandedSection === section) {
      setExpandedSection(null)
    } else {
      setExpandedSection(section)
    }
  }

  return (
    <div className="static-page-container">
      <div className="page-header">
        <h1 className="page-title">Terms of Service</h1>
        <p className="page-subtitle">Last updated: May 15, 2025</p>
      </div>

      <div className="terms-container">
        <div className="terms-sidebar">
          <ul className="terms-nav">
            <li className={expandedSection === "terms" ? "active" : ""} onClick={() => toggleSection("terms")}>
              Terms of Service
            </li>
            <li className={expandedSection === "privacy" ? "active" : ""} onClick={() => toggleSection("privacy")}>
              Privacy Policy
            </li>
            <li className={expandedSection === "copyright" ? "active" : ""} onClick={() => toggleSection("copyright")}>
              Copyright Policy
            </li>
            <li className={expandedSection === "community" ? "active" : ""} onClick={() => toggleSection("community")}>
              Community Guidelines
            </li>
            <li className={expandedSection === "licensing" ? "active" : ""} onClick={() => toggleSection("licensing")}>
              Licensing Information
            </li>
          </ul>
        </div>

        <div className="terms-content">
          <div className={`terms-section ${expandedSection === "terms" ? "expanded" : ""}`}>
            <div className="terms-section-header" onClick={() => toggleSection("terms")}>
              <h2>Terms of Service</h2>
              {expandedSection === "terms" ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </div>

            {expandedSection === "terms" && (
              <div className="terms-section-content">
                <h3>1. Acceptance of Terms</h3>
                <p>
                  By accessing or using MusicApp, you agree to be bound by these Terms of Service and all applicable
                  laws and regulations. If you do not agree with any of these terms, you are prohibited from using or
                  accessing this site.
                </p>

                <h3>2. Use License</h3>
                <p>
                  Permission is granted to temporarily download one copy of the materials on MusicApp for personal,
                  non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and
                  under this license you may not:
                </p>
                <ul>
                  <li>Modify or copy the materials</li>
                  <li>Use the materials for any commercial purpose</li>
                  <li>Attempt to decompile or reverse engineer any software contained on MusicApp</li>
                  <li>Remove any copyright or other proprietary notations from the materials</li>
                  <li>Transfer the materials to another person or "mirror" the materials on any other server</li>
                </ul>

                <h3>3. Account Terms</h3>
                <p>
                  To access certain features of the Service, you may be required to create an account. You are
                  responsible for maintaining the confidentiality of your account and password and for restricting
                  access to your computer. You agree to accept responsibility for all activities that occur under your
                  account.
                </p>

                <h3>4. User Content</h3>
                <p>
                  Our Service allows you to post, link, store, share and otherwise make available certain information,
                  text, graphics, videos, or other material. You are responsible for the content that you post to the
                  Service, including its legality, reliability, and appropriateness.
                </p>

                <h3>5. Termination</h3>
                <p>
                  We may terminate or suspend your account and bar access to the Service immediately, without prior
                  notice or liability, under our sole discretion, for any reason whatsoever and without limitation,
                  including but not limited to a breach of the Terms.
                </p>

                <h3>6. Limitation of Liability</h3>
                <p>
                  In no event shall MusicApp, nor its directors, employees, partners, agents, suppliers, or affiliates,
                  be liable for any indirect, incidental, special, consequential or punitive damages, including without
                  limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your
                  access to or use of or inability to access or use the Service.
                </p>

                <h3>7. Changes to Terms</h3>
                <p>
                  We reserve the right, at our sole discretion, to modify or replace these Terms at any time. By
                  continuing to access or use our Service after any revisions become effective, you agree to be bound by
                  the revised terms.
                </p>
              </div>
            )}
          </div>

          <div className={`terms-section ${expandedSection === "privacy" ? "expanded" : ""}`}>
            <div className="terms-section-header" onClick={() => toggleSection("privacy")}>
              <h2>Privacy Policy</h2>
              {expandedSection === "privacy" ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </div>

            {expandedSection === "privacy" && (
              <div className="terms-section-content">
                <h3>1. Information We Collect</h3>
                <p>
                  We collect several different types of information for various purposes to provide and improve our
                  Service to you:
                </p>
                <ul>
                  <li>
                    <strong>Personal Data:</strong> While using our Service, we may ask you to provide us with certain
                    personally identifiable information that can be used to contact or identify you.
                  </li>
                  <li>
                    <strong>Usage Data:</strong> We may also collect information on how the Service is accessed and
                    used.
                  </li>
                  <li>
                    <strong>Tracking & Cookies Data:</strong> We use cookies and similar tracking technologies to track
                    activity on our Service.
                  </li>
                </ul>

                <h3>2. Use of Data</h3>
                <p>MusicApp uses the collected data for various purposes:</p>
                <ul>
                  <li>To provide and maintain our Service</li>
                  <li>To notify you about changes to our Service</li>
                  <li>To provide customer support</li>
                  <li>To gather analysis or valuable information so that we can improve our Service</li>
                  <li>To monitor the usage of our Service</li>
                  <li>To detect, prevent and address technical issues</li>
                </ul>

                <h3>3. Data Security</h3>
                <p>
                  The security of your data is important to us, but remember that no method of transmission over the
                  Internet or method of electronic storage is 100% secure. While we strive to use commercially
                  acceptable means to protect your Personal Data, we cannot guarantee its absolute security.
                </p>

                <h3>4. Your Data Protection Rights</h3>
                <p>
                  You have certain data protection rights. MusicApp aims to take reasonable steps to allow you to
                  correct, amend, delete, or limit the use of your Personal Data.
                </p>
              </div>
            )}
          </div>

          <div className={`terms-section ${expandedSection === "copyright" ? "expanded" : ""}`}>
            <div className="terms-section-header" onClick={() => toggleSection("copyright")}>
              <h2>Copyright Policy</h2>
              {expandedSection === "copyright" ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </div>

            {expandedSection === "copyright" && (
              <div className="terms-section-content">
                <h3>1. DMCA Compliance</h3>
                <p>
                  MusicApp respects the intellectual property rights of others and expects users of the Service to do
                  the same. We will respond to notices of alleged copyright infringement that comply with applicable law
                  and are properly provided to us.
                </p>

                <h3>2. Copyright Infringement Claims</h3>
                <p>
                  If you believe that your copyrighted work has been copied in a way that constitutes copyright
                  infringement, please provide us with the following information:
                </p>
                <ul>
                  <li>
                    A physical or electronic signature of the copyright owner or a person authorized to act on their
                    behalf
                  </li>
                  <li>Identification of the copyrighted work claimed to have been infringed</li>
                  <li>
                    Identification of the material that is claimed to be infringing or to be the subject of infringing
                    activity
                  </li>
                  <li>Your contact information, including your address, telephone number, and an email address</li>
                  <li>
                    A statement by you that you have a good faith belief that use of the material in the manner
                    complained of is not authorized by the copyright owner, its agent, or the law
                  </li>
                  <li>
                    A statement that the information in the notification is accurate, and, under penalty of perjury,
                    that you are authorized to act on behalf of the copyright owner
                  </li>
                </ul>

                <h3>3. Repeat Infringers</h3>
                <p>
                  It is our policy to terminate the user accounts of repeat infringers in appropriate circumstances, at
                  our sole discretion.
                </p>
              </div>
            )}
          </div>

          <div className={`terms-section ${expandedSection === "community" ? "expanded" : ""}`}>
            <div className="terms-section-header" onClick={() => toggleSection("community")}>
              <h2>Community Guidelines</h2>
              {expandedSection === "community" ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </div>

            {expandedSection === "community" && (
              <div className="terms-section-content">
                <h3>1. Respect Other Users</h3>
                <p>
                  Treat others with respect. Do not engage in hate speech, bullying, harassment, or any form of abusive
                  behavior.
                </p>

                <h3>2. Content Standards</h3>
                <p>Do not post content that:</p>
                <ul>
                  <li>
                    Is illegal, harmful, threatening, abusive, harassing, defamatory, or invasive of another's privacy
                  </li>
                  <li>
                    Infringes on any patent, trademark, trade secret, copyright, or other intellectual property rights
                  </li>
                  <li>
                    Contains software viruses or any other computer code designed to interrupt, destroy, or limit the
                    functionality of any computer software or hardware
                  </li>
                  <li>Is sexually explicit, pornographic, or otherwise objectionable</li>
                </ul>

                <h3>3. Sharing Music</h3>
                <p>
                  When sharing music, ensure you have the right to do so. Do not share copyrighted material without
                  proper authorization.
                </p>

                <h3>4. Reporting Violations</h3>
                <p>
                  If you encounter content or behavior that violates these guidelines, please report it to us
                  immediately.
                </p>
              </div>
            )}
          </div>

          <div className={`terms-section ${expandedSection === "licensing" ? "expanded" : ""}`}>
            <div className="terms-section-header" onClick={() => toggleSection("licensing")}>
              <h2>Licensing Information</h2>
              {expandedSection === "licensing" ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </div>

            {expandedSection === "licensing" && (
              <div className="terms-section-content">
                <h3>1. Music Licensing</h3>
                <p>
                  MusicApp has obtained licenses from various rights holders to allow for the streaming of music on our
                  platform. These licenses may include agreements with:
                </p>
                <ul>
                  <li>Record labels</li>
                  <li>Music publishers</li>
                  <li>Performing rights organizations</li>
                  <li>Independent artists</li>
                </ul>

                <h3>2. User-Uploaded Content</h3>
                <p>
                  When you upload content to MusicApp, you grant us a non-exclusive, transferable, sub-licensable,
                  royalty-free, worldwide license to use, reproduce, modify, publish, and distribute such content in
                  connection with our Service.
                </p>

                <h3>3. Third-Party Content</h3>
                <p>
                  Some content available through MusicApp may be owned by third parties. All such third-party content is
                  the responsibility of the respective content owners and may be protected by applicable copyright or
                  other intellectual property laws.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="terms-footer">
        <p>
          If you have any questions about these Terms, please contact us at{" "}
          <a href="mailto:musix.app.team@gmail.com">musix.app.team@gmail.com</a>
        </p>
      </div>
    </div>
  )
}

export default Terms
