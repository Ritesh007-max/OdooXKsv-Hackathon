# 🌉 VendorBridge

> **VendorBridge** is a comprehensive procurement and vendor management portal developed for the **OdooXKsv-Hackathon**. It serves as a centralized hub to streamline the process of discovering vendors, managing Request for Quotations (RFQs), comparing vendor bids, issuing Purchase Orders (POs), and handling invoices.

---

## 🎯 The Problem & Our Solution
**The Problem:** Traditional procurement processes are fragmented. Procurement officers jump between emails, spreadsheets, and legacy ERPs to track vendors, compare RFQs, and manage invoices. This leads to data silos, delayed approvals, and lost negotiations.

**Our Solution:** **VendorBridge** unifies the entire procurement lifecycle. From the moment a need arises, officers can instantly assign saved vendors to new RFQs, compare incoming bids side-by-side, auto-generate POs, and visually track invoice statuses in a single, modern, lightning-fast web application.

---

## 🚀 Key Features

- **📊 Procurement Dashboard**: A high-level overview of active RFQs, pending approvals, purchase orders, and spending trends visualized with interactive charts.
- **🏢 Vendor Directory**: Maintain a rich directory of vendors. Add, edit, and categorize vendor details dynamically.
- **📝 RFQ Creation**: Seamlessly draft and send Requests for Quotation to multiple vendors. Build line items dynamically and attach necessary files using a drag-and-drop interface.
- **⚖️ Quotation Comparison**: Review and compare incoming vendor bids side-by-side to make data-driven procurement decisions instantly.
- **🧾 Purchase Orders & Invoices**: Generate POs upon quotation approval and manage incoming vendor invoices with severity/status tracking (Draft, Pending, Paid, Overdue).
- **✨ Premium UI/UX**: Built with a sleek, custom `DebugDeck` light-theme design system featuring glassmorphism elements, subtle micro-animations, and responsive layouts.

## 🛠️ Tech Stack

This project is built using the **MERN** stack architecture along with modern frontend tooling.

### Frontend (Client)
- **Core:** [React 19](https://react.dev/)
- **Build Tool & Bundler:** [Vite](https://vitejs.dev/) for blazing-fast HMR and optimized production builds
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/) for rapid, utility-first styling
- **Data Visualization:** [Recharts](https://recharts.org/) for dynamic spending and procurement trend graphs
- **Icons:** [Lucide React](https://lucide.dev/) for clean, consistent, and scalable SVG iconography

### Backend (API & Server)
- **Runtime Environment:** [Node.js](https://nodejs.org/)
- **Framework:** [Express.js](https://expressjs.com/) for building robust RESTful APIs
- **Database Object Modeling:** [Mongoose](https://mongoosejs.com/) for structured MongoDB schema validations and interactions
- **Middleware:** `cors` for cross-origin requests and `dotenv` for environment variable management

---

## 📂 Project Architecture

```text
VendorBridge/
├── Backend/                 # Express REST API
│   ├── src/models/          # Mongoose Schemas (Vendor, PO, Invoice, RFQ)
│   └── server.js            # Entry Point
└── Frontend/                # React Vite Application
    ├── src/components/      
    │   ├── dashboard/       # Charts & Stat Cards
    │   ├── vendors/         # Vendor Directory & Modals
    │   ├── rfqs/            # RFQ Creation & Drag-Drop Forms
    │   ├── quotations/      # Side-by-side Comparison UI
    │   └── layout/          # Navigation & TopBar
    ├── src/index.css        # Custom DebugDeck Design Tokens
    └── App.jsx              # Main Router
```

---

## ⚙️ Getting Started

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed on your machine.

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Ritesh007-max/OdooXKsv-Hackathon.git
   cd OdooXKsv-Hackathon
   ```

2. **Setup the Frontend:**
   Navigate into the frontend directory and install dependencies:
   ```bash
   cd Frontend
   npm install
   ```

3. **Run the Development Server:**
   Start the Vite development server:
   ```bash
   npm run dev
   ```
   *The application will typically be available at https://odoo-x-ksv-hackathon-ryuo-nu.vercel.app/.*

---

## 🔭 Future Roadmap
If we had more time for the hackathon, we planned to implement:
- **Real-time Notifications:** WebSockets for instant alerts when a vendor submits a bid.
- **AI-Powered Vendor Recommendations:** Suggesting the best vendors based on historical bid data and delivery times.
- **PDF Generation:** One-click exporting of POs and Invoices to formal PDF documents.

## 🤝 Contribution
This project was developed during the OdooXKsv-Hackathon. Contributions, issues, and feature requests are welcome!
