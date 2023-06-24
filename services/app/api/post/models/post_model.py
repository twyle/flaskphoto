from dataclasses import dataclass
from ...extensions.extensions import db
from datetime import datetime

@dataclass
class Post(db.Model):
    """The Post Model."""
    __tablename__ = 'posts'
    author_id: int = db.Column(db.Integer, db.ForeignKey("users.id"))
    location: str = db.Column(db.String(100), nullable=False)
    text: str = db.Column(db.Text, nullable=False)
    image: str = db.Column(db.String(100), nullable=True)
    date_published: datetime = db.Column(db.DateTime, default=datetime.utcnow)
    id: int = db.Column(db.Integer, primary_key=True)
    
    author = db.relationship("User", backref="posts")