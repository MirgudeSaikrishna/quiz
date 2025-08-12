# Gold Loan Finance Application

A comprehensive Next.js application for managing gold loan portfolios. Track loans taken and given, monitor interest rates, gold quantities, and analyze your financial position.

## Features

- **Dashboard**: Overview of your loan portfolio with key metrics
- **Loan Management**: Add, edit, and delete loans (both taken and given)
- **Financial Analysis**: Detailed P&L analysis and cash flow tracking
- **Gold Portfolio**: Track gold quantities and purity for each loan
- **Profile Section**: Comprehensive financial profile with income/expense breakdown
- **MongoDB Integration**: Pure MongoDB database with Mongoose ODM

## Key Features

### Loan Types
- **Loans Taken**: Track money you've borrowed against gold
- **Loans Given**: Track money you've lent to others against their gold

### Financial Tracking
- Principal amounts and interest rates
- Monthly payment calculations
- Total interest and amount calculations
- Net P&L analysis
- Monthly cash flow projections

### Gold Management
- Gold quantity tracking (in grams)
- Gold purity tracking (percentage)
- Net gold position calculation

## Tech Stack

- **Frontend**: Next.js 14 with TypeScript
- **Styling**: Tailwind CSS
- **Database**: MongoDB with Mongoose
- **Icons**: Lucide React
- **Date Handling**: date-fns

## Prerequisites

- Node.js 18+ 
- MongoDB (local or cloud instance)
- npm or yarn

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd gold-loan-finance
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.local.example .env.local
   ```
   
   Edit `.env.local` and set your MongoDB connection string:
   ```
   MONGODB_URI=mongodb://localhost:27017/gold-loan-finance
   ```

4. **Start MongoDB** (if using local instance)
   ```bash
   # On macOS with Homebrew
   brew services start mongodb-community
   
   # On Ubuntu/Debian
   sudo systemctl start mongod
   
   # On Windows
   net start MongoDB
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Usage

### Adding a Loan

1. Navigate to "Add Loan" from the navigation
2. Select loan type (Taken or Given)
3. Fill in the required details:
   - Principal amount
   - Interest rate (% per annum)
   - Start and end dates
   - Months remaining
   - Gold quantity (grams)
   - Gold purity (%)
   - Borrower/Lender name
4. Submit the form

### Dashboard Overview

The dashboard provides:
- Total loans count
- Net P&L
- Net gold position
- Monthly cash flow
- Detailed financial summaries

### Profile Analysis

The profile section includes:
- Income vs expenses breakdown
- Monthly cash flow analysis
- Gold portfolio analysis
- Upcoming payments

## Database Schema

### Loan Model
```typescript
{
  type: 'taken' | 'given',
  principalAmount: number,
  interestRate: number,
  startDate: Date,
  endDate: Date,
  monthsRemaining: number,
  goldQuantity: number, // in grams
  goldPurity: number, // percentage
  borrowerName?: string, // for loans given
  lenderName?: string, // for loans taken
  status: 'active' | 'completed' | 'defaulted',
  monthlyPayment: number, // calculated
  totalInterest: number, // calculated
  totalAmount: number // calculated
}
```

## API Endpoints

- `GET /api/loans` - Get all loans
- `POST /api/loans` - Create new loan
- `PUT /api/loans/[id]` - Update loan
- `DELETE /api/loans/[id]` - Delete loan
- `GET /api/dashboard` - Get dashboard statistics

## Calculations

### Monthly Payment
The application uses the standard loan payment formula:
```
PMT = P * (r * (1 + r)^n) / ((1 + r)^n - 1)
```
Where:
- P = Principal amount
- r = Monthly interest rate (annual rate / 12)
- n = Total number of months

### Total Interest
```
Total Interest = (Monthly Payment × Total Months) - Principal Amount
```

## Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy

### Other Platforms
The application can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/gold-loan-finance` |

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please open an issue in the repository.