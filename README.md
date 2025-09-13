# BBUI - Brain Bot UI

A unified Refine-based frontend application for the Brain Bot knowledge management system.

## Quick Start

1. **Setup environment**:
   ```bash
   ./setup-env.sh
   ```
   Or manually:
   ```bash
   cp .env.example .env
   # Edit .env with your Supabase credentials
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Run development server**:
   ```bash
   npm run dev
   ```

## Environment Variables

This app requires the following environment variables:

- `VITE_SUPABASE_URL`: Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY`: Your Supabase anonymous key
- `VITE_APP_NAME`: Application name (default: brain-bot-docs)

Get these values from your [Supabase dashboard](https://app.supabase.com) under Settings > API.

## Authentication

This app includes a complete authentication system with role-based access control. See [AUTH_SETUP.md](./AUTH_SETUP.md) for detailed setup instructions.

## Features

- 🔐 Supabase Authentication
- 👥 User Management with Roles (Admin, User, Viewer)
- 📄 Document Browsing with Tree View
- 🔒 Row Level Security (RLS)
- 🎨 Ant Design UI Components
- ⚡ Vite for Fast Development
- 📁 Feature-based Architecture

## Project Structure

```
bbui/
├── src/
│   ├── components/      # Shared components
│   ├── features/        # Feature modules
│   │   ├── admin/       # Admin dashboard
│   │   ├── auth/        # Authentication (login/signup)
│   │   ├── documents/   # Document viewer
│   │   ├── tools/       # Tools and utilities
│   │   └── users/       # User management
│   ├── providers/       # Auth and access control
│   ├── utils/           # Utilities and clients
│   └── App.tsx          # Main application
├── templates/           # Component templates
└── scripts/             # Build and utility scripts
```

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## Security

- Never commit `.env` files
- Always use the anon key in frontend apps
- Keep service role keys secure and server-side only
- Enable RLS on all tables