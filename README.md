# Role-Based Access Control (RBAC) Simulator

This interactive educational tool was developed as part of an internship project to demonstrate Access Control Vulnerabilities (OWASP A01) and how Role-Based Access Control (RBAC) effectively prevents them.

The simulator allows users to explore security concepts hands-on by switching roles, toggling backend security measures, and attempting to "hack" the application using a simulated console.

# Features

Role Switching: Instantly toggle between Guest, User, and Admin identities to observe how the user interface adapts to different privilege levels.

# Security Modes:

Vulnerable Mode: Relies on "Security by Obscurity" (hiding buttons in the UI). This mode is designed to be vulnerable to IDOR (Insecure Direct Object References) and forced browsing.

Secure Mode: Implements strict server-side role validation to ensure requests are authorized before processing.

Hacker Console: A built-in terminal interface that allows users to send raw API requests (GET, POST, DELETE) to restricted endpoints, bypassing the frontend UI.

Real-time Logging: Watch how the simulated backend processes requests and authorizes or denies them in real-time.

# Tech Stack

Frontend: React (Vite)

Styling: Tailwind CSS

Icons: Lucide React

Installation & Setup

# Prerequisites:
Ensure you have Node.js installed on your computer.

# Install Dependencies:
Open your terminal in the project folder and run:

""npm install""


Run the Simulator:
Start the local development server:

""npm run dev""


Open in Browser:
Click the link provided in the terminal (usually http://localhost:5173).

# Usage Scenarios

# Scenario 1: The UI Illusion (Vulnerable Mode)

Set the Backend Security toggle to VULNERABLE.

Log in as a Guest.

Notice that the "Admin Panel" button is hidden from view.

Open the Hacker Console at the bottom.

Select DELETE and type /api/admin/users.

Click SEND_PACKET.

# Result:
The request succeeds because the backend did not check your role, demonstrating a common vulnerability where security is left solely to the frontend.

# Scenario 2: True Security (Secure Mode)

Set the Backend Security toggle to SECURE.

Log in as a Guest.

Attempt the same exploit in the Hacker Console.

# Result:
You receive a 403 Forbidden error. The backend verified your session role before processing the request, successfully preventing the unauthorized action.

# Project Structure

src/App.jsx: Contains the main application logic, including the mock backend implementation.

src/index.css: Tailwind directives and custom scrollbar styles.

tailwind.config.js: Tailwind CSS configuration.

# License

This project was created for educational purposes as part of an internship. Feel free to modify and share it to help others learn about web security.