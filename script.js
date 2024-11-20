// Mock data for meetings
const mockMeetings = [
    {
        name: "Sweet Surrender Support Group",
        location: "San Francisco",
        address: "123 Main St",
        time: "Mondays 7:00 PM",
        type: "In-Person"
    },
    {
        name: "Digital Dessert Detox",
        location: "Online",
        address: "Zoom Meeting",
        time: "Wednesdays 6:30 PM",
        type: "Virtual"
    },
    {
        name: "Frozen Freedom Fellowship",
        location: "Los Angeles",
        address: "456 Palm Ave",
        time: "Fridays 5:00 PM",
        type: "In-Person"
    }
];

// Handle meeting search
function findMeetings() {
    const location = document.getElementById('location').value.toLowerCase();
    const resultsDiv = document.getElementById('meeting-results');
    resultsDiv.innerHTML = '';

    const filteredMeetings = mockMeetings.filter(meeting => 
        meeting.location.toLowerCase().includes(location) ||
        meeting.address.toLowerCase().includes(location)
    );

    if (filteredMeetings.length === 0) {
        resultsDiv.innerHTML = `
            <div class="no-results">
                <p>No meetings found in your area. Would you like to start one?</p>
                <button onclick="startNewMeeting()" class="cta-button">Start a Meeting</button>
            </div>
        `;
        return;
    }

    filteredMeetings.forEach(meeting => {
        const meetingCard = document.createElement('div');
        meetingCard.className = 'meeting-card';
        meetingCard.innerHTML = `
            <h3>${meeting.name}</h3>
            <p><strong>Location:</strong> ${meeting.location}</p>
            <p><strong>Address:</strong> ${meeting.address}</p>
            <p><strong>Time:</strong> ${meeting.time}</p>
            <p><strong>Type:</strong> ${meeting.type}</p>
            <button onclick="joinMeeting('${meeting.name}')" class="join-button">Join Meeting</button>
        `;
        resultsDiv.appendChild(meetingCard);
    });
}

// Handle story form submission
document.getElementById('story-form')?.addEventListener('submit', async function(e) {
    e.preventDefault();
    const story = e.target.querySelector('textarea').value;
    if (story.trim()) {
        try {
            const { data, error } = await supabase
                .from('stories')
                .insert([
                    { content: story }
                ]);

            if (error) throw error;

            alert('Thank you for sharing your story. Your experience will help others in their journey.');
            e.target.reset();
        } catch (error) {
            console.error('Error submitting story:', error);
            alert('There was an error submitting your story. Please try again.');
        }
    } else {
        alert('Please share your story before submitting.');
    }
});

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Handle meeting join button click
async function joinMeeting(meetingName) {
    const name = prompt('Please enter your name (optional):');
    const email = prompt('Please enter your email (optional):');
    
    try {
        const { data, error } = await supabase
            .from('meeting_registrations')
            .insert([
                {
                    meeting_name: meetingName,
                    name: name || null,
                    email: email || null
                }
            ]);

        if (error) throw error;

        alert(`Thank you for joining ${meetingName}! ${email ? 'A confirmation email will be sent shortly.' : ''}`);
    } catch (error) {
        console.error('Error registering for meeting:', error);
        alert('There was an error registering for the meeting. Please try again.');
    }
}

// Handle new meeting creation
function startNewMeeting() {
    alert('Thank you for your interest in starting a new meeting! Our team will contact you soon with next steps.');
}

// Add scroll-based animations
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        const rect = section.getBoundingClientRect();
        const isVisible = (rect.top <= window.innerHeight * 0.75) && (rect.bottom >= 0);
        if (isVisible) {
            section.classList.add('fade-in');
        }
    });
});

// Add CSS for animations
const style = document.createElement('style');
style.textContent = `
    .fade-in {
        animation: fadeIn 1s ease-in;
    }
    
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
    }
    
    .meeting-card {
        background: white;
        padding: 1.5rem;
        margin: 1rem 0;
        border-radius: 10px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }
    
    .join-button {
        background-color: var(--primary-color);
        color: white;
        border: none;
        padding: 0.5rem 1rem;
        border-radius: 5px;
        cursor: pointer;
        margin-top: 1rem;
    }
    
    .no-results {
        text-align: center;
        padding: 2rem;
    }
`;
document.head.appendChild(style);
