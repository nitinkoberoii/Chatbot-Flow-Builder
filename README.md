# React Chatbot Flow Builder

A modern React-based chatbot flow builder application that allows users to create, edit, and manage conversational flows with an intuitive drag-and-drop interface.

## 🌐 Live Demo

**[View Live Application](https://chatbot-flow-builder-seven-puce.vercel.app)**

## 🚀 Features

- **Interactive Flow Builder** - Drag-and-drop interface for creating chatbot conversation flows
- **React Flow Integration** - Powered by @xyflow/react for advanced node-based editing
- **Real-time Editing** - Live preview and editing of chatbot flows
- **Node Management** - Add, delete, and connect different types of conversation nodes
- **Export Functionality** - Save and export your chatbot flows
- **Responsive Design** - Works seamlessly across desktop and mobile devices
- **Modern Tech Stack** - Built with React 18, Vite, Redux Toolkit, and TailwindCSS
- **State Management** - Redux Toolkit for efficient application state handling
- **Smooth Animations** - Framer Motion for enhanced user experience

## 📋 Prerequisites

- Node.js (v14.x or higher)
- npm or yarn

## 🛠️ Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd react_chatbot_flow_builder
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```
3. Start the development server:

   ```bash
   npm start
   # or
   yarn start
   ```

4. Open your browser and navigate to `http://localhost:4028`

## 📁 Project Structure

```
react_chatbot_flow_builder/
├── public/                    # Static assets and images
├── src/
│   ├── components/           # Reusable UI components
│   │   ├── ui/              # Base UI components
│   │   ├── AppIcon.jsx      # Application icons
│   │   └── AppImage.jsx     # Image components
│   ├── pages/               # Page components
│   │   ├── flow-builder-canvas/  # Flow builder main page
│   │   └── NotFound.jsx     # 404 page
│   ├── styles/              # Global styles and Tailwind
│   ├── utils/               # Utility functions
│   ├── App.jsx              # Main application component
│   ├── Routes.jsx           # Application routes
│   └── index.jsx            # Application entry point
├── index.html               # HTML template
├── package.json             # Project dependencies and scripts
├── tailwind.config.js       # Tailwind CSS configuration
├── postcss.config.js        # PostCSS configuration
└── vite.config.mjs          # Vite configuration
```

## 🎯 How to Use

1. **Create Nodes**: Click on the canvas to add new conversation nodes
2. **Connect Nodes**: Drag from one node's output to another node's input to create conversation flows
3. **Edit Content**: Double-click on nodes to edit their content and responses
4. **Save Flow**: Use the save functionality to preserve your chatbot flow
5. **Export**: Export your completed flow for integration with chatbot platforms

## 🧩 Key Components

- **FlowCanvas**: Main canvas component for the flow builder interface
- **Node Types**: Different types of conversation nodes (text, decision, action)
- **Connection System**: Visual connections between conversation steps
- **State Management**: Redux store for managing flow state and user interactions

## 🎨 Styling & Design

This project uses a modern design system built with:

- **TailwindCSS** - Utility-first CSS framework with custom configuration
- **Responsive Design** - Mobile-first approach with breakpoint-specific styling
- **Component Variants** - Class Variance Authority for consistent component styling
- **Animations** - Smooth transitions and micro-interactions
- **Design Tokens** - Consistent spacing, colors, and typography throughout the app

## 🔧 Technologies Used

- **Frontend**: React 18, Redux Toolkit, React Router v6
- **Flow Editor**: @xyflow/react (React Flow)
- **Styling**: TailwindCSS, Framer Motion
- **Build Tool**: Vite
- **Form Handling**: React Hook Form
- **Icons**: Lucide React
- **Utilities**: Clsx, Tailwind Merge

## 📦 Deployment

Build the application for production:

```bash
npm run build
```

The build files will be generated in the `dist` directory and can be deployed to any static hosting service like Vercel, Netlify, or GitHub Pages.

### Deployed Version

This application is currently deployed and accessible at:
**https://chatbot-flow-builder-seven-puce.vercel.app**
