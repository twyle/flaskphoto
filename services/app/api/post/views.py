"""This module contains routes for the app."""
from flask import Blueprint, render_template, request, jsonify, url_for
from flask_login import current_user, login_required

from ..utils.http_status_codes import HTTP_200_OK, HTTP_201_CREATED

post = Blueprint("post", __name__)


@post.route("/", methods=['POST'])
@login_required
def create_post():
    """Render the home page."""
    form = request.form
    print(form)
    return jsonify({'success': 'created'}), HTTP_201_CREATED


@post.route("/", methods=['GET'])
@login_required
def get_post():
    """Render the home page."""
    post_id = request.args.get('post_id')
    print(post_id)
    post = {
        'post_id': post_id,
        'user_photo': url_for('static', filename='img/profile-1.jpg'),
        'user_name': 'Lyle Okoth',
        'location': 'Nairobi',
        'time': '10 MINUTES',
        'post_text': 'New Post text from database.',
        'post_photo': url_for('static', filename='img/feed-7.jpg')
    }
    return jsonify(post), HTTP_200_OK


@post.route("/", methods=['DELETE'])
@login_required
def delete_post():
    """Render the home page."""
    post_id = request.args.get('post_id')
    print(post_id)
    return jsonify({'success': 'deleted'}), HTTP_200_OK


@post.route("/", methods=['PUT'])
@login_required
def update_post():
    """Render the home page."""
    post_id = request.args.get('post_id')
    file = request.files
    form = request.form
    print(file)
    print(form)
    return jsonify({'success': 'updated'}), HTTP_200_OK


@post.route("/like", methods=['GET'])
@login_required
def like_post():
    """Render the home page."""
    post_id = request.args.get('post_id')
    print(post_id)
    return jsonify({'success': 'liked'}), HTTP_200_OK


@post.route("/comment", methods=['GET'])
@login_required
def comment_on_post():
    """Render the home page."""
    post_id = request.args.get('post_id')
    print(post_id)
    return jsonify({'success': 'commented'}), HTTP_200_OK