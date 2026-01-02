from datetime import datetime, timedelta
from typing import List, Dict, Any
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func, extract, and_
from app.db.database import get_db
from app.models.analytics import Analytics
from pydantic import BaseModel

router = APIRouter()

class AnalyticsCreate(BaseModel):
    url: str = None
    user_agent: str = None
    ip_address: str = None
    referrer: str = None

class DateRange(BaseModel):
    start_date: datetime
    end_date: datetime

def get_date_range() -> Dict[str, datetime]:
    today = datetime.utcnow()
    current_period_end = today
    current_period_start = today - timedelta(days=29)  # Last 30 days including today
    
    previous_period_end = current_period_start - timedelta(days=1)
    previous_period_start = previous_period_end - timedelta(days=29)
    
    return {
        'current_period_start': current_period_start,
        'current_period_end': current_period_end,
        'previous_period_start': previous_period_start,
        'previous_period_end': previous_period_end
    }

@router.post("/track", status_code=201)
async def track_analytics(
    analytics_data: AnalyticsCreate,
    db: Session = Depends(get_db)
):
    """
    Track a page view in the analytics system.
    """
    try:
        db_analytics = Analytics(
            url=analytics_data.url,
            user_agent=analytics_data.user_agent,
            ip_address=analytics_data.ip_address,
            referrer=analytics_data.referrer
        )
        db.add(db_analytics)
        db.commit()
        db.refresh(db_analytics)
        return {"status": "success", "id": db_analytics.id}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/visitors")
async def get_visitor_analytics(
    db: Session = Depends(get_db)
):
    """
    Get visitor analytics for the current and previous period.
    Returns visitor counts grouped by date for both periods.
    """
    try:
        date_ranges = get_date_range()
        
        # Format dates for response
        def format_date(date):
            return date.strftime('%Y-%m-%d')
        
        # Get current period data
        current_period_data = db.query(
            func.date(Analytics.date).label('date'),
            func.count(Analytics.id).label('count')
        ).filter(
            and_(
                Analytics.date >= date_ranges['current_period_start'],
                Analytics.date <= date_ranges['current_period_end']
            )
        ).group_by(
            func.date(Analytics.date)
        ).order_by(
            'date'
        ).all()
        
        # Get previous period data
        previous_period_data = db.query(
            func.date(Analytics.date).label('date'),
            func.count(Analytics.id).label('count')
        ).filter(
            and_(
                Analytics.date >= date_ranges['previous_period_start'],
                Analytics.date <= date_ranges['previous_period_end']
            )
        ).group_by(
            func.date(Analytics.date)
        ).order_by(
            'date'
        ).all()
        
        # Format the data for the chart
        def format_data(dates, data):
            data_map = {}
            # Initialize all dates in the period with 0
            current_date = dates['start_date']
            while current_date <= dates['end_date']:
                date_str = format_date(current_date)
                data_map[date_str] = {'date': date_str, 'count': 0}
                current_date += timedelta(days=1)
            
            # Update with actual data
            for item in data:
                date_str = format_date(item.date) if isinstance(item.date, datetime) else item.date
                data_map[date_str] = {'date': date_str, 'count': item.count}
            
            return list(data_map.values())
        
        current_dates = {
            'start_date': date_ranges['current_period_start'],
            'end_date': date_ranges['current_period_end']
        }
        previous_dates = {
            'start_date': date_ranges['previous_period_start'],
            'end_date': date_ranges['previous_period_end']
        }
        
        return {
            'current_period': format_data(current_dates, current_period_data),
            'previous_period': format_data(previous_dates, previous_period_data)
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
