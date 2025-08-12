# Gold Loan Manager

A comprehensive Next.js application for managing gold loans for individual users. Track loans taken and given, monitor interest calculations, analyze gold portfolio, and get detailed P&L reports.

## Features

### 🔐 Authentication & Security
- **Single User System**: Secure single-user authentication
- **Protected Routes**: All API endpoints require authentication
- **Session Management**: JWT-based session handling with NextAuth.js
- **Password Security**: Bcrypt password hashing for security

### 🏦 Loan Management
- **Add Loans**: Create loans taken or given with detailed information
- **Track Gold**: Monitor gold quantity and purity for each loan
- **Interest Calculation**: Real-time interest calculation based on elapsed time
- **Status Management**: Mark loans as active, paid, or overdue
- **Search & Filter**: Find loans by name, type, status, and more

### 📊 Financial Analytics
- **P&L Dashboard**: Real-time profit and loss analysis
- **Income Tracking**: Monitor income from loans given out
- **Expense Tracking**: Track expenses from loans taken
- **Interest Rate Analysis**: Average rates, spreads, and performance metrics
- **ROI Analysis**: Return on investment for individual loans

### 🥇 Gold Portfolio Management
- **Gold Tracking**: Monitor gold quantities in grams
- **Purity Management**: Track gold purity (10K, 14K, 18K, 22K, 24K)
- **Net Position**: Calculate gold surplus or deficit
- **Portfolio Overview**: Comprehensive gold asset management

### 📈 Advanced Features
- **Top Performing Loans**: Identify most profitable loans given
- **Expensive Loans**: Track costliest loans taken
- **Interactive Dashboard**: Beautiful, responsive UI
- **Real-time Calculations**: Live interest and P&L updates
- **Overdue Detection**: Automatic overdue loan identification

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Database**: MongoDB with Mongoose
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Date Handling**: date-fns
- **UI Components**: Custom responsive components

## Getting Started

### Prerequisites

- Node.js 18.0 or later
- MongoDB (local or cloud instance)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd gold-loan-manager
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory:
   ```env
   MONGODB_URI=mongodb://localhost:27017/gold-loan-manager
   NEXTAUTH_SECRET=gold-loan-manager-secret-key-2024
   NEXTAUTH_URL=http://localhost:3000
   ```

   **For MongoDB Atlas (Cloud):**
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/gold-loan-manager
   NEXTAUTH_SECRET=gold-loan-manager-secret-key-2024
   NEXTAUTH_URL=http://localhost:3000
   ```

4. **Start MongoDB** (if running locally)
   ```bash
   # On macOS with Homebrew
   brew services start mongodb/brew/mongodb-community

   # On Ubuntu
   sudo systemctl start mongod

   # On Windows
   net start MongoDB
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Set up the default user account**
   
   Navigate to [http://localhost:3000/setup](http://localhost:3000/setup) and click "Create Default User"

7. **Login to the application**
   
   Navigate to [http://localhost:3000/login](http://localhost:3000/login) and use:
   - **Email:** admin@goldloan.com
   - **Password:** admin123

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── analytics/          # P&L and analytics endpoints
│   │   └── loans/              # CRUD operations for loans
│   ├── loans/                  # Loan management page
│   ├── profile/                # P&L analysis page
│   └── page.tsx               # Dashboard home page
├── components/
│   ├── LoanCard.tsx           # Individual loan display component
│   └── LoanForm.tsx           # Add/edit loan form
├── lib/
│   └── mongodb.ts             # Database connection utility
└── models/
    └── Loan.ts                # Mongoose loan schema
```

## API Endpoints

**Note: All API endpoints require authentication. Include the session cookie or JWT token with requests.**

### Authentication
- `GET/POST /api/auth/[...nextauth]` - NextAuth.js authentication endpoints
- `POST /api/setup-user` - Create default user (one-time setup)

### Loans
- `GET /api/loans` - Fetch all loans (requires auth)
- `POST /api/loans` - Create a new loan (requires auth)
- `GET /api/loans/[id]` - Get loan by ID (requires auth)
- `PUT /api/loans/[id]` - Update loan (requires auth)
- `DELETE /api/loans/[id]` - Delete loan (requires auth)

### Analytics
- `GET /api/analytics` - Get comprehensive P&L and portfolio analytics (requires auth)

## Database Schema

### Loan Document
```typescript
{
  type: 'taken' | 'given',           // Loan direction
  principalAmount: number,           // Principal amount in currency
  interestRate: number,              // Annual interest rate (%)
  startDate: Date,                   // Loan start date
  endDate: Date,                     // Loan end date
  monthsRemaining: number,           // Months remaining
  goldQuantity: number,              // Gold quantity in grams
  goldPurity: number,                // Gold purity in karats
  lenderName?: string,               // For loans taken
  borrowerName?: string,             // For loans given
  description?: string,              // Optional description
  status: 'active' | 'paid' | 'overdue',
  createdAt: Date,
  updatedAt: Date
}
```

## Usage Guide

### Adding a New Loan

1. Click "Add New Loan" from the dashboard or loans page
2. Select loan type (Taken or Given)
3. Enter principal amount and interest rate
4. Set start and end dates
5. Input gold quantity and purity
6. Add lender/borrower name as required
7. Submit the form

### Viewing P&L Analysis

1. Navigate to "Profile & P&L" from the main menu
2. View comprehensive financial overview:
   - Total income from loans given
   - Total expenses from loans taken
   - Net profit/loss
   - Gold portfolio summary
   - Interest rate analysis
   - Top performing and expensive loans

### Managing Loan Status

1. Go to the loans management page
2. Use the action buttons on each loan card:
   - Mark as Paid
   - Mark as Overdue
   - Edit loan details
   - Delete loan

## Financial Calculations

### Interest Calculation
```
Monthly Interest Rate = Annual Rate / 12 / 100
Months Elapsed = (Current Date - Start Date) / 30 days
Current Interest = Principal × Monthly Rate × Months Elapsed
Total Amount = Principal + Current Interest
```

### P&L Calculation
```
Income = Sum of all interest earned from loans given
Expenses = Sum of all interest paid on loans taken
Net P&L = Income - Expenses
```

## Features in Detail

### Dashboard
- Quick overview of all loans and financial position
- Key metrics and performance indicators
- Quick action buttons for common tasks
- Gold portfolio summary

### Loan Management
- Comprehensive CRUD operations
- Advanced filtering and search
- Status management
- Real-time interest calculations

### Profile & Analytics
- Detailed P&L breakdown
- Portfolio analysis
- Performance rankings
- Interest rate comparisons
- Historical data insights

## Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically

### Other Platforms
- **Netlify**: Configure build settings for Next.js
- **Railway**: Direct deployment with MongoDB addon
- **Heroku**: Use Next.js buildpack

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `MONGODB_URI` | MongoDB connection string | Yes |
| `NEXTAUTH_SECRET` | Secret for authentication | Yes |
| `NEXTAUTH_URL` | Application URL | Yes |

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, please open an issue in the GitHub repository or contact the development team.

---

**Built with ❤️ using Next.js, TypeScript, and MongoDB**
