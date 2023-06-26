"""This module contains routes for the app."""
from flask import Blueprint, render_template, request, jsonify, url_for
from flask_login import current_user, login_required

from ..utils.http_status_codes import HTTP_200_OK, HTTP_201_CREATED
from .controller.post import (
    handle_create_post, handle_load_posts, handle_get_post, handle_update_post,
    handle_delete_post, handle_like, handle_comment
)

post = Blueprint("post", __name__)


@post.route("/", methods=['POST'])
# @login_required
def create_post():
    """Render the home page."""
    return handle_create_post(request.form, request.files)


@post.route("/", methods=['GET'])
# @login_required
def get_post():
    """Render the home page."""
    return handle_get_post(request.args.get('post_id'))


@post.route("/", methods=['DELETE'])
# @login_required
def delete_post():
    """Render the home page."""
    return handle_delete_post(request.args.get('post_id'))
    

@post.route("/", methods=['PUT'])
# @login_required
def update_post():
    """Render the home page."""
    return handle_update_post(request.args.get('post_id'), request.form, request.files)


@post.route("/like", methods=['GET'])
# @login_required
def like_post():
    """Like or dislike a post."""
    return handle_like(request.args.get('post_id'))


@post.route("/comment", methods=['POST'])
# @login_required
def comment_on_post():
    """Render the home page."""
    return handle_comment(request.args, request.form)


@post.route("/load_posts", methods=['GET'])
def load_posts():
    """Load posts."""
    return handle_load_posts(request.args)
    