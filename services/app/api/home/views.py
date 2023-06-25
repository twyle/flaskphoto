"""This module contains routes for the app."""
from flask import Blueprint, render_template, jsonify, url_for
from flask_login import current_user, login_required
from ..post.models.post_model import Post
from datetime import datetime

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

@home.route("/friend_action")
def friend_action():
    """Render the home page."""
    return jsonify({'success': 'friend action'}), HTTP_200_OK