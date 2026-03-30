# PagarBook CRM 🚀

Ek complete CRM system jo PagarBook branch owners ke liye banaya gaya hai — jisme Admin aur Relationship Executive (RE) dono ke liye alag dashboards hain.

---

## 📦 Local Setup (Pehli Baar)

### Prerequisites
- **Node.js** v16 ya usse zyada (https://nodejs.org se download karein)
- **npm** (Node ke saath automatically aata hai)

### Steps:

```bash
# 1. Folder mein jaao
cd pagarbook-crm

# 2. Dependencies install karein
npm install

# 3. App start karein
npm start
```

Browser mein automatically `http://localhost:3000` khulega.

---

## 🔐 Login Credentials

| Role  | Username | Password   |
|-------|----------|------------|
| Admin | admin    | admin@123  |
| RE    | rahul    | rahul@123  |
| RE    | priya    | priya@123  |
| RE    | amit     | amit@123   |

---

## ✨ Features

### Admin Dashboard
- **Overview** — Sabhi REs ka combined performance, charts
- **All Leads** — Poora data ek jagah
- **By Staff** — Kisi bhi RE ka data alag dekhein
- **Follow Up** — Saare pending follow ups
- **Payment** — Payment wale leads
- **Converted** — Successfully converted leads
- **Not Interested** — In leads ko kisi doosre RE ko reassign karein

### Staff (RE) Dashboard
- **My Stats** — Apna performance overview + upcoming follow ups
- **All Leads** — Apne saare leads update karein (call status, notes, follow up date)
- **Follow Up** — Sirf follow up wale leads
- **Payment** — Payment wale leads
- **Converted** — Meri converted leads

### Lead Status Options
- ⏳ Pending
- 📵 Call Busy
- 📴 Not Received
- 📞 Call Cut
- 📅 Follow Up
- 🎯 Follow Up for Demo
- 💰 Payment
- ❌ Not Interested → Admin ke paas wapas jaayega
- ✅ Converted → Alag section mein jaayega

### Excel Bulk Upload
Admin kisi bhi RE ko bulk leads upload kar sakta hai.
Excel file mein ye columns honein chahiye:
- `Company Name`
- `Owner Name`
- `Phone`

---

## 📁 File Structure

```
src/
├── context/
│   ├── AuthContext.js      # Login/logout logic
│   └── DataContext.js      # Lead data management
├── components/
│   ├── Navbar.js           # Top navigation
│   ├── StatCard.js         # Stats display card
│   ├── LeadTable.js        # Lead listing with filters
│   ├── StatusBadge.js      # Status color badge
│   ├── UpdateLeadModal.js  # Call status update popup
│   └── AddLeadModal.js     # Add lead / Excel upload
├── pages/
│   ├── LoginPage.js
│   ├── AdminDashboard.js
│   ├── StaffDashboard.js
│   ├── admin/
│   │   ├── AdminOverview.js
│   │   ├── AdminAllLeads.js
│   │   ├── AdminByStaff.js
│   │   ├── AdminConverted.js
│   │   ├── AdminFollowUp.js
│   │   ├── AdminPayment.js
│   │   └── AdminNotInterested.js
│   └── staff/
│       ├── StaffOverview.js
│       ├── StaffMyLeads.js
│       └── StaffPages.js
└── App.js
```

---

## 💾 Data Storage
Data browser ke localStorage mein save hota hai — page refresh karne ke baad bhi data rahega.

## 🔧 Naye Staff Add Karna
`src/context/AuthContext.js` mein `USERS` array mein naya entry add karein:
```js
{ id: 're004', name: 'Naya Naam', role: 'staff', username: 'naya', password: 'naya@123' }
```
