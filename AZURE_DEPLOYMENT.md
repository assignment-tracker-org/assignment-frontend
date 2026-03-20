# Azure App Service Deployment Guide

## Project Setup for Azure Deployment

Your React frontend has been configured for Azure App Service (IIS) deployment.

### Key Changes Made:

1. **Environment Variables** - API URLs are now configurable via `.env` file
2. **web.config** - IIS rewrite rules for React Router handling
3. **.deployment** - Azure build configuration
4. **Optimized Build** - Production-ready setup

---

## Deployment Options

### Option A: Azure Portal (Manual Deployment)

#### Step 1: Build the Project Locally
```bash
npm install
npm run build
```

#### Step 2: Create ZIP for Deployment
- Compress the `build` folder
- Include `web.config` in the root of the ZIP

#### Step 3: Deploy via Portal
1. Go to Azure Portal → Your Web App → Deployment Center
2. Click "Manual Deploy" or "Local Git"
3. Upload the ZIP file or push to Git repository
4. Azure will detect and deploy automatically

#### Step 4: Configure Environment Variables in Azure Portal
1. Go to Settings → Configuration
2. Add Application Settings:
   - `REACT_APP_PRIMARY_API_URL`: Your Azure API endpoint
   - `REACT_APP_FALLBACK_API_URL`: Your fallback API endpoint
   - `NODE_ENV`: `production`

---

### Option B: Azure CLI Deployment

#### Step 1: Install Azure CLI
```bash
# Windows
choco install azure-cli
# or download from: https://aka.ms/installazurecliwindows

# Verify installation
az --version
```

#### Step 2: Login to Azure
```bash
az login
```

#### Step 3: Build Locally
```bash
npm install
npm run build
```

#### Step 4: Deploy Using ZIP
```bash
# Create deployment package
Compress-Archive -Path "build", "web.config" -DestinationPath "app.zip"

# Deploy to Azure Web App
az webapp deployment source config-zip `
  --resource-group <your-resource-group> `
  --name <your-web-app-name> `
  --src app.zip
```

#### Step 5: Set Environment Variables
```bash
az webapp config appsettings set `
  --resource-group <your-resource-group> `
  --name <your-web-app-name> `
  --settings REACT_APP_PRIMARY_API_URL="https://your-api.azurewebsites.net/api/assignments" `
             REACT_APP_FALLBACK_API_URL="https://fallback-api.com/api/assignments" `
             NODE_ENV="production"
```

---

### Option C: GitHub Actions CI/CD (Recommended)

#### Step 1: Create GitHub Actions Workflow
Create file: `.github/workflows/azure-deploy.yml`

```yaml
name: Build and Deploy to Azure

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest

    steps:
    - uses: actions/checkout@v3

    - name: Set up Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'

    - name: Install dependencies
      run: npm ci

    - name: Run build
      run: npm run build
      env:
        REACT_APP_PRIMARY_API_URL: ${{ secrets.REACT_APP_PRIMARY_API_URL }}
        REACT_APP_FALLBACK_API_URL: ${{ secrets.REACT_APP_FALLBACK_API_URL }}

    - name: Upload artifact
      uses: actions/upload-artifact@v3
      with:
        name: build
        path: build/

    - name: Deploy to Azure Web App
      uses: azure/webapps-deploy@v2
      with:
        app-name: '<your-web-app-name>'
        publish-profile: ${{ secrets.AZURE_WEBAPP_PUBLISH_PROFILE }}
        package: build/
```

#### Step 2: Add Publish Profile Secret
1. Download publish profile from Azure Portal:
   - Go to Web App → Overview → Download Publish Profile
2. Go to GitHub repo → Settings → Secrets and Variables → Actions
3. Create secrets:
   - `AZURE_WEBAPP_PUBLISH_PROFILE`: Paste publish profile content
   - `REACT_APP_PRIMARY_API_URL`: Your API URL
   - `REACT_APP_FALLBACK_API_URL`: Your fallback URL

#### Step 3: Push to GitHub
```bash
git add .
git commit -m "Configure for Azure deployment"
git push origin main
```

---

## Verification Steps

After deployment:

1. **Test API Connectivity**
   - Open Browser DevTools → Network tab
   - Check API calls are hitting correct endpoint
   - Verify fallback works if primary API is down

2. **Check Application Settings**
   ```bash
   az webapp config appsettings list `
     --resource-group <your-resource-group> `
     --name <your-web-app-name>
   ```

3. **View Live Logs**
   ```bash
   az webapp log tail `
     --resource-group <your-resource-group> `
     --name <your-web-app-name>
   ```

4. **Test Refresh (React Router)**
   - Navigate to any page (e.g., `/assignments`)
   - Refresh browser - should stay on same route
   - If redirect to home, check web.config is deployed

---

## Environment Variables Reference

Create `.env` file locally or set in Azure Portal:

```env
# Primary API (Azure Backend)
REACT_APP_PRIMARY_API_URL=https://assignment-tracker-backend-e9bmgrh7cneeg9hb.southeastasia-01.azurewebsites.net/api/assignments

# Fallback API (Render/Other)
REACT_APP_FALLBACK_API_URL=https://assignment-backend-ram9.onrender.com/api/assignments

# Node Environment
NODE_ENV=production
```

---

## Troubleshooting

### Issue: White screen after deployment
✓ Check browser console for errors
✓ Verify web.config is in root of Azure Web App
✓ Check Application Insights for exceptions

### Issue: API calls failing
✓ Verify REACT_APP_PRIMARY_API_URL is set in Azure Portal
✓ Check CORS settings on backend API
✓ Verify network connectivity in browser DevTools

### Issue: Routes not working on refresh
✓ Redeploy web.config file
✓ Check IIS rewrite module is enabled (usually default on Azure)
✓ Restart Web App from Azure Portal

### Issue: Build failing on Azure
✓ Check Node.js version compatibility
✓ Review build logs in App Service → Deployment Center
✓ Run `npm install && npm run build` locally to replicate

---

## File Structure for Deployment

```
build/
├── index.html
├── static/
│   ├── css/
│   ├── js/
│   └── media/
└── ...

web.config          (mandatory - already included)
.env               (local configuration - not committed)
.build             (auto-generated by npm)
package.json
```

---

## Performance Tips

1. **Enable Gzip Compression** (configured in web.config)
2. **Use CDN** for static assets - configure in Azure Storage
3. **Enable Browser Caching** (configured in web.config)
4. **Monitor Performance** - Enable Application Insights

---

## Security Best Practices

✓ Never commit `.env` with secrets
✓ Use Azure Key Vault for sensitive values
✓ Enable HTTPS (automatic on Azure)
✓ Set security headers (configured in web.config)
✓ CORS should be configured on backend only

---

## Support & Resources

- [Azure App Service Docs](https://docs.microsoft.com/en-us/azure/app-service/)
- [IIS URL Rewrite Module](https://docs.microsoft.com/iis/extensions/url-rewrite-module/using-the-url-rewrite-module)
- [React Production Build](https://create-react-app.dev/docs/production-build/)
- [GitHub Actions + Azure](https://github.com/Azure/webapps-deploy)
