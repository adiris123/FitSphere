from flask import Flask, render_template, request, redirect, url_for, flash, session
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime, timedelta
from functools import wraps
import os

app = Flask(__name__)
app.config['SECRET_KEY'] = 'your-secret-key-here-change-in-production'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///fitsphere.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

# Database Models
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=False)
    full_name = db.Column(db.String(120), nullable=False)
    role = db.Column(db.String(20), nullable=False, default='member')  # admin, staff, member
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    members = db.relationship('Member', backref='user', lazy=True)

class Club(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    description = db.Column(db.Text)
    sport_type = db.Column(db.String(50), nullable=False)
    location = db.Column(db.String(200))
    contact_email = db.Column(db.String(120))
    contact_phone = db.Column(db.String(20))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    members = db.relationship('Member', backref='club', lazy=True)
    events = db.relationship('Event', backref='club', lazy=True)

class Member(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    club_id = db.Column(db.Integer, db.ForeignKey('club.id'), nullable=False)
    membership_type = db.Column(db.String(50), nullable=False)  # monthly, yearly
    join_date = db.Column(db.DateTime, default=datetime.utcnow)
    expiry_date = db.Column(db.DateTime)
    status = db.Column(db.String(20), default='active')  # active, inactive, expired
    phone = db.Column(db.String(20))
    address = db.Column(db.Text)
    
    payments = db.relationship('Payment', backref='member', lazy=True)
    event_registrations = db.relationship('EventRegistration', backref='member', lazy=True)

class Event(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    club_id = db.Column(db.Integer, db.ForeignKey('club.id'), nullable=False)
    name = db.Column(db.String(120), nullable=False)
    description = db.Column(db.Text)
    event_date = db.Column(db.DateTime, nullable=False)
    location = db.Column(db.String(200))
    max_participants = db.Column(db.Integer)
    registration_fee = db.Column(db.Float, default=0.0)
    status = db.Column(db.String(20), default='upcoming')  # upcoming, ongoing, completed, cancelled
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    registrations = db.relationship('EventRegistration', backref='event', lazy=True)

class EventRegistration(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    event_id = db.Column(db.Integer, db.ForeignKey('event.id'), nullable=False)
    member_id = db.Column(db.Integer, db.ForeignKey('member.id'), nullable=False)
    registration_date = db.Column(db.DateTime, default=datetime.utcnow)
    payment_status = db.Column(db.String(20), default='pending')  # pending, paid
    attendance_status = db.Column(db.String(20), default='registered')  # registered, attended, absent

class Payment(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    member_id = db.Column(db.Integer, db.ForeignKey('member.id'), nullable=False)
    amount = db.Column(db.Float, nullable=False)
    payment_type = db.Column(db.String(50), nullable=False)  # membership, event
    payment_method = db.Column(db.String(50))  # cash, card, online
    payment_date = db.Column(db.DateTime, default=datetime.utcnow)
    description = db.Column(db.Text)
    status = db.Column(db.String(20), default='completed')

# Login required decorator
def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'user_id' not in session:
            flash('Please login first.', 'warning')
            return redirect(url_for('login'))
        return f(*args, **kwargs)
    return decorated_function

def admin_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'user_id' not in session:
            flash('Please login first.', 'warning')
            return redirect(url_for('login'))
        user = User.query.get(session['user_id'])
        if user.role != 'admin':
            flash('Admin access required.', 'danger')
            return redirect(url_for('dashboard'))
        return f(*args, **kwargs)
    return decorated_function

# Routes
@app.route('/')
def index():
    clubs = Club.query.all()
    upcoming_events = Event.query.filter_by(status='upcoming').order_by(Event.event_date).limit(6).all()
    return render_template('index.html', clubs=clubs, events=upcoming_events)

@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        username = request.form.get('username')
        email = request.form.get('email')
        password = request.form.get('password')
        full_name = request.form.get('full_name')
        
        if User.query.filter_by(username=username).first():
            flash('Username already exists.', 'danger')
            return redirect(url_for('register'))
        
        if User.query.filter_by(email=email).first():
            flash('Email already registered.', 'danger')
            return redirect(url_for('register'))
        
        hashed_password = generate_password_hash(password)
        new_user = User(username=username, email=email, password=hashed_password, full_name=full_name)
        
        db.session.add(new_user)
        db.session.commit()
        
        flash('Registration successful! Please login.', 'success')
        return redirect(url_for('login'))
    
    return render_template('register.html')

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form.get('username')
        password = request.form.get('password')
        
        user = User.query.filter_by(username=username).first()
        
        if user and check_password_hash(user.password, password):
            session['user_id'] = user.id
            session['username'] = user.username
            session['role'] = user.role
            flash(f'Welcome back, {user.full_name}!', 'success')
            return redirect(url_for('dashboard'))
        else:
            flash('Invalid username or password.', 'danger')
    
    return render_template('login.html')

@app.route('/logout')
def logout():
    session.clear()
    flash('You have been logged out.', 'info')
    return redirect(url_for('index'))

@app.route('/dashboard')
@login_required
def dashboard():
    user = User.query.get(session['user_id'])
    
    if user.role == 'admin':
        total_users = User.query.count()
        total_clubs = Club.query.count()
        total_members = Member.query.count()
        total_events = Event.query.count()
        active_members = Member.query.filter_by(status='active').count()
        recent_payments = Payment.query.order_by(Payment.payment_date.desc()).limit(5).all()
        
        return render_template('admin_dashboard.html', 
                             total_users=total_users,
                             total_clubs=total_clubs,
                             total_members=total_members,
                             total_events=total_events,
                             active_members=active_members,
                             recent_payments=recent_payments)
    else:
        my_memberships = Member.query.filter_by(user_id=user.id).all()
        my_events = EventRegistration.query.join(Member).filter(Member.user_id == user.id).all()
        return render_template('member_dashboard.html', 
                             memberships=my_memberships, 
                             event_registrations=my_events)

@app.route('/clubs')
def clubs():
    all_clubs = Club.query.all()
    return render_template('clubs.html', clubs=all_clubs)

@app.route('/club/<int:club_id>')
def club_detail(club_id):
    club = Club.query.get_or_404(club_id)
    members = Member.query.filter_by(club_id=club_id).all()
    events = Event.query.filter_by(club_id=club_id).order_by(Event.event_date.desc()).all()
    return render_template('club_detail.html', club=club, members=members, events=events)

@app.route('/events')
def events():
    all_events = Event.query.order_by(Event.event_date.desc()).all()
    return render_template('events.html', events=all_events)

@app.route('/event/<int:event_id>')
def event_detail(event_id):
    event = Event.query.get_or_404(event_id)
    registrations = EventRegistration.query.filter_by(event_id=event_id).all()
    return render_template('event_detail.html', event=event, registrations=registrations)

@app.route('/admin/clubs', methods=['GET', 'POST'])
@admin_required
def admin_clubs():
    if request.method == 'POST':
        name = request.form.get('name')
        description = request.form.get('description')
        sport_type = request.form.get('sport_type')
        location = request.form.get('location')
        contact_email = request.form.get('contact_email')
        contact_phone = request.form.get('contact_phone')
        
        new_club = Club(name=name, description=description, sport_type=sport_type,
                       location=location, contact_email=contact_email, contact_phone=contact_phone)
        db.session.add(new_club)
        db.session.commit()
        
        flash('Club created successfully!', 'success')
        return redirect(url_for('admin_clubs'))
    
    clubs = Club.query.all()
    return render_template('admin_clubs.html', clubs=clubs)

@app.route('/admin/members')
@admin_required
def admin_members():
    members = Member.query.all()
    return render_template('admin_members.html', members=members)

@app.route('/admin/events', methods=['GET', 'POST'])
@admin_required
def admin_events():
    if request.method == 'POST':
        club_id = request.form.get('club_id')
        name = request.form.get('name')
        description = request.form.get('description')
        event_date = datetime.strptime(request.form.get('event_date'), '%Y-%m-%dT%H:%M')
        location = request.form.get('location')
        max_participants = request.form.get('max_participants')
        registration_fee = request.form.get('registration_fee')
        
        new_event = Event(club_id=club_id, name=name, description=description,
                         event_date=event_date, location=location,
                         max_participants=max_participants, registration_fee=registration_fee)
        db.session.add(new_event)
        db.session.commit()
        
        flash('Event created successfully!', 'success')
        return redirect(url_for('admin_events'))
    
    events = Event.query.all()
    clubs = Club.query.all()
    return render_template('admin_events.html', events=events, clubs=clubs)

@app.route('/join-club/<int:club_id>', methods=['GET', 'POST'])
@login_required
def join_club(club_id):
    club = Club.query.get_or_404(club_id)
    
    if request.method == 'POST':
        membership_type = request.form.get('membership_type')
        phone = request.form.get('phone')
        address = request.form.get('address')
        
        # Calculate expiry date
        if membership_type == 'monthly':
            expiry_date = datetime.utcnow() + timedelta(days=30)
        else:  # yearly
            expiry_date = datetime.utcnow() + timedelta(days=365)
        
        new_member = Member(user_id=session['user_id'], club_id=club_id,
                           membership_type=membership_type, expiry_date=expiry_date,
                           phone=phone, address=address)
        db.session.add(new_member)
        db.session.commit()
        
        flash(f'Successfully joined {club.name}!', 'success')
        return redirect(url_for('dashboard'))
    
    return render_template('join_club.html', club=club)

@app.route('/register-event/<int:event_id>')
@login_required
def register_event(event_id):
    event = Event.query.get_or_404(event_id)
    
    # Check if event is upcoming
    if event.status != 'upcoming':
        flash('This event is not open for registration.', 'warning')
        return redirect(url_for('event_detail', event_id=event_id))
    
    # Check if user is a member of the club
    member = Member.query.filter_by(user_id=session['user_id'], club_id=event.club_id).first()
    
    if not member:
        flash(f'You must be a member of {event.club.name} to register for this event. Please join the club first!', 'warning')
        return redirect(url_for('club_detail', club_id=event.club_id))
    
    # Check if member's membership is active
    if member.status != 'active':
        flash('Your membership is not active. Please renew your membership to register for events.', 'danger')
        return redirect(url_for('dashboard'))
    
    # Check if already registered
    existing_registration = EventRegistration.query.filter_by(event_id=event_id, member_id=member.id).first()
    if existing_registration:
        flash('You are already registered for this event.', 'info')
        return redirect(url_for('event_detail', event_id=event_id))
    
    # Check if event has reached max capacity
    if event.max_participants:
        current_registrations = EventRegistration.query.filter_by(event_id=event_id).count()
        if current_registrations >= event.max_participants:
            flash('Sorry, this event has reached maximum capacity.', 'warning')
            return redirect(url_for('event_detail', event_id=event_id))
    
    # Register for event
    registration = EventRegistration(event_id=event_id, member_id=member.id)
    db.session.add(registration)
    db.session.commit()
    
    flash(f'Successfully registered for {event.name}!', 'success')
    return redirect(url_for('dashboard'))

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
        
        # Create default admin user if not exists
        if not User.query.filter_by(username='admin').first():
            admin = User(
                username='admin',
                email='admin@fitsphere.in',
                password=generate_password_hash('admin123'),
                full_name='System Administrator',
                role='admin'
            )
            db.session.add(admin)
            db.session.commit()
            print('Default admin created: username=admin, password=admin123')
    
    app.run(debug=True, host='127.0.0.1', port=5000)
