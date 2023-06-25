"""This module contains routes for the app."""
from flask import Blueprint, render_template, jsonify, url_for
from flask_login import current_user, login_required
from ..post.models.post_model import Post
from datetime import datetime

from ..utils.http_status_codes import HTTP_200_OK

home = Blueprint("home", __name__)


@home.route("/")
@home.route("/home")
@home.route("/index")
@login_required
def home_page():
    """Render the home page."""
    posts_raw = Post.query.all()
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
    return render_template("home/index.html", posts=posts), HTTP_200_OK

@home.route("/friend_action")
def friend_action():
    """Render the home page."""
    return jsonify({'success': 'friend action'}), HTTP_200_OK