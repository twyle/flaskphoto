from werkzeug.datastructures import FileStorage
from flask import jsonify, current_app, session, url_for
from datetime import datetime
from ...utils.http_status_codes import HTTP_201_CREATED, HTTP_200_OK
from werkzeug.utils import secure_filename
import os
import secrets
from ..models.post_model import Post
from ...extensions.extensions import db

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
                'author_image': url_for('static', filename=f'img/{post.author.image_file}'),
                'author_name': post.author.username,
                'location': post.location,
                'publish_time': int((post.date_published - datetime.now()).total_seconds() / 60),
                'text': post.text,
                'photo': url_for('static', filename=f'img/{post.image}')
        }
            for post in posts_raw
    ]
    return jsonify(posts), HTTP_200_OK


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