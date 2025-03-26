# importing the required libraries
from django.contrib.auth import authenticate, login, logout
from django.utils import timezone

from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes, action
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.authtoken.models import Token
from rest_framework.exceptions import PermissionDenied

from .models import (
    Resident, Visitor, Complaint, Payment, 
    Facility, FacilityBooking, Notice, SecurityLog
)
from .serializers import (
    RegisterSerializer, ResidentSerializer, VisitorSerializer, 
    ComplaintSerializer, PaymentSerializer, FacilitySerializer, 
    FacilityBookingSerializer, NoticeSerializer, SecurityLogSerializer
)
from .permissions import IsAdmin, IsResident, IsSecurity

class ResidentViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing residents.

    - Only admins have permission to create, update, or delete residents.
    - Provides standard CRUD operations for Resident instances.
    """
    queryset = Resident.objects.all()  # Retrieve all resident records
    serializer_class = ResidentSerializer  # Use ResidentSerializer for serialization
    permission_classes = [IsAuthenticated, IsAdmin]  # Only authenticated admins can access

class VisitorViewSet(viewsets.ModelViewSet):
    """
    ViewSet for logging and managing visitor records.

    - Only security personnel have permission to create, update, or delete visitor logs.
    - Provides standard CRUD operations for Visitor instances.
    """
    queryset = Visitor.objects.all()  # Retrieve all visitor records
    serializer_class = VisitorSerializer  # Use VisitorSerializer for serialization
    permission_classes = [IsAuthenticated, IsSecurity]  # Only authenticated security personnel can access

class PaymentViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing payments.

    - Residents can create payments, which are initially marked as 'pending'.
    - Admins can approve or reject payments.
    - Provides standard CRUD operations for Payment instances.
    """
    queryset = Payment.objects.all()  # Retrieve all payment records
    serializer_class = PaymentSerializer  # Use PaymentSerializer for serialization
    permission_classes = [permissions.IsAuthenticated]  # Only authenticated users can access payment records

    def perform_create(self, serializer):
        """
        Override the create method to:
        - Automatically link the payment to the logged-in resident.
        - Set the initial payment status to 'pending'.
        """
        serializer.save(resident=self.request.user, payment_status="pending")

    @action(detail=True, methods=["PATCH"], permission_classes=[permissions.IsAdminUser])
    def approve_payment(self, request, pk=None):
        """
        Custom action to allow admins to approve or reject payments.

        - Only admins can change payment status.
        - Status can be updated to 'completed' or 'rejected'.
        - Returns a response with the updated status message.
        """
        payment = self.get_object()
        new_status = request.data.get("payment_status")

        # Validate the provided status
        if new_status not in ["completed", "rejected"]:
            return Response({"error": "Invalid status. Use 'completed' or 'rejected'."}, status=400)

        # Update and save the payment status
        payment.payment_status = new_status
        payment.save()

        return Response({"message": f"Payment status updated to {new_status}", "status": new_status})

class FacilityViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing facilities.

    - Residents can view available facilities.
    - Only admins can create new facilities.
    - Provides standard CRUD operations for Facility instances.
    """
    queryset = Facility.objects.all()  # Retrieve all facilities
    serializer_class = FacilitySerializer  # Use FacilitySerializer for serialization
    permission_classes = [permissions.IsAuthenticated]  # Only authenticated users can access facilities

    def perform_create(self, serializer):
        """
        Override the create method to restrict facility creation to admins only.

        - If the user is not an admin, raise a PermissionDenied exception.
        - Otherwise, save the facility.
        """
        if self.request.user.role != "admin":
            raise PermissionDenied("Only admins can create facilities.")
        serializer.save()

class FacilityBookingViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing facility bookings.

    - Residents can create booking requests.
    - Admins can approve or reject bookings.
    - Provides standard CRUD operations for FacilityBooking instances.
    """
    queryset = FacilityBooking.objects.all()  # Retrieve all facility bookings
    serializer_class = FacilityBookingSerializer  # Use FacilityBookingSerializer for serialization
    permission_classes = [permissions.IsAuthenticated]  # Only authenticated users can access booking records

    @action(detail=True, methods=["PATCH"], permission_classes=[permissions.IsAdminUser])
    def approve(self, request, pk=None):
        """
        Custom action to allow admins to approve a booking.

        - Updates the booking status to 'approved'.
        - Only accessible by admins.
        """
        booking = self.get_object()  # Retrieve the booking instance
        booking.status = "approved"
        booking.save()  # Save the updated status
        return Response({"message": "Booking approved", "status": "approved"}, status=status.HTTP_200_OK)

    @action(detail=True, methods=["PATCH"], permission_classes=[permissions.IsAdminUser])
    def reject(self, request, pk=None):
        """
        Custom action to allow admins to reject a booking.

        - Updates the booking status to 'rejected'.
        - Only accessible by admins.
        """
        booking = self.get_object()  # Retrieve the booking instance
        booking.status = "rejected"
        booking.save()  # Save the updated status
        return Response({"message": "Booking rejected", "status": "rejected"}, status=status.HTTP_200_OK)

    def perform_create(self, serializer):
        """
        Automatically assigns the logged-in resident to the booking.

        - The booking status is set to 'pending' by default.
        """
        serializer.save(resident=self.request.user, status="pending")
    
class NoticeViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing notices.

    - Residents can view notices.
    - Only admins can create and manage notices.
    - Notices are ordered by creation date (latest first).
    """
    queryset = Notice.objects.all().order_by("-created_at")  # Fetch all notices, ordered by newest first
    serializer_class = NoticeSerializer  # Use NoticeSerializer for serialization
    permission_classes = [permissions.IsAuthenticated]  # Only authenticated users can access notices

    def perform_create(self, serializer):
        """
        Restrict notice creation to admins and auto-assign the `posted_by` field.

        - Raises a PermissionDenied error if a non-admin attempts to post a notice.
        """
        if self.request.user.role != "admin":
            raise PermissionDenied("Only admins can post notices.")
        serializer.save(posted_by=self.request.user)

class ComplaintViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing resident complaints.

    - Residents can create complaints.
    - Admins can update, delete, and change complaint statuses.
    - All authenticated users can view complaints.
    """
    queryset = Complaint.objects.all()  # Fetch all complaints
    serializer_class = ComplaintSerializer  # Use ComplaintSerializer for serialization
    permission_classes = [permissions.IsAuthenticated]  # Default permission for authenticated users

    def get_permissions(self):
        """
        Assign permissions dynamically based on the request action.

        - Residents can create complaints.
        - Admins can update, delete, or change complaint statuses.
        - All authenticated users can view complaints.
        """
        if self.action in ["update", "partial_update", "destroy"]:
            return [IsAdmin()]  # Only admins can modify or delete complaints
        elif self.action == "create":
            return [IsResident()]  # Only residents can file complaints
        return [permissions.IsAuthenticated()]  # Default: any authenticated user can view complaints

    @action(detail=True, methods=["PATCH"], permission_classes=[IsAdmin])
    def update_status(self, request, pk=None):
        """
        Admin action to update the status of a complaint.

        - Allowed statuses: `open`, `in_progress`, `resolved`
        - Returns an error for invalid statuses.
        """
        complaint = self.get_object()
        new_status = request.data.get("status")

        if new_status not in ["open", "in_progress", "resolved"]:
            return Response({"error": "Invalid status"}, status=400)

        complaint.status = new_status
        complaint.save()
        return Response({"message": "Complaint status updated", "status": new_status})

    def perform_create(self, serializer):
        """
        Ensure that the complaint is linked to the logged-in resident.
        """
        serializer.save(resident=self.request.user)

class SecurityLogViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing security logs.

    - Security personnel can log visitor check-ins and check-outs.
    - Residents and admins can view logs.
    """
    queryset = SecurityLog.objects.all()  # Fetch all security logs
    serializer_class = SecurityLogSerializer  # Use SecurityLogSerializer for serialization
    permission_classes = [permissions.IsAuthenticated]  # Only authenticated users can access logs

    @action(detail=True, methods=["PATCH"], permission_classes=[permissions.IsAuthenticated])
    def checkout(self, request, pk=None):
        """
        Allow security personnel to mark a visitor's check-out.

        - Sets the `exit_time` field to the current timestamp.
        - Returns an error if the log entry does not exist.
        """
        try:
            log = self.get_object()  # Retrieve the security log entry
            if log.exit_time is not None:
                return Response({"error": "Visitor has already checked out."}, status=status.HTTP_400_BAD_REQUEST)
            
            log.exit_time = timezone.now()
            log.save()  # Save the updated log with exit time
            return Response({"message": "Check-out successful", "exit_time": log.exit_time}, status=status.HTTP_200_OK)
        except SecurityLog.DoesNotExist:
            return Response({"error": "Visitor log not found"}, status=status.HTTP_404_NOT_FOUND)

# Login API
@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    """
    Authenticate user and return token along with user role.
    """
    username = request.data.get('username')
    password = request.data.get('password')

    if not username or not password:
        return Response({"error": "Username and password are required"}, status=status.HTTP_400_BAD_REQUEST)

    user = authenticate(username=username, password=password)
    if user:
        token, _ = Token.objects.get_or_create(user=user)
        login(request, user)
        return Response({
            "message": "Login successful",
            "role": user.role,
            "token": token.key
        }, status=status.HTTP_200_OK)

    return Response({"error": "Invalid credentials"}, status=status.HTTP_400_BAD_REQUEST)


# Logout API (Deletes Token)
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout_view(request):
    """
    Logout user by deleting their authentication token.
    """
    request.user.auth_token.delete()  # Ensure token is deleted
    logout(request)
    return Response({'message': 'Logout successful'}, status=status.HTTP_200_OK)


# User Profile API
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_profile(request):
    """
    Retrieve the authenticated user's profile details.
    """
    user = request.user
    return Response({
        'id': user.id,
        'username': user.username,
        'first_name': user.first_name,
        'last_name': user.last_name,
        'email': user.email,
        'role': user.role,
        'apartment_no': user.apartment_no,
        'phone_number': user.phone_number,
    }, status=status.HTTP_200_OK)


# Update Profile API
@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def update_profile(request):
    """
    Update the authenticated user's profile details.
    """
    user = request.user
    data = request.data

    user.first_name = data.get("first_name", user.first_name)
    user.last_name = data.get("last_name", user.last_name)
    user.email = data.get("email", user.email)
    user.phone_number = data.get("phone_number", user.phone_number)

    try:
        user.save()
        return Response({"success": True, "message": "Profile updated successfully"}, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({"success": False, "error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


# Registration API
@api_view(['POST'])
@permission_classes([AllowAny])
def register_view(request):
    """
    Register a new user.
    """
    serializer = RegisterSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response({'message': 'User registered successfully'}, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# Get Residents API (Admin only)
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_residents(request):
    """
    Retrieve all residents. Only accessible by admins.
    """
    if request.user.role != "admin":
        return Response({"error": "Permission denied"}, status=status.HTTP_403_FORBIDDEN)

    residents = Resident.objects.all()
    serializer = ResidentSerializer(residents, many=True)
    return Response(serializer.data)


# Get Visitor Logs API (Admin & Security Only)
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_visitor_logs(request):
    """
    Retrieve visitor logs. Admins and security personnel can access this.
    """
    if request.user.role not in ["admin", "security"]:
        return Response({"error": "Permission denied"}, status=status.HTTP_403_FORBIDDEN)

    logs = SecurityLog.objects.all().order_by('-entry_time')
    serializer = SecurityLogSerializer(logs, many=True)
    return Response(serializer.data)


# Log Visitor Entry API (Security Only)
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def log_visitor_entry(request):
    """
    Log a visitor entry. Only security personnel can use this.
    """
    if request.user.role != "security":
        return Response({"error": "Only security can log visitors."}, status=status.HTTP_403_FORBIDDEN)

    data = request.data
    required_fields = ["name", "phone_number", "resident_id"]

    # Check for missing fields
    missing_fields = [field for field in required_fields if not data.get(field)]
    if missing_fields:
        return Response({field: "This field is required." for field in missing_fields}, status=status.HTTP_400_BAD_REQUEST)

    try:
        # Ensure the resident exists
        resident = Resident.objects.get(id=data["resident_id"])

        visitor = Visitor.objects.create(
            name=data["name"],
            phone_number=data["phone_number"],
            vehicle_number=data.get("vehicle_number", None),
            resident=resident,
        )

        # Log visitor entry
        SecurityLog.objects.create(visitor=visitor, guard_name=request.user.username)

        return Response({"message": "Visitor entry logged successfully."}, status=status.HTTP_201_CREATED)

    except Resident.DoesNotExist:
        return Response({"error": "Resident not found."}, status=status.HTTP_400_BAD_REQUEST)

    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)



@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_complaints(request):
    """
    Retrieve complaints based on the user's role.

    - Admins can view all complaints.
    - Residents can only view complaints they have submitted.
    """
    if request.user.role == "admin":
        complaints = Complaint.objects.all()  # Admins can see all complaints
    else:
        complaints = Complaint.objects.filter(resident=request.user)  # Residents see their own complaints
    
    serializer = ComplaintSerializer(complaints, many=True)
    return Response(serializer.data)


@api_view(["PATCH"])
@permission_classes([IsAuthenticated, IsAdmin])
def update_complaint_status(request, pk):
    """
    Update the status of a complaint. (Admin only)

    - Allowed statuses: `open`, `in_progress`, `resolved`
    - Returns 400 for invalid status values.
    - Returns 404 if the complaint does not exist.
    """
    try:
        complaint = Complaint.objects.get(pk=pk)
        new_status = request.data.get("status")

        # Validate status input
        if new_status not in ["open", "in_progress", "resolved"]:
            return Response({"error": "Invalid status"}, status=status.HTTP_400_BAD_REQUEST)

        # Update complaint status
        complaint.status = new_status
        complaint.save()
        return Response({"message": "Complaint status updated", "status": new_status})
    
    except Complaint.DoesNotExist:
        return Response({"error": "Complaint not found"}, status=status.HTTP_404_NOT_FOUND)
    


import csv
from django.http import HttpResponse

def generate_csv_report(request, report_type):
    response = HttpResponse(content_type="text/csv")
    response["Content-Disposition"] = f'attachment; filename="{report_type}_report.csv"'
    writer = csv.writer(response)

    if report_type == "complaints":
        writer.writerow(["Complaint ID", "Title", "Description", "Status", "Resident", "Created At"])
        complaints = Complaint.objects.all()
        for complaint in complaints:
            writer.writerow([complaint.id, complaint.title, complaint.description, complaint.status, complaint.resident.username, complaint.created_at])

    elif report_type == "payments":
        writer.writerow(["Payment ID", "Amount", "Status", "Resident", "Date"])
        payments = Payment.objects.all()
        for payment in payments:
            writer.writerow([payment.id, payment.amount, payment.payment_status, payment.resident.username, payment.payment_date])

    elif report_type == "bookings":
        writer.writerow(["Booking ID", "Facility", "Start Time", "End Time", "Resident", "Status"])
        bookings = FacilityBooking.objects.all()
        for booking in bookings:
            writer.writerow([booking.id, booking.facility_name, booking.start_time, booking.end_time, booking.user.username, booking.status])

    else:
        writer.writerow(["Error", "Invalid Report Type"])
    
    return response