from flask import Blueprint, request, jsonify
from app.extensions import db
from app.models.user import User
from flask_jwt_extended import create_access_token
from werkzeug.security import generate_password_hash, check_password_hash

auth_bp = Blueprint('auth', __name__, url_prefix="/api/auth")
@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.json

    user_exists = User.query.filter_by(email=data['email']).first()
    if user_exists:
        return jsonify({"message": "User already exists"}), 400

    hashed_password = generate_password_hash(data['password'])
    
    user = User(
        name=data['name'],
        email=data['email'],
        password=hashed_password,
        role=data.get("role", "user")
    )

    db.session.add(user)
    db.session.commit()

    return jsonify({"message": "User registered successfully"})
@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.json

    user = User.query.filter_by(email=data['email']).first()
    if not user:
        return jsonify({"message": "Invalid email"}), 401

    if not check_password_hash(user.password, data['password']):
        return jsonify({"message": "Invalid password"}), 401

    token = create_access_token(identity=str(user.id))


    return jsonify({
        "access_token": token,
        "user": {
            "id": user.id,
            "name": user.name,
            "role": user.role
        }
    })

