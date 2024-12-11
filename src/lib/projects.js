import essentialharvest from '../assets/projects/mockups/eh1.png'
import sinssflow from '../assets/projects/mockups/sf.png'
import kyte from '../assets/projects/mockups/kyte1.png'
import ljs from '../assets/projects/mockups/ljs1.png'
import fi1 from '../assets/projects/mockups/fi1.png'
import qualityDigital from '../assets/projects/mockups/qd1.png'
import sp from '../assets/projects/mockups/sp.png'
import vk from '../assets/projects/mockups/vk.png'
import cp from '../assets/projects/mockups/cp.png'
import cursify from '../assets/projects/mockups/cursify.png'

export const projects = [
     {
          "name": "Workcare",
          "slug": "essential-harvest-ecommerce-application",
          "description": "A robust ecommerce application developed using the MERN stack with advanced features such as inventory management, email marketing, RBAC, and third-party integrations like Razorpay for payments and Google APIs for authentication and data handling.",
          "features": [
               "Manual and Google Authentication",
               "Role-Based Access Control (RBAC) for Admin and Users",
               "Inventory management system for product tracking",
               "Dashboard analysis and email marketing based on reports",
               "Third-party payment integration using Razorpay",
               "Excel data integration using Google APIs",
               "Responsive and user-friendly design"
          ],
          "techStack": ["MERN (MongoDB, Express, React.js, Node.js)", "Nodemailer", "Google APIs"],
          "liveLink": "worldcare.vn",
          "image": essentialharvest,

     },
     {
          "name": "Yokara website",
          "slug": "yokara-website",
          "description": "Yokara website is a website that brings news and top singer users using Servlet and ReactJS with advanced features such as inventory management, email marketing, RBAC, and third-party integrations like Google APIs for authentication and data handling.",
          "features": [
               "Manual and Google,Facebook Authentication",
               "Role-Based Access Control (RBAC) for Admin and Users",
               "Inventory management system for product tracking",
               "Dashboard analysis and email marketing based on reports",
               "Third-party payment integration using Razorpay",
               "Excel data integration using Google APIs",
               "Responsive and user-friendly design"
          ],
          "techStack": ["Java Servlet", "ReactJS", "Firebase", "Google APIs", "Google App Engine", "Tailwind CSS"],
          "liveLink": "Yokara.com",
          "image": essentialharvest,

     },
     {
          "name": "Yokara Karaoke App",
          "slug": "yokara-karaoke-app",
          "description": "Yokara App is an exciting and interactive karaoke app using Java Serlvet, Flutter and Firebase",
          "features": [
               "Role-Based Access Control (RBAC) for agencies and sub-accounts",
               "Excel data integration using Google APIs",
               "Responsive and user-friendly design",
               "Manual and Google, Facebook, Zalo, Authentication",
               "Create a currency system for purchasing items and tipping people",
               "Real-time responses for like and comment actions"
          ],
          "techStack": [
               "Flutter",
               "Firebase Realtime Database",
               "Google App Engine",
               "Java Serlvet",
               "Firebase authentication",
          ],
          "liveLink": "play.google.com/store/apps/details?id=com.yokara.v3&hl=vi",
          "image": sinssflow,
     },
     {
          "name": "Yokara Xúc xắc may mắn",
          "slug": "yokara-xuc-xac-may-man",
          "description": "The game developed into a fully functional using Firebase and Unity at apart of Yokara app.",
          "features": [
               "Custom design in Figma",
               "Fully responsive for android and ios devices",
               "Supports gameplay for up to 10,000 participants per round"
          ],
          "techStack": ["Firebase", "Unity"],
          "liveLink": "play.google.com/store/apps/details?id=com.yokara.v3&hl=vi",
          "image": kyte
     },
     {
          "name": "Suzu social website",
          "slug": "suzu-social-website",
          "description": "Suzu social website is a modern, responsive platform designed for singer or famous people social. The design, created in Figma, was developed into a fully functional and visually engaging website using Next.js and Supabase.",
          "features": [
               "Fully responsive across devices",
               "Responsive and user-friendly design",
               "Component-based structure developed in Next.js"
          ],
          "techStack": ["Tailwind CSS", "Next.js", "Supabase", "PostgreSQL"],
          "liveLink": "dev.suzu.net",
          "image": ljs
     }
]
