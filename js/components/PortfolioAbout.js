import { resumeData, chatResponses, chatFallbackResponse, chatGreeting } from '../data.js';

// Serverless proxy (Vercel) that calls Gemini on the assistant's behalf.
// See chat-proxy/api/chat.js.
const CHAT_API_URL = 'https://portfolio-five-theta-ftdhmviqc3.vercel.app/api/chat';
const HEALTH_API_URL = CHAT_API_URL.replace(/\/chat$/, '/health');
const CHAT_API_TIMEOUT_MS = 8000;
const HEALTH_CHECK_TIMEOUT_MS = 4000;

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
    const statusDot = this.querySelector('#chat-status-dot');
    const statusText = this.querySelector('#chat-status-text');

    if (!messagesContainer || !inputForm || !userInput) return;

    const user = resumeData.user;

    // Reflects whether replies are actually coming from Gemini ('online') or
    // the local keyword-matched fallback ('local') — not just decorative.
    const setChatStatus = (state) => {
      if (!statusDot || !statusText) return;
      statusDot.classList.toggle('is-local', state === 'local');
      statusText.textContent = state === 'online' ? 'AGENT_ONLINE' : 'LOCAL_MODE';
    };

    const checkChatHealth = async () => {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), HEALTH_CHECK_TIMEOUT_MS);
      try {
        const res = await fetch(HEALTH_API_URL, { signal: controller.signal });
        const data = await res.json();
        setChatStatus(res.ok && data.ok ? 'online' : 'local');
      } catch (err) {
        setChatStatus('local');
      } finally {
        clearTimeout(timeout);
      }
    };

    checkChatHealth();

    const chatCard = this.querySelector('.about-chat-card');
    const fullscreenBtn = this.querySelector('#chat-fullscreen-btn');

    if (chatCard && fullscreenBtn) {
      const setFullscreen = (isFullscreen) => {
        chatCard.classList.toggle('is-fullscreen', isFullscreen);
        document.body.classList.toggle('chat-fullscreen-lock', isFullscreen);
        fullscreenBtn.setAttribute('aria-pressed', String(isFullscreen));
        fullscreenBtn.setAttribute('aria-label', isFullscreen ? 'Exit fullscreen chat' : 'Expand chat to fullscreen');
        fullscreenBtn.innerHTML = `<i data-lucide="${isFullscreen ? 'minimize-2' : 'maximize-2'}" class="fullscreen-icon"></i>`;
        if (window.lucide) {
          window.lucide.createIcons();
        }
        messagesContainer.scrollTo({ top: messagesContainer.scrollHeight, behavior: 'auto' });
      };

      fullscreenBtn.addEventListener('click', () => {
        setFullscreen(!chatCard.classList.contains('is-fullscreen'));
      });

      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && chatCard.classList.contains('is-fullscreen')) {
          setFullscreen(false);
        }
      });
    }

    const getBotResponse = (query) => {
      const q = query.toLowerCase().trim();
      const match = chatResponses.find(r => r.keywords.some(k => q.includes(k)));
      return match ? match.reply(user) : chatFallbackResponse;
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

    const showTypingIndicator = () => {
      const typingDiv = document.createElement('div');
      typingDiv.classList.add('chat-message', 'bot', 'typing-indicator-msg');
      typingDiv.setAttribute('aria-hidden', 'true');
      typingDiv.innerHTML = `<div class="msg-bubble typing-dots">
        <span></span><span></span><span></span>
      </div>`;
      messagesContainer.appendChild(typingDiv);
      return typingDiv;
    };

    const getAiResponse = async (queryText) => {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), CHAT_API_TIMEOUT_MS);
      try {
        const res = await fetch(CHAT_API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: queryText }),
          signal: controller.signal,
        });
        if (!res.ok) throw new Error(`Chat proxy responded with ${res.status}`);
        const data = await res.json();
        return data.reply;
      } finally {
        clearTimeout(timeout);
      }
    };

    const triggerBotResponse = async (queryText) => {
      const typingDiv = showTypingIndicator();
      messagesContainer.scrollTo({ top: messagesContainer.scrollHeight, behavior: 'smooth' });

      let reply;
      try {
        reply = await getAiResponse(queryText);
        setChatStatus('online');
      } catch (err) {
        // Proxy unreachable, rate-limited, or slow — fall back to local answers
        // so the widget never looks broken.
        reply = getBotResponse(queryText);
        setChatStatus('local');
      }

      typingDiv.remove();
      addMessage(reply, 'bot', true);
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

    const scrollObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !greetingRun) {
          greetingRun = true;
          scrollObserver.unobserve(entry.target);

          const typingDiv = showTypingIndicator();
          setTimeout(() => {
            typingDiv.remove();
            addMessage(chatGreeting, 'bot', true);
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
                  <div class="chat-title">
                    <i data-lucide="file-code-2" class="chat-title-icon"></i>
                    <span>assistant.ts</span>
                  </div>
                  <div class="chat-header-actions">
                    <div class="chat-status">
                      <span class="chat-status-dot" id="chat-status-dot"></span>
                      <span id="chat-status-text">CONNECTING...</span>
                    </div>
                    <button type="button" class="chat-fullscreen-btn" id="chat-fullscreen-btn" aria-label="Expand chat to fullscreen" aria-pressed="false">
                      <i data-lucide="maximize-2" class="fullscreen-icon"></i>
                    </button>
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
