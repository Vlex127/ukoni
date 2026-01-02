from app.db.database import Base, engine
from sqlalchemy import inspect

def check_table_columns():
    inspector = inspect(engine)
    
    # Check if comments table exists
    if 'comments' not in inspector.get_table_names():
        print("Comments table does not exist yet")
        return
    
    # Get columns for comments table
    columns = inspector.get_columns('comments')
    print("\nComments table columns:")
    for column in columns:
        print(f"- {column['name']}: {column['type']} "
              f"{'NULL' if column['nullable'] else 'NOT NULL'} "
              f"{'PRIMARY KEY' if column.get('primary_key', False) else ''}")
    
    # Check foreign keys
    print("\nForeign keys:")
    fks = inspector.get_foreign_keys('comments')
    for fk in fks:
        print(f"- {fk['constrained_columns']} references {fk['referred_table']}.{fk['referred_columns']}")

if __name__ == "__main__":
    check_table_columns()
