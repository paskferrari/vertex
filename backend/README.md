# Vertex Backend

## Environment Configuration

This project uses environment variables for configuration. Follow these steps to set up your environment:

1. Create a `.env` file in the backend directory (already done)
2. Add your Supabase credentials to the `.env` file:

```
# Supabase Configuration
SUPABASE_URL=your-supabase-project-url
SUPABASE_ANON_KEY=your-supabase-anon-key

# JWT Secret for authentication
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Server Configuration
PORT=3001
```

## Supabase Setup

1. Create a Supabase account at [https://supabase.com](https://supabase.com) if you don't have one
2. Create a new project in Supabase
3. Navigate to Project Settings > API to find your project URL and anon key
4. Copy these values to your `.env` file

## Fallback Mechanism

The application is designed to work with both Supabase and SQLite:

- If Supabase credentials are provided in the `.env` file, the application will use Supabase as the primary database
- If Supabase credentials are not provided, the application will automatically fall back to using SQLite

## Running the Server

```bash
npm start
```

The server will run on port 3001 by default, or the port specified in your `.env` file.