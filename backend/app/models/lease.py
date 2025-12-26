from app.extensions import db
from datetime import date

class Lease(db.Model):
    __tablename__ = "lease"

    id = db.Column(db.Integer, primary_key=True)
    start_date = db.Column(db.Date, default=date.today)
    user_name = db.Column(db.String(100), nullable=True)

    user_id = db.Column(db.Integer, db.ForeignKey("user.id"))
    unit_id = db.Column(db.Integer, db.ForeignKey("unit.id"))
