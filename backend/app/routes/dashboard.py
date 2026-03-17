from flask import Blueprint, jsonify
from app.models.incident import Incident
from app.routes.auth import admin_required

dashboard_bp = Blueprint('dashboard', __name__, url_prefix='/api/dashboard')

@dashboard_bp.route('/summary', methods=['GET'])
@admin_required
def summary(current_user):
    total = Incident.query.count()
    reported = Incident.query.filter_by(status='reported').count()
    in_progress = Incident.query.filter_by(status='in_progress').count()
    resolved = Incident.query.filter_by(status='resolved').count()
    high = Incident.query.filter_by(severity='high').count()
    medium = Incident.query.filter_by(severity='medium').count()
    low = Incident.query.filter_by(severity='low').count()

    return jsonify({
        'total_incidents': total,
        'by_status': {
            'reported': reported,
            'in_progress': in_progress,
            'resolved': resolved
        },
        'by_severity': {
            'high': high,
            'medium': medium,
            'low': low
        }
    }), 200

@dashboard_bp.route('/analytics', methods=['GET'])
@admin_required
def analytics(current_user):
    from app import db
    from sqlalchemy import func
    from app.models.incident import Incident

    by_category = db.session.query(
        Incident.category,
        func.count(Incident.id).label('count')
    ).group_by(Incident.category).all()

    return jsonify({
        'by_category': [{'category': c, 'count': n} for c, n in by_category]
    }), 200
