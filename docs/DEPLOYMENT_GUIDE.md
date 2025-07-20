# React No-Code Query Builder - Deployment Guide

## Table of Contents
1. [Environment Setup](#environment-setup)
2. [Build Process](#build-process)
3. [Deployment Strategies](#deployment-strategies)
4. [Production Configuration](#production-configuration)
5. [Monitoring and Logging](#monitoring-and-logging)
6. [Security Configuration](#security-configuration)
7. [Performance Optimization](#performance-optimization)
8. [Rollback Procedures](#rollback-procedures)
9. [Troubleshooting](#troubleshooting)

## Environment Setup

### Prerequisites
- **Node.js**: Version 18.x or higher
- **npm**: Version 9.x or higher
- **Git**: Version 2.x or higher

### Development Environment
```bash
# Clone repository
git clone <repository-url>
cd CustomQueryBuilder

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local

# Start development server
npm run dev
```

### Environment Variables
```bash
# .env.local (Development)
VITE_API_BASE_URL=http://localhost:3000/api
VITE_APP_TITLE=Query Builder - Development
VITE_ENABLE_ANALYTICS=false
VITE_LOG_LEVEL=debug

# .env.staging (Staging)
VITE_API_BASE_URL=https://staging-api.querybuilder.com/api
VITE_APP_TITLE=Query Builder - Staging
VITE_ENABLE_ANALYTICS=true
VITE_LOG_LEVEL=info

# .env.production (Production)
VITE_API_BASE_URL=https://api.querybuilder.com/api
VITE_APP_TITLE=Query Builder
VITE_ENABLE_ANALYTICS=true
VITE_LOG_LEVEL=warn
VITE_SENTRY_DSN=https://your-sentry-dsn
```

### System Requirements

#### Development
- **CPU**: 2+ cores
- **RAM**: 4GB minimum, 8GB recommended
- **Storage**: 2GB free space
- **Network**: Stable internet connection

#### Production
- **CPU**: 4+ cores
- **RAM**: 8GB minimum, 16GB recommended
- **Storage**: 10GB free space
- **Network**: High-speed internet connection

## Build Process

### Local Build
```bash
# Install dependencies
npm ci

# Run tests
npm test

# Run linting
npm run lint

# Build for production
npm run build

# Preview production build
npm run preview
```

### Build Configuration
```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          ui: ['@dnd-kit/core', '@dnd-kit/sortable', 'lucide-react'],
          utils: ['zustand', 'zod', 'react-hook-form']
        }
      }
    }
  },
  server: {
    port: 5173,
    host: true
  },
  preview: {
    port: 4173,
    host: true
  }
});
```

### Build Scripts
```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "build:staging": "tsc && vite build --mode staging",
    "build:production": "tsc && vite build --mode production",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "lint:fix": "eslint . --ext ts,tsx --fix",
    "preview": "vite preview",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "type-check": "tsc --noEmit"
  }
}
```

### Build Optimization
```typescript
// Build optimization configuration
export default defineConfig({
  build: {
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    },
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes('node_modules')) {
            if (id.includes('react')) {
              return 'react';
            }
            if (id.includes('lucide')) {
              return 'icons';
            }
            return 'vendor';
          }
        }
      }
    }
  }
});
```

## Deployment Strategies

### Static Site Deployment

#### Netlify Deployment
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Build project
npm run build

# Deploy to Netlify
netlify deploy --prod --dir=dist
```

**netlify.toml**
```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[build.environment]
  VITE_API_BASE_URL = "https://api.querybuilder.com/api"
  VITE_APP_TITLE = "Query Builder"
```

#### Vercel Deployment
```bash
# Install Vercel CLI
npm install -g vercel

# Build project
npm run build

# Deploy to Vercel
vercel --prod
```

**vercel.json**
```json
{
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": { "distDir": "dist" }
    }
  ],
  "routes": [
    { "handle": "filesystem" },
    { "src": "/(.*)", "dest": "/index.html" }
  ],
  "env": {
    "VITE_API_BASE_URL": "https://api.querybuilder.com/api",
    "VITE_APP_TITLE": "Query Builder"
  }
}
```

### Container Deployment

#### Docker Configuration
```dockerfile
# Dockerfile
FROM node:18-alpine as builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Build application
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy built application
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Expose port
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
```

**nginx.conf**
```nginx
events {
    worker_connections 1024;
}

http {
    include       /etc/nginx/mime.types;
    default_type  application/octet-stream;

    server {
        listen 80;
        server_name localhost;
        root /usr/share/nginx/html;
        index index.html index.htm;

        # Enable gzip compression
        gzip on;
        gzip_vary on;
        gzip_min_length 1024;
        gzip_proxied any;
        gzip_types
            text/plain
            text/css
            text/xml
            text/javascript
            application/javascript
            application/xml+rss
            application/json;

        # Cache static assets
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }

        # Handle client-side routing
        location / {
            try_files $uri $uri/ /index.html;
        }

        # Security headers
        add_header X-Frame-Options "SAMEORIGIN" always;
        add_header X-Content-Type-Options "nosniff" always;
        add_header X-XSS-Protection "1; mode=block" always;
        add_header Referrer-Policy "strict-origin-when-cross-origin" always;
        add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self';" always;
    }
}
```

#### Docker Compose
```yaml
# docker-compose.yml
version: '3.8'

services:
  query-builder:
    build: .
    ports:
      - "80:80"
    environment:
      - VITE_API_BASE_URL=https://api.querybuilder.com/api
      - VITE_APP_TITLE=Query Builder
    restart: unless-stopped

  # Optional: Add reverse proxy
  nginx-proxy:
    image: nginx:alpine
    ports:
      - "443:443"
    volumes:
      - ./nginx-proxy.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - query-builder
```

### CI/CD Pipeline

#### GitHub Actions
```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Run tests
        run: npm test
        
      - name: Run linting
        run: npm run lint
        
      - name: Type check
        run: npm run type-check

  build:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Build application
        run: npm run build:production
        env:
          VITE_API_BASE_URL: ${{ secrets.VITE_API_BASE_URL }}
          VITE_APP_TITLE: ${{ secrets.VITE_APP_TITLE }}
          
      - name: Upload build artifacts
        uses: actions/upload-artifact@v3
        with:
          name: build-files
          path: dist/

  deploy:
    needs: build
    runs-on: ubuntu-latest
    steps:
      - name: Download build artifacts
        uses: actions/download-artifact@v3
        with:
          name: build-files
          path: dist/
          
      - name: Deploy to production
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
          cname: querybuilder.com
```

#### AWS Deployment
```yaml
# .github/workflows/aws-deploy.yml
name: Deploy to AWS

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Build application
        run: npm run build:production
        
      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v1
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: us-east-1
          
      - name: Deploy to S3
        run: |
          aws s3 sync dist/ s3://${{ secrets.S3_BUCKET_NAME }} --delete
          
      - name: Invalidate CloudFront
        run: |
          aws cloudfront create-invalidation \
            --distribution-id ${{ secrets.CLOUDFRONT_DISTRIBUTION_ID }} \
            --paths "/*"
```

## Production Configuration

### Environment Configuration
```typescript
// src/config/environment.ts
export const config = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
  appTitle: import.meta.env.VITE_APP_TITLE || 'Query Builder',
  enableAnalytics: import.meta.env.VITE_ENABLE_ANALYTICS === 'true',
  logLevel: import.meta.env.VITE_LOG_LEVEL || 'info',
  sentryDsn: import.meta.env.VITE_SENTRY_DSN,
  version: import.meta.env.VITE_APP_VERSION || '1.0.0'
};
```

### Error Monitoring
```typescript
// src/utils/errorReporting.ts
import * as Sentry from '@sentry/react';
import { config } from '@/config/environment';

if (config.sentryDsn) {
  Sentry.init({
    dsn: config.sentryDsn,
    environment: import.meta.env.MODE,
    release: config.version,
    tracesSampleRate: 1.0,
    integrations: [
      new Sentry.BrowserTracing(),
      new Sentry.Replay()
    ]
  });
}

export const reportError = (error: Error, context?: any) => {
  if (config.sentryDsn) {
    Sentry.captureException(error, { extra: context });
  } else {
    console.error('Error:', error, context);
  }
};
```

### Analytics Configuration
```typescript
// src/utils/analytics.ts
import { config } from '@/config/environment';

interface AnalyticsEvent {
  action: string;
  category: string;
  label?: string;
  value?: number;
}

export const trackEvent = (event: AnalyticsEvent) => {
  if (!config.enableAnalytics) return;
  
  // Google Analytics 4
  if (window.gtag) {
    window.gtag('event', event.action, {
      event_category: event.category,
      event_label: event.label,
      value: event.value
    });
  }
  
  // Custom analytics
  console.log('Analytics Event:', event);
};

export const trackPageView = (path: string) => {
  if (!config.enableAnalytics) return;
  
  if (window.gtag) {
    window.gtag('config', 'GA_MEASUREMENT_ID', {
      page_path: path
    });
  }
};
```

## Monitoring and Logging

### Health Check Endpoint
```typescript
// src/utils/healthCheck.ts
export const healthCheck = async () => {
  const checks = {
    timestamp: new Date().toISOString(),
    status: 'healthy',
    checks: {
      api: await checkApiHealth(),
      storage: checkStorageHealth(),
      memory: checkMemoryUsage()
    }
  };
  
  return checks;
};

const checkApiHealth = async () => {
  try {
    const response = await fetch(`${config.apiBaseUrl}/health`);
    return response.ok ? 'healthy' : 'unhealthy';
  } catch {
    return 'unhealthy';
  }
};

const checkStorageHealth = () => {
  try {
    localStorage.setItem('health-check', 'test');
    localStorage.removeItem('health-check');
    return 'healthy';
  } catch {
    return 'unhealthy';
  }
};

const checkMemoryUsage = () => {
  const memory = (performance as any).memory;
  if (memory) {
    const usedMB = Math.round(memory.usedJSHeapSize / 1024 / 1024);
    const totalMB = Math.round(memory.totalJSHeapSize / 1024 / 1024);
    return { used: usedMB, total: totalMB, status: 'healthy' };
  }
  return { status: 'unknown' };
};
```

### Logging Configuration
```typescript
// src/utils/logger.ts
import { config } from '@/config/environment';

enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3
}

const logLevelMap = {
  debug: LogLevel.DEBUG,
  info: LogLevel.INFO,
  warn: LogLevel.WARN,
  error: LogLevel.ERROR
};

const currentLogLevel = logLevelMap[config.logLevel] || LogLevel.INFO;

export const logger = {
  debug: (message: string, ...args: any[]) => {
    if (currentLogLevel <= LogLevel.DEBUG) {
      console.debug(`[DEBUG] ${message}`, ...args);
    }
  },
  
  info: (message: string, ...args: any[]) => {
    if (currentLogLevel <= LogLevel.INFO) {
      console.info(`[INFO] ${message}`, ...args);
    }
  },
  
  warn: (message: string, ...args: any[]) => {
    if (currentLogLevel <= LogLevel.WARN) {
      console.warn(`[WARN] ${message}`, ...args);
    }
  },
  
  error: (message: string, error?: Error, ...args: any[]) => {
    if (currentLogLevel <= LogLevel.ERROR) {
      console.error(`[ERROR] ${message}`, error, ...args);
      reportError(error || new Error(message), { args });
    }
  }
};
```

### Performance Monitoring
```typescript
// src/utils/performance.ts
export const measurePerformance = (name: string, fn: () => void | Promise<void>) => {
  return async (...args: any[]) => {
    const start = performance.now();
    
    try {
      const result = await fn.apply(this, args);
      const end = performance.now();
      
      logger.info(`Performance: ${name} took ${end - start}ms`);
      
      // Track performance metrics
      trackEvent({
        action: 'performance',
        category: 'timing',
        label: name,
        value: Math.round(end - start)
      });
      
      return result;
    } catch (error) {
      const end = performance.now();
      logger.error(`Performance: ${name} failed after ${end - start}ms`, error);
      throw error;
    }
  };
};
```

## Security Configuration

### Content Security Policy
```html
<!-- In index.html -->
<meta http-equiv="Content-Security-Policy" content="
  default-src 'self';
  script-src 'self' 'unsafe-inline' https://www.googletagmanager.com;
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: https:;
  font-src 'self';
  connect-src 'self' https://api.querybuilder.com https://sentry.io;
  frame-ancestors 'none';
  base-uri 'self';
">
```

### Security Headers
```typescript
// For server-side rendering or reverse proxy
const securityHeaders = {
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'geolocation=(), microphone=(), camera=()',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains'
};
```

### Input Sanitization
```typescript
// src/utils/sanitization.ts
export const sanitizeInput = (input: string): string => {
  return input
    .replace(/[<>]/g, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+=/gi, '')
    .trim();
};

export const validateConfig = (config: any): boolean => {
  // Validate configuration structure
  if (!config || typeof config !== 'object') {
    return false;
  }
  
  // Check for required fields
  if (!config.ScholarshipInfo || !config.ScholarshipConfig) {
    return false;
  }
  
  // Validate data types
  if (typeof config.ScholarshipInfo.id !== 'string') {
    return false;
  }
  
  return true;
};
```

## Performance Optimization

### Code Splitting
```typescript
// src/components/LazyComponents.tsx
import { lazy, Suspense } from 'react';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

const ConfigInput = lazy(() => import('@/components/ConfigInput/ConfigInput'));
const EligibilityBuilder = lazy(() => import('@/components/EligibilityBuilder/EligibilityBuilder'));
const RankingBuilder = lazy(() => import('@/components/RankingBuilder/RankingBuilder'));

export const LazyConfigInput = (props: any) => (
  <Suspense fallback={<LoadingSpinner />}>
    <ConfigInput {...props} />
  </Suspense>
);

export const LazyEligibilityBuilder = (props: any) => (
  <Suspense fallback={<LoadingSpinner />}>
    <EligibilityBuilder {...props} />
  </Suspense>
);

export const LazyRankingBuilder = (props: any) => (
  <Suspense fallback={<LoadingSpinner />}>
    <RankingBuilder {...props} />
  </Suspense>
);
```

### Bundle Analysis
```bash
# Install bundle analyzer
npm install --save-dev @rollup/plugin-bundle-analyzer

# Analyze bundle
npm run build && npx vite-bundle-analyzer dist/
```

### Caching Strategy
```typescript
// src/utils/cache.ts
const CACHE_PREFIX = 'qb_cache_';
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export const cache = {
  set: (key: string, value: any, ttl = CACHE_TTL) => {
    const item = {
      value,
      expiry: Date.now() + ttl
    };
    localStorage.setItem(`${CACHE_PREFIX}${key}`, JSON.stringify(item));
  },
  
  get: (key: string) => {
    const itemStr = localStorage.getItem(`${CACHE_PREFIX}${key}`);
    if (!itemStr) return null;
    
    const item = JSON.parse(itemStr);
    if (Date.now() > item.expiry) {
      localStorage.removeItem(`${CACHE_PREFIX}${key}`);
      return null;
    }
    
    return item.value;
  },
  
  clear: () => {
    Object.keys(localStorage)
      .filter(key => key.startsWith(CACHE_PREFIX))
      .forEach(key => localStorage.removeItem(key));
  }
};
```

## Rollback Procedures

### Automated Rollback
```bash
#!/bin/bash
# scripts/rollback.sh

set -e

BACKUP_DIR="/var/backups/querybuilder"
CURRENT_VERSION=$(cat package.json | grep version | cut -d '"' -f 4)
ROLLBACK_VERSION=$1

if [ -z "$ROLLBACK_VERSION" ]; then
    echo "Usage: $0 <version>"
    echo "Available versions:"
    ls -la $BACKUP_DIR
    exit 1
fi

echo "Rolling back from $CURRENT_VERSION to $ROLLBACK_VERSION..."

# Stop application
sudo systemctl stop querybuilder

# Backup current version
sudo cp -r /var/www/querybuilder $BACKUP_DIR/backup_$CURRENT_VERSION

# Restore previous version
sudo cp -r $BACKUP_DIR/backup_$ROLLBACK_VERSION /var/www/querybuilder

# Update configuration
sudo chown -R www-data:www-data /var/www/querybuilder
sudo chmod -R 755 /var/www/querybuilder

# Start application
sudo systemctl start querybuilder

# Verify rollback
curl -f http://localhost/health || {
    echo "Rollback failed! Restoring current version..."
    sudo cp -r $BACKUP_DIR/backup_$CURRENT_VERSION /var/www/querybuilder
    sudo systemctl restart querybuilder
    exit 1
}

echo "Rollback successful!"
```

### Manual Rollback Steps
1. **Identify target version**
   ```bash
   git log --oneline -10
   ```

2. **Create backup of current state**
   ```bash
   cp -r dist/ backup_$(date +%Y%m%d_%H%M%S)
   ```

3. **Checkout target version**
   ```bash
   git checkout <target-commit>
   ```

4. **Rebuild application**
   ```bash
   npm ci
   npm run build:production
   ```

5. **Deploy rolled back version**
   ```bash
   # Deploy using your deployment method
   ```

6. **Verify rollback**
   ```bash
   curl -f https://yourapp.com/health
   ```

## Troubleshooting

### Common Issues

#### Build Failures
```bash
# Clear cache and rebuild
rm -rf node_modules package-lock.json
npm install
npm run build

# Check for TypeScript errors
npm run type-check

# Check for linting errors
npm run lint
```

#### Memory Issues
```bash
# Increase Node.js memory limit
export NODE_OPTIONS="--max-old-space-size=4096"
npm run build
```

#### Deployment Failures
```bash
# Check environment variables
printenv | grep VITE_

# Verify build output
ls -la dist/

# Check network connectivity
curl -I https://api.querybuilder.com/health
```

### Performance Issues
```typescript
// Monitor performance in production
const observer = new PerformanceObserver((list) => {
  list.getEntries().forEach((entry) => {
    if (entry.duration > 100) { // Log slow operations
      logger.warn(`Slow operation: ${entry.name} took ${entry.duration}ms`);
    }
  });
});

observer.observe({ entryTypes: ['measure'] });
```

### Error Diagnosis
```typescript
// Enhanced error logging
window.addEventListener('error', (event) => {
  logger.error('Global error:', event.error, {
    filename: event.filename,
    lineno: event.lineno,
    colno: event.colno
  });
});

window.addEventListener('unhandledrejection', (event) => {
  logger.error('Unhandled promise rejection:', event.reason);
});
```

### Health Check Script
```bash
#!/bin/bash
# scripts/health-check.sh

URL="https://yourapp.com"
TIMEOUT=30

echo "Checking application health..."

# Check if application is accessible
if curl -f --max-time $TIMEOUT "$URL/health" > /dev/null 2>&1; then
    echo "✅ Application is healthy"
else
    echo "❌ Application is not responding"
    exit 1
fi

# Check specific endpoints
ENDPOINTS=("/" "/config" "/eligibility" "/ranking")

for endpoint in "${ENDPOINTS[@]}"; do
    if curl -f --max-time $TIMEOUT "$URL$endpoint" > /dev/null 2>&1; then
        echo "✅ $endpoint is accessible"
    else
        echo "❌ $endpoint is not accessible"
        exit 1
    fi
done

echo "All health checks passed!"
```

---

*Last Updated: July 2025*
*Version: 1.0.0*