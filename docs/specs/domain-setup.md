Short checklist to map your GoDaddy domain to environment-specific sites on Vercel.

Decide names
production: example.com (+ www)
staging: staging.example.com (branch or separate project)
preview: branch-based previews or wildcard like _.preview.example.com
Add domains in Vercel
Project → Settings → Domains → Add example.com, www.example.com, staging.example.com, _.preview.example.com (if using wildcard).
For staging/preview, set Branch Filters on the domain entry (Include only: staging or the branch name).
Configure DNS in GoDaddy
Apex (example.com): add A record
Host: @
Type: A
Value: 76.76.21.21
www or subdomain (www, staging, preview subdomains): add CNAME
Host: www (or staging, preview)
Type: CNAME
Value: cname.vercel-dns.com
Wildcard preview (optional):
Host: \*.preview
Type: CNAME
Value: cname.vercel-dns.com
Verify and wait
In Vercel Domains panel click Verify; wait DNS propagation (minutes → hours).
Vercel will provision SSL automatically.
Environment variables
Vercel → Project → Settings → Environment Variables
Add variables per Environment: Production, Preview, Development.
For Preview-scoped values that should apply only to a branch, add the Preview var and set Branch Filters.
Re-deploy
Changing env vars or domains requires a new deployment to take effect.
Troubleshooting quick hits

Don’t set both CNAME and A for the same host.
If verification fails, remove conflicting records (old A/CNAME).
For a true isolated staging, create a separate Vercel project and map staging.example.com there.
If you want, provide your domain name and whether you want staging as a branch or a separate project and I’ll give the exact GoDaddy records and Vercel settings to add.
