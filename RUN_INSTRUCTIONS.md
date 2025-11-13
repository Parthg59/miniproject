# How to Run the Expense Tracker App

## Prerequisites
- Node.js (v14 or higher)
- npm (comes with Node.js)

## Installation & Setup

1. Install dependencies:
```bash
npm install --legacy-peer-deps
```

2. Make sure the `.env` file exists with:
```
REACT_APP_BACKEND_URL=http://localhost:8000
REACT_APP_ENABLE_VISUAL_EDITS=false
```

## Running the App

### Option 1: Using npm (recommended)
```bash
npm start
```

### Option 2: Using npm dev script
```bash
npm run dev
```

### Option 3: Build for production
```bash
npm run build
```

## Important Notes

1. **No yarn needed**: The app now works with npm commands
2. **No local storage issues**: All data is stored in sessionStorage (browser memory)
3. **Backend required**: The app expects a backend API at `http://localhost:8000`

## Default Login Credentials

Username: `parth`
Password: `12345`

## Features Working

✅ Login/Logout
✅ Create multiple wallets
✅ Add/Edit/Delete transactions
✅ Budget planning
✅ Category-wise spending analytics
✅ Monthly trends
✅ Export transactions to CSV

## Port

The app runs on: `http://localhost:3000`

## Troubleshooting

If you get errors:
1. Delete `node_modules` folder
2. Delete `package-lock.json` file
3. Run `npm install --legacy-peer-deps` again
4. Run `npm start`
