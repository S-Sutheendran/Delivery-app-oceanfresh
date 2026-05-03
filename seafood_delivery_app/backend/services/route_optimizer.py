"""
Nearest-Neighbor route optimizer.

Given a driver's current GPS position and a list of delivery stops,
returns the stops ordered so the driver always visits the nearest
unvisited stop next.  This is a greedy O(n²) TSP approximation that
works well for the small batches (≤ 10 orders) typical in delivery.
"""
import math
from typing import List, Dict, Any


def haversine_meters(lat1: float, lng1: float, lat2: float, lng2: float) -> float:
    """Return the great-circle distance in metres between two GPS coordinates."""
    R = 6_371_000  # Earth radius in metres
    phi1, phi2 = math.radians(lat1), math.radians(lat2)
    d_phi = math.radians(lat2 - lat1)
    d_lam = math.radians(lng2 - lng1)
    a = math.sin(d_phi / 2) ** 2 + math.cos(phi1) * math.cos(phi2) * math.sin(d_lam / 2) ** 2
    return 2 * R * math.atan2(math.sqrt(a), math.sqrt(1 - a))


def optimize_route(
    driver_lat: float,
    driver_lng: float,
    stops: List[Dict[str, Any]],
) -> List[Dict[str, Any]]:
    """
    Parameters
    ----------
    driver_lat / driver_lng : current driver GPS position
    stops : list of dicts, each must contain at minimum:
            { "order_id": int, "delivery_lat": float, "delivery_lng": float }
            Any extra keys are passed through unchanged.

    Returns
    -------
    A new list in optimised visit order.  Each dict gains two extra keys:
      "sequence"              : 1-based position in the route
      "distance_from_prev_m"  : Haversine metres from the previous stop
                                (or from driver position for the first stop)
    """
    if not stops:
        return []

    remaining = list(stops)
    route: List[Dict[str, Any]] = []
    cur_lat, cur_lng = driver_lat, driver_lng

    while remaining:
        nearest = min(
            remaining,
            key=lambda s: haversine_meters(cur_lat, cur_lng, s["delivery_lat"], s["delivery_lng"]),
        )
        dist = haversine_meters(cur_lat, cur_lng, nearest["delivery_lat"], nearest["delivery_lng"])
        stop = dict(nearest)
        stop["sequence"] = len(route) + 1
        stop["distance_from_prev_m"] = round(dist)
        route.append(stop)
        remaining.remove(nearest)
        cur_lat, cur_lng = nearest["delivery_lat"], nearest["delivery_lng"]

    return route
