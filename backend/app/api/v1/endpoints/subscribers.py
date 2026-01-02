from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.db.database import get_db
from app.models.subscriber import Subscriber as SubscriberModel
from app.schemas.subscriber import Subscriber, SubscriberCreate
from app.api.v1.endpoints.auth import get_current_user
from app.models.user import User

router = APIRouter()

@router.post("/", response_model=Subscriber)
def create_subscriber(
    subscriber: SubscriberCreate,
    db: Session = Depends(get_db)
):
    # Check if email already exists
    db_subscriber = db.query(SubscriberModel).filter(
        SubscriberModel.email == subscriber.email
    ).first()
    
    if db_subscriber:
        # If exists but inactive, reactivate
        if not db_subscriber.is_active:
            db_subscriber.is_active = True
            db.commit()
            db.refresh(db_subscriber)
            return db_subscriber
        # If already active, return conflict
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Email already subscribed"
        )
    
    # Create new subscriber
    db_subscriber = SubscriberModel(email=subscriber.email)
    db.add(db_subscriber)
    db.commit()
    db.refresh(db_subscriber)
    return db_subscriber

@router.get("/", response_model=List[Subscriber])
def list_subscribers(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Only admin can list subscribers
    if not current_user.is_superuser:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions"
        )
    subscribers = db.query(SubscriberModel).offset(skip).limit(limit).all()
    return subscribers

# Add this to your subscribers.py in the backend
@router.get("/count")
def get_subscribers_count(
    db: Session = Depends(get_db)
):
    # No authentication required for getting the count
    count = db.query(SubscriberModel).filter(
        SubscriberModel.is_active == True
    ).count()
    
    return {"count": count}

@router.delete("/{subscriber_id}")
def delete_subscriber(
    subscriber_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Only admin can delete subscribers
    if not current_user.is_superuser:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions"
        )
    
    subscriber = db.query(SubscriberModel).filter(SubscriberModel.id == subscriber_id).first()
    if not subscriber:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Subscriber not found"
        )
    
    db.delete(subscriber)
    db.commit()
    return {"message": "Subscriber deleted successfully"}
