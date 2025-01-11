**Features
Dynamic rendering with EJS templates.
Secure session management with express-session.
QR code generation and PDF creation.
Database connectivity using MSSQL.**

Getting Started
To set up and run this application on your local machine, please follow the steps below:

Prerequisites
Ensure you have the following installed on your system:

Node.js (v16.x or later recommended)
npm (Node Package Manager)

Installation
Clone this repository to your local machine using the following command:
git clone https:https://github.com/MohamedimranM/Auxwall-Task.git

Install Dependencies
Install all required Node.js packages listed in package.json:
npm install

Required Dependencies
The project uses the following key dependencies:

body-parser: To parse incoming request bodies (^1.20.3)
ejs: For rendering dynamic HTML templates (^3.1.10)
express: A fast web framework for Node.js (^4.21.2)
express-session: For session management (^1.18.1)
fs: File system module for file operations (^0.0.1-security)
mssql: Microsoft SQL Server client for database connectivity (^11.0.1)
nodemon: For automatically restarting the server during development (^3.1.9)
path: Utilities for file and directory paths (^0.12.7)
pdfkit: For generating PDFs programmatically (^0.16.0)
qr-image: To generate QR codes as image streams (^3.2.0)
qrcode: An additional library for generating QR codes (^1.5.4)

All dependencies will be automatically installed when running npm install.

Running the Application
To start the application, use the following command:
npm start

