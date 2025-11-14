# 🧪 Fitsphere Testing Guide

## Quick Start Testing

### 1. Start the Application
```bash
cd C:\Users\SUMIT\sports-club-management
python app.py
```

Visit: **http://127.0.0.1:5000**

---

## 🎯 Test Scenarios

### **Scenario A: Homepage Features Section**

**What to Test:** Features section displays correctly

**Steps:**
1. Open homepage (`http://127.0.0.1:5000`)
2. Scroll down to "Our Features" section
3. ✅ Verify you see 3 cards:
   - Club Management
   - Event Management  
   - Payment Tracking
4. ✅ Each card should have an icon and description

**Expected Result:** All 3 feature cards display properly with icons

---

### **Scenario B: Event Registration - Club Member Only**

**What to Test:** Only club members can register for events

#### **B1: As Non-Member (Should Fail)**

**Steps:**
1. Login as: `robertgarcia357` / `password123`
2. Go to Events page
3. Click on any event (check which club it belongs to)
4. Note the organizing club name
5. Click "Register for Event" button

**Expected Results:**
- ✅ Shows warning: "You must be a member of [Club Name] to register"
- ✅ Redirects to club detail page
- ✅ Shows "Join This Club" button

#### **B2: Join Club First**

**Steps (continuing from B1):**
1. You're now on the club page
2. Click "Join This Club" button
3. Select "Monthly" or "Yearly" membership
4. Enter phone: `+1-555-123-4567`
5. Enter address: `123 Test St, New York`
6. Click "Join Club"

**Expected Results:**
- ✅ Success message: "Successfully joined [Club Name]!"
- ✅ Redirected to dashboard
- ✅ Club membership visible in "My Club Memberships"

#### **B3: Now Register for Event (Should Succeed)**

**Steps:**
1. Go back to Events page
2. Find same event from B1
3. Click "View Details"
4. Now see warning: "Note: You must be a member..."
5. But you ARE a member now
6. Click "Register for Event"

**Expected Results:**
- ✅ Success message: "Successfully registered for [Event Name]!"
- ✅ Redirected to dashboard
- ✅ Event appears in "My Event Registrations"

---

### **Scenario C: Already Registered Check**

**What to Test:** Prevent duplicate registrations

**Steps:**
1. Stay logged in from Scenario B
2. Go to same event detail page
3. Look at registration section

**Expected Results:**
- ✅ Shows alert: "You are already registered for this event!"
- ✅ No register button visible
- ✅ Blue info alert displayed

---

### **Scenario D: Event Capacity Display**

**What to Test:** Event capacity tracking works

**Steps:**
1. Browse to any event detail page
2. Look at "Participants" section

**Expected Results:**
- ✅ If limited capacity: Shows "X / Y registered"
- ✅ If unlimited: Shows "X registered (Unlimited)"
- ✅ If near full (80%+): Shows yellow "Almost Full" badge
- ✅ If full (100%): Shows red "Full" badge

---

### **Scenario E: Non-Logged-In User**

**What to Test:** Proper prompts for visitors

#### **E1: Homepage**
**Steps:**
1. Logout (if logged in)
2. Visit homepage

**Expected Results:**
- ✅ Shows "Join Now" and "Explore Clubs" buttons
- ✅ Features section displays correctly

#### **E2: Event Page**
**Steps:**
1. Go to Events page (while logged out)
2. Click "View Details" on any event

**Expected Results:**
- ✅ Shows info alert: "Please login to register for this event"
- ✅ Login link is clickable
- ✅ No register button shown

#### **E3: Club Page**
**Steps:**
1. Go to Clubs page (while logged out)
2. Click "View Details" on any club

**Expected Results:**
- ✅ Shows info alert: "Please login or register to join this club"
- ✅ Both login and register links work
- ✅ No join button shown

---

### **Scenario F: Admin Dashboard**

**What to Test:** Admin can see all data

**Steps:**
1. Login as admin: `admin` / `admin123`
2. View dashboard

**Expected Results:**
- ✅ Shows statistics cards:
  - Total Users: 51 (50 members + 1 admin)
  - Total Clubs: 50
  - Active Members: ~90-100
  - Total Events: ~167
- ✅ Shows "Quick Actions" buttons
- ✅ Shows "Recent Payments" table

---

### **Scenario G: Member Dashboard**

**What to Test:** Member sees personal data

**Steps:**
1. Login as any member (e.g., `barbaramitchell94` / `password123`)
2. View dashboard

**Expected Results:**
- ✅ "My Club Memberships" section shows clubs you've joined
- ✅ Each membership shows:
  - Club name
  - Membership type (Monthly/Yearly)
  - Status badge (Active/Expired)
  - Expiry date
- ✅ "My Event Registrations" shows registered events
- ✅ Shows event dates, locations, payment status

---

### **Scenario H: Browse Clubs**

**What to Test:** All 50 clubs display

**Steps:**
1. Go to "Clubs" page (from navbar)
2. Scroll through all clubs

**Expected Results:**
- ✅ Shows all 50 clubs
- ✅ Each club card shows:
  - Club name with icon
  - Description (truncated)
  - Sport type badge
  - Location
  - Contact info
  - "View Details" button
  - "Join Club" button (if logged in)

---

### **Scenario I: Browse Events**

**What to Test:** All ~167 events display

**Steps:**
1. Go to "Events" page (from navbar)
2. Scroll through events

**Expected Results:**
- ✅ Shows all events
- ✅ Each event card shows:
  - Event name
  - Description (truncated)
  - Status badge (Upcoming/Ongoing/Completed)
  - Date and time
  - Location
  - Max participants
  - Registration fee
  - "View Details" button
  - "Register" button (if logged in & upcoming)

---

### **Scenario J: Club Detail Page**

**What to Test:** Club information is complete

**Steps:**
1. Click on any club
2. View club detail page

**Expected Results:**
- ✅ Shows club name and full description
- ✅ Shows sport type
- ✅ Shows location, email, phone
- ✅ Shows "Club Members" sidebar with count
- ✅ Shows "Club Events" section
- ✅ If not member: Shows "Join This Club" button
- ✅ If already member: Shows "You are a member" alert

---

### **Scenario K: Search and Navigation**

**What to Test:** Navigation works smoothly

**Steps:**
1. Use navbar to navigate between pages:
   - Home
   - Clubs
   - Events
   - Dashboard (if logged in)
2. Test all links

**Expected Results:**
- ✅ All navbar links work
- ✅ Navbar shows correct options based on login state
- ✅ Admin sees "Manage Clubs/Events/Members" options
- ✅ Logout works and redirects to homepage

---

## 🔧 Admin-Specific Tests

### **Scenario L: Manage Clubs**

**Login as:** `admin` / `admin123`

**Steps:**
1. Dashboard → "Manage Clubs"
2. Scroll to "Add New Club" form
3. Fill in:
   - Name: "Test Sports Club"
   - Sport Type: "Testing"
   - Description: "A test club for verification"
   - Location: "123 Test Ave, Test City"
   - Email: "test@club.com"
   - Phone: "+1-555-999-9999"
4. Click "Create Club"
5. Scroll down to "Existing Clubs" table

**Expected Results:**
- ✅ Success message displayed
- ✅ New club appears in table
- ✅ All details are correct

---

### **Scenario M: Manage Events**

**Login as:** `admin` / `admin123`

**Steps:**
1. Dashboard → "Manage Events"
2. Scroll to "Create New Event" form
3. Select any club
4. Fill in event details
5. Set date/time in the future
6. Click "Create Event"

**Expected Results:**
- ✅ Success message
- ✅ Event appears in table
- ✅ Status is "upcoming"

---

### **Scenario N: View All Members**

**Login as:** `admin` / `admin123`

**Steps:**
1. Dashboard → "Manage Members"
2. View members table

**Expected Results:**
- ✅ Shows all ~103 memberships
- ✅ Table displays:
  - Member name
  - Club
  - Membership type
  - Join date
  - Expiry date
  - Status (Active/Inactive/Expired)
  - Contact info

---

## ⚠️ Error Testing

### **Scenario O: Expired Membership**

**Note:** You may need to manually expire a membership in the database or wait for one to expire

**What to Test:** Expired members can't register

**Steps:**
1. Login as member with expired membership
2. Try to register for event

**Expected Results:**
- ✅ Shows error: "Your membership is not active"
- ✅ Redirected to dashboard

---

### **Scenario P: Full Event**

**What to Test:** Can't register for full events

**Steps:**
1. Find an event with limited capacity
2. Check if it's full (registrations >= max_participants)
3. Try to register

**Expected Results:**
- ✅ Shows badge "Full" on event page
- ✅ Error message: "Event has reached maximum capacity"

---

## 📊 Checklist Summary

Use this quick checklist to verify everything works:

**Homepage:**
- [ ] Hero section displays
- [ ] Features section shows 3 cards
- [ ] Featured clubs display (up to 6)
- [ ] Upcoming events display (up to 6)

**Authentication:**
- [ ] Register new account works
- [ ] Login works
- [ ] Logout works
- [ ] Session persists

**Clubs:**
- [ ] All 50 clubs display
- [ ] Club detail page works
- [ ] Join club works
- [ ] Member status shows correctly

**Events:**
- [ ] All events display
- [ ] Event detail page works
- [ ] Registration requires membership
- [ ] Already registered check works
- [ ] Capacity tracking works

**Dashboard:**
- [ ] Admin sees statistics
- [ ] Member sees personal data
- [ ] Navigation works

**Admin Functions:**
- [ ] Create club works
- [ ] Create event works
- [ ] View all members works

---

## 🐛 Common Issues & Solutions

### Issue: "Features section not displaying"
**Solution:** Clear browser cache, refresh page

### Issue: "Can't register for event"
**Solution:** Check if you're a member of the organizing club

### Issue: "Database error"
**Solution:** Stop Flask server, restart with `python app.py`

### Issue: "No clubs/events showing"
**Solution:** Re-run seed script: `python seed_data.py`

---

## ✅ All Tests Passed?

If all scenarios work as expected, your Fitsphere application is **fully functional and ready for demonstration**! 🎉

---

**Happy Testing! 🚀**
