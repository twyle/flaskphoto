from dataclasses import dataclass
from ...extensions.extensions import db
from datetime import datetime


# @dataclass
# class Friend(db.Model):
#     __tablename__ = 'friends'
#     id: int = db.Column(db.Integer, primary_key=True)
#     user_id: int = db.Column(db.Integer, db.ForeignKey("users.id"))
#     friend_id: int = db.Column(db.Integer, db.ForeignKey("users.id"))
#     date: datetime = db.Column(db.DateTime, default=datetime.utcnow)

#     user = db.relationship("User", backref="friends")
#     friend = db.relationship("User", backref="friends")