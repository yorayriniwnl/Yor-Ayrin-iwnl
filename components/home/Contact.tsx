'use client'

import { useState } from 'react'

type ContactForm = { name: string; email: string; msg: string }

/**
 * Contact
 *
 * Two-column contact section with link list and inline form.
 * Needs 'use client' for:
 *   - useState (controlled form inputs)
 *   - sendMessage handler (button onClick)
 */
export default function Contact() {
  const [form, setForm] = useState<ContactForm>({ name: '', email: '', msg: '' })

  const sendMessage = () => {
    if (!form.name.trim() && !form.msg.trim()) {
      alert('Fill in your message first.')
      return
    }
    alert(`Message sent from: ${form.name || 'Anonymous'}`)
  }

  return (
    <section className="contact" id="contact">
      <div className="section-wrap">
        <div className="contact-inner">
          {/* ── Left column ── */}
          <div className="contact-left">
            <div className="section-label">Get in Touch</div>
            <h2 className="contact-heading">
              Let&apos;s build something <em>real.</em>
            </h2>
            <p className="contact-desc">
              Open to verified opportunities and collaboration conversations. If
              you&apos;re building something worth building, let&apos;s talk.
            </p>

            <div className="contact-links">
              <a
                className="contact-link-row"
                href="mailto:yorayriniwnl@gmail.com"
              >
                <span className="contact-link-label">Email</span>
                <span className="contact-link-val">yorayriniwnl@gmail.com</span>
                <span className="contact-link-arrow">-&gt;</span>
              </a>
              <a
                className="contact-link-row"
                href="https://github.com/yorayriniwnl"
                target="_blank"
                rel="noreferrer"
              >
                <span className="contact-link-label">GitHub</span>
                <span className="contact-link-val">
                  github.com/yorayriniwnl
                </span>
                <span className="contact-link-arrow">-&gt;</span>
              </a>
              <a
                className="contact-link-row"
                href="https://linkedin.com/in/yorayriniwnl"
                target="_blank"
                rel="noreferrer"
              >
                <span className="contact-link-label">LinkedIn</span>
                <span className="contact-link-val">
                  linkedin.com/in/yorayriniwnl
                </span>
                <span className="contact-link-arrow">-&gt;</span>
              </a>
              <a
                className="contact-link-row"
                href="/resume.pdf"
                target="_blank"
                rel="noreferrer"
              >
                <span className="contact-link-label">Resume</span>
                <span className="contact-link-val">Download PDF</span>
                <span className="contact-link-arrow">download</span>
              </a>
            </div>
          </div>

          {/* ── Right column — form ── */}
          <div className="contact-right">
            <div className="contact-form">
              <div className="contact-form-bar">
                <span className="contact-form-title">send-message.md</span>
                <div className="form-dots">
                  <div className="form-dot" />
                  <div className="form-dot" />
                  <div className="form-dot" />
                </div>
              </div>

              <div className="form-field">
                <label htmlFor="contactName">Your Name</label>
                <input
                  id="contactName"
                  type="text"
                  placeholder="Who am I speaking to?"
                  value={form.name}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, name: e.target.value }))
                  }
                />
              </div>

              <div className="form-field">
                <label htmlFor="contactEmail">Email</label>
                <input
                  id="contactEmail"
                  type="email"
                  placeholder="Where should I reply?"
                  value={form.email}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, email: e.target.value }))
                  }
                />
              </div>

              <div className="form-field">
                <label htmlFor="contactMsg">Message</label>
                <textarea
                  id="contactMsg"
                  placeholder="What are you building? What's the opportunity?"
                  value={form.msg}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, msg: e.target.value }))
                  }
                />
              </div>

              <div className="form-footer">
                <span className="form-note">Response within 24-48 hours</span>
                <button className="btn-send" onClick={sendMessage}>
                  Send Message
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
