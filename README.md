# Vertex - Sports Betting Performance Tracker

Vertex is a progressive web app (PWA) designed to track, manage, and improve performance in sports betting. The app allows users to receive curated betting tips, add them to a personal wallet, track ROI, and monitor stats over time.

## Features

- **Login System**: Email + 6-digit verification code authentication
- **Role-Based Access**: Free and premium user tiers with JWT authentication
- **Dashboard**: ROI tracker, win/loss stats, pending bets
- **Personal Wallet**: Saved predictions with performance tracking
- **Premium Tips Feed**: Selectable tips with authorship, sport, and odds information
- **Notifications**: For new tips, results, and plan expiry
- **Profile Management**: User data, plan type, and logout functionality
- **Admin-Ready**: Expandable for back-office interface
- **PWA Support**: Full offline functionality, installable on mobile devices

## Tech Stack

- **Frontend**: React + Vite + Tailwind CSS
- **Animations**: Framer Motion
- **State Management**: LocalStorage (with Zustand option)
- **Authentication**: JWT-based
- **Backend**: Express.js + PostgreSQL (Supabase-compatible)
- **Email Service**: Nodemailer (Gmail app password)
- **Hosting**: Vercel (frontend) + Supabase/Render (backend)

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/vertex.git
   cd vertex
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Start the development server
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

## Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory, ready to be deployed to Vercel or any other static hosting service.

## PWA Features

Vertex is a fully-featured PWA with:

- Offline support via service workers
- Installable on mobile devices
- Fast loading with cached assets
- Custom splash screen and app icons

## Deployment

### Frontend (Vercel)

1. Push your code to a GitHub repository
2. Connect the repository to Vercel
3. Configure the build settings (Build command: `npm run build`, Output directory: `dist`)
4. Deploy

### Backend (Supabase/Render)

The backend code should be deployed separately to Supabase or Render, following their respective documentation.

## Project Structure

```
src/
├── assets/        # Static assets (images, icons)
├── components/    # Reusable UI components
├── context/       # React context providers
├── hooks/         # Custom React hooks
├── pages/         # Page components
├── routes/        # Routing components
├── utils/         # Utility functions
├── App.jsx        # Main app component
└── main.jsx       # Entry point
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Design inspiration from modern betting platforms
- Built with React, Vite, and Tailwind CSS
