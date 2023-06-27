from werkzeug.datastructures import FileStorage
from flask import jsonify, current_app, session, url_for
from datetime import datetime
from ...utils.http_status_codes import HTTP_201_CREATED, HTTP_200_OK
from werkzeug.utils import secure_filename
import os
import secrets
from ..models.post_model import Post
from ...extensions.extensions import db
from ..models.like_model import Like
from ..models.comment_model import Comment
import random
from ..models.bookmark_model import Bookmark
from ...auth.models.user import User


ALLOWED_EXTENSIONS = {'txt', 'pdf', 'png', 'jpg', 'jpeg', 'gif'}

def allowed_file(filename: str) -> bool:
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def handle_create_post(post_data: dict, post_image_data: dict) -> tuple[str, int]:
    """Create a new post."""
    post_text: str = post_data.get('text')
    post_location: str = post_data.get('location')
    file_name = save_post_photo(post_image_data)
    post = Post(
        author_id=session['user_id'],
        location=post_location,
        text=post_text,
        image=file_name
    )
    db.session.add(post)
    db.session.commit()
    return jsonify({'success': 'created'}), HTTP_201_CREATED

def save_post_photo(post_image: dict) -> None:
    """Save the uploadeded post image."""
    file: FileStorage = post_image['file']
    upload_folder = os.path.join(current_app.root_path, 'static', 'img')
    if file and allowed_file(file.filename):
        filename = secrets.token_hex(8)
        file.save(os.path.join(upload_folder, filename))
    return filename

def handle_load_posts(args: dict) -> tuple[str, int]:
    """Load posts from the database."""
    offset = int(args.get('offset', 10))
    limit = int(args.get('limit', 5))
    posts_raw = Post.query.all()[offset: offset+limit]
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
                    'author': Comment.query.filter_by(post_id=post.id).limit(1).first().user.username,
                    'text': Comment.query.filter_by(post_id=post.id).limit(1).first().post.text
                },
                'comments': [
                    comment.text for comment in Comment.query.filter_by(post_id=post.id).all()
                ],
                'user': get_user(int(args.get('user_id')))
        }
            for post in posts_raw
    ]
    return jsonify(posts), HTTP_200_OK

def get_user(user_id: int) -> dict:
    """Get the user with the id."""
    current_user = User.query.filter_by(id=user_id).first()
    return {
        'user_name': current_user.username,
        'image': url_for('static', filename=f'img/{current_user.image_file}'),
        'user_id': current_user.id,
        'email': current_user.email,
        'handle': f'@{"".join(current_user.username.split())}'
    }


def handle_get_post(post_id: str) -> tuple[str, int]:
    """Get the post with the given id."""
    raw_post = Post.query.filter_by(id=int(post_id)).first()
    post = {
            'id': raw_post.id,
            'author_image': url_for('static', filename=f'img/{raw_post.author.image_file}'),
            'author_name': raw_post.author.username,
            'location': raw_post.location,
            'publish_time': int((raw_post.date_published - datetime.now()).total_seconds() / 60),
            'text': raw_post.text,
            'photo': url_for('static', filename=f'img/{raw_post.image}')
        }
    return jsonify(post), HTTP_200_OK

def handle_update_post(post_id: str, post_data: dict, post_image_data: dict) -> tuple[str, int]:
    """Update a given post."""
    post = Post.query.filter_by(id=int(post_id)).first()
    if post_data.get('text'):
        post.text = post_data.get('text')
    if post_image_data:
        post.image = save_post_photo(post_image_data)
    db.session.commit()
    return jsonify({'success': 'updated'}), HTTP_200_OK

def delete_post_photo(photo_path: str) -> None:
    """Delete a photo."""
    upload_folder = os.path.join(current_app.root_path, 'static', 'img')
    os.remove(os.path.join(upload_folder, photo_path))

def handle_delete_post(post_id: str) -> tuple[str, int]:
    """Delete a post."""
    post = Post.query.filter_by(id=int(post_id)).first()
    delete_post_photo(post.image)
    db.session.delete(post)
    db.session.commit()
    return jsonify({'success': 'deleted'}), HTTP_200_OK


def handle_like(post_args: dict) -> tuple[str, int]:
    """Like or unlike a post."""
    user_id: int = int(post_args.get('user_id'))
    post_id: int = int(post_args.get('post_id'))
    like = Like.query.filter(Like.user_id==user_id and Like.post_id==int(post_id)).first()
    if like:
        db.session.delete(like)
        db.session.commit()
        return jsonify({'success': 'unliked'}), HTTP_200_OK
    db.session.add(
        Like(user_id=user_id, post_id=post_id)
    )
    db.session.commit()
    return jsonify({'success': 'liked'}), HTTP_201_CREATED


def handle_comment(post_args: dict, post_data: dict) -> tuple[str, int]:
    """Handle a post comment."""
    comment_text: str = post_data.get('comment-text')
    user_id: int = int(post_args.get('user_id'))
    post_id: int = int(post_args.get('post_id'))
    comment = Comment(
        post_id=int(post_id),
        user_id=user_id,
        text=comment_text
    )
    db.session.add(comment)
    db.session.commit()
    return jsonify({'success': 'commented'}), HTTP_201_CREATED


def handle_bookmark(post_args: dict) -> tuple[str, int]:
    """Bookmark or unbookmark a post."""
    user_id: int = int(post_args.get('user_id'))
    post_id: int = int(post_args.get('post_id'))
    bookmark = Bookmark.query.filter(Bookmark.user_id==user_id and Bookmark.post_id==int(post_id)).first()
    if bookmark:
        db.session.delete(bookmark)
        db.session.commit()
        return jsonify({'success': 'unbookmarked'}), HTTP_200_OK
    db.session.add(
        Bookmark(user_id=user_id, post_id=post_id)
    )
    db.session.commit()
    return jsonify({'success': 'bookmarked'}), HTTP_201_CREATED


def handle_get_post_comments(post_id: str) -> tuple[str, int]:
    """get a posts comments"""
    comments_raw = Comment.query.filter_by(post_id=int(post_id)).limit(3)
    comments = [
        {
            'author_image': url_for('static', filename=f'img/{comment.user.image_file}'),
            'author_name': comment.user.username,
            'text': comment.text
        }
        for comment in comments_raw
    ]
    return jsonify(comments), HTTP_200_OK
    