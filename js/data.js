/**
 * Portfolio Static Data — Fallback & Source of Truth
 *
 * This mirrors the JSON embedded in the GitHub profile README at:
 * https://github.com/devadula-nandan/devadula-nandan
 *
 * api.js fetches the README at runtime and parses the JSON comment.
 * This file serves as the offline fallback if that fetch fails.
 *
 * Schema version: 2.0
 */
export const resumeData = {
  "user": {
    "firstName": "Nandan",
    "lastName": "Devadula",
    "avatar": "https://avatars.githubusercontent.com/u/47176249?s=400&u=b878a616fb5166ee40288fd3dbd77182b2e0eb2e&v=4",
    "headline": "Frontend Developer at IBM · Carbon Design System · Web Components · TypeScript",
    "titles": [
      "Frontend Developer at IBM",
      "Carbon Design System Engineer",
      "Web Components Prototyper"
    ],
    "social": {
      "instagram": "https://www.instagram.com/d.nandan.1996",
      "linkedin": "https://www.linkedin.com/in/nandan-devadula",
      "github": "https://github.com/devadula-nandan"
    },
    "description": "Frontend Developer at IBM, building enterprise-grade web components and design systems used by hundreds of IBM products globally. I work on Carbon for IBM Products and Carbon for AI — contributions that directly shape the user experience of enterprise software at scale. Previously at HCLTech delivering financial dashboards and real-time data UIs. I care deeply about accessibility (WCAG), component modularity, and crafting interfaces that are pixel-perfect and inclusive by design.",
    "cv": "https://drive.google.com/file/d/1gtAMviM329eqGWURrzCcOWMZM2PIkAjC/view?usp=sharing",
    "contact": {
      "email": "devadula.nandan@gmail.com",
      "phone": "+91 7032328703"
    },
    "highlights": [
      { "label": "5+ Years", "sublabel": "Frontend Engineering" },
      { "label": "IBM Carbon", "sublabel": "Open Source Contributor" },
      { "label": "40+",        "sublabel": "GitHub Repositories" },
      { "label": "WCAG",      "sublabel": "Accessibility Advocate" }
    ],
    "commonSkills": {
      "Frontend":        92,
      "Web Components":  88,
      "Testing & A11y":  80,
      "Backend / APIs":  62
    },
    "specificSkills": {
      "React.js":             88,
      "TypeScript":           82,
      "JavaScript":           90,
      "Web Components":       90,
      "Lit":                  80,
      "CSS / SCSS":           85,
      "HTML5":                90,
      "Carbon Design System": 85,
      "Tailwind CSS":         78,
      "Redux.js":             75,
      "Jest":                 80,
      "Cypress":              78,
      "Playwright":           72,
      "REST APIs":            70,
      "Python":               55,
      "MySQL":                50,
      "Bootstrap":            68
    },
    "experience": [
      {
        "period": ["11/1/2023", "Present"],
        "place": "IBM",
        "title": "Frontend Developer",
        "location": "Kochi, Kerala, India",
        "workType": "Hybrid",
        "tags": ["Carbon Design System", "Web Components", "TypeScript", "Lit", "WCAG", "Playwright"],
        "description": "Working with the Carbon Design System team to develop and maintain accessible, enterprise-grade components for Carbon for IBM Products and Carbon for AI. * Prototyped innovative UI components in Carbon Labs — IBM's space for rapid frontend innovation. * Contributed to WCAG success criteria compliance with unit, E2E, and automated accessibility (a11y) testing. * Operated in a fast-paced agile environment ensuring high-quality, timely software delivery.",
        "type": "professional"
      },
      {
        "period": ["6/1/2022", "10/31/2023"],
        "place": "HCL Technologies",
        "title": "Software Engineer",
        "location": "Hyderabad, Telangana, India",
        "workType": "On-site",
        "tags": ["React", "Redux", "REST APIs", "Jest", "Cypress"],
        "description": "Developed and maintained responsive UI components for financial dashboards and reporting tools, enhancing user engagement. * Collaborated with backend teams to integrate RESTful APIs, enabling real-time data access across applications. * Diagnosed and resolved UI bugs, implementing performance enhancements that improved overall user experience.",
        "type": "professional"
      },
      {
        "period": ["7/1/2021", "5/31/2022"],
        "place": "Ochre Media Pvt Ltd",
        "title": "Web UI Developer",
        "location": "Secunderabad, Telangana, India",
        "workType": "On-site",
        "tags": ["HTML5", "CSS", "JavaScript", "Bootstrap"],
        "description": "Collaborated with back-end teams to implement UI features, enhancing user experience across platforms. * Designed and developed unique websites, microsites, and newsletters for diverse B2B clients, boosting brand visibility. * Created product pages and inquiry forms, leading to improved user engagement and conversion rates.",
        "type": "professional"
      },
      {
        "period": ["6/1/2014", "5/31/2018"],
        "place": "Andhra University",
        "title": "B.E — Electronics & Communication Engineering",
        "description": "Bachelor of Engineering in Electronics and Communication Engineering. Graduated from Gayatri Vidya Parishad College of Engineering & Technology, affiliated with Andhra University.",
        "type": "academic"
      },
      {
        "period": ["1/1/2021", "12/31/2021"],
        "place": "Great Learning",
        "title": "Certificate in Software Development",
        "description": "Comprehensive software development certification program covering full-stack web development, REST APIs, relational databases, Python, and professional testing practices (Jest, Cypress).",
        "type": "academic"
      },
      {
        "period": ["6/1/2012", "5/31/2014"],
        "place": "Sri Gayatri Jr. College",
        "title": "Board of Secondary Education — MPC",
        "description": "Intermediate education with Mathematics, Physics, and Chemistry specialization under the Andhra Pradesh Board of Secondary Education.",
        "type": "academic"
      }
    ]
  }
};

export const reposData = [
  {
    "name": "wc-audio-input",
    "desc": "An audio input web component supporting speech-to-text (STT). Built with native Web Components and TypeScript.",
    "stars": 2,
    "lang": "TypeScript",
    "homepage": "https://devadula-nandan.github.io/wc-audio-input/",
    "url": "https://github.com/devadula-nandan/wc-audio-input",
    "topics": ["web-components", "speech-to-text", "typescript", "audio-input"]
  },
  {
    "name": "wc-resizer",
    "desc": "A lightweight and reusable container resizer web component supporting flexbox layout resizing.",
    "stars": 1,
    "lang": "TypeScript",
    "homepage": "https://devadula-nandan.github.io/wc-resizer/",
    "url": "https://github.com/devadula-nandan/wc-resizer",
    "topics": ["web-components", "typescript", "resizer", "ui-component"]
  },
  {
    "name": "storybook-theme-carbon",
    "desc": "Storybook themes and layout setups custom-tailored to mimic IBM's Carbon Design System aesthetics.",
    "stars": 1,
    "lang": "SCSS",
    "homepage": "https://devadula-nandan.github.io/storybook-theme-carbon/",
    "url": "https://github.com/devadula-nandan/storybook-theme-carbon",
    "topics": ["storybook", "carbon-design-system", "scss"]
  },
  {
    "name": "TD-TABLE",
    "desc": "A highly interactive Tailwind + DaisyUI data table playground powered by TanStack Table v8.",
    "stars": 0,
    "lang": "JavaScript",
    "homepage": "https://devadula-nandan.github.io/TD-TABLE/",
    "url": "https://github.com/devadula-nandan/TD-TABLE",
    "topics": ["tailwind", "daisyui", "tanstack-table", "react-table"]
  },
  {
    "name": "Todo_application_with_vanilla_js",
    "desc": "A todo application built with vanilla JavaScript using optimized DOM manipulation techniques.",
    "stars": 2,
    "lang": "JavaScript",
    "homepage": "https://devadula-nandan.github.io/Todo_application_with_vanilla_js/",
    "url": "https://github.com/devadula-nandan/Todo_application_with_vanilla_js",
    "topics": ["vanilla-js", "dom-manipulation", "todo-list"]
  },
  {
    "name": "RNG_Color_Generator",
    "desc": "A random color generator web application implementing multiple code approaches and color theory logic.",
    "stars": 1,
    "lang": "JavaScript",
    "homepage": "https://devadula-nandan.github.io/RNG_Color_Generator/",
    "url": "https://github.com/devadula-nandan/RNG_Color_Generator",
    "topics": ["rng", "color-picker", "vanilla-js"]
  },
  {
    "name": "Unstop_Frontend_Task",
    "desc": "Frontend coding challenge implementation with enterprise-level layouts and performance optimizations.",
    "stars": 0,
    "lang": "JavaScript",
    "homepage": "https://unstop-frontend-task.vercel.app/assessment",
    "url": "https://github.com/devadula-nandan/Unstop_Frontend_Task",
    "topics": ["challenge", "react", "frontend-task"]
  },
  {
    "name": "Flask_Restaurant_Application_Great_Learning",
    "desc": "Full-stack restaurant food ordering app using Flask for the back-end and modular HTML/CSS.",
    "stars": 1,
    "lang": "Python",
    "homepage": "https://flask-restaurant-application.vercel.app/",
    "url": "https://github.com/devadula-nandan/Flask_Restaurant_Application_Great_Learning",
    "topics": ["flask", "python", "e-commerce", "sql"]
  },
  {
    "name": "Facebook_clone_vue_app",
    "desc": "Facebook interface clone built with Vue.js, Vuex global state management, and Tailwind CSS.",
    "stars": 0,
    "lang": "Vue",
    "homepage": "https://vue-app-jade.vercel.app",
    "url": "https://github.com/devadula-nandan/Facebook_clone_vue_app",
    "topics": ["vue", "vuex", "facebook-clone", "tailwind"]
  },
  {
    "name": "Facebook_clone_react_app",
    "desc": "A React implementation of the Facebook UI connected to a custom MySQL + Express backend API.",
    "stars": 0,
    "lang": "JavaScript",
    "homepage": "https://react-app-beta-ten.vercel.app",
    "url": "https://github.com/devadula-nandan/Facebook_clone_react_app",
    "topics": ["react", "express-api", "social-network"]
  },
  {
    "name": "valorant-clip-automation",
    "desc": "Python automation script to capture, parse, and upload Valorant gameplay clips to YouTube via API.",
    "stars": 0,
    "lang": "Python",
    "homepage": null,
    "url": "https://github.com/devadula-nandan/valorant-clip-automation",
    "topics": ["automation", "python", "youtube-api", "gameplay-clips"]
  }
];
