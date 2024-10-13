import { SkillGroup } from "./types";

export const OPTION_GROUPS = [
  {
    name: "Key Tech",
    options: [
      { id: "javascript", label: "JavaScript" },
      { id: "typescript", label: "TypeScript" },
      { id: "nodedotjs", label: "Node.js" },
      { id: "amazonwebservices", label: "AWS" },
    ],
  },
  {
    name: "Front End",
    options: [
      { id: "react", label: "React" },
      { id: "nextdotjs", label: "Next.js" },
      { id: "tailwindcss", label: "Tailwind CSS" },
      { id: "redux", label: "Redux" },
      { id: "html5", label: "HTML" },
      { id: "css3", label: "CSS" },
      { id: "bootstrap", label: "Bootstrap" },
      { id: "material-ui", label: "Material-UI" },
      { id: "react-testing-library", label: "React Testing Library" },
      { id: "graphql", label: "GraphQL" },
      { id: "apollographql", label: "Apollo" },
    ],
  },
  {
    name: "Full Stack",
    options: [
      { id: "Docker", label: "Docker" },
      { id: "CI", label: "CI/CD" },
      { id: "Git", label: "Git" },
      { id: "Jest", label: "Jest" },
      { id: "Cypress", label: "Cypress" },
      { id: "vercel", label: "Vercel" },
      { id: "firebase", label: "Firebase" },
      { id: "azure", label: "Azure" },
    ],
  },
  {
    name: "Databases",
    options: [
      { id: "postgresql", label: "PostgreSQL" },
      { id: "mysql", label: "MySQL" },
      { id: "mongodb", label: "MongoDB" },
      { id: "redis", label: "Redis" },
      { id: "DynamoDB", label: "DynamoDB" },
    ],
  },
];

export const SKILL_GROUPS: SkillGroup[] = [
  {
    name: "Web Development",
    skills: ["JavaScript", "React", "Node.js", "HTML", "CSS"],
  },
  {
    name: "Backend Development",
    skills: [
      "AWS",
      "Docker",
      "CI/CD",
      "Git",
      "Jest",
      "Cypress",
      "Vercel",
      "Firebase",
      "Azure",
    ],
  },
  {
    name: "Project Management",
    skills: [
      "Agile",
      "Scrum",
      "Kanban",
      "Risk Management",
      "Stakeholder Management",
    ],
  },
];

export const CV_TEXT = `
Romilly Eveleigh CV
Experienced Web Developer with a demonstrated history of managing teams and delivering production-ready solutions. Skilled
in JavaScript, Typescript, React, Redux, Next.js, GraphQL, Apollo, Node.js, Express, Docker, Postgres, MongoDB, Firebase, AWS
(S3, DynamoDB, Codecommit, Lambda), HTML, CSS, and full-stack development. Highly-driven IT professional with a Bachelor's
Degree from the Courtauld Institute, University of London.
I started building my earliest websites whilst I was still a teenager. I’ve always been driven by a desire to figure out how things
work and solve technical problems. So far, coding has been the perfect match for me. My first commercial project was creating a
custom database-driven e-commerce site for my employer in just a few weeks. Since then, my knowledge-base has steadily
grown through a combination of self-study, persistence and practical experience.
Outside of software development, I have extensive experience working as a Project Manager, coordinating small teams,
managing budgets and delivering complex projects on time and to a high standard.
Nowadays, I like to use Next.js and React due to its active user community and excellent component libraries, but I can quickly
learn whatever stack is necessary. With the right tools for the job and my adaptability, I’m confident to tackle any task.
Key skills
Next, React (including hooks, Context and Redux/Redux Toolkit, Query), JavaScript (ES6), Jira, Git, Node.js, HTML and CSS. My
preferred specialty is developing full-stack web apps with Next and associated technologies including Express, APIs, NPM, Git,
Postman, AWS, Webflow, Heroku, and databases such as PostgreSQL, Dynamo and MySQL and Firebase Cloud Firestore. I
frequently pick up any new technologies as and when necessary.
Experience
• Languages: TypeScript, JavaScript (ES6), React, HTML, CSS
• Operating Systems: Mac, Windows
• Database systems: Dynamo, MariaDB, Firebase (incl. Cloud Firestore, Real-time Database), MongoDB Cloud, PostgreSQL
• Other: Cypress, Jest, React Testing Library, Node.js, Redux, Bootstrap, AWS, Heroku, Apollo GraphQL
Employment history
FRAMESTORE Jul 2022 - Sep 2024
Lead Front End Developer
• Work on a smart signage SaaS product that is used in the offices of blue chip companies across the globe. The product
provides a complex suite of graphics editing, animation, scheduling and publishing services.
• Lead a team of 4 senior front end developers within a startup-style environment.
- I helped build the software and pre and post-launch, recruited new developers, reviewed code and proactively sought out and
troubleshooted problems and implemented solutions to help ensure smooth delivery of features.
- Key technologies: React, Typescript, AWS (Lambda, Dynamo, S3), Material UI, CSS, Cypress.
NTT Data Sep 2021 - Jul 2022
Senior Full Stack Developer
• Worked on a large-scale, public-facing frontend project for a mainstream blue chip telecoms/mobile company.
• Lead a small squad of developers within a larger dev team of ~50+ people.
- Key technologies: Next, React, Typescript, JavaScript, MSAL/Azure, REST apis, CSS, in-house component libraries.
NECTAR 360 Jul 2020 - Sep 2021
Senior Full Stack Developer
• Worked on a variety of commercial projects including maintenance of desktop tools and websites and the development of a
new React app with a Node.js backend.
• Lead a small team of developers, data scientists and dev ops specialists who develop in-house tools for the Nectar loyalty
scheme. I liaise with stakeholders and users to design UI concepts and user experiences for various apps, and write code related
to permissions, APIs, browser setup (Webpack) and testing, as well as many other key areas.
- I helped team members overcome challenges, provided mentoring, reviewed code and proactively sought out and
troubleshooted problems and implemented solutions to help ensure smooth delivery of products.
- Key technologies: React, Node.js, JavaScript, DynamoDB, AWS, Docker, MariaDB, Azure, CSS, in-house component libraries
(Luna)
OVCHARENKO LTD Dec 2015 - Jun 2020
Freelance Web Developer/Editor
• Worked on a variety of commercial projects including e-commerce sites as well as providing digital content and content
editing services.
• Recently developed a full-scale single-page web app to assist people applying for UK visas (spousevisahelper.com) which was
built from scratch with the potential to be scaled up to provide SaaS as a complement to the growing online ‘virtual lawyer’
sector. The project was built on React with authentication provided by Firebase. The site utilizes a Cloud Firestore database, and
draws upon libraries including Bootstrap and react-router. I make all my sites fully responsive, with user input forms, modals,
custom styling and special optimizations for iOS.
- Experience deploying on Heroku, GitHub and Apache servers, both for front-end clients and backend servers using Node.js,
JavaScript, Express and MongoDB Cloud. My latest project is a Twitter-inspired messaging web app developed in React with a
Firebase Real-time Database backend, Firebase authentication and includes social login via Facebook and Google accounts.
- I also acted as a freelance editor, providing English-language support to a range of websites in the news, events and marketing
industry.
- Key technologies: React, Node.js, JavaScript, Firebase, MongoDB, PostgreSQL, Heroku, Express, TeamCity, AWS, HTML, CSS, Git,
NPM, social login
REGINA LONDON Mar 2010 - Dec 2015
Project Manager
• Worked as a project manager for an events startup. I was in charge of setting up a new London office and implementing all of
the logistical and technical requirements of the business, from building databases and digital marketing, to managing subscriber
email lists, maintaining a digital archive and preparing digital presentation materials for clients. I lead a team of 15+ staff, and
worked on projects in cities including Berlin, New York, Moscow and Basel. I developed my skills for working on large-scale
projects and ensuring that they were delivered on time, efficiently and within budget.
- Key technologies: HTML, CSS, Wordpress, FileMaker Pro, Photoshop, InDesign
IBID PROJECTS Sep 2006 - Nov 2009
Project Manager
• Worked as a project manager for a London-based exhibitions and events company. I implemented all of the technical
requirements of the business, including maintaining the company website, creating digital marketing content, administering
network systems and maintaining a digital archive. I developed my skills for working under pressure on time-sensitive projects.
- Key technologies: HTML, CSS, PHP, MySQL, cPanel, FileMaker Pro, Photoshop, InDesign
May 2004 - Aug 2006
Freelance Web Developer
• Worked on building websites for local businesses and private clients. My largest project was developing a complete online
e-commerce solution for a print sales business with a stock of over 10,000 items. I taught myself PHP and wrote custom scripts
linking a CMS website to a MySQL backend database with data converted from FileMaker Pro. The resulting website produced a
significant increase in turnover for the business upon launch. I developed my skills for producing simple-to-use, SEO-friendly,
database-driven websites.
- Key technologies: HTML, PHP, CSS, Drupal, Apache, FileMaker Pro, MySQL
Education
Courtauld Institute, University of London - BA History (2:1)
Interests
Motorcycling, photography (instagram.com/streetartasia), design, history, travel. For several years I worked remotely, and I lived
and traveled in many countries throughout Asia and Europe before settling back in London.
Achievements
2021. As a co-founder, my side project (whatvisa.com) was selected for the Lawtech Sandbox (technation.io/lawtech-sandbox)
run by Technation.io, an annual UK government-backed initiative, to highlight the 8 most innovative tech startups in the legal
sector.`
