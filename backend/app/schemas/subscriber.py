from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional

class SubscriberBase(BaseModel):
    email: EmailStr

class SubscriberCreate(SubscriberBase):
    pass

class Subscriber(SubscriberBase):
    id: int
    created_at: datetime
    is_active: bool

    class Config:
        from_attributes = True
