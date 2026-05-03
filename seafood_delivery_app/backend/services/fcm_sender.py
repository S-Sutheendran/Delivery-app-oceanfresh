"""
Firebase Cloud Messaging sender — wraps firebase_admin.messaging.

Sends both notification messages (shown in the system tray) and silent
data messages (handled by the app in background/foreground).
"""
import logging
from typing import Optional, Dict, Any

try:
    import firebase_admin
    from firebase_admin import messaging
    _FCM_AVAILABLE = True
except ImportError:
    _FCM_AVAILABLE = False

logger = logging.getLogger(__name__)


def send_notification(
    token: str,
    title: str,
    body: str,
    data: Optional[Dict[str, str]] = None,
) -> bool:
    """Send a visible push notification to a single FCM token."""
    if not _FCM_AVAILABLE or not token:
        logger.warning("FCM not available or token missing — skipping notification.")
        return False
    try:
        message = messaging.Message(
            notification=messaging.Notification(title=title, body=body),
            data={k: str(v) for k, v in (data or {}).items()},
            token=token,
            android=messaging.AndroidConfig(priority="high"),
            apns=messaging.APNSConfig(
                payload=messaging.APNSPayload(
                    aps=messaging.Aps(sound="default")
                )
            ),
        )
        messaging.send(message)
        return True
    except Exception as exc:
        logger.error("FCM send failed: %s", exc)
        return False


def send_data_message(token: str, data: Dict[str, str]) -> bool:
    """Send a silent data-only message (no system-tray notification)."""
    if not _FCM_AVAILABLE or not token:
        return False
    try:
        message = messaging.Message(
            data={k: str(v) for k, v in data.items()},
            token=token,
            android=messaging.AndroidConfig(priority="high"),
        )
        messaging.send(message)
        return True
    except Exception as exc:
        logger.error("FCM data send failed: %s", exc)
        return False


# ── Convenience helpers ───────────────────────────────────────────────────────

def notify_driver_new_order(driver_fcm_token: str, order_id: int, customer_address: str) -> bool:
    return send_notification(
        driver_fcm_token,
        title="New order assigned!",
        body=f"Order #{order_id} — {customer_address}",
        data={"type": "order_assigned", "order_id": str(order_id)},
    )


def notify_customer_status(customer_fcm_token: str, order_id: int, status: str) -> bool:
    messages = {
        "assigned":   ("Driver assigned", "Your order has been picked up by a driver."),
        "picked_up":  ("Order picked up", "Your driver has collected your order."),
        "in_transit": ("On the way!", "Your order is on its way to you."),
        "delivered":  ("Delivered!", "Your order has been delivered. Enjoy your meal!"),
    }
    title, body = messages.get(status, ("Order update", f"Status: {status}"))
    return send_notification(
        customer_fcm_token, title=title, body=body,
        data={"type": "order_status", "order_id": str(order_id), "status": status},
    )


def notify_customer_proximity(customer_fcm_token: str, order_id: int) -> bool:
    return send_notification(
        customer_fcm_token,
        title="Your order is almost here!",
        body="Your driver is less than 1 km away. Get ready!",
        data={"type": "proximity_alert", "order_id": str(order_id)},
    )


def push_live_location(customer_fcm_token: str, order_id: int, lat: float, lng: float) -> bool:
    """Silent data push so the customer app can update the live map."""
    return send_data_message(
        customer_fcm_token,
        data={
            "type": "location_update",
            "order_id": str(order_id),
            "driver_lat": str(lat),
            "driver_lng": str(lng),
        },
    )
