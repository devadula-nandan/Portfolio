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
            <p class="section-subtitle">Have a project idea, a job opportunity, or want to collaborate? Drop a line!</p>
          </div>
          
          <div class="contact-grid">
            <!-- Left Side: Contact details -->
            <div class="contact-info">
              <h3 class="contact-info-title">Contact Channels</h3>
              <p class="contact-info-desc">Feel free to reach out via email or phone, or connect on social media. I am always open to discussing design systems, frontend roles, or WCAG accessibility opportunities.</p>
              
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
                    <span class="detail-value">${user.experience?.[0]?.location || 'India (Open to Remote)'}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Right Side: Validated Form -->
            <div class="contact-form-wrapper card animate-fade-in">
              <h3 class="contact-info-title">Send Message</h3>
              <form id="portfolio-contact-form" novalidate autocomplete="off">
                <div class="form-row">
                  <div class="form-group">
                    <label for="form-name" class="form-label">Full Name *</label>
                    <input type="text" id="form-name" name="name" class="form-input" placeholder="Your Name" required />
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
                    <span class="form-error" id="error-message">Please enter your message.</span>
                  </div>
                </div>
                
                <button type="submit" class="btn btn-primary btn-full">
                  Send Message
                  <i data-lucide="send"></i>
                </button>
                <p class="form-hint">Submitting drafts a pre-filled message in your email client. Nothing is saved on this site.</p>
              </form>

              <div class="form-success-alert card" id="success-alert" style="display: none;" role="status">
                <span class="alert-icon"><i data-lucide="sparkles"></i></span>
                <div class="alert-message">
                  <h4>Check your email app!</h4>
                  <p>A message template has been created in your email client. Just click send. Or email me directly at
                     <a href="mailto:${user.contact.email}" class="alert-mail-link">${user.contact.email}</a>.</p>
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
        const name = nameInput.value.trim();
        const email = emailInput.value.trim();
        const message = messageInput.value.trim();

        const subject = encodeURIComponent(`Portfolio contact from ${name}`);
        const body = encodeURIComponent(`${message}\n\n— ${name} (${email})`);
        
        window.location.href = `mailto:${resumeData.user.contact.email}?subject=${subject}&body=${body}`;

        form.style.display = 'none';
        if (successAlert) successAlert.style.display = 'flex';
        form.reset();
      }
    });

    // Clear validation indicators on keypress
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
