import { resumeData } from '../data.js';

export class PortfolioContact extends HTMLElement {
  connectedCallback() {
    this.render();
    this.setupValidation();
  }

  render() {
    const user = resumeData.user;
    this.innerHTML = `
      <section class="contact-section" id="contact">
        <div class="container">
          <div class="section-header">
            <h2 class="section-title">Get In Touch</h2>
            <p class="section-subtitle">Have a project idea, question, or want to collaborate? Send a message!</p>
          </div>
          
          <div class="contact-grid">
            <!-- Left Side: Contact Information Cards -->
            <div class="contact-info">
              <h3 class="contact-info-title">Contact Channels</h3>
              <p class="contact-info-desc">Feel free to reach out via email or telephone, or connect on my social channels. I'm always open to discussing frontend engineering roles, design systems, or freelance opportunities.</p>
              
              <div class="contact-cards-stack">
                <a href="mailto:${user.contact.email}" class="contact-detail-card card">
                  <div class="detail-icon"><i data-lucide="mail"></i></div>
                  <div class="detail-content">
                    <span class="detail-label">Email Address</span>
                    <span class="detail-value">${user.contact.email}</span>
                  </div>
                </a>
                
                <a href="tel:${user.contact.phone.replace(/\s+/g, '')}" class="contact-detail-card card">
                  <div class="detail-icon"><i data-lucide="phone"></i></div>
                  <div class="detail-content">
                    <span class="detail-label">Phone Number</span>
                    <span class="detail-value">${user.contact.phone}</span>
                  </div>
                </a>
                
                <div class="contact-detail-card card">
                  <div class="detail-icon"><i data-lucide="map-pin"></i></div>
                  <div class="detail-content">
                    <span class="detail-label">Work Location</span>
                    <span class="detail-value">India (Open to Remote)</span>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Right Side: Validated Contact Form -->
            <div class="contact-form-wrapper card">
              <h3 class="contact-info-title">Send Message</h3>
              <form id="portfolio-contact-form" novalidate>
                <div class="form-row">
                  <div class="form-group">
                    <label for="form-name" class="form-label">Full Name *</label>
                    <input type="text" id="form-name" name="name" class="form-input" placeholder="Your name" required />
                    <span class="form-error" id="error-name">Please enter your name.</span>
                  </div>
                </div>
                
                <div class="form-row">
                  <div class="form-group">
                    <label for="form-email" class="form-label">Email Address *</label>
                    <input type="email" id="form-email" name="email" class="form-input" placeholder="yourname@domain.com" required />
                    <span class="form-error" id="error-email">Please enter a valid email address.</span>
                  </div>
                </div>
                
                <div class="form-row">
                  <div class="form-group">
                    <label for="form-message" class="form-label">Message *</label>
                    <textarea id="form-message" name="message" class="form-input form-textarea" placeholder="How can I help you?" rows="5" required></textarea>
                    <span class="form-error" id="error-message">Please enter a message.</span>
                  </div>
                </div>
                
                <button type="submit" class="btn btn-primary btn-full">
                  Send Message
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                </button>
              </form>
              
              <div class="form-success-alert card" id="success-alert" style="display: none;">
                <span class="alert-icon"><i data-lucide="sparkles"></i></span>
                <div class="alert-message">
                  <h4>Message Sent Successfully!</h4>
                  <p>Thank you for reaching out. I'll get back to you shortly.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    `;
  }

  setupValidation() {
    const form = this.querySelector('#portfolio-contact-form');
    const successAlert = this.querySelector('#success-alert');
    if (!form) return;

    const nameInput = form.querySelector('#form-name');
    const emailInput = form.querySelector('#form-email');
    const messageInput = form.querySelector('#form-message');

    const nameError = form.querySelector('#error-name');
    const emailError = form.querySelector('#error-email');
    const messageError = form.querySelector('#error-message');

    const validateEmail = (email) => {
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return re.test(email);
    };

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      let isValid = true;

      // Validate Name
      if (!nameInput.value.trim()) {
        nameError.style.display = 'block';
        nameInput.classList.add('invalid');
        isValid = false;
      } else {
        nameError.style.display = 'none';
        nameInput.classList.remove('invalid');
      }

      // Validate Email
      if (!emailInput.value.trim() || !validateEmail(emailInput.value.trim())) {
        emailError.style.display = 'block';
        emailInput.classList.add('invalid');
        isValid = false;
      } else {
        emailError.style.display = 'none';
        emailInput.classList.remove('invalid');
      }

      // Validate Message
      if (!messageInput.value.trim()) {
        messageError.style.display = 'block';
        messageInput.classList.add('invalid');
        isValid = false;
      } else {
        messageError.style.display = 'none';
        messageInput.classList.remove('invalid');
      }

      if (isValid) {
        // Mock successful form submission
        form.style.display = 'none';
        successAlert.style.display = 'flex';
        
        console.log('Form submitted successfully:', {
          name: nameInput.value.trim(),
          email: emailInput.value.trim(),
          message: messageInput.value.trim()
        });

        // Reset form inputs
        form.reset();
      }
    });

    // Clear errors on input
    nameInput.addEventListener('input', () => {
      nameError.style.display = 'none';
      nameInput.classList.remove('invalid');
    });
    emailInput.addEventListener('input', () => {
      emailError.style.display = 'none';
      emailInput.classList.remove('invalid');
    });
    messageInput.addEventListener('input', () => {
      messageError.style.display = 'none';
      messageInput.classList.remove('invalid');
    });
  }
}

customElements.define('portfolio-contact', PortfolioContact);
