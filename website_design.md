<user_request>Build an end-to-end full-stack web and mobile application called "Campus Canteen" with the following specifications:

🧍‍♂️ User Roles:

Student User: login/signup, view menu, place orders, make payments, view order status, get notifications. Therefore create a separate pages for staff user and admin login and then inside the contents should be of their specific roles.

Canteen Staff: login to a dashboard to see live orders, mark them as "In Progress," "Ready," or "Completed," and update menu items or availability.

Admin: manage all users, view analytics (sales, best-selling items, peak hours), edit menu, and monitor complaints or refund requests.

📱 Student-Side Features:

Student authentication with email/OTP login

Real-time menu with food items, price, and availability status

Food search & category filter (Breakfast, Snacks, Beverages, etc.)

Add to cart and pre-order with custom pickup time

Online payment (UPI/Card/Wallet). I want it to be real time and the user should be taken to the app like phonepe or the confirmation should appear on the app.

AI-based meal recommendations (based on order history/time of day)

Loyalty points and dynamic offers system

Order status tracking with live updates and countdown

Notifications for confirmation, readiness, or delay

Order history, favorites, and "Reorder" button

🧑‍🍳 Canteen Staff Dashboard:

Real-time order dashboard (auto-refresh)

Mark orders as "In progress," "Ready," or "Completed"

Menu management: add/edit/delete items, toggle availability

Order analytics (number of orders, revenue, most popular dishes)

🧭 Admin Panel:

Manage users (students/staff)

Manage canteen menu and categories

Analytics dashboard (daily revenue, top items, busy hours)

Manage offers, discounts, and loyalty rewards

🧠 Tech Requirements:

Frontend: React.js (for web) + React Native (for mobile) with Tailwind CSS

Backend: Node.js + Express.js

Database: MongoDB (for user profiles, orders, menu, payments)

Real-time updates: Socket.io for live order status tracking

Payment Integration: Razorpay / Stripe sandbox for online payments

Notifications: Firebase Cloud Messaging (for order updates)

AI Recommendation Engine: Use a simple model (TensorFlow.js or local API) based on order frequency/time of day

Deployment: Host backend on Render / Vercel and database on MongoDB Atlas

🎨 Design:

Clean UI with a student-friendly feel (bright colors, rounded cards, food imagery).

Responsive for both mobile and desktop views.

Include animations (Framer Motion) for smooth transitions.

🌟 Bonus Features:

QR code ordering for table service.

AI-powered wait-time prediction based on pending orders.

Offline order caching for low connectivity.

✅ Goal: Create a fully functional, real-time food ordering app that minimizes queues, optimizes staff workflow, and enhances the student canteen experience through AI-driven recommendations and seamless order management.

MENU-:

☕ HOT BEVERAGES

Tea – ₹10

Special Tea – ₹20

Black Tea – ₹20

Lemon Tea – ₹20

Green Tea – ₹25

Filter Coffee – ₹25

NES Coffee – ₹25

Hot Milk – ₹30

🧊 COLD BEVERAGES

Frooti / Appy – ₹15

Cold Drinks – ₹40

Cold Coffee – ₹45

Sweet Lassi – ₹40

Mango Lassi – ₹50

Butter Milk – ₹30

Lime Juice – ₹20

🥣 SOUTH INDIAN SNACKS

Idli Sambar – ₹40

Masala Idli – ₹50

Fry Idli – ₹50

Medu Wada – ₹50

Dahi Wada – ₹60

Sabudana Wada – ₹50

Sabudana Khichdi – ₹60

Aloo Wada Samber – ₹50

🥘 MAHARASHTRIAN SNACKS

Upma – ₹30

Poha – ₹30

Vada Pav – ₹30

Misal Pav – ₹50

Samosa – ₹20

Samosa Chaat – ₹50

Bread Pakoda – ₹30

Kanda Bhajiya – ₹50

Mix Pakoda – ₹60

Aloo Pakoda – ₹50

Cheese Pakoda – ₹90

Paneer Pakoda – ₹80

🫓 PARATHA

Aloo Paratha – ₹70

Mix Paratha – ₹80

Paneer Paratha – ₹90

Cheese Paratha – ₹100

Extra Cheese – ₹15

Chapati – ₹09

🍛 SPECIAL SNACKS

Chole Bhature – ₹90

Pav Bhaji – ₹70

Veg Puff – ₹25

🍳 EGG DISHES

Boiled Egg – ₹25

Egg Bhurji – ₹50

Half Fry – ₹35

Full Fry – ₹40

Paneer Bhurji – ₹70

Mushroom Bhurji – ₹70

🍜 MAGGIE

Plain Maggie – ₹40

Masala Maggie – ₹50

Cheese Maggie – ₹60

Paneer Maggie – ₹70

Chicken Maggie – ₹70

🥪 SANDWICHES / TOAST

Veg S/W – ₹45

Veg Grilled S/W – ₹50

Veg Cheese S/W – ₹50

Veg Cheese Grilled S/W – ₹55

Veg Club S/W – ₹55

Veg Club Grilled – ₹60

Bread Butter – ₹30

Bread Butter Toast – ₹40

Bread Jam Toast – ₹35

Cheese S/W – ₹50

Cheese Grilled S/W – ₹55

Boiled Egg S/W – ₹45

Boiled Egg Grilled S/W – ₹50

Single Egg Fry S/W – ₹35

Egg Full Fry Grilled S/W – ₹55

Egg Half Fry S/W – ₹40

Egg Half Fry Grilled S/W – ₹45

Egg French Toast – ₹45

Veg Mayo S/W – ₹50

Veg Mayo Grilled S/W – ₹55

Chicken Mayo S/W – ₹60

Chicken Mayo Grilled S/W – ₹65

Mexican Cheese Grilled S/W – ₹60

Italian Cheese Grilled S/W – ₹60

Chicken Italian Grilled S/W – ₹70

Cheese Chilli Toast – ₹50

Paneer Grilled S/W – ₹70

Paneer Schz. Grilled S/W – ₹80

Cheese Chilli Corn Grilled S/W – ₹60

🌯 ROLLS

Mix Veg Roll – ₹60

Mix Veg Cheese Roll – ₹70

Paneer Roll – ₹90

Paneer Cheese Roll – ₹100

Egg Roll – ₹80

Double Egg Roll – ₹100

Egg Chicken Roll – ₹100

Double Egg Chicken Roll – ₹110

Double Egg Cheese Roll – ₹120

Double Egg Chi Cheese Roll – ₹120

🥡 CHINESE STARTER

Veg Manchurian Dry – ₹80

Veg Manchurian Gravy – ₹90

Paneer Chilly – ₹100

Paneer 65 – ₹120

Chicken 65 – ₹120

Chicken Crispy – ₹120

Chicken Manchurian – ₹120

🍜 CHINESE NOODLES / RICE

Veg Hakka Noodles / Rice – ₹80

Veg Schezwan Noodles / Rice – ₹90

Veg Manchurian Noodles / Rice – ₹100

Veg Triple Schezwan Fried Rice – ₹120

Egg Hakka Noodles / Rice – ₹90

Egg Schezwan Noodles / Rice – ₹100

Chicken Schezwan Noodles / Rice – ₹120

Chicken Triple Schezwan Rice – ₹130

🍲 SOUPS

Tomato Soup – ₹50

Veg Manchow Soup – ₹50

Chicken Manchow Soup – ₹70

Hot & Sour Soup – ₹70

🍴 SPECIAL DISHES

Special Veg – ₹150

Veg Bhoona – ₹130

Veg Maratha – ₹130

Veg Tawa – ₹130

Veg Afghani – ₹130

Veg Chilli Milli – ₹130

Veg Pahadi – ₹130

Veg Diwani Handi – ₹130

Paneer Chingari – ₹150

Paneer Tufani – ₹150

Paneer Angara – ₹150

Babycorn Mushroom Tawa – ₹150

🫕 PUNJABI DISHES

Dal Fry – ₹70

Dal Tadka – ₹80

Veg Kolhapuri – ₹100

Dal Makhani – ₹100

Aloo Mutter – ₹90

Green Peas Masala – ₹90

Bhendi Fry / Masala – ₹90

Mix Veg – ₹100

Veg Kadai – ₹120

Veg Handi – ₹120

Veg Kolhapuri – ₹120

Veg Makhani – ₹120

🧀 PANEER DISHES

Mutter Paneer – ₹140

Paneer Tikka Masala – ₹150

Paneer Butter Masala – ₹150

Palak Paneer – ₹150

Kadai Paneer / Paneer Handi – ₹150

Paneer Bhurji – ₹150

🍗 NON-VEG INDIAN DISHES

Chicken Masala – ₹140

Chicken Handi – ₹140

Chicken Maratha – ₹140

Chicken Tawa – ₹140

Chicken Kolhapuri – ₹150

Chicken Adraki – ₹150

Chicken Suka – ₹150

Butter Chicken – ₹160

🍚 RICE

Plain Rice – ₹50

Jeera Rice – ₹60

Curd Rice – ₹70

Dal Khichadi – ₹80

Veg Pulav – ₹90

Paneer Pulav – ₹90

Peas Pulav – ₹90

🍛 BIRYANI

Veg Biryani – ₹90

Paneer Biryani – ₹110

Egg Biryani – ₹110

Chicken Biryani – ₹130

🥗 BHEL / CHAAT

Panipuri – ₹40

SPDP – ₹50

Sev Puri – ₹50

Papdi Chat – ₹50

Samosa Chat – ₹50

Sev Batata Puri – ₹30

Dahi Papdi Chat – ₹50

🧁 SWEET

Gulab Jamun – ₹30

🥗 THALI

Veg Thali – ₹90

Egg Thali – ₹120

Chicken Thali – ₹150

2. RAZORPAY_KEY_ID - Rc95kL1tkTf4Le

RAZORPAY_KEY_SECRET - 5xPZ8c12s6LludOd6FH8W1ro(Its a test one

Use MongoDB for backend</user_request>

<todo_list>
1. Set up MongoDB models, API routes for authentication (students/staff/admin), menu items with all categories, orders, and users. Integrate Razorpay payment gateway with test credentials
2. Create student-facing pages: landing page with menu display (with search and category filters), cart functionality, order placement with Razorpay checkout, and order tracking with real-time status updates
3. Build staff dashboard at `/staff` with live order management (mark orders as in-progress/ready/completed), menu item availability toggle, and basic analytics display
4. Create admin panel at `/admin` with user management, comprehensive analytics dashboard (sales, top items, peak hours), menu CRUD operations, and loyalty/offers management
5. Implement AI-based meal recommendations using order history and time-of-day logic, add order history with favorites and reorder functionality, and polish the UI with animations and responsive design
</todo_list>