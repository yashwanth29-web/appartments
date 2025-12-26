from app.extensions import db

class Tower(db.Model):
    __tablename__ = "tower"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)

    units = db.relationship("Unit", backref="tower", lazy=True)
