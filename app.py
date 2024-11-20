from flask import Flask, request, jsonify, render_template
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from datetime import datetime
import os

app = Flask(__name__, static_folder='.', static_url_path='')
CORS(app)

# Database configuration
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///froyo.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

# Database Models
class Story(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    content = db.Column(db.Text, nullable=False)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'content': self.content,
            'timestamp': self.timestamp.strftime('%Y-%m-%d %H:%M:%S')
        }

class MeetingRegistration(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    meeting_name = db.Column(db.String(100), nullable=False)
    name = db.Column(db.String(100))
    email = db.Column(db.String(120))
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'meeting_name': self.meeting_name,
            'name': self.name,
            'email': self.email,
            'timestamp': self.timestamp.strftime('%Y-%m-%d %H:%M:%S')
        }

# Create database tables
with app.app_context():
    db.create_all()

# Routes
@app.route('/')
def home():
    return app.send_static_file('index.html')

@app.route('/api/stories', methods=['POST'])
def submit_story():
    data = request.json
    story = Story(content=data.get('story'))
    db.session.add(story)
    db.session.commit()
    return jsonify({'message': 'Story submitted successfully', 'story': story.to_dict()})

@app.route('/api/stories', methods=['GET'])
def get_stories():
    stories = Story.query.order_by(Story.timestamp.desc()).all()
    return jsonify([story.to_dict() for story in stories])

@app.route('/api/meetings/register', methods=['POST'])
def register_meeting():
    data = request.json
    registration = MeetingRegistration(
        meeting_name=data.get('meeting_name'),
        name=data.get('name', ''),
        email=data.get('email', '')
    )
    db.session.add(registration)
    db.session.commit()
    return jsonify({'message': 'Registration successful', 'registration': registration.to_dict()})

@app.route('/api/meetings/registrations', methods=['GET'])
def get_registrations():
    registrations = MeetingRegistration.query.order_by(MeetingRegistration.timestamp.desc()).all()
    return jsonify([reg.to_dict() for reg in registrations])

@app.route('/admin')
def admin_dashboard():
    stories = Story.query.order_by(Story.timestamp.desc()).all()
    registrations = MeetingRegistration.query.order_by(MeetingRegistration.timestamp.desc()).all()
    return render_template('admin.html', stories=stories, registrations=registrations)

if __name__ == '__main__':
    app.run(debug=True, port=5000)
