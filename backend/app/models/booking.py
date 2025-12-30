from app.extensions import db
from datetime import datetime

class Booking(db.Model):
    __tablename__ = "booking"

    id = db.Column(db.Integer, primary_key=True)
    status = db.Column(db.String(20), default="pending")
    user_name = db.Column(db.String(100), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    approved_date = db.Column(db.DateTime, nullable=True)

    user_id = db.Column(db.Integer, db.ForeignKey("user.id"))
    unit_id = db.Column(db.Integer, db.ForeignKey("unit.id"))
