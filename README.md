# ShortFormFactory Hub

Production-ready inbound engine + internal ops dashboard for managing short-form video editing requests and jobs.

## Features

### Public Pages (No Login Required)
- **Landing Page (/)**: Marketing page with CTAs
- **Request Form (/request)**: Buyer intake form with auto-tier calculation

### Admin Dashboard (Login Required)
- **Requests Tab**: Manage incoming requests with status tracking
  - NEW → IN_REVIEW → QUOTED → WON/LOST
  - Copy quote email templates
  - Convert requests to jobs
  - Override internal tier suggestions
- **Jobs Tab**: Kanban board for job management
  - Columns: INTAKE_PENDING → IN_PROGRESS → QA → DELIVERED → REVISIONS → CLOSED
  - Job detail editing
  - Checklist tracking
  - Copy client update templates
- **Templates Tab**: CRUD for message templates with placeholders

### Security
- Row Level Security (RLS) enabled on all tables
- Anonymous users can only INSERT into buyer_requests
- All admin operations require authentication
- Single owner authentication via OWNER_UID environment variable

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Deployment**: Vercel-ready

## Setup Instructions

### 1. Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- Supabase account (free tier works)
- Vercel account (for deployment)

### 2. Supabase Setup

#### Create a new Supabase project

1. Go to [https://supabase.com](https://supabase.com)
2. Create a new project
3. Wait for the project to be provisioned
4. Go to Project Settings → API to get your credentials:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

#### Run database migrations

1. Go to SQL Editor in Supabase Dashboard
2. Create a new query
3. Copy and paste the contents of `supabase/schema.sql`
4. Click "Run" to execute
5. Create another new query
6. Copy and paste the contents of `supabase/seed.sql`
7. Click "Run" to seed default templates

#### Create admin user

1. Go to Authentication → Users in Supabase Dashboard
2. Click "Add user" → "Create new user"
3. Enter your email and password
4. Copy the User UID (you'll need this for OWNER_UID)
5. Verify the email address if required

### 3. Local Development Setup

#### Clone and install dependencies

```bash
# Install dependencies
npm install
```

#### Configure environment variables

```bash
# Copy the example env file
cp .env.example .env
```

Edit `.env` and add your credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
OWNER_UID=your-user-uid-from-supabase
```

#### Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Testing Locally

#### Test public pages
1. Visit `http://localhost:3000` - should see landing page
2. Click "Request Editing" or visit `/request`
3. Fill out and submit the form
4. Should see success message

#### Test admin authentication
1. Visit `http://localhost:3000/admin`
2. Should redirect to `/login`
3. Enter the email/password you created in Supabase
4. Should redirect to admin dashboard

#### Test admin features
1. **Requests Tab**:
   - View submitted requests
   - Change request status
   - Click a request to see details
   - Click "Copy Quote Email" to test template
   - Click "Convert to Job" to create a job
   - Test tier override functionality

2. **Jobs Tab**:
   - Should see the job you created
   - Drag jobs between columns (or use dropdown to change status)
   - Click a job to see details
   - Edit job fields
   - Toggle checklist items
   - Test "Copy Client Update" and "Copy Delivery Message"

3. **Templates Tab**:
   - View seeded templates
   - Create a new template with placeholders
   - Edit an existing template
   - Delete a template
   - Test "Copy" button

### 5. Deployment to Vercel

#### Connect to Vercel

```bash
# Install Vercel CLI (optional)
npm i -g vercel

# Deploy
vercel
```

Or use the Vercel dashboard:

1. Go to [https://vercel.com](https://vercel.com)
2. Click "Add New Project"
3. Import your Git repository
4. Configure project:
   - Framework Preset: Next.js
   - Build Command: `npm run build`
   - Output Directory: `.next`

#### Add environment variables in Vercel

1. Go to Project Settings → Environment Variables
2. Add all variables from your `.env` file:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `OWNER_UID`
3. Apply to all environments (Production, Preview, Development)

#### Deploy

1. Push to your Git repository
2. Vercel will automatically deploy
3. Visit your deployment URL

#### Configure Supabase redirect URLs

1. Go to Supabase Dashboard → Authentication → URL Configuration
2. Add your Vercel URL to:
   - Site URL: `https://your-app.vercel.app`
   - Redirect URLs: `https://your-app.vercel.app/auth/callback`

## Database Schema

### Tables

#### buyer_requests
- Stores all incoming buyer requests
- Auto-calculates `complexity_suggested` and `speed_tier`
- Admin can override tier suggestions

#### jobs
- Created from buyer_requests
- Tracks job lifecycle through Kanban columns
- Stores financial data (buyer_price, editor_payout)

#### job_checklist
- One-to-one with jobs
- Boolean flags for job milestones

#### templates
- Message templates with placeholder support
- Seeded with default templates

### Row Level Security

- Anonymous users: INSERT only on `buyer_requests`
- Authenticated users: Full access to all tables
- All other operations blocked by default

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Your Supabase anonymous key |
| `OWNER_UID` | Yes | User ID of the admin owner |

## File Structure

```
/
├── app/
│   ├── admin/              # Admin dashboard
│   │   ├── actions/        # Server actions for admin
│   │   ├── components/     # Admin UI components
│   │   ├── layout.tsx      # Admin layout with auth check
│   │   └── page.tsx        # Main admin page with tabs
│   ├── auth/
│   │   └── callback/       # Auth callback handler
│   ├── login/              # Login page
│   ├── request/            # Public request form
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Landing page
│   └── globals.css         # Global styles
├── lib/
│   ├── supabase/           # Supabase client utilities
│   └── types.ts            # TypeScript types
├── supabase/
│   ├── schema.sql          # Database schema + RLS
│   └── seed.sql            # Default templates
├── middleware.ts           # Auth middleware
└── package.json
```

## Template Placeholders

Available in message templates:

- `{name}` - Buyer name
- `{email}` - Buyer email
- `{service}` - Service type
- `{turnaround}` - Turnaround time
- `{volume_per_week}` - Weekly volume
- `{price}` - Price quote
- `{next_step}` - Next step instructions
- `{order_url}` - Order page URL
- `{delivery_link}` - Delivery link
- `{question}` - Custom question

## Troubleshooting

### Login not working
- Verify OWNER_UID matches the user ID in Supabase
- Check that email is verified in Supabase Auth
- Ensure environment variables are set correctly

### Request form submission fails
- Check Supabase RLS policies are enabled
- Verify anonymous INSERT policy exists on buyer_requests
- Check browser console for errors

### Jobs not appearing
- Ensure you've converted a request to a job
- Check Supabase database to verify job was created
- Refresh the page

### Templates not loading
- Verify seed.sql was run successfully
- Check Supabase table browser for templates table
- Ensure user is authenticated

## Production Checklist

- [ ] Database schema deployed to Supabase
- [ ] Default templates seeded
- [ ] Admin user created in Supabase
- [ ] Environment variables set in Vercel
- [ ] Supabase redirect URLs configured
- [ ] Test public request form
- [ ] Test admin login
- [ ] Test request → job conversion
- [ ] Test all templates
- [ ] Verify RLS policies working

## Support

For issues or questions:
- Email: shortformfactory.help@gmail.com

## License

ISC
