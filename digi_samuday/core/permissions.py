from rest_framework.permissions import BasePermission

class IsAdmin(BasePermission):
    """
    Custom permission to allow access only to admin users.
    """
    def has_permission(self, request, view):
        # Check if the user is authenticated and has the role of 'admin'
        return request.user.is_authenticated and getattr(request.user, "role", None) == "admin"

class IsResident(BasePermission):
    """
    Custom permission to allow access only to residents.
    """
    def has_permission(self, request, view):
        # Check if the user is authenticated and has the role of 'resident'
        return request.user.is_authenticated and getattr(request.user, "role", None) == "resident"

class IsSecurity(BasePermission):
    """
    Custom permission to allow access only to security personnel.
    """
    def has_permission(self, request, view):
        # Check if the user is authenticated and has the role of 'security'
        return request.user.is_authenticated and getattr(request.user, "role", None) == "security"