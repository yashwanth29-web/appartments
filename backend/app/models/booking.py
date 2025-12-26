from app.extensions import db

class Booking(db.Model):
    __tablename__ = "booking"

    id = db.Column(db.Integer, primary_key=True)
    status = db.Column(db.String(20), default="pending")
    user_name = db.Column(db.String(100), nullable=True)

    user_id = db.Column(db.Integer, db.ForeignKey("user.id"))
    unit_id = db.Column(db.Integer, db.ForeignKey("unit.id"))
