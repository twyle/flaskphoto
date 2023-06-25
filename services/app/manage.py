from flask.cli import FlaskGroup
from api.helpers.data import create_data
from api import create_app, db

app = create_app()
cli = FlaskGroup(create_app=create_app)


@cli.command("create_db")
def create_db():
    """Create the database and all the tables."""
    db.drop_all()
    db.create_all()
    db.session.commit()
    
@cli.command("seed_db")
def seed_db():
    """Create the initial data."""
    create_data()


if __name__ == "__main__":
    cli()
