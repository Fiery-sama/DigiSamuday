from rest_framework import serializers
from .models import Resident, Visitor, Complaint, Payment, Facility, FacilityBooking, Notice, SecurityLog
from django.contrib.auth.hashers import make_password

class RegisterSerializer(serializers.ModelSerializer):
    """
    Serializer for user registration.
    Hashes the password before saving the user.
    """
    class Meta:
        model = Resident
        fields = ['username', 'password', 'email', 'phone_number', 'apartment_no', 'role']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        """
        Override create method to hash the password before storing.
        """
        validated_data['password'] = make_password(validated_data['password'])  # Hash the password
        return super().create(validated_data)

class ResidentSerializer(serializers.ModelSerializer):
    """
    Serializer for the Resident model, excluding sensitive information like password.
    """
    class Meta:
        model = Resident
        fields = ['id', 'username', 'email', 'apartment_no', 'phone_number', 'role', 'status']

class VisitorSerializer(serializers.ModelSerializer):
    """
    Serializer for the Visitor model, including all fields.
    """
    class Meta:
        model = Visitor
        fields = '__all__'

class ComplaintSerializer(serializers.ModelSerializer):
    """
    Serializer for the Complaint model.
    Includes the resident's username as a read-only field.
    """
    resident_name = serializers.CharField(source="resident.username", read_only=True)

    class Meta:
        model = Complaint
        fields = ["id", "title", "description", "status", "created_at", "updated_at", "resident_name"]

class PaymentSerializer(serializers.ModelSerializer):
    """
    Serializer for the Payment model.
    The resident field is read-only to prevent modification.
    """
    resident = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = Payment
        fields = ["id", "amount", "payment_date", "payment_status", "payment_method", "resident"]

class FacilitySerializer(serializers.ModelSerializer):
    """
    Serializer for the Facility model, including all details about a facility.
    """
    class Meta:
        model = Facility
        fields = ["id", "name", "description", "availability_status"]

class FacilityBookingSerializer(serializers.ModelSerializer):
    """
    Serializer for Facility Booking model.
    Includes the resident's username as a read-only field.
    """
    resident = serializers.ReadOnlyField(source="resident.username")

    class Meta:
        model = FacilityBooking
        fields = ["id", "facility_name", "start_time", "end_time", "status", "resident"]

class NoticeSerializer(serializers.ModelSerializer):
    """
    Serializer for the Notice model.
    Includes the admin username who posted the notice as a read-only field.
    """
    posted_by = serializers.ReadOnlyField(source="posted_by.username")

    class Meta:
        model = Notice
        fields = ["id", "title", "content", "created_at", "posted_by"]

class SecurityLogSerializer(serializers.ModelSerializer):
    """
    Serializer for the Security Log model, including all fields.
    """
    class Meta:
        model = SecurityLog
        fields = '__all__'
