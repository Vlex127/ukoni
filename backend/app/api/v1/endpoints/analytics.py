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

@router.get("/visitors/stats")
async def get_visitor_stats(
    db: Session = Depends(get_db)
):
    """
    Get detailed visitor statistics including comment engagement metrics.
    """
    try:
        date_ranges = get_date_range()
        
        # Total visitors in current period
        total_visitors_current = db.query(Analytics).filter(
            and_(
                Analytics.date >= date_ranges['current_period_start'],
                Analytics.date <= date_ranges['current_period_end']
            )
        ).count()
        
        # Comment visitors in current period
        comment_visitors_current = db.query(Analytics).filter(
            and_(
                Analytics.date >= date_ranges['current_period_start'],
                Analytics.date <= date_ranges['current_period_end'],
                Analytics.referrer.like('comment_%')
            )
        ).count()
        
        # Page visitors in current period
        page_visitors_current = total_visitors_current - comment_visitors_current
        
        # Total visitors in previous period
        total_visitors_previous = db.query(Analytics).filter(
            and_(
                Analytics.date >= date_ranges['previous_period_start'],
                Analytics.date <= date_ranges['previous_period_end']
            )
        ).count()
        
        # Comment visitors in previous period
        comment_visitors_previous = db.query(Analytics).filter(
            and_(
                Analytics.date >= date_ranges['previous_period_start'],
                Analytics.date <= date_ranges['previous_period_end'],
                Analytics.referrer.like('comment_%')
            )
        ).count()
        
        # Page visitors in previous period
        page_visitors_previous = total_visitors_previous - comment_visitors_previous
        
        # Calculate growth percentages
        def calculate_growth(current, previous):
            if previous == 0:
                return 100 if current > 0 else 0
            return round(((current - previous) / previous) * 100, 1)
        
        total_growth = calculate_growth(total_visitors_current, total_visitors_previous)
        comment_growth = calculate_growth(comment_visitors_current, comment_visitors_previous)
        page_growth = calculate_growth(page_visitors_current, page_visitors_previous)
        
        # Comment engagement rate
        engagement_rate_current = round((comment_visitors_current / total_visitors_current * 100) if total_visitors_current > 0 else 0, 1)
        engagement_rate_previous = round((comment_visitors_previous / total_visitors_previous * 100) if total_visitors_previous > 0 else 0, 1)
        
        return {
            "current_period": {
                "total_visitors": total_visitors_current,
                "comment_visitors": comment_visitors_current,
                "page_visitors": page_visitors_current,
                "engagement_rate": engagement_rate_current
            },
            "previous_period": {
                "total_visitors": total_visitors_previous,
                "comment_visitors": comment_visitors_previous,
                "page_visitors": page_visitors_previous,
                "engagement_rate": engagement_rate_previous
            },
            "growth": {
                "total_visitors": total_growth,
                "comment_visitors": comment_growth,
                "page_visitors": page_growth,
                "engagement_rate": engagement_rate_current - engagement_rate_previous
            }
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/visitors")
async def get_visitor_analytics(
    db: Session = Depends(get_db)
):
    """
    Get visitor analytics for the current and previous period.
    Returns visitor counts grouped by date for both periods,
    including breakdown of page visitors vs comment visitors.
    """
    try:
        date_ranges = get_date_range()
        
        # Format dates for response
        def format_date(date):
            return date.strftime('%Y-%m-%d')
        
        # Get current period data - total visitors
        current_period_data = db.query(
            func.date(Analytics.date).label('date'),
            func.count(Analytics.id).label('total_visitors')
        ).filter(
            and_(
                Analytics.date >= date_ranges['current_period_start'],
                Analytics.date <= date_ranges['current_period_end']
            )
        ).group_by(
            func.date(Analytics.date)
        ).order_by(
            func.date(Analytics.date)
        ).all()
        
        # Get comment visitors separately for current period
        current_comment_data = db.query(
            func.date(Analytics.date).label('date'),
            func.count(Analytics.id).label('comment_visitors')
        ).filter(
            and_(
                Analytics.date >= date_ranges['current_period_start'],
                Analytics.date <= date_ranges['current_period_end'],
                Analytics.referrer.like('comment_%')
            )
        ).group_by(
            func.date(Analytics.date)
        ).all()
        
        # Get previous period data - total visitors
        previous_period_data = db.query(
            func.date(Analytics.date).label('date'),
            func.count(Analytics.id).label('total_visitors')
        ).filter(
            and_(
                Analytics.date >= date_ranges['previous_period_start'],
                Analytics.date <= date_ranges['previous_period_end']
            )
        ).group_by(
            func.date(Analytics.date)
        ).order_by(
            func.date(Analytics.date)
        ).all()
        
        # Get comment visitors separately for previous period
        previous_comment_data = db.query(
            func.date(Analytics.date).label('date'),
            func.count(Analytics.id).label('comment_visitors')
        ).filter(
            and_(
                Analytics.date >= date_ranges['previous_period_start'],
                Analytics.date <= date_ranges['previous_period_end'],
                Analytics.referrer.like('comment_%')
            )
        ).group_by(
            func.date(Analytics.date)
        ).all()
        
        # Format the data for the chart
        def format_data(dates, total_data, comment_data):
            data_map = {}
            # Initialize all dates in the period with 0
            current_date = dates['start_date']
            while current_date <= dates['end_date']:
                date_str = format_date(current_date)
                data_map[date_str] = {
                    'date': date_str, 
                    'count': 0,
                    'page_visitors': 0,
                    'comment_visitors': 0
                }
                current_date += timedelta(days=1)
            
            # Update with total visitor data
            for item in total_data:
                date_str = format_date(item.date) if hasattr(item.date, 'strftime') else str(item.date)
                if date_str in data_map:
                    data_map[date_str]['count'] = item.total_visitors
            
            # Update with comment visitor data
            comment_map = {format_date(item.date) if hasattr(item.date, 'strftime') else str(item.date): item.comment_visitors for item in comment_data}
            for date_str, comment_count in comment_map.items():
                if date_str in data_map:
                    data_map[date_str]['comment_visitors'] = comment_count
                    data_map[date_str]['page_visitors'] = data_map[date_str]['count'] - comment_count
            
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
            'current_period': format_data(current_dates, current_period_data, current_comment_data),
            'previous_period': format_data(previous_dates, previous_period_data, previous_comment_data)
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
