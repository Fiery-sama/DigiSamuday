from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import Resident, Visitor, Complaint, Payment, Facility, FacilityBooking, Notice, SecurityLog

class ResidentAdmin(UserAdmin):
    """
    Admin configuration for the Resident model.
    Extends Django's built-in UserAdmin to include additional fields.
    """
    model = Resident
    list_display = ("username", "email", "apartment_no", "phone_number", "role", "status")  # Fields to display in the admin panel
    list_filter = ("role", "status")  # Filters for quick sorting
    fieldsets = UserAdmin.fieldsets + (
        (None, {"fields": ("apartment_no", "phone_number", "role", "status")}),  # Adding custom fields to the UserAdmin
    )

# Registering models in Django Admin to enable management through the admin interface
admin.site.register(Resident, ResidentAdmin)
admin.site.register(Visitor)
admin.site.register(Complaint)
admin.site.register(Payment)
admin.site.register(Facility)
admin.site.register(Notice)
admin.site.register(SecurityLog)

class FacilityBookingAdmin(admin.ModelAdmin):
    """
    Admin configuration for the FacilityBooking model.
    Provides search and filtering options.
    """
    list_display = ("resident", "facility_name", "start_time", "end_time", "status")  # Fields to display in the admin panel
    list_filter = ("status",)  # Filter bookings by status
    search_fields = ("resident__username", "facility_name")  # Enable search functionality by resident username and facility name

# Register FacilityBooking with its custom admin configuration
admin.site.register(FacilityBooking, FacilityBookingAdmin)
