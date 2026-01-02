from app.db.database import engine
from sqlalchemy import text

with engine.connect() as conn:
    conn.execute(text('UPDATE alembic_version SET version_num = "8ee35d4301df"'))
    conn.commit()
    print('Updated alembic version')
