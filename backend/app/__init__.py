from flask import Flask
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from app.config import config
import os

db = SQLAlchemy()
migrate = Migrate()

def create_app():
    app = Flask(__name__)
    env = os.getenv('FLASK_ENV', 'default')
    app.config.from_object(config[env])

    # Initialize extensions
    CORS(app)
    db.init_app(app)
    migrate.init_app(app, db)

    # Register blueprints
    from app.routes import health_bp
    from app.routes.auth import auth_bp
    from app.routes.incidents import incidents_bp
    from app.routes.dashboard import dashboard_bp

    app.register_blueprint(health_bp)
    app.register_blueprint(auth_bp)
    app.register_blueprint(incidents_bp)
    app.register_blueprint(dashboard_bp)

    return app
