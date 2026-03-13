# SmartBite - AI Powered Food Recommendation Platform

SmartBite is a full-stack food discovery and recommendation platform that helps users explore food menu items and receive intelligent suggestions through a chatbot interface.

The system allows users to search dishes, explore menu data, and interact with **NutriBot**, a chatbot designed to provide nutritional insights and food recommendations.

---

##  Features

*  Smart search for food menu items
*  NutriBot chatbot for food suggestions and nutrition insights
*  Structured food menu dataset management
*  Scripts to update and maintain food items
*  Fast full-stack application using Next.js

---

## Project Architecture

### Frontend

* Next.js
* React
* TypeScript
* Tailwind CSS

Provides the user interface for:

* browsing menu items
* interacting with the chatbot
* viewing food recommendations

### Backend

* Next.js API Routes
* Node.js

Handles:

* chatbot requests
* food search queries
* menu updates
* middleware processing

### Database Layer

* Drizzle ORM

Used to manage structured food menu data and database interactions.

### Data Sources

Food dataset stored in JSON files such as:

* `menu_dump.json`
* `all_menu.json`

These contain information like:

* dish name
* category
* ingredients
* pricing

---

##  NutriBot Chat System

NutriBot allows users to interact with the menu conversationally.

Example queries:

* "Show healthy snacks"
* "Find vegetarian dishes"
* "Suggest something like pav bhaji"

The chatbot processes requests and returns relevant menu items from the dataset.

---

##  Project Structure

```
SmartBite
│
├── src                # Application source code
├── public             # Static assets
├── drizzle            # Database schema and ORM configuration
├── menu_dump.json     # Food menu dataset
├── all_menu.json      # Structured menu data
├── middleware.ts      # Request middleware
├── search-items.ts    # Menu search utilities
├── update-item.ts     # Food item update scripts
└── PAYMENT_SETUP_GUIDE.md
```

---

## ⚙️ Installation

Clone the repository:

```
git clone https://github.com/shreyabbgn-source/-SmartBite
```

Install dependencies:

```
npm install
```

Run the development server:

```
npm run dev
```

Open in browser:

```
http://localhost:3000
```

---

##  Tech Stack

* Next.js
* React
* TypeScript
* Tailwind CSS
* Node.js
* Drizzle ORM
* JSON datasets

---

##  Future Improvements

* AI-based personalized food recommendations
* Nutrition analysis using machine learning
* Payment gateway integration
* User accounts and order history

---

##  Author

**Shreya Gupta**

BTech(AI/ML) Student | Exploring AI & Cybersecurity
