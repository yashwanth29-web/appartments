from app.extensions import db

class Amenity(db.Model):
    __tablename__ = "amenity"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.String(255))
    image = db.Column(db.String(200))

    tower_id = db.Column(db.Integer, db.ForeignKey("tower.id"))
