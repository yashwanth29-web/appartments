from app.extensions import db

class Unit(db.Model):
    __tablename__ = "unit"

    id = db.Column(db.Integer, primary_key=True)
    flat_number = db.Column(db.String(20), nullable=False)
    rent = db.Column(db.Integer, nullable=False)
    status = db.Column(db.String(20), default="available")
    image = db.Column(db.String(200),nullable=True)   # ✅ NEW
    tower_id = db.Column(db.Integer, db.ForeignKey("tower.id"))
