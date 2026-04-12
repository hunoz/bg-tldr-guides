# @rulesnap/infra

AWS CDK infrastructure for RuleSnap — S3 static hosting with CloudFront distribution, Route 53 DNS, and game manual PDF hosting.

## Architecture

```
                    ┌─────────────┐
                    │  Route 53   │
                    │  DNS Record │
                    └──────┬──────┘
                           │
                           ▼
┌──────────────────────────────────────────────┐
│              CloudFront Distribution          │
│                                              │
│  ┌────────────────┐  ┌────────────────────┐  │
│  │ Default: /*    │  │ Path: /manuals/*   │  │
│  │                │  │                    │  │
│  │ OG Meta Fn     │  │ Direct pass-thru   │  │
│  │ (viewer req)   │  │                    │  │
│  └───────┬────────┘  └────────┬───────────┘  │
│          │                    │              │
│  SPA routing:                 │              │
│  403/404 → index.html         │              │
└──────────┬────────────────────┬──────────────┘
           │                    │
           ▼                    ▼
    ┌──────────────┐    ┌──────────────┐
    │  S3: SPA     │    │  S3: Manuals │
    │  (app dist)  │    │  (PDFs)      │
    └──────────────┘    └──────────────┘
```

### How it works

1. Route 53 points the domain (e.g. `rulesnap.com`) to the CloudFront distribution via an A record alias
2. CloudFront serves the SPA from an S3 bucket with origin access control (no public bucket access)
3. A CloudFront Function (`og-meta-function.js`) runs on viewer requests to return Open Graph meta tags for social media crawlers while passing normal browser requests through
4. SPA routing is handled by CloudFront error responses — 403 and 404 errors return `index.html` so client-side routing works for all paths
5. Game manual PDFs are served from a separate S3 bucket under the `/manuals/*` path
6. HTTPS is enforced via an ACM certificate validated through DNS, with TLS 1.2 minimum
7. HTTP/2 and HTTP/3 are enabled with compression and optimized caching

### Security

- Both S3 buckets block all public access — content is only accessible through CloudFront
- CloudFront uses origin access control (OAC) for S3 access
- Security response headers are applied via CloudFront's managed security headers policy
- TLS 1.2 minimum protocol version

## Stacks

| Stack | Purpose |
|-------|---------|
| `DnsStack` | Imports the existing Route 53 hosted zone by ID |
| `SpaStack` | S3 buckets, CloudFront distribution, ACM certificate, DNS record, OG meta function, and S3 deployments |

## Prerequisites

- Node.js 18+
- pnpm
- AWS CLI configured with credentials
- CDK bootstrapped in the target account/region

## Environment Variables

Required for all CDK commands:

| Variable | Description | Example |
|----------|-------------|---------|
| `ZONE_ID` | Route 53 hosted zone ID | `Z1234567890` |
| `ZONE_NAME` | Route 53 zone name | `rulesnap.com` |
| `DOMAIN_NAME` | Full domain for the app | `rulesnap.com` |
| `AWS_ACCOUNT` | AWS account ID | `123456789012` |
| `AWS_REGION` | AWS region | `us-east-1` |

## Commands

```bash
# First-time setup — bootstrap CDK in your account
pnpm bootstrap

# Preview changes
pnpm diff

# Deploy all stacks
pnpm deploy

# Synthesize CloudFormation templates (no deploy)
pnpm synth

# Tear down all stacks
pnpm destroy
```

## Deployment Flow

1. Build the web app in `packages/app` (`pnpm build` → outputs to `dist/`)
2. Run `pnpm deploy` in this package — CDK uploads `dist/` to the SPA S3 bucket and manual PDFs to the manuals bucket, then invalidates the CloudFront cache

## Adding Game Manuals

Drop PDF files into `lib/manuals/`. They're deployed to S3 under the `/manuals/` prefix and served at `https://{domain}/manuals/{filename}.pdf`.
