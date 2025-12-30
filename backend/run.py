import os
from app import create_app, init_db

app = create_app()

# Initialize database tables on first request (works with gunicorn)
@app.before_request
def initialize_database():
    """Initialize database on first request"""
    if not getattr(app, '_db_initialized', False):
        from app.extensions import db
        with app.app_context():
            db.create_all()
        app._db_initialized = True

if __name__ == "__main__":
    # For local development only
    port = int(os.environ.get("PORT", 5000))
    debug = os.environ.get("FLASK_ENV", "production") != "production"
    
    # Initialize DB for local development
    init_db(app)
    
    app.run(host='0.0.0.0', port=port, debug=debug)
