from dataclasses import dataclass
from ...extensions.extensions import db
from datetime import datetime


@dataclass
class Like(db.Model):
    __tablename__ = 'likes'
    id: int = db.Column(db.Integer, primary_key=True)
    user_id: int = db.Column(db.Integer, db.ForeignKey("users.id"))
    post_id: int = db.Column(db.Integer, db.ForeignKey("posts.id"))
    date: datetime = db.Column(db.DateTime, default=datetime.utcnow)

    user = db.relationship("User", backref="likes")
    post = db.relationship("Post", backref="likes")