from app.db.database import engine, Base
from sqlalchemy import text, inspect
import sys

def check_database():
    # Create an inspector to inspect the database
    inspector = inspect(engine)
    
    # Get all table names
    print("\n=== Database Tables ===")
    tables = inspector.get_table_names()
    
    for table in tables:
        print(f"\nTable: {table}")
        
        # Get columns for each table
        columns = inspector.get_columns(table)
        print("  Columns:")
        for column in columns:
            print(f"    - {column['name']}: {column['type']}")
        
        # Get primary keys
        pk = inspector.get_pk_constraint(table)
        if pk['constrained_columns']:
            print(f"  Primary Key: {', '.join(pk['constrained_columns'])}")
    
    # Check if subscribers table exists
    if 'subscribers' in tables:
        print("\n✅ Subscribers table exists in the database")
        
        # Count subscribers
        with engine.connect() as conn:
            result = conn.execute(text('SELECT COUNT(*) FROM subscribers'))
            count = result.scalar()
            print(f"  Total subscribers: {count}")
    else:
        print("\n❌ Subscribers table does NOT exist in the database")
        print("\nTo create the subscribers table, run the following commands:")
        print("1. cd backend")
        print("2. alembic revision --autogenerate -m \"Add subscribers table\"")
        print("3. alembic upgrade head")

if __name__ == "__main__":
    print(f"Checking database at: {engine.url}")
    check_database()
