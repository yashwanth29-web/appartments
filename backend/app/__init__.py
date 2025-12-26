from flask import Flask
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

    db.init_app(app)
    jwt.init_app(app)
    cors.init_app(app, resources={r"/api/*": {"origins": "*"}}, supports_credentials=True)


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
