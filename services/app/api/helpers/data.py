from ..auth.models.user import User
from ..post.models.post_model import Post
from ..post.models.like_model import Like
from ..post.models.comment_model import Comment
from faker import Faker
from datetime import datetime, timedelta
fake = Faker()
import random
from ..extensions.extensions import db

def generate_users(count: int = 10) -> list[User]:
    """Generate ten random users."""
    profile_pictures = (f'profile-{i}.jpg' for i in range(count))
    names = (fake.name() for _ in range(count))
    emails = (fake.email() for i in range(count))
    return [
        User(
            username=name,
            email=email,
            image_file=profile_pic,
            password='password',
            account_activated=True
        ) 
        for profile_pic, name, email in zip(profile_pictures, names, emails)
    ]

def generate_posts(authors: list[User], count: int = 100) -> list[Post]:
    """Generate posts."""
    cities = [fake.city() for _ in range(10)]
    posts_text = [fake.text() for _ in range(count)]
    post_images = [f'feed-{i}.jpg' for i in range(8)]
    dates_published = (datetime.now() + timedelta(minutes=random.randint(1,60)) for _ in range(count))
    return [
        Post(
            author=random.choice(authors),
            location=random.choice(cities),
            text=text,
            image=random.choice(post_images),
            date_published=d
        )
        for text, d in zip(posts_text, dates_published)
    ]
    
def generate_likes(users: list[User], posts: list[Post], likes_count: int = 100) -> list[Like]:
    """Generate likes."""
    return [
        Like(user=random.choice(users), post=random.choice(posts))
        for _ in range(likes_count)
    ]
    
def generate_comments(users: list[User], posts: list[Post], comments_count: int = 100) -> list[Comment]:
    """Generate comments."""
    comments = [
        Comment(user=random.choice(users), post=random.choice(posts), text=fake.text())
        for _ in range(comments_count)
    ]
    return comments
    
def save_to_database(items: list[User | Post]) -> None:
    """Save many items to database."""
    db.session.add_all(items)
    db.session.commit()
        
def create_data() -> None:
    """Create data for the database."""
    users = generate_users()
    save_to_database(users)
    posts = generate_posts(count=20, authors=users)
    save_to_database(posts)
    likes = generate_likes(users=users, posts=posts, likes_count=100)
    save_to_database(likes)
    comments = generate_comments(users=users, posts=posts, comments_count=100)
    save_to_database(comments)
     