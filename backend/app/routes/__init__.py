from flask import Blueprint, jsonify
from datetime import datetime

health_bp = Blueprint('health', __name__)

@health_bp.route('/health', methods=['GET'])
def health_check():
    return jsonify({
        'status': 'healthy',
        'service': 'AlertNest API',
        'timestamp': datetime.utcnow().isoformat(),
        'version': '1.0.0'
    }), 200

@health_bp.route('/api/ping', methods=['GET'])
def ping():
    return jsonify({'message': 'pong'}), 200
