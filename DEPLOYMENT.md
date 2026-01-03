# Deployment Guide

## Quick Deploy Checklist

### 1. Supabase Setup (5 minutes)

1. **Create Supabase Project**
   - Go to https://supabase.com/dashboard
   - Click "New Project"
   - Fill in project details
   - Wait for provisioning (~2 minutes)

2. **Get API Credentials**
   - Go to Project Settings → API
   - Copy:
     - Project URL (NEXT_PUBLIC_SUPABASE_URL)
     - anon/public key (NEXT_PUBLIC_SUPABASE_ANON_KEY)

3. **Run Database Schema**
   - Go to SQL Editor
   - Click "New Query"
   - Paste contents of `supabase/schema.sql`
   - Click "Run"
   - Verify success (should see "Success. No rows returned")

4. **Seed Templates**
   - Click "New Query" again
   - Paste contents of `supabase/seed.sql`
   - Click "Run"
   - Verify 6 templates inserted

5. **Create Admin User**
   - Go to Authentication → Users
   - Click "Add user" → "Create new user"
   - Enter email: `your-email@example.com`
   - Enter password: (strong password)
   - Click "Create user"
   - **IMPORTANT**: Copy the User UID (you need this for OWNER_UID)
   - Go to user details and click "Confirm email" if needed

### 2. Vercel Deployment (3 minutes)

#### Option A: Deploy from GitHub

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial ShortFormFactory Hub deployment"
   git push origin claude/shortform-hub-mvp-Rz76m
   ```

2. **Connect to Vercel**
   - Go to https://vercel.com/new
   - Import your GitHub repository
   - Framework Preset: Next.js (auto-detected)
   - Root Directory: `./`
   - Click "Deploy"

3. **Add Environment Variables**
   - While deployment is running, go to Project Settings
   - Go to Environment Variables
   - Add these 3 variables:
     ```
     NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
     NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
     OWNER_UID=your-admin-user-uid
     ```
   - Apply to: Production, Preview, Development

4. **Redeploy**
   - Go to Deployments
   - Click "..." on latest deployment
   - Click "Redeploy"

#### Option B: Deploy with Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel

# Follow prompts and add environment variables when asked

# Deploy to production
vercel --prod
```

### 3. Configure Supabase Auth (1 minute)

1. **Get your Vercel URL**
   - Copy your deployment URL (e.g., `https://your-app.vercel.app`)

2. **Update Supabase Auth Settings**
   - Go to Supabase Dashboard → Authentication → URL Configuration
   - Site URL: `https://your-app.vercel.app`
   - Redirect URLs: Add `https://your-app.vercel.app/auth/callback`
   - Click "Save"

### 4. Test Deployment (2 minutes)

1. **Test Public Pages**
   - Visit `https://your-app.vercel.app`
   - Should see landing page
   - Click "Request Editing"
   - Fill and submit form
   - Should see success message

2. **Test Admin Login**
   - Visit `https://your-app.vercel.app/admin`
   - Should redirect to login
   - Enter your Supabase admin credentials
   - Should login and see admin dashboard

3. **Test Admin Features**
   - Check Requests tab - should see your test request
   - Click request → Convert to Job
   - Go to Jobs tab - should see new job
   - Go to Templates tab - should see 6 seeded templates

## Environment Variables Reference

| Variable | Where to Find | Example |
|----------|---------------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase → Settings → API → Project URL | `https://abcdefg.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase → Settings → API → Project API keys → anon/public | `eyJhbGc...` (long string) |
| `OWNER_UID` | Supabase → Authentication → Users → Click user → Copy UID | `12345678-1234-1234-1234-123456789012` |

## Troubleshooting

### "Invalid API key" error
- Double-check NEXT_PUBLIC_SUPABASE_ANON_KEY is correct
- Make sure there are no extra spaces or quotes
- Verify you're using the anon/public key, NOT the service_role key

### Login redirects to login page (loop)
- Verify redirect URL is configured in Supabase
- Check that OWNER_UID matches your admin user ID
- Try logging in again with correct credentials

### Request form not submitting
- Check browser console for errors
- Verify RLS policies were created (run schema.sql again)
- Check Supabase logs in Dashboard → Logs

### Templates not showing
- Verify seed.sql was run successfully
- Go to Supabase → Table Editor → templates
- Should see 6 rows

## Post-Deployment

### Custom Domain (Optional)
1. Go to Vercel Project Settings → Domains
2. Add your custom domain
3. Update Supabase redirect URLs to use custom domain

### Email Configuration (Optional)
1. Go to Supabase → Authentication → Email Templates
2. Customize email templates for password reset, etc.

### Monitoring
1. Vercel provides automatic monitoring
2. Supabase has built-in analytics
3. Set up error tracking if needed (Sentry, etc.)

## Scaling Considerations

### Free Tier Limits
- **Vercel**: 100GB bandwidth, unlimited requests
- **Supabase**: 500MB database, 2GB bandwidth, 50,000 monthly active users

### When to Upgrade
- More than 500MB of data in database
- More than 50,000 MAU
- Need for dedicated resources

### Performance Optimization
- Database queries are indexed for common operations
- Static pages are cached by Vercel CDN
- Images should be optimized before upload

## Backup and Recovery

### Database Backups
- Supabase Pro plan includes automatic daily backups
- Free tier: manually export data via SQL Editor
  ```sql
  -- Export all tables
  COPY buyer_requests TO STDOUT CSV HEADER;
  COPY jobs TO STDOUT CSV HEADER;
  COPY templates TO STDOUT CSV HEADER;
  ```

### Code Backups
- Git repository is your source of truth
- Vercel keeps deployment history

## Security Checklist

- [x] RLS policies enabled on all tables
- [x] Anonymous users restricted to INSERT on buyer_requests only
- [x] Admin access requires authentication
- [x] Environment variables stored securely in Vercel
- [x] No hardcoded secrets in code
- [x] HTTPS enforced (Vercel default)

## Support

If you encounter issues during deployment:
1. Check Vercel deployment logs
2. Check Supabase logs
3. Review this guide's troubleshooting section
4. Email: shortformfactory.help@gmail.com
