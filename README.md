# Medina Chess Festival - React + Vite + Supabase

This is a React + Vite rewrite of the original PHP project.

## Architecture used

I used a **frontend SPA architecture** with **React + Vite** and **Supabase as the backend platform**.

### Layers

1. **Presentation layer**
   - React components
   - responsive layout in `src/styles/global.css`
   - multilingual UI using a language context and dictionary file

2. **Application layer**
   - route management with `react-router-dom`
   - form state and admin auth flow in React pages/components
   - language state in `src/contexts/LanguageContext.jsx`

3. **Data layer**
   - Supabase tables: `registrations`, `admin_users`
   - Supabase Auth for admin login
   - Supabase realtime subscription on the admin dashboard
   - Row Level Security policies in `supabase_schema.sql`

### Why this architecture

- no PHP server is needed anymore
- easy deployment on Vercel, Netlify, or Cloudflare Pages
- Supabase handles database, auth, and realtime updates
- admin access is safer because it uses Supabase Auth instead of a password hardcoded in the frontend

## Main features included

- responsive landing page
- registration form saved to Supabase
- admin login with Supabase Auth
- protected admin dashboard
- realtime registrations list
- language switcher: FR / EN / DE / RU / AR
- RTL support for Arabic

## Step by step: make it work

### 1. Install Node.js
Install Node.js 20 or newer.

### 2. Open the project
```bash
cd medina-chess-festival-react
```

### 3. Install dependencies
```bash
npm install
```

### 4. Create your `.env`
Copy `.env.example` to `.env` and fill it:
```bash
cp .env.example .env
```

Then edit `.env`:
```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_SITE_NAME=Medina Chess Festival
```

### 5. Create your Supabase project
In Supabase:
- create a new project
- open the SQL editor
- run the content of `supabase_schema.sql`

### 6. Create the admin user in Supabase Auth
In Supabase:
- go to **Authentication > Users**
- create a user with email and password

### 7. Add that admin user to `admin_users`
Get the user id from Supabase Auth, then run this SQL:
```sql
insert into public.admin_users (id, email)
values ('YOUR_AUTH_USER_UUID', 'admin@example.com');
```

### 8. Run the project locally
```bash
npm run dev
```
Open the URL shown by Vite, usually:
```text
http://localhost:5173
```

### 9. Test the public form
- open the homepage
- submit the registration form
- check the `registrations` table in Supabase

### 10. Test the admin dashboard
- go to `/admin/login`
- sign in with the admin email/password created in Supabase Auth
- if that user exists in `admin_users`, you can access `/admin`

## Deployment

Because this is now a static React app, you can deploy it easily on:
- Vercel
- Netlify
- Cloudflare Pages

### Vercel quick deploy
1. Push the project to GitHub
2. Import the repo into Vercel
3. Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in Vercel environment variables
4. Deploy

## Important note about security

The public registration form inserts directly into Supabase using the anonymous key. That is fine only if your RLS policies stay restrictive.

For stricter anti-spam protection later, move registration submission to:
- a Supabase Edge Function, or
- a backend API route

That would let you add:
- server-side validation
- stronger rate limiting
- email sending
- CAPTCHA verification
