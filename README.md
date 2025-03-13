# Round-Robin Coupon Distribution System

A Next.js application that distributes coupons to guest users in a round-robin manner, with built-in abuse prevention mechanisms.

## Features

- **Round-Robin Coupon Distribution**: Coupons are distributed sequentially to ensure even distribution.
- **Guest Access**: Users can claim coupons without creating an account or logging in.
- **Abuse Prevention**:
  - IP Tracking: Records user IP addresses to prevent multiple claims from the same IP within a specified time frame.
  - Cookie Tracking: Uses browser cookies to identify returning users and enforce claim limits.
- **User Feedback**: Clear messages for successful claims and waiting periods.

## Tech Stack

- **Frontend**: Next.js with React and Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: postgresql
- **Deployment**: Ready for deployment on Vercel or similar platforms

## Setup Instructions

### Prerequisites

- Node.js (v18 or later)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/coupon-distribution.git
   cd coupon-distribution
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up the database:
   ```bash
   npx prisma migrate dev --name init
   ```

4. Seed the database with sample coupons:
   ```bash
   npm run seed
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```
# Local Development
DATABASE_URL="file:./dev.db"

# Production (Neon PostgreSQL)
# DATABASE_URL="postgresql://[username]:[password]@[hostname]/[database]?sslmode=require"

COOKIE_SECRET="your-secret-key"
CLAIM_COOLDOWN_MINUTES=60
```

- `DATABASE_URL`: Connection string for your database (SQLite for local, Neon PostgreSQL for production)
- `COOKIE_SECRET`: Secret key for cookie encryption
- `CLAIM_COOLDOWN_MINUTES`: Time (in minutes) a user must wait before claiming another coupon
