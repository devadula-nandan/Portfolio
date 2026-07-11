import { resumeData } from '../data.js';

export class PortfolioAbout extends HTMLElement {
  connectedCallback() {
    this.render();
    this.initChatAssistant();
  }

  initChatAssistant() {
    const messagesContainer = this.querySelector('#chat-messages-container');
    const inputForm = this.querySelector('#chat-input-form');
    const userInput = this.querySelector('#chat-user-input');
    const chips = this.querySelectorAll('.chat-chip');

    if (!messagesContainer || !inputForm || !userInput) return;

    const user = resumeData.user;
    const cvLink = user.cv;

    // Chatbot responses mapping
    const getBotResponse = (query) => {
      const q = query.toLowerCase().trim();

      if (q.includes('yourself') || q.includes('who are you') || q.includes('bio') || q.includes('introduction') || q.includes('about me')) {
        return `I am Nandan Devadula, a Frontend Developer at IBM Kochi. I specialize in building enterprise-grade design systems, accessible Web Components, and scalable modular libraries. I bridge the gap between design concepts and production-ready, WCAG-compliant frontend implementations.`;
      }

      if (q.includes('ibm') || q.includes('carbon') || q.includes('labs') || q.includes('design system')) {
        return `At IBM, I work with the <strong>Carbon Design System</strong> team. I develop accessible, enterprise-grade components for <em>Carbon for IBM Products</em> and <em>Carbon for AI</em>, write high-coverage unit & E2E tests (Playwright, Jest), and prototype new UI paradigms in Carbon Labs.`;
      }
      
      if (q.includes('stack') || q.includes('tech') || q.includes('skill') || q.includes('framework') || q.includes('react') || q.includes('lit') || q.includes('typescript')) {
        return `My technical stack is centered around frontend engineering: 
        <ul>
          <li><strong>Languages:</strong> JavaScript, TypeScript, CSS/SCSS, HTML5</li>
          <li><strong>UI Frameworks:</strong> Web Components (Lit, native), React.js, Redux</li>
          <li><strong>Testing/A11y:</strong> Jest, Cypress, Playwright, WCAG, WAI-ARIA</li>
          <li><strong>Enterprise:</strong> Carbon Design System, Tailwind CSS</li>
        </ul>`;
      }
      
      if (q.includes('contact') || q.includes('email') || q.includes('phone') || q.includes('hire') || q.includes('reach') || q.includes('cv') || q.includes('resume')) {
        return `You can reach me directly at <a href="mailto:${user.contact.email}" class="chat-link">${user.contact.email}</a> or call me at <strong>${user.contact.phone}</strong>. You can also view and download my official resume here: <a href="${cvLink}" target="_blank" rel="noopener noreferrer" class="chat-link">View CV <i data-lucide="external-link"></i></a>.`;
      }

      if (q.includes('experience') || q.includes('work') || q.includes('hcl') || q.includes('history') || q.includes('job')) {
        return `I have over <strong>5 years</strong> of professional experience:
        <ul>
          <li><strong>IBM</strong> (2023 - Present): Frontend Developer on Carbon Design System.</li>
          <li><strong>HCL Technologies</strong> (2022 - 2023): Software Engineer building dashboard UIs & REST APIs.</li>
          <li><strong>Ochre Media</strong> (2021 - 2022): Web UI Developer creating client microsites.</li>
        </ul>`;
      }

      if (q.includes('a11y') || q.includes('accessib') || q.includes('wcag') || q.includes('screen reader') || q.includes('aria')) {
        return `I am an <strong>Accessibility Advocate</strong>. I design components compliant with WCAG 2.1 AA/AAA standards, meaning I build proper keyboard navigation, manage interactive focus outlines, ensure high-contrast colors, and implement semantic WAI-ARIA roles.`;
      }

      if (q.includes('project') || q.includes('repo') || q.includes('code') || q.includes('github') || q.includes('wc-')) {
        return `I have created over 40 GitHub repositories! Highlights include:
        <ul>
          <li><strong>wc-audio-input:</strong> Audio input web component supporting speech-to-text.</li>
          <li><strong>wc-resizer:</strong> Lightweight container layout resizer.</li>
          <li><strong>storybook-theme-carbon:</strong> Themes matching IBM's Carbon aesthetics.</li>
        </ul>
        Check them out in the Projects section below or visit my <a href="${user.social.github}" target="_blank" class="chat-link">GitHub Profile</a>.`;
      }

      if (q.includes('education') || q.includes('college') || q.includes('degree') || q.includes('university') || q.includes('graduate')) {
        return `I hold a <strong>Bachelor of Engineering (B.E.)</strong> in Electronics & Communication from Andhra University (Gayatri Vidya Parishad College), and a certificate in Software Development from Great Learning.`;
      }

      if (q.includes('hello') || q.includes('hi') || q.includes('hey') || q.includes('greet') || q.includes('greetings')) {
        return `Hello! How can I help you? Ask me about my work at IBM Carbon, my software engineering experience, skills, or projects.`;
      }

      // Default fallback
      return `Interesting question! I am specialized to talk about my tech stack, IBM design systems contributions, projects, and career history. Try asking:
      <br/>- <em>"What is your tech stack?"</em>
      <br/>- <em>"What do you do at IBM?"</em>
      <br/>- <em>"How can I contact you?"</em>`;
    };

    const addMessage = (text, sender, shouldType = false) => {
      const msgDiv = document.createElement('div');
      msgDiv.classList.add('chat-message', sender);
      
      const bubble = document.createElement('div');
      bubble.classList.add('msg-bubble');
      msgDiv.appendChild(bubble);
      messagesContainer.appendChild(msgDiv);

      if (shouldType) {
        let currentText = '';
        let i = 0;
        let isTag = false;
        
        const interval = setInterval(() => {
          if (i >= text.length) {
            clearInterval(interval);
            if (window.lucide) {
              window.lucide.createIcons();
            }
            return;
          }
          
          const char = text[i];
          if (char === '<') {
            isTag = true;
          }
          
          currentText += char;
          
          if (char === '>') {
            isTag = false;
          }
          
          i++;
          
          if (isTag) return;
          
          bubble.innerHTML = currentText;
          messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }, 12); // Typing speed
      } else {
        bubble.innerHTML = text;
        if (window.lucide) {
          window.lucide.createIcons();
        }
        messagesContainer.scrollTo({
          top: messagesContainer.scrollHeight,
          behavior: 'smooth'
        });
      }
    };

    const triggerBotResponse = (queryText) => {
      // 1. Show Typing Indicator
      const typingDiv = document.createElement('div');
      typingDiv.classList.add('chat-message', 'bot', 'typing-indicator-msg');
      typingDiv.setAttribute('aria-hidden', 'true');
      typingDiv.innerHTML = `<div class="msg-bubble typing-dots">
        <span></span><span></span><span></span>
      </div>`;
      messagesContainer.appendChild(typingDiv);
      messagesContainer.scrollTo({ top: messagesContainer.scrollHeight, behavior: 'smooth' });

      // 2. Resolve response after short mock typing delay
      setTimeout(() => {
        typingDiv.remove();
        const reply = getBotResponse(queryText);
        addMessage(reply, 'bot', true);
      }, 750);
    };

    const handleUserSend = (text) => {
      if (!text.trim()) return;
      addMessage(text, 'user');
      triggerBotResponse(text);
    };

    // Form submission listener
    inputForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const text = userInput.value;
      userInput.value = '';
      handleUserSend(text);
    });

    // Chip click listeners
    chips.forEach(chip => {
      chip.addEventListener('click', () => {
        const question = chip.getAttribute('data-question');
        if (question) {
          handleUserSend(question);
        }
      });
    });

    // IntersectionObserver to trigger initial message typing when scrolled into view
    let greetingRun = false;
    const greetingText = "Hi! I am Nandan's virtual assistant. Ask me anything about my frontend engineering background, open-source work at IBM Carbon, or skills!";
    
    const scrollObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !greetingRun) {
          greetingRun = true;
          scrollObserver.unobserve(entry.target);
          
          // Trigger Bot typing indicator
          const typingDiv = document.createElement('div');
          typingDiv.classList.add('chat-message', 'bot', 'typing-indicator-msg');
          typingDiv.setAttribute('aria-hidden', 'true');
          typingDiv.innerHTML = `<div class="msg-bubble typing-dots">
            <span></span><span></span><span></span>
          </div>`;
          messagesContainer.appendChild(typingDiv);
          
          setTimeout(() => {
            typingDiv.remove();
            addMessage(greetingText, 'bot', true);
          }, 800);
        }
      });
    }, {
      root: null,
      threshold: 0.15 // Trigger when 15% of the section is visible
    });

    const aboutSection = this.querySelector('#about');
    if (aboutSection) {
      scrollObserver.observe(aboutSection);
    }
  }

  render() {
    const user = resumeData.user;
    const highlights = user.highlights;
    
    const yExp = highlights[0]?.label || '5+ Years';
    const yExpSub = highlights[0]?.sublabel || 'Frontend Engineering';
    const carbonRole = highlights[1]?.label || 'IBM Carbon';
    const carbonSub = highlights[1]?.sublabel || 'Open Source Contributor';
    const repoCount = highlights[2]?.label || '40+';
    const repoSub = highlights[2]?.sublabel || 'GitHub Repositories';
    const wcagRole = highlights[3]?.label || 'WCAG';
    const wcagSub = highlights[3]?.sublabel || 'Accessibility Advocate';

    this.innerHTML = `
      <section class="about-section" id="about">
        <div class="container">
          <div class="section-header">
            <h2 class="section-title">About Me</h2>
            <p class="section-subtitle">Bridging pixel-perfect design assets with clean, highly accessible, and modular systems</p>
          </div>
          
          <div class="about-dashboard">
            <!-- COLUMN 1: Chat Assistant Panel -->
            <div class="about-panel chat-panel">

              <!-- Interactive Chat Assistant -->
              <div class="about-chat-card card">
                <div class="chat-header">
                  <div class="chat-tabs">
                    <div class="chat-tab active">
                      <i data-lucide="file-code-2" class="tab-icon"></i>
                      <span>assistant.ts</span>
                      <span class="tab-close">×</span>
                    </div>
                  </div>
                  <div class="chat-status">
                    <span class="chat-status-dot"></span>
                    <span>AGENT_ONLINE</span>
                  </div>
                </div>
                
                <div class="chat-body">
                  <div class="chat-messages" id="chat-messages-container" aria-live="polite" aria-atomic="false">
                    <!-- Initial message typed dynamically on scroll observer -->
                  </div>
                  
                  <div class="chat-chips">
                    <button class="chat-chip" data-question="Tell me about yourself">Tell me about yourself</button>
                    <button class="chat-chip" data-question="What is your tech stack?">Tech Stack</button>
                    <button class="chat-chip" data-question="What do you do at IBM?">IBM Carbon Work</button>
                    <button class="chat-chip" data-question="How can I contact you?">Get in Touch</button>
                  </div>

                  <form class="chat-input-wrapper" id="chat-input-form">
                    <span class="chat-prompt-prefix font-mono">$</span>
                    <input type="text" id="chat-user-input" class="chat-input" placeholder="Type a message or click a chip..." required autocomplete="off" />
                    <button type="submit" class="chat-send-btn" aria-label="Send message">
                      <i data-lucide="send" class="send-icon-img"></i>
                    </button>
                  </form>
                </div>
              </div>
            </div>

            <!-- COLUMN 2: Philosophy & Telemetry Grid -->
            <div class="about-panel details-panel">

              <div class="pillars-grid">
                <!-- Pillar 1 -->
                <div class="pillar-card card">
                  <div class="pillar-header">
                    <div class="pillar-icon-box"><i data-lucide="cpu"></i></div>
                    <h4 class="pillar-title">Component Architecture</h4>
                  </div>
                  <p class="pillar-desc">Designing modular Web Components and React libraries using Lit and TypeScript that serve as the single source of truth for design patterns.</p>
                  <div class="pillar-badge-strip">
                    <span class="badge">Lit</span>
                    <span class="badge">TypeScript</span>
                    <span class="badge">Carbon Labs</span>
                  </div>
                </div>

                <!-- Pillar 2 -->
                <div class="pillar-card card">
                  <div class="pillar-header">
                    <div class="pillar-icon-box"><i data-lucide="eye"></i></div>
                    <h4 class="pillar-title">Inclusive & A11y First</h4>
                  </div>
                  <p class="pillar-desc">Building interfaces compliant with WCAG 2.1 standards. Ensuring keyboard support, screen-reader patterns, and automated accessibility testing.</p>
                  <div class="pillar-badge-strip">
                    <span class="badge">WCAG 2.1</span>
                    <span class="badge">WAI-ARIA</span>
                    <span class="badge">Playwright</span>
                  </div>
                </div>
              </div>

              <!-- Telemetry Stats Dashboard Grid -->
              <div class="telemetry-dashboard">
                <div class="telemetry-grid">
                  <div class="telemetry-card card">
                    <div class="telemetry-lines"></div>
                    <div class="telemetry-meta">METRIC // CHRONO</div>
                    <div class="telemetry-value">${yExp}</div>
                    <div class="telemetry-label">${yExpSub}</div>
                  </div>
                  <div class="telemetry-card card">
                    <div class="telemetry-lines"></div>
                    <div class="telemetry-meta">METRIC // CONTRIB</div>
                    <div class="telemetry-value">${carbonRole}</div>
                    <div class="telemetry-label">${carbonSub}</div>
                  </div>
                  <div class="telemetry-card card">
                    <div class="telemetry-lines"></div>
                    <div class="telemetry-meta">METRIC // CODEBASE</div>
                    <div class="telemetry-value" id="about-repos-count">${repoCount}</div>
                    <div class="telemetry-label">${repoSub}</div>
                  </div>
                  <div class="telemetry-card card">
                    <div class="telemetry-lines"></div>
                    <div class="telemetry-meta">METRIC // AUDIT</div>
                    <div class="telemetry-value">${wcagRole}</div>
                    <div class="telemetry-label">${wcagSub}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    `;
  }
}

customElements.define('portfolio-about', PortfolioAbout);
