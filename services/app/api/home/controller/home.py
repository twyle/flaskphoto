from ...post.models.post_model import Post
from ...post.models.like_model import Like
from ...post.models.comment_model import Comment
from flask import url_for, render_template, jsonify
from datetime import datetime
from ...utils.http_status_codes import HTTP_200_OK, HTTP_201_CREATED
import random
from flask_login import current_user
# from ..models.friend_model import Friend
from ...extensions.extensions import db
from ...post.models.bookmark_model import Bookmark


def handle_load_posts() -> tuple[str, int]:
    """Load the initial posts."""
    user = {
        'user_name': current_user.username,
        'image': url_for('static', filename=f'img/{current_user.image_file}'),
        'user_id': current_user.id,
        'email': current_user.email,
        'handle': f'@{"".join(current_user.username.split())}'
    }
    posts_raw = Post.query.limit(5)
    posts = [
            {
                'id': post.id,
                'user_id': post.author_id,
                'author_image': url_for('static', filename=f'img/{post.author.image_file}'),
                'author_name': post.author.username,
                'location': post.location,
                'publish_time': int((post.date_published - datetime.now()).total_seconds() / 60),
                'text': post.text,
                'photo': url_for('static', filename=f'img/{post.image}'),
                'likes_count': Like.query.filter_by(post_id=post.id).count(),
                'influencer': random.choice(Like.query.all()).user.username,
                'liked_by': [
                    url_for('static', filename=f'img/{like.user.image_file}') for like in Like.query.filter_by(post_id=post.id).limit(3)
                ],
                'comments_count': Comment.query.filter_by(post_id=post.id).count(),
                'comment': {
                    'author': Comment.query.filter_by(post_id=post.id).limit(1).first().user.username if Comment.query.filter_by(post_id=post.id).limit(1).first() else '',
                    'text': Comment.query.filter_by(post_id=post.id).limit(1).first().post.text if Comment.query.filter_by(post_id=post.id).limit(1).first() else ''
                },
                'comments': [
                    comment.text for comment in Comment.query.filter_by(post_id=post.id).all()
                ],
                'bookmarked': bookmarked(user_id=user['user_id'], post_id=post.id),
                'liked': liked(user_id=user['user_id'], post_id=post.id)
        }
            for post in posts_raw
    ]
    print([post['bookmarked'] for post in posts])
    return render_template("home/index.html", posts=posts, user=user), HTTP_200_OK


def bookmarked(user_id: int, post_id: int) -> bool:
    """Check if user bookmarked this article."""
    bookmark = Bookmark.query.filter(Bookmark.user_id==user_id and Bookmark.post_id==post_id).first()
    if bookmark:
        return True
    return False

def liked(user_id: int, post_id: int) -> bool:
    """Check if user liked this article."""
    like = Like.query.filter(Like.user_id==user_id and Like.post_id==post_id).first()
    if like:
        return True
    return False


def handle_befriend(request_args: dict) -> tuple[str, int]:
    """Befreind a given user."""
    user_id: int = int(request_args.get('user_id'))
    friend_id: int = int(request_args.get('friend_id'))
    
    # friend = Friend.query.filter(Friend.user_id==user_id and Friend.friend_id==friend_id).first()
    # if not friend:
    #     db.session.add(Friend(user_id=user_id, friend_id=friend_id))
    #     db.session.commit()
    return jsonify({'success': 'befriended'}), HTTP_201_CREATED