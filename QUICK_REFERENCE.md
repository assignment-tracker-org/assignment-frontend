# Azure Deployment Quick Reference

## Files Created/Modified

### ✅ Modified Files
- `src/components/AssignmentTracker.js` - Environment variable support added
- `package.json` - Node.js version requirements added

### ✅ New Configuration Files
- `web.config` - **CRITICAL** - IIS routing for Azure
- `.env` - Local environment variables
- `.env.example` - Template for team members
- `.deployment` - Azure build configuration
- `.gitignore` - Updated to exclude .env and build files
- `.github/workflows/azure-deploy.yml` - GitHub Actions CI/CD

### ✅ Documentation Files
- `AZURE_DEPLOYMENT.md` - Complete deployment guide (3 methods)
- `DEPLOYMENT_SUMMARY.md` - This implementation summary
- `QUICK_REFERENCE.md` - This file

---

## One-Command Deployment Checklist

### Before Deployment:
```bash
# 1. Verify build works
npm install
npm run build

# Output should show:
# ✓ Compiled successfully
# ✓ 76.52 kB main.js
# ✓ 32.81 kB main.css
# ✓ Build folder is ready to be deployed
```

### Deployment Option A: GitHub Actions (Easiest)
```bash
# 1. Push to GitHub
git add .
git commit -m "Prepare for Azure deployment"
git push origin main

# 2. In GitHub repo → Settings → Secrets add:
#    - AZURE_WEBAPP_PUBLISH_PROFILE
#    - REACT_APP_PRIMARY_API_URL
#    - REACT_APP_FALLBACK_API_URL

# 3. Monitor GitHub Actions tab → Automatic deployment!
```

### Deployment Option B: Azure CLI
```bash
# 1. Install Azure CLI (Windows)
choco install azure-cli

# 2. Login
az login

# 3. Deploy
az webapp deployment source config-zip `
  --resource-group YOUR_RESOURCE_GROUP `
  --name YOUR_APP_NAME `
  --src build.zip

# 4. Configure settings
az webapp config appsettings set `
  --resource-group YOUR_RESOURCE_GROUP `
  --name YOUR_APP_NAME `
  --settings REACT_APP_PRIMARY_API_URL="https://..." `
             REACT_APP_FALLBACK_API_URL="https://..."
```

### Deployment Option C: Azure Portal
```bash
# 1. Create deployment package
Compress-Archive -Path "build", "web.config" -DestinationPath "app.zip"

# 2. Azure Portal → Web App → Deployment Center
# 3. Upload the ZIP file
# 4. Configure application settings in Portal
```

---

## Verification After Deployment

```bash
# View live logs
az webapp log tail -n YOUR_APP_NAME -g YOUR_RESOURCE_GROUP

# Check settings
az webapp config appsettings list -n YOUR_APP_NAME -g YOUR_RESOURCE_GROUP

# Restart app
az webapp restart -n YOUR_APP_NAME -g YOUR_RESOURCE_GROUP
```

---

## Environment Variables

Set these in Azure Portal → Configuration → Application Settings:

| Key | Value |
|-----|-------|
| `REACT_APP_PRIMARY_API_URL` | `https://assignment-tracker-backend-e9bmgrh7cneeg9hb.southeastasia-01.azurewebsites.net/api/assignments` |
| `REACT_APP_FALLBACK_API_URL` | `https://assignment-backend-ram9.onrender.com/api/assignments` |
| `NODE_ENV` | `production` |
| `WEBSITE_NODE_DEFAULT_VERSION` | `18.0.0` |

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| **Build fails** | Run `npm install --legacy-peer-deps` |
| **API returns 404** | Check REACT_APP_PRIMARY_API_URL is set in Azure Portal |
| **Page refresh shows 404** | Verify web.config is deployed in Azure root |
| **CORS errors** | Configure CORS on backend API, not frontend |
| **Slow performance** | Enable CDN in Azure Portal settings |

---

## Key Files Explained

### web.config
- **Purpose:** Tells Azure IIS how to route requests
- **Critical for:** React Router single-page apps
- **Must be in:** Root of deployment (Azure Web App root folder)
- **Features:** Gzip compression, caching, security headers

### .env
- **Purpose:** Local environment variables (DO NOT commit)
- **Used by:** React build process to inject variables
- **Location:** Root folder (in .gitignore)

### .github/workflows/azure-deploy.yml
- **Purpose:** Automates build and deployment on git push
- **Triggers on:** Push to `main` branch
- **Requires:** AZURE_WEBAPP_PUBLISH_PROFILE secret in GitHub

---

## Performance Metrics

After deployment, check Azure Portal → App Service plan → Metrics:

- ✓ CPU % should be < 50%
- ✓ Memory % should be < 70%
- ✓ Response time < 500ms
- ✓ HTTP 200 rate > 99%

If high CPU/Memory, consider upgrading to B2 or higher plan.

---

## Security Checklist

- ✓ HTTPS enabled (automatic on Azure)
- ✓ .env file excluded from deployment (in .gitignore)
- ✓ Security headers configured (in web.config)
- ✓ Sensitive keys in Azure Key Vault (recommended)
- ✓ CORS properly configured on backend only
- ✓ No hardcoded credentials in code

---

## Monitoring Setup (Optional)

```bash
# Enable Application Insights for monitoring
az webapp config appsettings set `
  --resource-group YOUR_RESOURCE_GROUP `
  --name YOUR_APP_NAME `
  --settings APPINSIGHTS_INSTRUMENTATIONKEY="YOUR_KEY"
```

Then view in Azure Portal → Application Insights → Live Metrics Stream

---

## Rollback Instructions

If deployment has issues:

```bash
# Swap slots (if using staging)
az webapp deployment slot swap `
  --resource-group YOUR_RESOURCE_GROUP `
  --name YOUR_APP_NAME `
  --slot staging

# Or restart app
az webapp restart -n YOUR_APP_NAME -g YOUR_RESOURCE_GROUP

# Or redeploy previous version
git revert HEAD~1
git push origin main
```

---

For complete detailed instructions, see: **AZURE_DEPLOYMENT.md**
