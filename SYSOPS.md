# DevOps & Systems Operations — Project: CHECK

This document outlines the DevOps practices, infrastructure, and reliability measures implemented in the **CHECK** application to transition it from a standard MERN app to a production-grade portfolio project.

---

## 🏗️ 1. Infrastructure & Architecture

### Deployment Strategy
- **Frontend:** React (Vite) deployed on **Vercel** for optimal global delivery (Edge network).
- **Backend:** Node.js (Express) deployed on **Render** (Web Service).
- **Database:** **MongoDB Atlas** (Managed Service) with VPC peering potential.

### Infrastructure as Code (IaC)
To ensure reproducibility and avoid "Configuration Drift":
- `render.yaml`: Defines the backend service, environment variables, and build/start commands.
- `vercel.json`: Defines frontend routing, caching headers, and build configuration.
- **Benefit:** The entire infrastructure setup can be rebuilt from scratch just by connecting the repository to the cloud providers.

---

## 🐳 2. Containerization (Environment Parity)

We use **Docker** to eliminate the "Works on my Machine" problem:
- **Backend Dockerfile:** Uses `node:20-alpine` for a minimal footprint.
- **Frontend Dockerfile:** Implements a **Multi-stage build**:
  - **Stage 1 (Build):** Compiles the Vite app.
  - **Stage 2 (Serve):** Uses **Nginx** to serve the static assets, simulating a real-world production web server.
- **Docker Compose:** Orchestrates both services locally with a single command: `docker-compose up`.

---

## 🔄 3. CI/CD Pipeline (Quality Gates)

Automated via **GitHub Actions** (`.github/workflows/ci.yml`):
- **On Push/PR:** The pipeline automatically triggers.
- **Dependency Audit:** Runs `npm audit` on both frontend and backend to block deployments with "High" severity vulnerabilities.
- **Linting:** Enforces code style consistency using ESLint.
- **Build Verification:** Ensures the app actually builds before allowing a merge, preventing "broken main" syndrome.

---

## 🛡️ 4. Security & Compliance (DevSecOps)

- **Shift-Left Security:** Dependency scanning is integrated into the developer workflow via CI.
- **Secret Management:** Secrets are injected into the environment via the cloud provider's encrypted store (never committed to Git).
- **Security Headers:** Implemented via `cors` and `vercel.json` headers.

---

## 📈 5. Monitoring & Observability

- **Health Checks:** A dedicated `/api/health` endpoint monitors:
  - Server Uptime
  - Database connectivity status
  - Environment identification
- **Active Monitoring:** (Recommended) Integration with **UptimeRobot** or **Better Stack** to ping the health endpoint every 5 minutes and alert on downtime.
- **Logging:** Structured error logging implemented in the Express Global Error Handler.

---

## 🛠️ DevOps Interview Quick-Ref

**Q: Why use Docker if you're already on Vercel/Render?**
> "While Vercel/Render manage the host, Docker provides me with a local environment that is 100% identical to production. It also makes the project 'Provider Agnostic'—I could move this entire stack to AWS EC2 or DigitalOcean Droplets in minutes."

**Q: Tell me about your CI/CD approach.**
> "I implemented 'Quality Gates.' Every PR is audited for security vulnerabilities and build errors. This reduces technical debt and ensures 'main' is always deployable."

**Q: How do you handle secrets?**
> "I follow the 12-Factor App methodology. Secrets are strictly managed in the environment. I've also implemented CI checks to ensure no `.env` files or hardcoded keys ever reach the repository."
