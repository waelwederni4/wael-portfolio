import type { Experience } from '@/types'

export const experiences: Experience[] = [
  {
    company: 'NeoLedge',
    role: 'Full Stack Engineer & Mobile Developer',
    location: 'Zarzis',
    period: 'Jul 2022 – Present',
    type: 'fulltime',
    bullets: [
      'Hybrid mobile app in Vue.js + Capacitor with high-performance native components',
      'Custom native plugins (Java/Swift): OIDC login, advanced WebView, downloads',
      'OIDC auth with Azure AD & Keycloak; token/security flow for Xamarin',
      'New features for UWP e-signature app; UX optimization',
      'Refactor & upgrade of Xamarin app for performance and stability',
      'PDF digital signatures with iText (server) in ASP.NET',
      'CI/CD with Azure DevOps; App Center deployments',
      'Production incident analysis, customer support; SCRUM ceremonies'
    ],
    stack: ['Vue.js','Capacitor','Java','Swift','Xamarin','ASP.NET','Azure AD','Keycloak','Azure DevOps','iText','UWP']
  },
  {
    company: 'NeoLedge',
    role: 'Mobile Developer Intern – ECM integration (PFE)',
    location: 'Zarzis',
    period: 'Feb 2022 – Jun 2022',
    type: 'intern',
    bullets: [
      'Flutter cross-platform app for Elise ECM',
      'Clean architecture (Presentation, Domain, Data)',
      'State management & navigation with GetX; BLoC logic',
      'Android native scanner via Platform Channels + OpenCV',
      'Secure integration with Azure DevOps APIs',
      'Responsive UI with reusable widgets'
    ],
    stack: ['Flutter','GetX','BLoC','OpenCV','Android','Azure DevOps']
  },
  {
    company: 'ETAII Software',
    role: 'Android Developer (Part-time)',
    location: 'Sfax',
    period: 'Jan 2020 – Jul 2020',
    type: 'parttime',
    bullets: ['Android/Java apps for multiple clients','Node.js microservices with Firebase API'],
    stack: ['Android','Java','Node.js','Firebase']
  }
  // Add your other older experiences here (AGIS, SOTECA, etc.)
]
