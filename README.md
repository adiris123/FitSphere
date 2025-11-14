# 🏆 Fitsphere - Sports Club Management System

A comprehensive web-based sports club membership management system built with Flask, SQLite, and Bootstrap 5.

## 🌟 Features

- **User Authentication**: Secure login/register system with role-based access (Admin, Member)
- **Club Management**: Create and manage multiple sports clubs
- **Member Management**: Track memberships, status, and expiry dates
- **Event Management**: Organize events, handle registrations, and track attendance
- **Payment Tracking**: Monitor membership fees and event payments
- **Admin Dashboard**: Comprehensive statistics and management tools
- **Responsive UI**: Beautiful, modern interface built with Bootstrap 5

## 📋 Requirements

- Python 3.8 or higher
- Flask 3.0.0
- Flask-SQLAlchemy 3.1.1
- SQLite (included with Python)

## 🚀 Installation & Setup

### 1. Install Dependencies

```bash
cd sports-club-management
python -m pip install -r requirements.txt
```

### 2. Run the Application

```bash
python app.py
```

### 3. Access the Website

Open your browser and navigate to:
```
http://127.0.0.1:5000
```

## 🔑 Default Admin Credentials

- **Username**: `admin`
- **Password**: `admin123`
- **Email**: `admin@fitsphere.com`

## 📁 Project Structure

```
sports-club-management/
├── app.py                    # Main Flask application
├── requirements.txt          # Python dependencies
├── fitsphere.db             # SQLite database (auto-created)
├── templates/               # HTML templates
│   ├── base.html           # Base template with navbar & footer
│   ├── index.html          # Homepage
│   ├── login.html          # Login page
│   ├── register.html       # Registration page
│   ├── admin_dashboard.html # Admin dashboard
│   ├── member_dashboard.html # Member dashboard
│   ├── clubs.html          # All clubs listing
│   ├── club_detail.html    # Club details page
│   ├── events.html         # All events listing
│   ├── event_detail.html   # Event details page
│   ├── join_club.html      # Join club form
│   ├── admin_clubs.html    # Admin: Manage clubs
│   ├── admin_events.html   # Admin: Manage events
│   └── admin_members.html  # Admin: Manage members
└── static/
    └── css/
        └── style.css       # Custom CSS styles
```

## 💾 Database Schema

### Tables:
- **User**: User accounts and authentication
- **Club**: Sports clubs information
- **Member**: Club memberships
- **Event**: Events and activities
- **EventRegistration**: Event participant registrations
- **Payment**: Payment records

## 🎯 Usage Guide

### For Admin Users:

1. **Login** with admin credentials
2. **Create Clubs**: Navigate to Manage Clubs → Add New Club
3. **Create Events**: Navigate to Manage Events → Create New Event
4. **View Statistics**: Dashboard shows overview of all activities
5. **Manage Members**: View and manage all club memberships

### For Regular Users:

1. **Register** a new account
2. **Browse Clubs**: View all available sports clubs
3. **Join Clubs**: Select membership type (Monthly/Yearly)
4. **Register for Events**: Browse and register for upcoming events
5. **View Dashboard**: Track your memberships and event registrations

## 🎨 Features Showcase

### Homepage
- Hero section with call-to-action
- Featured clubs display
- Upcoming events showcase
- Responsive design

### Admin Dashboard
- Total users, clubs, members, and events statistics
- Recent payments tracking
- Quick action buttons
- Comprehensive management tools

### Member Dashboard
- My club memberships overview
- Registered events list
- Membership status and expiry tracking

## 🔧 Configuration

Edit `app.py` to customize:
- Secret key (for production)
- Database location
- Session configuration

## 🛡️ Security Features

- Password hashing using Werkzeug
- Session-based authentication
- Role-based access control
- CSRF protection (Flask built-in)

## 📱 Responsive Design

The UI is fully responsive and works seamlessly on:
- Desktop computers
- Tablets
- Mobile phones

## 🎓 Technologies Used

- **Backend**: Python Flask
- **Database**: SQLite with SQLAlchemy ORM
- **Frontend**: HTML5, CSS3, Bootstrap 5
- **Icons**: Font Awesome 6
- **Authentication**: Flask session management with Werkzeug password hashing

## 📝 License

This project is created for educational purposes as a DBMS project.

## 👥 Contact

For questions or support, please contact the administrator.

---

**Fitsphere** - Your Ultimate Sports Club Management Solution 🏆
