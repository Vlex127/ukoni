from sqlalchemy import Column, Integer, String, DateTime, Boolean, func
from app.db.database import Base

class Subscriber(Base):
    __tablename__ = "subscribers"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    created_at = Column(DateTime, server_default=func.now())
    is_active = Column(Boolean, default=True)
    
    def __repr__(self):
        return f"<Subscriber {self.email}>"
