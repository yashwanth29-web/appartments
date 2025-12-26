from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity

from app.extensions import db
from app.models.unit import Unit
from app.models.booking import Booking

# Blueprint
user_bp = Blueprint('user_bp', __name__, url_prefix='/api')

# -------------------------
# Get all units (Resident)
# -------------------------
@user_bp.route('/units', methods=['GET'])
@jwt_required()
def get_units_for_users():
    units = Unit.query.all()

    return jsonify([
        {
            "id": u.id,
            "flat_number": u.flat_number,
            "rent": u.rent,
            "status": u.status
        }
        for u in units
    ]), 200


# -------------------------
# Get my bookings (Resident)
# -------------------------
@user_bp.route('/bookings/my', methods=['GET'])
@jwt_required()
def my_bookings():
    user_id = get_jwt_identity()

    bookings = Booking.query.filter_by(user_id=user_id).all()

    return jsonify([
        {
            "id": b.id,
            "unit_id": b.unit_id,
            "status": b.status
        }
        for b in bookings
    ]), 200
