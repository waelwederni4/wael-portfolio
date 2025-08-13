import type { Experience } from '@/types';

export const experiences: Experience[] = [
  {
    company: { en: 'NeoLedge', fr: 'NeoLedge' },
    role: { en: 'Full Stack Engineer & Mobile Developer', fr: 'Ingénieur Full-Stack & Développeur Mobile' },
    period: { en: 'Jul 2022 – Present', fr: '07/2022 – Présent' },
    type: 'fulltime',
    bullets: [
      { en: 'Hybrid mobile app in Vue.js + Capacitor with high-performance native components', fr: 'Application mobile hybride en Vue.js + Capacitor avec composants natifs performants' },
      { en: 'Custom native plugins (Java/Swift): OIDC login, advanced WebView, downloads', fr: 'Plugins natifs (Java/Swift) : connexion OIDC, WebView avancé, téléchargements' },
      { en: 'OIDC auth with Azure AD & Keycloak; token/security flow for Xamarin', fr: 'Auth OIDC avec Azure AD & Keycloak ; flux token/sécurité pour Xamarin' },
      { en: 'New features for UWP e-signature app; UX optimization', fr: 'Nouvelles fonctionnalités UWP de signature électronique ; optimisation UX' },
      { en: 'Refactor & upgrade of Xamarin app for performance and stability', fr: 'Refactorisation & upgrade de l’app Xamarin pour performance et stabilité' },
      { en: 'PDF digital signatures with iText (server) in ASP.NET', fr: 'Signatures PDF numériques avec iText (serveur) en ASP.NET' },
      { en: 'CI/CD with Azure DevOps; App Center deployments', fr: 'CI/CD avec Azure DevOps ; déploiements App Center' },
      { en: 'Incident analysis, customer support; SCRUM ceremonies', fr: 'Analyse d’incidents, support client ; cérémonies SCRUM' }
    ],
    stack: ['Vue.js','Capacitor','Java','Swift','Xamarin','ASP.NET','Azure AD','Keycloak','Azure DevOps','iText','UWP']
  },
  {
    company: { en: 'NeoLedge', fr: 'NeoLedge' },
    role: { en: 'Mobile Developer Intern – ECM integration (PFE)', fr: 'Stagiaire Développeur Mobile – Intégration GED (PFE)' },
    period: { en: 'Feb 2022 – Jun 2022', fr: '02/2022 – 06/2022' },
    type: 'intern',
    bullets: [
      { en: 'Flutter cross-platform app for Elise ECM', fr: 'Application Flutter multiplateforme pour Elise GED' },
      { en: 'Clean architecture (Presentation, Domain, Data)', fr: 'Architecture clean (Présentation, Domaine, Données)' },
      { en: 'State management & navigation with GetX; BLoC logic', fr: 'Gestion d’état & navigation avec GetX ; logique BLoC' },
      { en: 'Android native scanner via Platform Channels + OpenCV', fr: 'Scanner Android natif via Platform Channels + OpenCV' },
      { en: 'Secure integration with Azure DevOps APIs', fr: 'Intégration sécurisée avec les APIs Azure DevOps' },
      { en: 'Responsive UI with reusable widgets', fr: 'UI responsive avec widgets réutilisables' }
    ],
    stack: ['Flutter','GetX','BLoC','OpenCV','Android','Azure DevOps']
  },
  {
    company: { en: 'ETAII Software', fr: 'ETAII Software' },
    role: { en: 'Android Developer (Part-time)', fr: 'Développeur Android (Temps partiel)' },
    period: { en: 'Jan 2020 – Jul 2020', fr: '01/2020 – 07/2020' },
    type: 'parttime',
    bullets: [
      { en: 'Android/Java apps for multiple clients', fr: 'Apps Android/Java pour plusieurs clients' },
      { en: 'Node.js microservices with Firebase API', fr: 'Microservices Node.js avec API Firebase' }
    ],
    stack: ['Android','Java','Node.js','Firebase']
  },
  // New SOTECA entry
  {
    company: { en: 'SOTECA ELECTRIC', fr: 'SOTECA ELECTRIC' },
    role: { en: 'Mobile & Web Developer Intern', fr: 'Stagiaire Développeur Mobile & Web' },
    period: { en: 'Jan 2019 – Mar 2019', fr: '01/2019 – 03/2019' },
    type: 'intern',
    bullets: [
      {
        en: 'Designed a mobile solution for traffic-light management, improving urban traffic flow.',
        fr: 'Conçu une solution mobile pour la gestion des feux de circulation, contribuant à la fluidité du trafic urbain.'
      },
      {
        en: 'Built a web app for privilege management and activity auditing, used by the Sfax city council.',
        fr: 'Construit une application web pour la gestion des privilèges et l’audit des activités, utilisée par le conseil municipal de Sfax.'
      }
    ],
   stack: ['Android', 'Java', 'PHP', 'SQlite'] }
]
