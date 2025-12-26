from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.extensions import db
from app.models.tower import Tower
from app.models.user import User

tower_bp = Blueprint("tower", __name__)

# ---------- ADMIN: CREATE TOWER ----------
@tower_bp.route("/api/admin/towers", methods=["POST"])
@jwt_required()
def create_tower():
    user = User.query.get(int(get_jwt_identity()))
    if not user or user.role != "admin":
        return jsonify({"message": "Admin only"}), 403

    data = request.json
    name = data.get("name")
    if not name:
        return jsonify({"message": "Name is required"}), 400

    tower = Tower(name=name)
    db.session.add(tower)
    db.session.commit()

    return jsonify({"message": "Tower created"})


# ---------- ADMIN: GET ALL TOWERS ----------
@tower_bp.route("/api/admin/towers", methods=["GET"])
@jwt_required()
def get_admin_towers():
    user = User.query.get(int(get_jwt_identity()))
    if not user or user.role != "admin":
        return jsonify({"message": "Admin only"}), 403

    towers = Tower.query.all()
    return jsonify([{"id": t.id, "name": t.name} for t in towers])


# ---------- PUBLIC: GET TOWERS ----------
@tower_bp.route("/api/towers", methods=["GET"])
def get_towers():
    towers = Tower.query.all()
    return jsonify([{"id": t.id, "name": t.name} for t in towers])


# ---------- ADMIN: UPDATE TOWER ----------
@tower_bp.route("/api/admin/towers/<int:id>", methods=["PUT"])
@jwt_required()
def update_tower(id):
    user = User.query.get(int(get_jwt_identity()))
    if not user or user.role != "admin":
        return jsonify({"message": "Admin only"}), 403

    tower = Tower.query.get(id)
    if not tower:
        return jsonify({"message": "Tower not found"}), 404

    data = request.json
    name = data.get("name")
    if not name:
        return jsonify({"message": "Name is required"}), 400

    tower.name = name
    db.session.commit()

    return jsonify({"message": "Tower updated"})


# ---------- ADMIN: DELETE TOWER ----------
@tower_bp.route("/api/admin/towers/<int:id>", methods=["DELETE"])
@jwt_required()
def delete_tower(id):
    user = User.query.get(int(get_jwt_identity()))
    if not user or user.role != "admin":
        return jsonify({"message": "Admin only"}), 403

    tower = Tower.query.get(id)
    if not tower:
        return jsonify({"message": "Tower not found"}), 404

    # Prevent deleting a tower that still has units
    if tower.units and len(tower.units) > 0:
        return jsonify({"message": "Cannot delete tower with units"}), 400

    db.session.delete(tower)
    db.session.commit()

    return jsonify({"message": "Tower deleted"})
