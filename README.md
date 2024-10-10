# Device Buyback Website

## Project Overview

This project is a Device Buyback Website developed as part of the COMPETE's W3 Contest during Student Week. It was created by Abdul Waheed and Farrukh Ahmad Siddiqui.

The system aims to facilitate users in selling their devices, featuring both user and admin interfaces for handling transactions. It streamlines the process of selling a device, collecting necessary details, verifying the user, setting an automatically generated estimated price, and processing payments.

## Tech Stack

Our project utilizes the following technologies:

- **Frontend:**
  - Next.js (React framework)
  - TypeScript
  - Tailwind CSS

- **Backend:**
  - Firebase (Authentication, Firestore, Storage)

- **Deployment:**
  - Vercel (for hosting the Next.js application)

## Key Features

### User Side:
1. Device Selection and Details Input
2. Pickup or Parcel Service Selection
3. User Identity Verification
4. Automatic Price Estimation
5. Price Confirmation and Approval
6. Payment Method Selection

### Admin Side:
1. User Request Management
2. Built-in Chatbot for User Communication
3. Price Finalization
4. Details Confirmation
5. Analytics Dashboard

## Project Structure

- `app/`: Next.js app directory
  - `layout.tsx`: Root layout component
  - `page.tsx`: Home page component
  - `globals.css`: Global styles
  - `admin/`: Admin-related pages and components
- `components/`: Reusable React components
  - `Layout.tsx`: Main layout component
  - `PriceEstimation.tsx`: Component for estimating device prices
  - `DeviceDetails.tsx`: Component for displaying and inputting device details
- `firebase_storage_rules`: Firebase Storage security rules

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up Firebase configuration
4. Run the development server: `npm run dev`
5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Deployment

The project is configured for easy deployment on Vercel. Connect your GitHub repository to Vercel for automatic deployments.

## Competition Information

This project was developed as part of the COMPETE's W3 Contest during Student Week. We, Abdul Waheed and Farrukh Ahmad Siddiqui, participated as a team and successfully demonstrated our project during the competition.

## Contributors

- Abdul Waheed
- Farrukh Ahmad Siddiqui

## Evaluation Criteria

The project was evaluated based on the following criteria:

1. Functionality: Effectiveness of the buyback process, from user input to admin verification, price estimation, and payment processing.
2. User Experience: Ease of navigation and completion of the process for users.
3. Security: Implementation of data protection, user identity verification, secure payment handling, and management of device information.
4. Admin Experience: Efficiency in managing user requests, communication through the chatbot, verifying device details, finalizing prices, and accessing analytics for operational insights.
