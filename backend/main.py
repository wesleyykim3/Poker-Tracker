from flask import request, jsonify
from config import app, db
from models import Session
from datetime import datetime


@app.route('/sessions', methods=['GET'])
def get_sessions():
    sessions = Session.query.all()
    json_sessions = list(map(lambda x: x.to_json(), sessions))
    return jsonify({'sessions': json_sessions})


@app.route('/create_session', methods=['POST'])
def create_session():
    location = request.json.get('location')
    date = request.json.get('date')
    start_time = request.json.get('startTime')
    end_time = request.json.get('endTime')
    buyin = request.json.get('buyin')
    cashout = request.json.get('cashout')

    if not location or not date or not start_time or not cashout:
        return (
            jsonify({'message': 'You must include a location, date, and start time, and buyin.'}),
            400,
        )

    new_session = Session(
        location=location, 
        date=datetime.strptime(date, '%Y-%m-%d').date(), 
        start_time=datetime.strptime(start_time, '%H:%M').time(), 
        end_time=datetime.strptime(end_time, '%H:%M').time(), 
        buyin=buyin, 
        cashout=cashout
    )

    try:
        db.session.add(new_session)
        db.session.commit()
    except Exception as e:
        return jsonify({'message': str(e)}), 400

    return jsonify({'message': 'Session created!'}), 201


@app.route('/edit_session/<int:session_id>', methods=['PATCH'])
def edit_session(session_id):
    session = Session.query.get(session_id)

    if not session:
        return jsonify({'message': 'Session not found'}), 404

    # I think this is the problem
    # I think the start and end times need to be stripped
    # But I don't know why it works for date but not the time
    data = request.json
    session.location = data.get('location', session.location)
    session.date = data.get('date', session.date)
    session.start_time = data.get('startTime', session.start_time) 
    session.end_time = data.get('endTime', session.end_time)
    session.buyin = data.get('buyin', session.buyin)
    session.cashout = data.get('cashout', session.cashout)

    db.session.commit()

    return jsonify({'message': 'Session edited.'}), 200


@app.route('/delete_session/<int:session_id>', methods=['DELETE'])
def delete_session(session_id):
    session = Session.query.get(session_id)

    if not session:
        return jsonify({'message': 'Session not found'}), 404

    db.session.delete(session)
    db.session.commit()

    return jsonify({'message': 'Session deleted!'}), 200


if __name__ == '__main__':
    with app.app_context():
        print("Attempting to create database and tables...")
        db.create_all() 
        print("Database and tables created!")

    app.run(debug=True)
