# Every_Recipe 🍳

A modern, responsive recipe sharing platform where users can discover, save, and share their favorite recipes with an intuitive and beautiful interface.

## ✨ Features

- **🔍 Smart Search** - Find recipes by name, tags, or cooking time with real-time filtering
- **👤 User Authentication** - Secure sign up, login, and user management
- **📱 Fully Responsive** - Optimized for mobile, tablet, and desktop devices
- **💾 Recipe Collections** - Create custom albums to organize your favorite recipes
- **✍️ Recipe Management** - Add, edit, and delete your own recipes
- **🏷️ Tag System** - Categorize recipes with cuisine types, dietary preferences, and cooking methods
- **⏱️ Time Filtering** - Filter recipes by cooking duration (Quick, Fast, Medium, Long)
- **🎨 Beautiful UI** - Clean, modern design with smooth animations and transitions
- **🔄 Auto-Scrolling Cards** - Interactive recipe carousels with manual speed controls

## 🛠️ Tech Stack

**Frontend:**
- React 19.1.0
- React Router DOM 7.7.1
- Tailwind CSS 3.4.1
- Heroicons React

**Development Tools:**
- Create React App
- PostCSS & Autoprefixer
- React Testing Library
- ESLint

**Key Libraries:**
- `@tailwindcss/aspect-ratio` - Responsive image containers
- `@heroicons/react` - Beautiful SVG icons
- `react-router-dom` - Client-side routing

## 🚀 Setup Instructions

### Prerequisites
- Node.js (version 14 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/Every_Recipe-Website-Frontend-.git
   cd Every_Recipe-Website-Frontend-
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000) to view the application.

### Available Scripts

- `npm start` - Runs the app in development mode
- `npm test` - Launches the test runner
- `npm run build` - Builds the app for production
- `npm run eject` - Ejects from Create React App (one-way operation)

### Environment Setup

Make sure your backend API is running and accessible. The frontend expects the backend to be available for:
- User authentication
- Recipe CRUD operations
- Album management
- Search functionality

## 📱 Mobile Optimization

The application is fully responsive with special optimizations for mobile devices:
- Collapsible navigation with icon-only buttons
- Stack layout for recipe details on small screens
- Touch-friendly search and filter controls
- Optimized typography and spacing

## 🎯 Key Components

- **Header** - Responsive navigation with user authentication
- **HomePage** - Main landing page with search and recipe carousels
- **RecipePage** - Detailed recipe view with ingredients and steps
- **SearchResultsPage** - Filtered recipe results
- **AuthPages** - Sign up and login forms
- **ProtectedRoute** - Route protection for authenticated users

---

Built with ❤️ using React and Tailwind CSS