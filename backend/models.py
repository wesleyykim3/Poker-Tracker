from config import db

class Session(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    location = db.Column(db.String(80), unique=False, nullable=False)
    date = db.Column(db.Date, unique=False, nullable=False)
    start_time = db.Column(db.Time, unique=False, nullable=False)
    end_time = db.Column(db.Time, unique=False, nullable=True)
    buyin = db.Column(db.Integer, unique=False, nullable=False)
    cashout = db.Column(db.Integer, unique=False, nullable=True)

    def to_json(self):
        return {
            'id': self.id,
            'location': self.location,
            'date': self.date.isoformat(),
            'startTime': self.start_time.strftime("%H:%M"),
            'endTime': self.end_time.strftime("%H:%M"),
            'buyin': self.buyin,
            'cashout': self.cashout
        }
