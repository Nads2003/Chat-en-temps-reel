# notifications/views.py
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .models import Notification
from .serializers import NotificationSerializer


# 🔹 Toutes les notifications (ordre récent)
class NotificationsListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        notifs = Notification.objects.filter(
            user=request.user
        ).order_by("-created_at")

        serializer = NotificationSerializer(notifs, many=True)
        return Response(serializer.data)


# 🔹 Notifications non lues (déjà OK chez toi)
class NotificationsNonLuesView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        notifs = Notification.objects.filter(
            user=request.user,
            is_read=False
        )
        serializer = NotificationSerializer(notifs, many=True)
        return Response(serializer.data)


# 🔹 Compteur (badge 🔔)
class NotificationsCountView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        count = Notification.objects.filter(
            user=request.user,
            is_read=False
        ).count()
        return Response({"count": count})


# 🔹 Marquer UNE notification comme lue
class NotificationMarkReadView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        notif = get_object_or_404(
            Notification,
            id=pk,
            user=request.user
        )
        notif.is_read = True
        notif.save()
        return Response({"message": "Notification marquée comme lue"})


# 🔹 Marquer TOUTES comme lues
class NotificationsMarkAllReadView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        Notification.objects.filter(
            user=request.user,
            is_read=False
        ).update(is_read=True)

        return Response({"message": "Toutes les notifications sont lues"})

