"""This module contains routes for the app."""
from flask import Blueprint, render_template, request, jsonify
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
