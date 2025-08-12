# MongoDB Setup Instructions

## Local MongoDB Setup

### Option 1: Docker (Recommended)
```bash
# Pull MongoDB image
docker pull mongo:latest

# Run MongoDB container
docker run -d \
  --name mongodb \
  -p 27017:27017 \
  -e MONGO_INITDB_ROOT_USERNAME=admin \
  -e MONGO_INITDB_ROOT_PASSWORD=password \
  mongo:latest

# Update .env.local
MONGODB_URI=mongodb://admin:password@localhost:27017/gold-loan-finance?authSource=admin
```

### Option 2: Native Installation

#### macOS (using Homebrew)
```bash
# Install MongoDB
brew tap mongodb/brew
brew install mongodb-community

# Start MongoDB service
brew services start mongodb-community

# Verify installation
mongosh
```

#### Ubuntu/Debian
```bash
# Import MongoDB public GPG key
wget -qO - https://www.mongodb.org/static/pgp/server-7.0.asc | sudo apt-key add -

# Add MongoDB repository
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list

# Update package database
sudo apt-get update

# Install MongoDB
sudo apt-get install -y mongodb-org

# Start MongoDB service
sudo systemctl start mongod

# Enable MongoDB to start on boot
sudo systemctl enable mongod

# Verify installation
mongosh
```

#### Windows
1. Download MongoDB Community Server from [MongoDB Download Center](https://www.mongodb.com/try/download/community)
2. Run the installer and follow the setup wizard
3. Start MongoDB service:
   ```cmd
   net start MongoDB
   ```

## Cloud MongoDB Setup (MongoDB Atlas)

1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a free account
3. Create a new cluster
4. Set up database access (username/password)
5. Set up network access (IP whitelist)
6. Get your connection string
7. Update `.env.local`:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/gold-loan-finance?retryWrites=true&w=majority
   ```

## Verify Connection

After setting up MongoDB, you can verify the connection by:

1. Starting the development server:
   ```bash
   npm run dev
   ```

2. Navigate to http://localhost:3000
3. Try adding a loan - if successful, MongoDB is working correctly

## Troubleshooting

### Connection Refused
- Ensure MongoDB service is running
- Check if port 27017 is available
- Verify connection string in `.env.local`

### Authentication Failed
- Check username/password in connection string
- Ensure proper authentication database is specified

### Network Issues (Cloud)
- Check IP whitelist in MongoDB Atlas
- Verify network connectivity
- Check firewall settings