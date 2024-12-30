# Inventory Management System

## Overview
The Inventory Management System is a modern web application designed to help businesses efficiently manage their inventory, track sales, and monitor stock levels. Built with React.js and Firebase, it provides real-time updates and a user-friendly interface for managing all aspects of inventory and sales.

## Features

### Inventory Management
- Add, edit, and delete inventory items
- Track item quantities and categories
- View detailed inventory information
- Manage multiple categories of items

### Sales Tracking
- Record sales transactions
- Track sales by item and date
- View sales trends and statistics
- Manage multiple sales records

### Stock Overview
- View current stock levels
- Identify low stock and out-of-stock items
- Export stock reports as PDF
- Monitor stock distribution across categories

### Reporting
- Generate sales reports
- View inventory statistics
- Export reports in PDF format
- Analyze sales trends and patterns

### User Interface
- Modern and responsive design
- Intuitive navigation and layout
- Real-time data updates
- Interactive charts and tables

## Technologies Used
- **Frontend**: React.js, Tailwind CSS
- **Backend**: Firebase (Firestore, Authentication)
- **Charting**: Chart.js
- **PDF Generation**: jsPDF
- **Routing**: React Router

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm (v8 or higher)
- Firebase project with Firestore enabled

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/inventory-management-system.git
   ```
2. Navigate to the project directory:
   ```bash
   cd inventory-management-system
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Create a `.env` file in the root directory with your Firebase configuration:
   ```env
   VITE_FIREBASE_API_KEY=your-api-key
   VITE_FIREBASE_AUTH_DOMAIN=your-auth-domain
   VITE_FIREBASE_PROJECT_ID=your-project-id
   VITE_FIREBASE_STORAGE_BUCKET=your-storage-bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
   VITE_FIREBASE_APP_ID=your-app-id
   ```
5. Start the development server:
   ```bash
   npm run dev
   ```
6. Open your browser and navigate to `http://localhost:5173`

## Changelog

### [1.0.0] - Initial Release
- Basic inventory management features
- Sales tracking functionality
- Stock overview and reporting
- PDF export capability

### [1.1.0] - UI Improvements
- Modernized user interface
- Added interactive charts
- Improved table layouts
- Enhanced mobile responsiveness

### [1.2.0] - Enhanced Features
- Multi-item sales recording
- Edit and delete functionality for sales
- Improved PDF export formatting
- Added stock status indicators

### [1.3.0] - Bug Fixes and Optimizations
- Fixed PDF export issues
- Improved data fetching performance
- Enhanced error handling
- Optimized component structure

## Contributing
Contributions are welcome! Please follow these steps:
1. Fork the repository
2. Create a new branch (`git checkout -b feature/YourFeatureName`)
3. Commit your changes (`git commit -m 'Add some feature'`)
4. Push to the branch (`git push origin feature/YourFeatureName`)
5. Open a pull request

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact
For any inquiries or support, please contact:
- **Email**: support@inventorysystem.com
- **Website**: https://inventorysystem.com
