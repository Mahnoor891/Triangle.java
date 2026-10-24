# MIEB: Medical Imaging Equipment Business (Client Portal)

A web portal where hospitals browse medical imaging equipment, send enquiries, review accepted orders, place or cancel them, and track delivery. It is the frontend for the Django REST backend of the same project, built as a university project.

**Stack:** Next.js (App Router) · React · JavaScript · plain CSS (CSS Modules) · Django REST Framework + PostgreSQL backend with token authentication

---

## Links

| | |
|---|---|
| Frontend repository | https://github.com/`<your-username>`/medical-imaging-frontend |
| Backend repository | https://github.com/`<your-username>`/Medical_Imaging_Equipment_Business |
| Website (runs locally) | http://localhost:3000 |
| Backend API | http://127.0.0.1:8000/api/ |
| Django admin | http://127.0.0.1:8000/admin/ |

The site is not hosted online. It runs on your own computer, and both the backend and the frontend must be running (see [Getting started](#getting-started)).

---

## Features

**Public pages**
- Home page with a short introduction, services, categories and a "how it works" section
- About Us and Contact Us pages
- Registration (creates the login account and the hospital profile together) and login

**Client portal (after login)**
- **Dashboard** with order counts, unread notifications and shortcuts
- **Equipment catalogue** with category buttons and a category dropdown in the navbar
- **Equipment details** with a formatted description and an *Enquire Now* option
- **Enquiry list** (like a cart) to send one enquiry for several items
- **My Orders** with status badges, and an order page where an accepted order can be reviewed: change quantities, remove items, see a live total, then place or cancel it
- **Invoice** with shipment status tracker, tracking number and expected delivery (printable)
- **Track my orders** page showing the shipment progress of every confirmed order
- **In-app notifications** with an unread counter, mark as read and mark all as read
- **Account settings** to update hospital name, email, phone and address

**General**
- Loading splash screen, shared header with top ribbon, footer
- Works on desktop and phone-sized screens

---

## How an order moves

1. The hospital sends an enquiry (status **Pending**).
2. The admin accepts or rejects it in the Django admin (**Awaiting Confirmation** or **Rejected**). The hospital gets a notification.
3. The hospital reviews the accepted order, changes quantities or removes items, then places it (**Confirmed**) or cancels it (**Cancelled**).
4. Placing the order creates the invoice and a shipment. The admin updates the shipment (**Pending → Processing → Shipped → Delivered**), and the client follows it on the tracking page.

---

## Getting started

### Requirements
- Node.js 20 or newer (check with `node --version`)
- Python 3 and PostgreSQL for the backend

### 1. Start the backend

```bash
git clone https://github.com/<your-username>/Medical_Imaging_Equipment_Business.git
cd Medical_Imaging_Equipment_Business
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

The API now runs at http://127.0.0.1:8000.

### 2. Start the frontend

```bash
git clone https://github.com/<your-username>/medical-imaging-frontend.git
cd medical-imaging-frontend
npm install
npm run dev
```

Open http://localhost:3000.

### 3. Try it

1. Click **Register** and create a hospital account (you are logged in straight away).
2. Browse **Equipment**, add items to the **Enquiry list**, and send the enquiry.
3. Open http://127.0.0.1:8000/admin/ with your superuser, open the order, and set its status to **Awaiting Confirmation** (fill in prices and the estimated timeline).
4. Back on the site, open **My Orders**, review the order and place it.
5. In the admin, edit the **Shipment** (status, tracking number, expected delivery date) and watch the **Track Orders** and **Invoice** pages update.

---

## Backend requirements

This frontend expects these parts on the Django side:

- `django-cors-headers` installed, with `http://localhost:3000` and `http://127.0.0.1:3000` in `CORS_ALLOWED_ORIGINS`
- Token authentication (`/api/accounts/login/` returns `token`, `user_id`, `username`)
- Registration at `/api/accounts/register/` that also creates the `Hospital` record
- `GET` and `PATCH` at `/api/my-hospital/` for the logged-in client's own hospital
- The equipment, orders, invoice and notification endpoints described in the backend repository

The backend address is set in one place, `src/lib/api.js` (`API_URL` and `BASE_URL`). Change it there if the backend runs somewhere else.

---

## Project structure

```
src
├── app
│   ├── page.js                    Home
│   ├── about/  contact/           Public pages
│   ├── login/  register/          Authentication
│   ├── dashboard/                 Client dashboard
│   ├── equipment/                 Catalogue, [id] details, category/[id]
│   ├── enquiry/                   Enquiry list (cart)
│   ├── orders/                    My Orders, [id] review, [id]/invoice
│   ├── tracking/                  Shipment tracking
│   ├── notifications/             Notifications
│   └── account/                   Account settings
├── components
│   ├── Header, Footer, Logo       Layout
│   ├── NotificationBell           Unread counter
│   ├── EnquiryLink                Enquiry list counter
│   ├── CategoryPills              Category buttons
│   ├── SocialIcons                Plain social icons
│   └── SplashScreen               Loading screen
└── lib
    ├── api.js                     API address, token helpers, enquiry list helpers
    └── site.js                    Site name and contact details
```

To change the company name, email, phone or address shown across the site, edit `src/lib/site.js`.

---

## Notes

- Notifications are in-app only (no email).
- The token is stored in the browser's local storage, and the enquiry list is stored per browser until you log out.
- The social icons are plain icons and do not link anywhere.

---

## Author

`<Your name>` · Department of Computer Science, University of Karachi
`<Course name / supervisor>`
