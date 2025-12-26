from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.extensions import db
from app.models.unit import Unit
from app.models.user import User
from app.models.tower import Tower

unit_bp = Blueprint("unit", __name__, url_prefix="/api/admin/units")
@unit_bp.route("", methods=["POST"])
@jwt_required()
def create_unit():
    user_id = int(get_jwt_identity())
    user = User.query.get(user_id)

    if user.role != "admin":
        return jsonify({"message": "Admin access required"}), 403

    data = request.json

    # Support both tower_id and tower_name
    tower_id = data.get("tower_id")
    tower_name = data.get("tower_name")
    
    if tower_name and not tower_id:
        tower = Tower.query.filter_by(name=tower_name).first()
        if not tower:
            return jsonify({"message": f"Tower '{tower_name}' not found"}), 404
        tower_id = tower.id
    elif tower_id:
        tower = Tower.query.get(tower_id)
        if not tower:
            return jsonify({"message": "Tower not found"}), 404
    else:
        return jsonify({"message": "tower_id or tower_name is required"}), 400

    unit = Unit(
        flat_number=data["flat_number"],
        rent=data["rent"],
        tower_id=tower_id,
        image=data.get("image")   
    )

    db.session.add(unit)
    db.session.commit()

    return jsonify({"message": "Unit created successfully"})
@unit_bp.route("", methods=["GET"])
def get_units():
    # Sort units by rent (ascending)
    units = Unit.query.order_by(Unit.rent.asc()).all()

    result = []
    for u in units:
        tower = Tower.query.get(u.tower_id)
        result.append({
            "id": u.id,
            "flat_number": u.flat_number,
            "rent": u.rent,
            "status": u.status,
            "tower_id": u.tower_id,
            "tower_name": tower.name if tower else None,
            "image": u.image
        })

    return jsonify(result)
@unit_bp.route("/<int:unit_id>", methods=["PUT"])
@jwt_required()
def update_unit(unit_id):
    user_id = int(get_jwt_identity())
    user = User.query.get(user_id)

    if user.role != "admin":
        return jsonify({"message": "Admin access required"}), 403

    unit = Unit.query.get(unit_id)
    if not unit:
        return jsonify({"message": "Unit not found"}), 404
    
    data = request.json

    unit.flat_number = data.get("flat_number", unit.flat_number)
    unit.rent = data.get("rent", unit.rent)
    unit.image = data.get("image", unit.image)
    unit.status = data.get("status", unit.status)
    
    # Support tower_name in update
    tower_name = data.get("tower_name")
    if tower_name:
        tower = Tower.query.filter_by(name=tower_name).first()
        if tower:
            unit.tower_id = tower.id
    elif "tower_id" in data:
        unit.tower_id = data.get("tower_id", unit.tower_id)

    db.session.commit()
    return jsonify({"message": "Unit updated successfully"})
@unit_bp.route("/<int:unit_id>", methods=["DELETE"])
@jwt_required()
def delete_unit(unit_id):
    unit = Unit.query.get(unit_id)
    if not unit:
        return jsonify({"message": "Unit not found"}), 404

    db.session.delete(unit)
    db.session.commit()

    return jsonify({"message": "Unit deleted"})


