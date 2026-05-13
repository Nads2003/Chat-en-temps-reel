import json
from channels.generic.websocket import AsyncWebsocketConsumer


class NotificationConsumer(AsyncWebsocketConsumer):

    async def connect(self):
        self.group_name = None  # 👈 IMPORTANT

        user = self.scope.get("user")

        if not user or user.is_anonymous:
            await self.close()
            return

        self.user = user
        self.group_name = f"user_{user.id}"

        await self.channel_layer.group_add(
            self.group_name,
            self.channel_name
        )

        await self.accept()
        print(f"✅ WS connecté : {self.group_name}")

    async def disconnect(self, close_code):
        # 👇 PROTECTION
        if self.group_name:
            await self.channel_layer.group_discard(
                self.group_name,
                self.channel_name
            )
            print(f"❌ WS déconnecté : {self.group_name}")

    async def send_notification(self, event):
        await self.send(text_data=json.dumps({
            "message": event.get("message"),
            "data": event.get("data", {})
        }))
