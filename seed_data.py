from app import app, db, User, Club, Member, Event, EventRegistration, Payment
from werkzeug.security import generate_password_hash
from datetime import datetime, timedelta
import random

# Sample data for generating realistic clubs and members
SPORTS_TYPES = [
    "Football", "Basketball", "Cricket", "Tennis", "Badminton", 
    "Swimming", "Volleyball", "Table Tennis", "Hockey", "Rugby",
    "Baseball", "Softball", "Golf", "Athletics", "Boxing",
    "Wrestling", "Martial Arts", "Yoga", "Pilates", "Cycling",
    "Running", "Triathlon", "Gymnastics", "Fencing", "Archery",
    "Rowing", "Sailing", "Surfing", "Skateboarding", "Rock Climbing"
]

CLUB_NAME_PREFIXES = [
    "Elite", "Pro", "Champion", "Victory", "Ultimate", "Supreme",
    "Premier", "Royal", "Golden", "Silver", "Diamond", "Platinum",
    "Star", "Thunder", "Lightning", "Phoenix", "Dragon", "Tiger",
    "Eagle", "Falcon", "Warrior", "Knight", "Titan", "Legend",
    "Alpha", "Omega", "Apex", "Prime", "Crown", "Empire"
]

CLUB_NAME_SUFFIXES = [
    "Club", "Academy", "Association", "Team", "Squad", "United",
    "Athletic", "Sports", "Arena", "Center", "League", "Guild"
]

CITY_NAMES = [
    "Mumbai", "Delhi", "Bangalore", "Hyderabad", "Ahmedabad",
    "Chennai", "Kolkata", "Pune", "Jaipur", "Lucknow",
    "Kanpur", "Nagpur", "Indore", "Thane", "Bhopal",
    "Visakhapatnam", "Pimpri-Chinchwad", "Patna", "Vadodara", "Ghaziabad",
    "Ludhiana", "Agra", "Nashik", "Faridabad", "Meerut",
    "Rajkot", "Varanasi", "Srinagar", "Aurangabad", "Dhanbad",
    "Amritsar", "Allahabad", "Ranchi", "Howrah", "Coimbatore",
    "Jabalpur", "Gwalior", "Vijayawada", "Jodhpur", "Madurai",
    "Raipur", "Kota", "Chandigarh", "Guwahati", "Solapur",
    "Mysore", "Tiruchirappalli", "Bareilly", "Aligarh", "Tiruvallur"
]

FIRST_NAMES = [
    "Rahul", "Priya", "Amit", "Anjali", "Vikram", "Sneha", "Arjun", "Pooja",
    "Rajesh", "Deepika", "Suresh", "Kavita", "Anil", "Meera", "Ravi", "Swati",
    "Sanjay", "Nisha", "Karan", "Divya", "Rohit", "Neha", "Aditya", "Shruti",
    "Vishal", "Aarti", "Manish", "Ritu", "Nikhil", "Shweta", "Akash", "Sonia",
    "Vijay", "Preeti", "Mohit", "Anita", "Ashok", "Sunita", "Rakesh", "Geeta",
    "Sachin", "Madhuri", "Sandeep", "Rani", "Ajay", "Poonam", "Manoj", "Seema",
    "Sunil", "Rekha"
]

LAST_NAMES = [
    "Sharma", "Kumar", "Singh", "Patel", "Verma", "Reddy", "Gupta", "Rao",
    "Desai", "Nair", "Iyer", "Joshi", "Mehta", "Chopra", "Malhotra", "Kapoor",
    "Chauhan", "Agarwal", "Bhat", "Pandey", "Mishra", "Sinha", "Khan", "Shah",
    "Yadav", "Jain", "Bansal", "Sethi", "Menon", "Pillai", "Naidu", "Krishnan",
    "Das", "Ghosh", "Mukherjee", "Chatterjee", "Bose", "Roy", "Choudhury", "Dutta",
    "Kulkarni", "Shukla", "Thakur", "Saxena", "Bhatt", "Trivedi", "Soni", "Varma",
    "Rathore", "Kohli"
]

CLUB_DESCRIPTIONS = [
    "Join our vibrant community of sports enthusiasts dedicated to excellence and teamwork.",
    "Experience professional training in a supportive and energetic environment.",
    "Develop your skills with expert coaches and state-of-the-art facilities.",
    "Building champions through dedication, discipline, and determination.",
    "Where passion meets performance in the world of competitive sports.",
    "Fostering athletic excellence and personal growth since our inception.",
    "Join us for intensive training sessions and competitive tournaments.",
    "A family-friendly club focused on health, fitness, and fun.",
    "Committed to developing talent and nurturing sporting excellence.",
    "Training the next generation of champions with dedication and expertise.",
]

def generate_phone():
    """Generate a random Indian phone number"""
    return f"+91-{random.randint(70000, 99999)}{random.randint(10000, 99999)}"

def generate_email(first_name, last_name):
    """Generate an email address"""
    domains = ["gmail.com", "yahoo.co.in", "outlook.com", "rediffmail.com", "fitsphere.in"]
    return f"{first_name.lower()}.{last_name.lower()}@{random.choice(domains)}"

def seed_database():
    """Seed the database with sample data"""
    
    print("Starting database seeding...")
    
    with app.app_context():
        # Clear existing data (except admin)
        print("Clearing existing data...")
        Payment.query.filter(Payment.id > 0).delete()
        EventRegistration.query.filter(EventRegistration.id > 0).delete()
        Event.query.filter(Event.id > 0).delete()
        Member.query.filter(Member.id > 0).delete()
        Club.query.filter(Club.id > 0).delete()
        User.query.filter(User.username != 'admin').delete()
        db.session.commit()
        
        # Create 50 Clubs
        print("Creating 50 clubs...")
        clubs = []
        for i in range(50):
            sport = random.choice(SPORTS_TYPES)
            prefix = random.choice(CLUB_NAME_PREFIXES)
            suffix = random.choice(CLUB_NAME_SUFFIXES)
            city = random.choice(CITY_NAMES)
            
            club_name = f"{prefix} {sport} {suffix}"
            
            club = Club(
                name=club_name,
                description=random.choice(CLUB_DESCRIPTIONS),
                sport_type=sport,
                location=f"{random.randint(10, 999)}/{random.randint(1, 50)} {random.choice(['MG Road', 'Park Street', 'Ring Road', 'Sports Complex', 'Stadium Road', 'Nehru Nagar', 'Gandhi Marg'])}, {city}",
                contact_email=f"contact@{club_name.replace(' ', '').lower()}.in",
                contact_phone=generate_phone(),
                created_at=datetime.utcnow() - timedelta(days=random.randint(30, 730))
            )
            
            db.session.add(club)
            clubs.append(club)
        
        db.session.commit()
        print(f"Created {len(clubs)} clubs")
        
        # Create 50 Users (Members)
        print("Creating 50 members...")
        users = []
        for i in range(50):
            first_name = random.choice(FIRST_NAMES)
            last_name = random.choice(LAST_NAMES)
            username = f"{first_name.lower()}{last_name.lower()}{random.randint(1, 999)}"
            
            user = User(
                username=username,
                email=generate_email(first_name, last_name),
                password=generate_password_hash('password123'),
                full_name=f"{first_name} {last_name}",
                role='member',
                created_at=datetime.utcnow() - timedelta(days=random.randint(1, 365))
            )
            
            db.session.add(user)
            users.append(user)
        
        db.session.commit()
        print(f"Created {len(users)} users")
        
        # Create Memberships (each user joins 1-3 clubs)
        print("Creating club memberships...")
        members = []
        for user in users:
            num_clubs = random.randint(1, 3)
            user_clubs = random.sample(clubs, num_clubs)
            
            for club in user_clubs:
                membership_type = random.choice(['monthly', 'yearly'])
                join_date = user.created_at + timedelta(days=random.randint(0, 30))
                
                if membership_type == 'monthly':
                    expiry_date = join_date + timedelta(days=30)
                else:
                    expiry_date = join_date + timedelta(days=365)
                
                # Determine status based on expiry
                if expiry_date > datetime.utcnow():
                    status = 'active'
                else:
                    status = random.choice(['active', 'expired', 'inactive'])
                
                member = Member(
                    user_id=user.id,
                    club_id=club.id,
                    membership_type=membership_type,
                    join_date=join_date,
                    expiry_date=expiry_date,
                    status=status,
                    phone=generate_phone(),
                    address=f"{random.randint(1, 500)}/{random.randint(1, 20)} {random.choice(['Sector', 'Block', 'Flat', 'House'])}-{random.choice(['A', 'B', 'C', 'D'])}, {random.choice(['Indiranagar', 'Koramangala', 'Malviya Nagar', 'Sector 15', 'Banjara Hills', 'Anna Nagar', 'Salt Lake', 'Viman Nagar'])}, {random.choice(CITY_NAMES)}"
                )
                
                db.session.add(member)
                members.append(member)
        
        db.session.commit()
        print(f"Created {len(members)} memberships")
        
        # Create Events (2-5 events per club)
        print("Creating events...")
        events = []
        for club in clubs:
            num_events = random.randint(2, 5)
            
            for i in range(num_events):
                event_types = [
                    "Championship", "Tournament", "Training Camp", "Workshop",
                    "Exhibition Match", "League Game", "Friendly Match", "Seminar",
                    "Competition", "Practice Session", "Open Day", "Trials"
                ]
                
                event_name = f"{club.sport_type} {random.choice(event_types)} {random.randint(2024, 2025)}"
                
                # Mix of past, present, and future events
                days_offset = random.randint(-60, 90)
                event_date = datetime.utcnow() + timedelta(days=days_offset)
                
                if days_offset < 0:
                    status = 'completed'
                elif days_offset < 7:
                    status = 'ongoing'
                else:
                    status = 'upcoming'
                
                event = Event(
                    club_id=club.id,
                    name=event_name,
                    description=f"Join us for an exciting {event_types[0].lower()} featuring top athletes and competitive matches. Open to all skill levels!",
                    event_date=event_date,
                    location=club.location,
                    max_participants=random.choice([None, 20, 30, 50, 100]),
                    registration_fee=random.choice([0, 100, 200, 300, 500, 1000]),
                    status=status,
                    created_at=event_date - timedelta(days=random.randint(15, 45))
                )
                
                db.session.add(event)
                events.append(event)
        
        db.session.commit()
        print(f"Created {len(events)} events")
        
        # Create Event Registrations
        print("Creating event registrations...")
        registrations = []
        for event in events:
            # Get members of this club
            club_members = [m for m in members if m.club_id == event.club_id and m.status == 'active']
            
            if club_members:
                # Random number of registrations (20-80% of members)
                num_registrations = random.randint(len(club_members) // 5, min(len(club_members), 50))
                registered_members = random.sample(club_members, min(num_registrations, len(club_members)))
                
                for member in registered_members:
                    payment_status = random.choice(['paid', 'paid', 'paid', 'pending'])
                    
                    if event.status == 'completed':
                        attendance = random.choice(['attended', 'attended', 'attended', 'absent'])
                    else:
                        attendance = 'registered'
                    
                    registration = EventRegistration(
                        event_id=event.id,
                        member_id=member.id,
                        registration_date=event.created_at + timedelta(days=random.randint(1, 10)),
                        payment_status=payment_status,
                        attendance_status=attendance
                    )
                    
                    db.session.add(registration)
                    registrations.append(registration)
        
        db.session.commit()
        print(f"Created {len(registrations)} event registrations")
        
        # Create Payments
        print("Creating payment records...")
        payments = []
        
        # Membership payments (in Indian Rupees)
        for member in members:
            if member.membership_type == 'monthly':
                amount = random.randint(500, 2000)
            else:
                amount = random.randint(5000, 20000)
            
            payment = Payment(
                member_id=member.id,
                amount=amount,
                payment_type='membership',
                payment_method=random.choice(['cash', 'card', 'online', 'online']),
                payment_date=member.join_date,
                description=f"{member.membership_type.title()} membership fee for {member.club.name}",
                status='completed'
            )
            
            db.session.add(payment)
            payments.append(payment)
        
        # Event payments
        for registration in registrations:
            if registration.payment_status == 'paid' and registration.event.registration_fee > 0:
                payment = Payment(
                    member_id=registration.member_id,
                    amount=registration.event.registration_fee,
                    payment_type='event',
                    payment_method=random.choice(['cash', 'card', 'online', 'online']),
                    payment_date=registration.registration_date,
                    description=f"Registration fee for {registration.event.name}",
                    status='completed'
                )
                
                db.session.add(payment)
                payments.append(payment)
        
        db.session.commit()
        print(f"Created {len(payments)} payment records")
        
        # Print summary
        print("\n" + "="*50)
        print("DATABASE SEEDING COMPLETED!")
        print("="*50)
        print(f"Summary:")
        print(f"   - Clubs: {len(clubs)}")
        print(f"   - Users: {len(users)}")
        print(f"   - Memberships: {len(members)}")
        print(f"   - Events: {len(events)}")
        print(f"   - Event Registrations: {len(registrations)}")
        print(f"   - Payments: {len(payments)}")
        print("="*50)
        print("\nYour Fitsphere website is now populated with realistic data!")
        print("Start the application: python app.py")
        print("Visit: http://127.0.0.1:5000")
        print("\nSample Member Login (any of these):")
        
        # Print 5 sample users
        sample_users = random.sample(users, min(5, len(users)))
        for user in sample_users:
            print(f"   Username: {user.username} | Password: password123")
        
        print("\nAdmin Login:")
        print("   Username: admin | Password: admin123")
        print("="*50)

if __name__ == '__main__':
    seed_database()
