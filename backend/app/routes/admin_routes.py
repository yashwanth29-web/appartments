from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.extensions import db
from app.models.user import User
from app.models.booking import Booking
from app.models.unit import Unit
from app.models.tower import Tower
from app.models.lease import Lease
from app.models.amenity import Amenity


admin_bp = Blueprint("admin", __name__, url_prefix="/api/admin")

# Create tower endpoint moved to `app.routes.towers` (tower_bp)
# Booking endpoints moved to `app.routes.booking_routes` (admin_booking_bp)


@admin_bp.route("/dashboard", methods=["GET"])
@jwt_required()
def admin_dashboard():
    user_id = get_jwt_identity()
    user = User.query.get(int(user_id))

    if not user or user.role != "admin":
        return jsonify({"message": "Admin access required"}), 403

    total_towers = Tower.query.count()
    total_units = Unit.query.count()
    occupied_units = Unit.query.filter_by(status="occupied").count()
    pending_bookings = Booking.query.filter_by(status="pending").count()
    active_leases = Lease.query.count()
    total_amenities = Amenity.query.count()

    return jsonify({
        "totalTowers": total_towers,
        "totalUnits": total_units,
        "occupiedUnits": occupied_units,
        "pendingBookings": pending_bookings,
        "activeLeases": active_leases,
        "totalAmenities": total_amenities
    })

