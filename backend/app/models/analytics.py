from sqlalchemy import Column, Integer, DateTime, String
from sqlalchemy.sql import func
from app.db.database import Base

class Analytics(Base):
    __tablename__ = "analytics"

    id = Column(Integer, primary_key=True, index=True)
    date = Column(DateTime, default=func.now(), index=True)
    url = Column(String, nullable=True)
    user_agent = Column(String, nullable=True)
    ip_address = Column(String, nullable=True)
    referrer = Column(String, nullable=True)
    created_at = Column(DateTime, default=func.now())

    def __repr__(self):
        return f"<Analytics(id={self.id}, date={self.date})>"
