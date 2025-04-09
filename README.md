
# 📦 AGF Smart Warehouse UI System

This project is a **smart warehouse management UI** developed for controlling and monitoring **automated guided forklifts (AGF)** and **warehouse control systems (WCS)**. It is built using **Nuxt.js**, **Vue.js**, and other modern web technologies to provide a seamless, responsive, and modular UI optimized for real-world operations on tablets.

## 🧑‍💻 Developed by
**Pan Jixiao**  
Frontend Engineer | Vue.js / Nuxt.js Specialist  
Email: carlos4sigoto@gmail.com  
Location: Arakawa City, Tokyo, Japan  

## 🚀 Project Purpose
To provide a responsive and real-time interface for logistics and manufacturing environments. The system is capable of:

- Visualizing AGF operations and task status live.
- Managing task input, status updates, and warehouse logic.
- Supporting both individual and batch (row-based) rack interactions.
- Working seamlessly on iPad and Android tablets in the field.

## 🔧 Tech Stack

| Category           | Technology                              |
|--------------------|------------------------------------------|
| Frontend Framework | Nuxt.js / Vue.js                         |
| State Management   | Pinia                                    |
| Canvas UI Engine   | Konva.js                                 |
| Styling            | SCSS (with BEM Naming Convention)        |
| API                | REST API (via Axios)                     |
| Version Control    | Git + GitHub                             |
| Device Support     | Responsive for tablets (iPad / Android)  |
| Other              | ESLint, Prettier, i18n-ready             |

## 📦 Features

- 📊 **Real-Time Visualization**: Canvas-based AGF task tracking
- 🔧 **Modular Components**: Reusable UI for task selection, alerts, and sidebar interactions
- 🎨 **Responsive Design**: Optimized layout for tablets and mobile viewports
- 🛠️ **Configurable**: Support for both manual and automated task input
- 🧠 **Smart UI Interactions**: Layered and row-based rack selection logic

## 📁 Folder Structure Overview

```
├── pages/                       # Nuxt pages including Home, Task, Selection UIs
├── components/                 # Reusable components (alerts, menus, buttons)
├── composables/                # Core business logic (e.g. rackTask, rackClick)
├── stores/                     # Pinia stores for task & error management
├── assets/scss/style.scss      # Global SCSS file using BEM & variables
├── konvas/                     # Konva.js canvas-based logic
├── public/                     # Static resources (icons, images)
├── plugins/                    # Plugin scripts (e.g. timers, error checker)
```

## 🌐 Deployment & Runtime

- Local server: `localhost:6547`
- SSR Disabled: Pure SPA deployment for fast client-side rendering
- PWA Ready: Configured with `@vite-pwa/nuxt` for installable experience

## 🏆 Achievements

- ✅ Reduced AGF task reassignment errors by **40%**
- ✅ Enhanced UI modularization and decreased dev effort by **30%**
- ✅ Improved layout compatibility across devices, reducing QA by **20%**
- ✅ System deployed at **ANA Narita** & featured on **Tokyo MX TV**

- ## 🗂️ Sample Screens

  Below are some key screens and real UI interactions from the AGF Smart Warehouse system:

  ### 🎬 AGF Monitoring

  ![AGF Monitor](https://i.imgur.com/FLwaAYX.gif)

  ### 🧾 Task Creation (Narita)

  ![Narita Task Creation](https://i.imgur.com/uEWU6G1.gif)

  ### 🧾 Task Creation (Tokyo)

  ![Tokyo Task Creation](https://i.imgur.com/8CamRkB.gif)

  ### 🐛 Error History View

  ![Error History](https://i.imgur.com/KJGLgdv.gif)

  ### ⚠️ Error Popup Handling

  ![Error Popup](https://i.imgur.com/jtdaWcI.gif)

  ### 🛠️ Defect Notification Popup

  ![Defect Popup](https://i.imgur.com/fe5MPv0.gif)

## Nagoya Exhibition Video Materials

Related demonstration videos have been uploaded to Google Drive:

👉 [Click here to access](https://drive.google.com/drive/folders/1z3hYT1WOGR3dod28_ZAEfKAQq8dA0Wcb?usp=drive_link)

Includes:
- 名古屋展示会2407(1).mp4
- 名古屋展示会2407(2).mp4

## 📜 License

This project is proprietary and developed under contract with MIRAIt Service Design and Lead Tech. Please contact for collaboration inquiries.

---

> Developed with 💻 by **Pan Jixiao**, aiming to simplify warehouse intelligence through beautiful and functional UI.
