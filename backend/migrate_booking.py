"""
Migration script to add approved_date and created_at columns to booking table
Run this once to update the database schema
"""
import os
import sys

# Add the backend directory to path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app import create_app
from app.extensions import db
from sqlalchemy import text

app = create_app()

with app.app_context():
    # Check if columns exist and add them if not
    try:
        # Add created_at column
        db.session.execute(text("""
            ALTER TABLE booking 
            ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        """))
        print("✓ Added created_at column")
    except Exception as e:
        print(f"created_at column: {e}")
    
    try:
        # Add approved_date column
        db.session.execute(text("""
            ALTER TABLE booking 
            ADD COLUMN IF NOT EXISTS approved_date TIMESTAMP
        """))
        print("✓ Added approved_date column")
    except Exception as e:
        print(f"approved_date column: {e}")
    
    db.session.commit()
    print("\n✓ Migration completed successfully!")
