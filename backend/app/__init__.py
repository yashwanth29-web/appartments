from flask import Flask, jsonify
from app.config import Config
from app.extensions import db, jwt, cors

# ✅ Import all models at module level
from app.models.user import User
from app.models.tower import Tower
from app.models.unit import Unit
from app.models.amenity import Amenity
from app.models.booking import Booking
from app.models.lease import Lease

# Blueprints
from app.routes.auth_routes import auth_bp
from app.routes.admin_routes import admin_bp
from app.routes.towers import tower_bp
from app.routes.unit_routes import unit_bp
from app.routes.amenity_routes import amenity_bp
from app.routes.booking_routes import booking_bp
from app.routes.booking_routes import admin_booking_bp
from app.routes.user_routes import user_bp
from app.routes.lease_routes import lease_bp

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # Initialize extensions
    db.init_app(app)
    jwt.init_app(app)
    
    # CORS configuration - allow all origins for Cloud Run
    cors.init_app(app, 
        resources={r"/*": {"origins": "*"}}, 
        supports_credentials=True,
        allow_headers=["Content-Type", "Authorization", "X-Requested-With", "Accept"],
        methods=["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"]
    )

    # Health check endpoint for Cloud Run (no auth required)
    @app.route('/health')
    def health_check():
        return jsonify({"status": "healthy"}), 200
    
    # Root endpoint
    @app.route('/')
    def root():
        return jsonify({"message": "Apartment Rental API", "status": "running"}), 200

    # Register blueprints
    app.register_blueprint(auth_bp)
    app.register_blueprint(admin_bp)
    app.register_blueprint(tower_bp)
    app.register_blueprint(unit_bp)
    app.register_blueprint(amenity_bp)
    app.register_blueprint(booking_bp)
    app.register_blueprint(admin_booking_bp)
    app.register_blueprint(user_bp)
    app.register_blueprint(lease_bp)
    
    return app


def init_db(app):
    """Initialize database tables - call this separately"""
    with app.app_context():
        db.create_all()
