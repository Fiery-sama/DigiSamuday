# DigiSamuday
A Society &amp; Management System based on Django and React
Designed and Developed by 
Suhail Khan
Enrolment Number: 2352838518
MCSP 232 [MCA_NEW PROJECT]
Under guidance of 
Dr. Faiyaz Ahmad
Assistant Professor
Dept. of Computer Engineering

DigiSamuday is a comprehensive Society & Apartment Management Application designed to streamline community operations, enhance security, and improve communication among residents and management.
Features

    Resident Management: Maintain a database of all residents with their details.

    Visitor Management: Log visitor entries and exits for enhanced security.

    Complaint System: Allow residents to lodge and track complaints.

    Payment Tracking: Manage society maintenance payments and dues.

    Facility Booking: Residents can book society amenities like clubhouse, gym, etc.

    Notices & Announcements: Admins can publish important notices for residents.

    Security Logs: Record security-related activities within the premises.

Technology Stack

    Backend: Django (Python) with MySQL database

    Frontend: React.js with Tailwind CSS & Flowbite for UI components

Installation & Setup
Prerequisites

    Python 3.x

    Node.js & npm

    MySQL Database

Backend Setup

    Clone the repository:
    git clone https://github.com/Fiery-sama/DigiSamuday.git
    cd DigiSamuday/digi_samuday

    Create a virtual environment and activate it:
    python -m venv venv
    source venv/bin/activate  # On Windows: venv\Scripts\activate

    Install dependencies:
    pip install -r requirements.txt

    Configure MySQL database in settings.py.

    Run migrations:
    python manage.py migrate

    Start the backend server:
    python manage.py runserver

Frontend Setup

    Navigate to the frontend directory:
    cd ../digisamuday-frontend

    Install dependencies:
    npm install

    Start the development server:
    npm start

Usage

    Access the application at http://localhost:3000 (Frontend)

    API endpoints are available at http://localhost:8000/api/

Contribution

Contributions are welcome! Feel free to fork the repository and submit a pull request.

License

This project is licensed under the MIT License.
