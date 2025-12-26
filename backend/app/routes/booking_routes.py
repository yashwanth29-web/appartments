from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.extensions import db
from app.models.booking import Booking
from app.models.user import User
from app.models.lease import Lease
from app.models.unit import Unit


# ---------------- ADMIN BOOKINGS ----------------
admin_booking_bp = Blueprint("admin_booking", __name__, url_prefix="/api/admin/bookings")

@admin_booking_bp.route("", methods=["GET"])
@jwt_required()
def admin_get_bookings():
    admin = User.query.get(int(get_jwt_identity()))
    if admin.role != "admin":
        return jsonify({"message": "Admin access required"}), 403

    bookings = Booking.query.all()
    result = []
    for b in bookings:
        user = User.query.get(b.user_id)
        unit = Unit.query.get(b.unit_id)
        lease = Lease.query.filter_by(user_id=b.user_id, unit_id=b.unit_id).order_by(Lease.start_date.desc()).first()
        approved_date = lease.start_date.isoformat() if lease else None
        result.append({
            "id": b.id,
            "user_id": b.user_id,
            "user_name": b.user_name if getattr(b, 'user_name', None) else (user.name if user else None),
            "unit_id": b.unit_id,
            "flat_number": unit.flat_number if unit else None,
            "status": b.status,
            "approved_date": approved_date
        })

    return jsonify(result)

@admin_booking_bp.route("/<int:booking_id>", methods=["PUT"])
@jwt_required()
def admin_update_booking(booking_id):
    admin = User.query.get(int(get_jwt_identity()))
    if admin.role != "admin":
        return jsonify({"message": "Admin access required"}), 403

    booking = Booking.query.get(booking_id)
    if not booking:
        return jsonify({"message": "Booking not found"}), 404
        
    previous_status = booking.status
    status = request.json["status"]  # approved / rejected
    
    unit = Unit.query.get(booking.unit_id)

    # Handle APPROVED status - create lease and mark unit occupied
    if status == "approved" and previous_status != "approved":
        user = User.query.get(booking.user_id)
        user_name = booking.user_name if getattr(booking, 'user_name', None) else (user.name if user else None)
        
        # Create lease automatically
        lease = Lease(
            user_id=booking.user_id,
            user_name=user_name,
            unit_id=booking.unit_id
        )
        db.session.add(lease)
        
        # Mark unit as occupied
        if unit:
            unit.status = "occupied"
        
        booking.status = status
        db.session.commit()
        return jsonify({"message": "Booking approved and lease created"})

    # Handle REJECTED status - delete booking and make unit available
    if status == "rejected":
        # Make unit available again
        if unit:
            unit.status = "available"
        
        # Delete the booking
        db.session.delete(booking)
        db.session.commit()
        return jsonify({"message": "Booking rejected and removed"})

    booking.status = status
    db.session.commit()
    return jsonify({"message": "Booking processed"})
# ---------------- USER BOOKINGS ----------------
booking_bp = Blueprint("booking", __name__, url_prefix="/api/bookings")

@booking_bp.route("", methods=["POST"])
@jwt_required()
def create_booking():
    user_id = int(get_jwt_identity())
    user = User.query.get(user_id)
    data = request.json

    booking = Booking(
        user_id=user_id,
        user_name=user.name if user else None,
        unit_id=data["unit_id"]
    )

    db.session.add(booking)
    db.session.commit()
    return jsonify({"message": "Booking requested"})


@booking_bp.route("/my", methods=["GET"])
@jwt_required()
def my_bookings():
    user_id = int(get_jwt_identity())
    bookings = Booking.query.filter_by(user_id=user_id).all()
    user = User.query.get(user_id)

    result = []
    for b in bookings:
        unit = Unit.query.get(b.unit_id)
        payment_status = "your payment is successful" if b.status == "approved" else "your payment is refunded"
        result.append({
            "id": b.id,
            "unit_id": b.unit_id,
            "user_mail": user.email if user else None,
            "user_name": b.user_name,
            "status": b.status,
            "flat_number": unit.flat_number if unit else None,
            "payment_status": payment_status
        })

    return jsonify(result)

