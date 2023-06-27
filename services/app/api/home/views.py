"""This module contains routes for the app."""
from flask import Blueprint, render_template, jsonify, url_for, request
from flask_login import current_user, login_required
from ..post.models.post_model import Post
from datetime import datetime
from .controller.home import handle_befriend

from ..utils.http_status_codes import HTTP_200_OK
from .controller.home import handle_load_posts

home = Blueprint("home", __name__)


@home.route("/")
@home.route("/home")
@home.route("/index")
@login_required
def home_page():
    """Render the home page."""
    return handle_load_posts()

@home.route("/befriend")
def befriend():
    """Render the home page."""
    return handle_befriend(request.args)

@home.route("/unfriend")
def unfriend():
    """Render the home page."""
    return jsonify({'success': 'unfriend'}), HTTP_200_OK