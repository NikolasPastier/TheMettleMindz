🧠 TheMettleMindz — Discipline. Mindset. Growth.

TheMettleMindz is a full-stack web application that merges technology with personal growth — a platform for creators, coaches, and entrepreneurs to manage products, digital resources, and personal brands built around mindset, discipline, and self-improvement.

Built with Next.js 14, Supabase, and TailwindCSS, it features secure authentication, product management, and a responsive, aesthetic dashboard optimized for both performance and productivity.

🌐 Live App: https://themettlmindz.com

⸻

✨ Features

🔐 Authentication
	•	Email & password authentication powered by Supabase Auth.
	•	Secure session handling and persistent user login.
	•	Email confirmation and password recovery built-in.

🧭 Dashboard
	•	Fully protected dashboard with role-based access control.
	•	Manage products, digital assets, and content in a clean UI.
	•	View analytics, edit profiles, and track updates.

🧱 CRUD System
	•	Create, read, update, and delete products or digital resources.
	•	Connect products to users with relational Supabase tables.
	•	Integrated Row Level Security (RLS) for data isolation.

🎨 UI & UX
	•	Sleek dark-mode aesthetic built with TailwindCSS and shadcn/ui.
	•	Consistent, modern design across all devices.
	•	Smooth animations and intuitive layout with a focus on clarity and flow.

🛡️ Security
	•	Row Level Security (RLS) on all user data.
	•	Protected API routes with session validation.
	•	Input validation, secure headers, and HTTPS enforced in production.

📱 Responsive Design
	•	Mobile-first design that adapts beautifully to all screen sizes.
	•	Optimized for creators, athletes, and coaches managing products on the go.

⸻

🏗️ Tech Stack

Frontend: Next.js 14 (App Router), TypeScript, React
Backend & Database: Supabase (PostgreSQL, Auth, RLS)
Styling: TailwindCSS + shadcn/ui
Deployment: Vercel
Authentication: Supabase Email Auth
Security: RLS Policies + Middleware Protection

⸻

⚙️ Getting Started

🧩 Prerequisites
	•	Node.js 18+
	•	Supabase project
	•	Vercel account (for deployment)

📦 Installation
	1.	Clone the repository
	•	git clone https://github.com/yourusername/themettlmindz.git
	•	cd themettlemindz
	2.	Install dependencies
	•	npm install or pnpm install
	3.	Set up environment variables
	•	Copy the example file:
	•	cp .env.example .env.local
	•	Fill in your credentials:
	•	NEXT_PUBLIC_SUPABASE_URL
	•	NEXT_PUBLIC_SUPABASE_ANON_KEY
	•	SUPABASE_SERVICE_ROLE_KEY
	4.	Set up the database
	•	Run SQL scripts in your Supabase SQL Editor or use the /scripts folder:
	•	scripts/001_create_users_table.sql
	•	scripts/002_create_products_table.sql
	•	scripts/003_create_profile_trigger.sql
	5.	Run the development server
	•	npm run dev
	•	Open http://localhost:3000

⸻

🗂️ Project Structure

themettlmindz/
├── app/ — Next.js App Router pages
│   ├── api/ — API routes
│   ├── auth/ — Authentication pages
│   ├── dashboard/ — Protected dashboard
│   └── layout.tsx — Root layout
├── components/ — Reusable UI components
├── lib/
│   ├── supabase/ — Supabase client configuration
│   ├── auth-utils.ts — Authentication utilities
│   └── api-utils.ts — API utilities
├── scripts/ — Database migration SQL scripts
└── middleware.ts — Route protection middleware

⸻

🔁 Authentication Flow
	1.	Sign Up — Users register with email/password.
	2.	Email Confirmation — Verification link required to activate accounts.
	3.	Sign In — Users log in with confirmed credentials.
	4.	Protected Routes — Dashboard and API routes require authentication.
	5.	RLS Policies — Ensure users only access their own data.

⸻

🔧 API Routes

POST /api/auth/register — Register new users
GET /api/products — Retrieve user’s products
POST /api/products — Create new product
PUT /api/products/[id] — Update product
DELETE /api/products/[id] — Delete product
GET /api/user/profile — Get user profile
PUT /api/user/profile — Update user profile

⸻

🧾 Database Schema

users
	•	id (UUID, references auth.users)
	•	email (text)
	•	full_name (text)
	•	created_at (timestamp)
	•	updated_at (timestamp)

products
	•	id (UUID)
	•	title (text)
	•	description (text)
	•	price (decimal)
	•	user_id (UUID, references users.id)
	•	created_at (timestamp)
	•	updated_at (timestamp)

⸻

🛡️ Security
	•	Row Level Security (RLS): Database policies restricting data per user.
	•	Auth Middleware: Protects private routes and API endpoints.
	•	Input Validation: Prevents injection and malformed data.
	•	Security Headers: XSS and clickjacking protection.
	•	HTTPS: Enforced in production for secure data transmission.

⸻

🚀 Deployment
	1.	Push your project to GitHub.
	2.	Connect your repository to Vercel.
	3.	Set environment variables in the Vercel dashboard:
	•	NEXT_PUBLIC_SUPABASE_URL
	•	NEXT_PUBLIC_SUPABASE_ANON_KEY
	•	SUPABASE_SERVICE_ROLE_KEY
	•	NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
	4.	Deploy — automatic builds on each push to main.

⸻

🧪 Development

Run tests: npm run test
Lint code: npm run lint
Type check: npm run type-check

⸻

💡 Vision

TheMettleMindz is more than a product dashboard — it’s the foundation for a digital ecosystem empowering creators and athletes to live with discipline, purpose, and control.
Every feature is designed to simplify backend chaos so users can focus on growth — mentally, physically, and financially.

⸻

🧑‍💻 Contributing
	1.	Fork the repository
	2.	Create your feature branch (git checkout -b feature/amazing-feature)
	3.	Commit your changes (git commit -m 'Add amazing feature')
	4.	Push to your branch (git push origin feature/amazing-feature)
	5.	Open a Pull Request

⸻

📜 License

Licensed under the MIT License — see the LICENSE file for details.

⸻

💬 Credits

Developed by Nikolas Pastier
Built with ❤️ using Next.js, Supabase, and TailwindCSS.

⸻

🌟 If you like this project

Give it a ⭐ on GitHub and share it with your community.
