from dataclasses import dataclass
from ...extensions.extensions import db
from datetime import datetime


@dataclass
class Comment(db.Model):
    __tablename__ = 'comments'
    id: int = db.Column(db.Integer, primary_key=True)
    user_id: int = db.Column(db.Integer, db.ForeignKey("users.id"))
    post_id: int = db.Column(db.Integer, db.ForeignKey("posts.id"))
    text: str = db.Column(db.Text, nullable=False)
    date: datetime = db.Column(db.DateTime, default=datetime.utcnow)

    user = db.relationship("User", backref="comments")
    post = db.relationship("Post", backref="comments")