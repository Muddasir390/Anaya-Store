# Anaya Store — Setup (about 20 minutes)

The site already runs in **preview mode** without any keys (demo abayas, demo checkout):
`npm run dev` → http://localhost:3000. (Needs Node 20.9+; use Node 22.)

## 1. Supabase (database + admin login + image storage)
1. Create a free account at https://supabase.com → **New project** (save the DB password).
2. **SQL Editor → New query** → paste all of `supabase/schema.sql` → **Run**.
3. **Authentication → Users → Add user** → your admin email + password (tick "Auto confirm").
4. Back in SQL Editor run (use your admin email):
   ```sql
   insert into public.admins (user_id) select id from auth.users where email = 'YOUR-ADMIN-EMAIL';
   ```
5. **Authentication → Sign In / Providers → Email**: turn **off "Allow new users to sign up"** (only you should have an account).
6. **Project Settings → API**: copy *Project URL*, *anon public key*, and *service_role key*.

## 2. Local env
Copy `.env.example` → `.env.local` and fill the three Supabase values + currency. Restart `npm run dev`.
Sign in at `/admin/login`.

## 3. Inside the admin panel
- **Settings**: set your real **WhatsApp number** (country code, digits only), shipping fee, announcement text.
- **Categories / Products**: add your abayas, upload photos, sizes, colours, stock.
- The starter categories from the SQL can be edited or deleted.

## 4. Deploy on Vercel
1. Push the project to GitHub (private repo is fine).
2. https://vercel.com → **Add New → Project** → import the repo.
3. Add the same env variables from `.env.local` (Settings → Environment Variables). Keep `SUPABASE_SERVICE_ROLE_KEY` secret.
4. Deploy. Then in Supabase **Authentication → URL Configuration** set *Site URL* to your Vercel URL.
5. Optional: add your custom domain in Vercel and update `NEXT_PUBLIC_SITE_URL`.

## How orders & WhatsApp work
- Customer checks out (cash on delivery) → order saved → confirmation page with **"Confirm on WhatsApp"** (pre-filled message to your number).
- In **Admin → Orders → order** you change status and tap **"Message customer on WhatsApp"** (pre-filled message for the current status).
- Customers can track at `/track` with order number + phone.
- This uses WhatsApp click-to-chat links (free, no API). Automatic WhatsApp messages would need the paid WhatsApp Business API — can be added later.
