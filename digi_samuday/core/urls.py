from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    ResidentViewSet, VisitorViewSet, ComplaintViewSet, PaymentViewSet, FacilityViewSet, 
    FacilityBookingViewSet, NoticeViewSet, SecurityLogViewSet, login_view, logout_view, 
    user_profile, register_view, update_profile, get_visitor_logs, log_visitor_entry, 
    get_complaints, update_complaint_status
)

from .views import generate_csv_report

# Initialize Django REST Framework's DefaultRouter for automatically generating URLs
router = DefaultRouter()
router.register(r'residents', ResidentViewSet)  # Resident API endpoints
router.register(r'visitors', VisitorViewSet)  # Visitor API endpoints
router.register(r'complaints', ComplaintViewSet)  # Complaint API endpoints
router.register(r'payments', PaymentViewSet)  # Payment API endpoints
router.register(r'facilities', FacilityViewSet)  # Facility API endpoints
router.register(r'facility-bookings', FacilityBookingViewSet)  # Facility booking API endpoints
router.register(r'notices', NoticeViewSet)  # Notice API endpoints
router.register(r'security-logs', SecurityLogViewSet)  # Security log API endpoints

# Define URL patterns for API endpoints
urlpatterns = [
    path('api/', include(router.urls)),  # Include all router-generated URLs
    
    # Authentication endpoints
    path('api/register/', register_view, name='register'),  # User registration
    path('api/login/', login_view, name='login'),  # User login
    path('api/logout/', logout_view, name='logout'),  # User logout

    # User profile management
    path("api/user-profile/", user_profile, name="user-profile"),  # Fetch user profile
    path("api/update-profile/", update_profile, name="update-profile"),  # Update user profile

    # Security log management
    path("api/security-logs/<int:pk>/checkout/", SecurityLogViewSet.as_view({'patch': 'checkout'})),  # Visitor checkout
    path("api/security-logs/", get_visitor_logs, name="get-visitor-logs"),  # Fetch security logs
    path("api/visitors/", log_visitor_entry, name="log-visitor-entry"),  # Log visitor entry

    # Complaint management
    path("api/complaints/", get_complaints, name="get-complaints"),  # Fetch complaints
    path("api/complaints/<int:pk>/update-status/", update_complaint_status, name="update-complaint-status"),  # Update complaint status

    path("api/reports/<str:report_type>/", generate_csv_report, name="generate_csv_report"),
]