# Next.js Authentication & CRUD App

A full-stack Next.js application with TypeScript, Supabase authentication, and product management dashboard.

## Features

- 🔐 **Authentication**: Email/password authentication with Supabase
- 📊 **Dashboard**: Protected dashboard with product management
- 🛡️ **Security**: Row Level Security (RLS) policies and secure API routes
- 🎨 **UI**: Dark theme with TailwindCSS and shadcn/ui components
- 📱 **Responsive**: Mobile-first responsive design

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Styling**: TailwindCSS + shadcn/ui
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+ 
- A Supabase project
- Vercel account (for deployment)

### Installation

1. **Clone the repository**
   \`\`\`bash
   git clone <your-repo-url>
   cd your-project-name
   npm install
   \`\`\`

2. **Set up environment variables**
   \`\`\`bash
   cp .env.example .env.local
   \`\`\`
   
   Fill in your Supabase credentials:
   - `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anon key
   - `SUPABASE_SERVICE_ROLE_KEY`: Your Supabase service role key

3. **Set up the database**
   
   Run the SQL scripts in order:
   \`\`\`sql
   -- Run these in your Supabase SQL editor or use the scripts folder
   scripts/001_create_users_table.sql
   scripts/002_create_products_table.sql
   scripts/003_create_profile_trigger.sql
   \`\`\`

4. **Run the development server**
   \`\`\`bash
   npm run dev
   \`\`\`

   Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

\`\`\`
├── app/
│   ├── api/                 # API routes
│   ├── auth/               # Authentication pages
│   ├── dashboard/          # Protected dashboard
│   └── layout.tsx          # Root layout
├── components/             # Reusable components
├── lib/
│   ├── supabase/          # Supabase client configuration
│   ├── auth-utils.ts      # Authentication utilities
│   └── api-utils.ts       # API utilities
├── scripts/               # Database migration scripts
└── middleware.ts          # Route protection middleware
\`\`\`

## Authentication Flow

1. **Sign Up**: Users create an account with email/password
2. **Email Confirmation**: Users must confirm their email address
3. **Sign In**: Users can sign in with confirmed credentials
4. **Protected Routes**: Dashboard requires authentication
5. **Row Level Security**: Database policies ensure users only access their own data

## API Routes

- `POST /api/auth/register` - User registration
- `GET /api/products` - Get user's products
- `POST /api/products` - Create new product
- `PUT /api/products/[id]` - Update product
- `DELETE /api/products/[id]` - Delete product
- `GET /api/user/profile` - Get user profile
- `PUT /api/user/profile` - Update user profile

## Database Schema

### Users Table
\`\`\`sql
users (
  id: uuid (references auth.users)
  email: text
  full_name: text
  created_at: timestamp
  updated_at: timestamp
)
\`\`\`

### Products Table
\`\`\`sql
products (
  id: uuid
  title: text
  description: text
  price: decimal
  user_id: uuid (references users.id)
  created_at: timestamp
  updated_at: timestamp
)
\`\`\`

## Security Features

- **Row Level Security (RLS)**: Database-level security policies
- **Authentication Middleware**: Route protection
- **Input Validation**: API request validation
- **Security Headers**: XSS and clickjacking protection
- **HTTPS Only**: Secure connections in production

## Deployment

### Deploy to Vercel

1. **Connect your repository to Vercel**
2. **Set environment variables in Vercel dashboard**
3. **Deploy**: Vercel will automatically deploy on push to main branch

### Environment Variables for Production

\`\`\`bash
NEXT_PUBLIC_SUPABASE_URL=your_production_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_production_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_production_service_role_key
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
\`\`\`

## Development

### Running Tests
\`\`\`bash
npm run test
\`\`\`

### Linting
\`\`\`bash
npm run lint
\`\`\`

### Type Checking
\`\`\`bash
npm run type-check
\`\`\`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details
