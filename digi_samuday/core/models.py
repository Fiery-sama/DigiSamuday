from django.contrib.auth.models import AbstractUser, Group, Permission
from django.db import models
from django.conf import settings
from django.utils import timezone

class Resident(AbstractUser):
    """
    Model representing a resident user in the society management system.
    Inherits from Django's AbstractUser to include authentication fields.
    """
    RESIDENT = 'resident'
    ADMIN = 'admin'
    SECURITY = 'security'

    ROLE_CHOICES = [
        (RESIDENT, 'Resident'),
        (ADMIN, 'Admin'),
        (SECURITY, 'Security'),
    ]

    apartment_no = models.CharField(max_length=20)  # Apartment number of the resident
    phone_number = models.CharField(max_length=15)  # Contact number
    role = models.CharField(max_length=20, choices=ROLE_CHOICES)  # User role
    status = models.CharField(max_length=10, choices=[('active', 'Active'), ('inactive', 'Inactive')], default='active')

    groups = models.ManyToManyField(Group, related_name="resident_group_set", blank=True)  # Group permissions
    user_permissions = models.ManyToManyField(Permission, related_name="resident_permission_set", blank=True)  # User permissions

    def __str__(self):
        return f"{self.username} ({self.role})"

class Visitor(models.Model):
    """
    Model representing visitors to the society.
    """
    name = models.CharField(max_length=100)  # Visitor's name
    phone_number = models.CharField(max_length=15)  # Contact number
    vehicle_number = models.CharField(max_length=20, blank=True, null=True)  # Optional vehicle number
    check_in = models.DateTimeField(auto_now_add=True)  # Check-in time
    check_out = models.DateTimeField(null=True, blank=True)  # Check-out time
    resident = models.ForeignKey(Resident, on_delete=models.CASCADE)  # Resident being visited

class Complaint(models.Model):
    """
    Model representing complaints filed by residents.
    """
    title = models.CharField(max_length=150)  # Complaint title
    description = models.TextField()  # Complaint details
    status = models.CharField(max_length=20, choices=[('open', 'Open'), ('in_progress', 'In Progress'), ('resolved', 'Resolved')], default='open')  # Complaint status
    created_at = models.DateTimeField(auto_now_add=True)  # Creation timestamp
    updated_at = models.DateTimeField(auto_now=True)  # Update timestamp
    resident = models.ForeignKey(Resident, on_delete=models.CASCADE)  # Resident who filed the complaint

class Payment(models.Model):
    """
    Model representing payment transactions made by residents.
    """
    amount = models.DecimalField(max_digits=10, decimal_places=2)  # Payment amount
    payment_date = models.DateTimeField(auto_now_add=True)  # Payment timestamp
    payment_status = models.CharField(
        max_length=20, 
        choices=[('pending', 'Pending'), ('completed', 'Completed')], 
        default='pending'
    )  # Payment status
    payment_method = models.CharField(max_length=50)  # Payment method
    resident = models.ForeignKey(Resident, on_delete=models.CASCADE)  # Resident making the payment

class Facility(models.Model):
    """
    Model representing facilities available in the society.
    """
    name = models.CharField(max_length=100)  # Facility name
    description = models.TextField()  # Facility details
    availability_status = models.CharField(max_length=20, choices=[('available', 'Available'), ('booked', 'Booked')], default='available')  # Booking status

class FacilityBooking(models.Model):
    """
    Model representing facility bookings by residents.
    """
    STATUS_CHOICES = [
        ("pending", "Pending"),
        ("approved", "Approved"),
        ("rejected", "Rejected"),
    ]

    resident = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)  # Resident making the booking
    facility_name = models.CharField(max_length=255, default="Community Hall")  # Facility being booked
    start_time = models.DateTimeField(default=timezone.now)  # Booking start time
    end_time = models.DateTimeField(null=True, blank=True)  # Booking end time
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default="pending")  # Booking status
    created_at = models.DateTimeField(auto_now_add=True)  # Timestamp of booking request

    def __str__(self):
        return f"{self.facility_name} - {self.resident.username} ({self.status})"

class Notice(models.Model):
    """
    Model representing notices/announcements posted by admins.
    """
    title = models.CharField(max_length=150)  # Notice title
    content = models.TextField()  # Notice details
    posted_by = models.ForeignKey(Resident, on_delete=models.CASCADE, limit_choices_to={'role': 'admin'})  # Admin posting the notice
    created_at = models.DateTimeField(auto_now_add=True)  # Timestamp of notice creation

class SecurityLog(models.Model):
    """
    Model representing security logs for visitor entries and exits.
    """
    visitor = models.ForeignKey(Visitor, on_delete=models.CASCADE)  # Visitor being logged
    entry_time = models.DateTimeField(auto_now_add=True)  # Entry timestamp
    exit_time = models.DateTimeField(null=True, blank=True)  # Exit timestamp
    guard_name = models.CharField(max_length=100)  # Name of the security guard logging the entry