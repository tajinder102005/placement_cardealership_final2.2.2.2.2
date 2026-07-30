# AutoDrive (Torque Motors Showroom)

AutoDrive is a premium dealership inventory management system that tracks vehicles on the lot in real-time. It features a stunning, high-contrast, black-and-gold interface, providing a smooth and luxurious user experience.

## Features
- **Real-Time Inventory Tracking:** Keep track of stock quantities, prices, and status.
- **Advanced Search & Filtering:** Filter instantly by make, model, category, and price range.
- **Admin Dashboard:** Add, edit, restock, and delete vehicles.
- **Premium UI:** Glassmorphism, animations, and high-contrast color scheme.
- **Supabase Backend:** Powered by PostgreSQL and Supabase Storage for fast, reliable data handling.

## Setup Instructions

### Prerequisites
- Node.js (v18+ recommended)
- Supabase account (for database and storage)

### Frontend Setup
1. Clone the repository: 
   ```bash
   git clone https://github.com/tajinder102005/placement_cardealership_final2.2.2.2.2.git
   ```
2. Navigate to the frontend directory: 
   ```bash
   cd frontend
   ```
3. Install dependencies: 
   ```bash
   npm install
   ```
4. Set up environment variables: Create a `.env` file in the frontend folder and add:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```
5. Run the development server: 
   ```bash
   npm run dev
   ```
6. Open your browser and visit `http://localhost:5173`.

### Backend Setup (Supabase)
The backend is completely handled by Supabase. To replicate the database:
1. Create a new Supabase project.
2. Create a `vehicles` table with the following columns: `id` (uuid), `make` (text), `model` (text), `category` (text), `year` (int), `price` (numeric), `quantity` (int), `description` (text), `image_url` (text), `created_at` (timestamptz).
3. Set up a Supabase Storage bucket named `vehicle-images` for storing car photos.
4. Set up a few RPC functions (e.g. `purchase_vehicle`, `restock_vehicle`) for atomic quantity updates.

## Screenshots
*(Add screenshots of your application here)*
- Landing Page Hero Section
- Admin Dashboard
- Real-time Search & Filter Bar

## My AI Usage
I utilized an AI coding assistant to help build, design, and refine this project.
- **UI/UX Design:** Used AI to generate a premium black-and-gold color scheme, implement glassmorphism, and align components professionally to match a provided mockup.
- **Refactoring:** Replaced standard inputs with fully functioning React dropdowns and debounced real-time search handlers.
- **Optimizations:** Changed state management to use optimistic UI updates so the dashboard doesn't flash when purchasing or restocking vehicles.
- **CSS Styling:** Used AI to write intricate CSS flexbox and CSS grid logic for perfect responsive alignment.

## Test Report
*(If you have a testing suite like Jest/Vitest set up, paste the results here. Currently, the application is manually tested for visual alignment, optimistic UI updates, and backend sync.)*
