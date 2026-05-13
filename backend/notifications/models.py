
#notification/models
from django.db import models
from accounts.models import Utilisateur

class Notification(models.Model):
    NOTIF_TYPES = (
        ("friend_request", "Demande d'ami"),
        ("friend_accept", "Demande acceptée"),
        ("message", "Message"),
    )

    user = models.ForeignKey(
        Utilisateur,
        on_delete=models.CASCADE,
        related_name="notifications"
    )
    sender = models.ForeignKey(
        Utilisateur,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="sent_notifications"
    )
    type = models.CharField(max_length=30, choices=NOTIF_TYPES)
    message = models.CharField(max_length=255)
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user} - {self.message}"
