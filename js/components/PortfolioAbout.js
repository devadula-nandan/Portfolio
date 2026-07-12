import {
  resumeData,
  chatResponses,
  chatFallbackResponse,
  chatGreeting,
} from "../data.js";

const CHAT_API_URL = "/api/chat";
const HEALTH_API_URL = "/api/health";
const CHAT_API_TIMEOUT_MS = 8000;
const HEALTH_CHECK_TIMEOUT_MS = 4000;

export class PortfolioAbout extends HTMLElement {
  connectedCallback() {
    this.render();
    this.initChatAssistant();
    this.initChatControls();
    this.checkProxyHealth();
  }

  render() {
    const user = resumeData.user;
    
    // Render highlights list
    const highlightsHTML = user.highlights.map(h => `
      <div class="highlight-card card">
        <span class="highlight-label">${h.label}</span>
        <span class="highlight-sublabel">${h.sublabel}</span>
      </div>
    `).join('');

    this.innerHTML = `
      <section class="about-section" id="about">
        <div class="container">
          <div class="about-grid">
            <!-- Left Side: Profile & Bio Details -->
            <div class="about-info">
              <div class="section-header">
                <h2 class="section-title">About Me</h2>
                <p class="section-subtitle">A brief overview of my professional focus and experience highlights</p>
              </div>
              <p class="about-desc">
                ${user.description}
              </p>
              <div class="about-highlights">
                ${highlightsHTML}
              </div>
            </div>

            <!-- Right Side: Clean Chat Assistant -->
            <div class="about-chat-card card">
              <div class="chat-header">
                <div class="chat-header-user">
                  <img src="${user.avatar}" alt="${user.firstName}" class="chat-avatar" />
                  <div class="chat-header-title">
                    <h4>${user.firstName}'s Assistant</h4>
                    <div class="chat-status">
                      <span class="chat-status-dot"></span>
                      <span id="chat-status-text">Checking...</span>
                    </div>
                  </div>
                </div>
                <div class="chat-header-actions">
                  <button type="button" class="chat-icon-btn" id="chat-reset-btn" aria-label="Reset conversation" title="Reset conversation">
                    <i data-lucide="rotate-ccw" style="width:16px; height:16px;"></i>
                  </button>
                  <button type="button" class="chat-icon-btn" id="chat-expand-btn" aria-label="Expand chat to fullscreen" aria-expanded="false" title="Expand">
                    <i data-lucide="maximize-2" class="chat-icon-expand" style="width:16px; height:16px;"></i>
                    <i data-lucide="minimize-2" class="chat-icon-collapse" style="width:16px; height:16px;"></i>
                  </button>
                </div>
              </div>
              
              <div class="chat-messages" id="chat-messages-container"></div>
              
              <div class="chat-input-area">
                <form class="chat-form" id="chat-input-form">
                  <div class="chat-input-wrapper">
                    <input 
                      type="text" 
                      id="chat-user-input" 
                      class="chat-input" 
                      placeholder="Ask about stack, experience, contact..." 
                      required 
                      autocomplete="off"
                    />
                    <button type="submit" class="chat-submit-btn" aria-label="Send Message">
                      <i data-lucide="send"></i>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    `;
  }

  async checkProxyHealth() {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), HEALTH_CHECK_TIMEOUT_MS);
    try {
      const res = await fetch(HEALTH_API_URL, { signal: controller.signal });
      const data = await res.json();
      if (res.ok && data.ok) {
        this.setChatStatus("online");
      } else {
        this.setChatStatus("local");
      }
    } catch (err) {
      this.setChatStatus("local");
    } finally {
      clearTimeout(timeout);
    }
  }

  setChatStatus(state) {
    const statusDot = this.querySelector('.chat-status-dot');
    const statusText = this.querySelector('#chat-status-text');
    if (!statusDot || !statusText) return;

    if (state === "online") {
      statusDot.classList.remove('is-local');
      statusText.textContent = "AGENT_ONLINE";
    } else {
      statusDot.classList.add('is-local');
      statusText.textContent = "LOCAL_MODE";
    }
  }

  initChatControls() {
    const card = this.querySelector('.about-chat-card');
    const expandBtn = this.querySelector('#chat-expand-btn');
    const resetBtn = this.querySelector('#chat-reset-btn');
    const container = this.querySelector('#chat-messages-container');
    const input = this.querySelector('#chat-user-input');
    if (!card || !expandBtn || !resetBtn || !container) return;

    const cardRadius = getComputedStyle(card).borderRadius;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const DURATION = reduceMotion ? 0 : 450;
    const TRANSITION = ['top', 'left', 'width', 'height', 'border-radius']
      .map(p => `${p} ${DURATION}ms cubic-bezier(0.4, 0, 0.2, 1)`)
      .join(', ');

    let placeholder = null;
    let expanded = false;
    let animating = false;

    const setGeometry = (rect) => {
      card.style.top = `${rect.top}px`;
      card.style.left = `${rect.left}px`;
      card.style.width = `${rect.width}px`;
      card.style.height = `${rect.height}px`;
    };

    const clearInlineStyles = () => {
      ['position', 'top', 'left', 'width', 'height', 'margin',
       'zIndex', 'borderRadius', 'transition'].forEach(p => { card.style[p] = ''; });
    };

    // transitionend can be missed (e.g. tab hidden), so a timeout backstops it
    const afterTransition = (fn) => {
      let called = false;
      const run = () => { if (!called) { called = true; fn(); } };
      const onEnd = (e) => {
        if (e.target !== card) return;
        card.removeEventListener('transitionend', onEnd);
        run();
      };
      card.addEventListener('transitionend', onEnd);
      setTimeout(run, DURATION + 100);
    };

    const expand = () => {
      if (animating || expanded) return;
      animating = true;

      const rect = card.getBoundingClientRect();
      placeholder = document.createElement('div');
      placeholder.style.height = `${rect.height}px`;
      card.parentNode.insertBefore(placeholder, card);

      // Pin the card at its current viewport rect, then transition to inset 0
      card.style.transition = 'none';
      card.style.position = 'fixed';
      card.style.zIndex = '2000';
      card.style.margin = '0';
      setGeometry(rect);
      card.classList.add('is-fullscreen');
      void card.offsetWidth;

      card.style.transition = TRANSITION;
      setGeometry({ top: 0, left: 0, width: window.innerWidth, height: window.innerHeight });
      card.style.borderRadius = '0px';
      document.body.classList.add('no-scroll');
      expandBtn.setAttribute('aria-expanded', 'true');
      expandBtn.setAttribute('title', 'Exit fullscreen');

      afterTransition(() => {
        // Hand geometry over to the .is-fullscreen class so resize keeps working
        clearInlineStyles();
        expanded = true;
        animating = false;
      });
    };

    const collapse = () => {
      if (animating || !expanded) return;
      animating = true;

      const target = placeholder.getBoundingClientRect();
      card.style.transition = 'none';
      card.style.position = 'fixed';
      card.style.zIndex = '2000';
      card.style.margin = '0';
      setGeometry(card.getBoundingClientRect());
      card.style.borderRadius = '0px';
      card.classList.remove('is-fullscreen');
      void card.offsetWidth;

      card.style.transition = TRANSITION;
      setGeometry(target);
      card.style.borderRadius = cardRadius;
      document.body.classList.remove('no-scroll');
      expandBtn.setAttribute('aria-expanded', 'false');
      expandBtn.setAttribute('title', 'Expand');

      afterTransition(() => {
        clearInlineStyles();
        if (placeholder) { placeholder.remove(); placeholder = null; }
        expanded = false;
        animating = false;
      });
    };

    expandBtn.addEventListener('click', () => (expanded ? collapse() : expand()));

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && expanded) collapse();
    });

    resetBtn.addEventListener('click', () => {
      container.innerHTML = `
        <div class="chat-message assistant">
          <p>${chatGreeting}</p>
        </div>
      `;
      if (input) input.value = '';
    });

    // Deep link: /?chat=fullscreen#about opens the chat expanded
    if (new URLSearchParams(window.location.search).get('chat') === 'fullscreen') {
      requestAnimationFrame(() => expand());
    }
  }

  initChatAssistant() {
    const container = this.querySelector('#chat-messages-container');
    const form = this.querySelector('#chat-input-form');
    const input = this.querySelector('#chat-user-input');
    if (!container || !form || !input) return;

    const user = resumeData.user;

    const appendMessage = (text, sender) => {
      const msgDiv = document.createElement('div');
      msgDiv.className = `chat-message ${sender}`;
      msgDiv.innerHTML = text;
      container.appendChild(msgDiv);
      container.scrollTop = container.scrollHeight;
    };

    // Types the reply's plain text with a caret, then swaps in the
    // formatted HTML (bold, links, icons) once finished
    const typeMessage = (html) => new Promise((resolve) => {
      const msgDiv = document.createElement('div');
      msgDiv.className = 'chat-message assistant is-typing';
      // Type into an inner <p> so the caret flows inline with the text
      // (.chat-message is a column flexbox — a caret directly on it wraps to its own row)
      const p = document.createElement('p');
      msgDiv.appendChild(p);
      container.appendChild(msgDiv);

      const tmp = document.createElement('div');
      tmp.innerHTML = html;
      const text = tmp.textContent;
      const step = Math.max(1, Math.round(text.length / 120)); // ~2s regardless of length
      let i = 0;

      const iv = setInterval(() => {
        i += step;
        p.textContent = text.slice(0, i);
        container.scrollTop = container.scrollHeight;
        if (i >= text.length) {
          clearInterval(iv);
          msgDiv.classList.remove('is-typing');
          msgDiv.innerHTML = html;
          container.scrollTop = container.scrollHeight;
          resolve();
        }
      }, 18);
    });

    // Type the greeting once the chat card is fully scrolled into view
    const card = this.querySelector('.about-chat-card');
    const greetObserver = new IntersectionObserver((entries) => {
      if (!entries[0].isIntersecting) return;
      greetObserver.disconnect();
      if (container.children.length === 0) typeMessage(`<p>${chatGreeting}</p>`);
    }, { threshold: 0.98 });
    greetObserver.observe(card);

    const showTypingIndicator = () => {
      const indDiv = document.createElement('div');
      indDiv.className = 'chat-message assistant typing-indicator-msg';
      indDiv.id = 'typing-indicator';
      indDiv.innerHTML = `
        <span style="display:inline-flex; gap:4px; align-items:center;">
          <span class="typing-dot" style="width:5px; height:5px; background:var(--text-muted); border-radius:50%; animation: blink 1.2s infinite 0.1s;"></span>
          <span class="typing-dot" style="width:5px; height:5px; background:var(--text-muted); border-radius:50%; animation: blink 1.2s infinite 0.2s;"></span>
          <span class="typing-dot" style="width:5px; height:5px; background:var(--text-muted); border-radius:50%; animation: blink 1.2s infinite 0.3s;"></span>
        </span>
      `;
      container.appendChild(indDiv);
      container.scrollTop = container.scrollHeight;
    };

    const removeTypingIndicator = () => {
      const ind = this.querySelector('#typing-indicator');
      if (ind) ind.remove();
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

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const messageText = input.value.trim();
      if (!messageText) return;

      // Append user message
      appendMessage(messageText, 'user');
      input.value = '';

      showTypingIndicator();

      let reply;
      try {
        reply = await getAiResponse(messageText);
        this.setChatStatus("online");
      } catch (err) {
        console.warn("Proxy query failed, falling back to local chat responses.", err);
        const query = messageText.toLowerCase();
        let matchedReply = null;

        for (const response of chatResponses) {
          const matches = response.keywords.some(keyword => query.includes(keyword));
          if (matches) {
            matchedReply = response.reply(user);
            break;
          }
        }
        reply = matchedReply || chatFallbackResponse;
        this.setChatStatus("local");
      }

      removeTypingIndicator();
      await typeMessage(reply);

      if (window.lucide) {
        window.lucide.createIcons();
      }
    });
  }
}

customElements.define('portfolio-about', PortfolioAbout);
