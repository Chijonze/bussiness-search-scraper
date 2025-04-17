# bussiness-search-scraper
A web application that searches for businesses using the Google Places API and scrapes contact details (emails and phone numbers) from their websites.
📌 Overview
This project consists of:

Backend (Node.js + Express + Cheerio):

Fetches business listings from the Google Places API.

Scrapes emails and phone numbers from business websites.

Frontend (React + TypeScript + Vite):

Allows users to search for businesses (e.g., "Clothing in Lagos").

Displays results in a structured table with Name, Address, Website, and Phone Number.
✨ Features
✅ Search Businesses – Query Google Places for business listings.
✅ Scrape Contact Info – Extract emails and phone numbers from websites.
✅ Responsive UI – Clean, user-friendly table display.
✅ Error Handling – Gracefully handles API failures and missing data.

🛠 Tech Stack
Backend	Frontend
Node.js	React
Express	TypeScript
Axios	Vite
Cheerio (Web Scraping)	Tailwind CSS
Google Places API	Axios (HTTP Requests)

🚀 Setup & Usage
Clone the Repository
git clone https://github.com/yourusername/business-search-scraper.git
cd business-search-scraper

Backend Setup
cd backend
npm install
cp .env.example .env  # Add your Google Places API key
npm start

Frontend Setup
cd frontend
npm install
npm run dev
Open http://localhost:5173 to use the app.

📜 License
MIT: open-source
