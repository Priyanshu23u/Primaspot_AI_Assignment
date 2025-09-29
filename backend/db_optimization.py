# SQLite3 optimization script - run occasionally
import sqlite3
import os
from django.conf import settings

def optimize_sqlite3():
    """Optimize SQLite3 database for better performance"""
    db_path = settings.DATABASES['default']['NAME']
    
    if not os.path.exists(db_path):
        print("Database file not found!")
        return
    
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    try:
        print("🔧 Optimizing SQLite3 database...")
        
        # Enable WAL mode for better concurrency
        cursor.execute("PRAGMA journal_mode=WAL;")
        
        # Optimize database
        cursor.execute("PRAGMA optimize;")
        
        # Update statistics
        cursor.execute("ANALYZE;")
        
        # Vacuum database to reclaim space
        cursor.execute("VACUUM;")
        
        # Check database integrity
        cursor.execute("PRAGMA integrity_check;")
        result = cursor.fetchone()
        
        if result[0] == 'ok':
            print("✅ Database integrity check passed")
        else:
            print("❌ Database integrity issues found")
        
        # Get database size
        size = os.path.getsize(db_path) / (1024 * 1024)  # MB
        print(f"📊 Database size: {size:.2f} MB")
        
        print("✅ SQLite3 optimization completed!")
        
    except Exception as e:
        print(f"❌ Optimization failed: {e}")
    
    finally:
        conn.close()

if __name__ == "__main__":
    import django
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'instagram_backend.settings')
    django.setup()
    optimize_sqlite3()
