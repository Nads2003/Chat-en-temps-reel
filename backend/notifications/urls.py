from django.urls import path
from .views import (
    NotificationsListView,
    NotificationsNonLuesView,
    NotificationsCountView,
    NotificationMarkReadView,
    NotificationsMarkAllReadView
)

urlpatterns = [
    path("notifications/", NotificationsListView.as_view()),
    path("notifications/unread/", NotificationsNonLuesView.as_view()),
    path("notifications/count/", NotificationsCountView.as_view()),
    path("notifications/<int:pk>/read/", NotificationMarkReadView.as_view()),
    path("notifications/read-all/", NotificationsMarkAllReadView.as_view()),
]
