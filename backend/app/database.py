import os
import time
import psycopg2
from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

DB_NAME = os.getenv("DB_NAME", "loginDB")
DB_USER = os.getenv("DB_USER", "postgres")
DB_PASS = os.getenv("DB_PASS", "1427")
DB_HOST = os.getenv("DB_HOST", "localhost")
DB_PORT = os.getenv("DB_PORT", "5432")

def wait_until_database_ready(dbname, timeout=10):
    print("Waiting for database to be ready...", end=" ", flush=True)
    start_time = time.time()
    while time.time() - start_time < timeout:
        try:
            conn = psycopg2.connect(
                dbname=dbname,
                user=DB_USER,
                password=DB_PASS,
                host=DB_HOST,
                port=DB_PORT
            )
            conn.close()
            print("done.")
            return
        except psycopg2.OperationalError:
            time.sleep(0.5)
    raise Exception(f"Timeout: Database '{dbname}' not ready after {timeout} seconds")

def create_database_if_not_exists():
    conn = psycopg2.connect(
        dbname="postgres",
        user=DB_USER,
        password=DB_PASS,
        host=DB_HOST,
        port=DB_PORT
    )
    conn.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
    cur = conn.cursor()

    dbname_lower = DB_NAME.lower()
    cur.execute("SELECT 1 FROM pg_database WHERE datname = %s", (dbname_lower,))
    exists = cur.fetchone()
    if not exists:
        print(f"Database '{DB_NAME}' does not exist. Creating...")
        cur.execute(f"CREATE DATABASE {dbname_lower} OWNER {DB_USER}")
        cur.close()
        conn.close()
        wait_until_database_ready(dbname_lower)
    else:
        print(f"Database '{DB_NAME}' already exists. Skipping creation.")
        cur.close()
        conn.close()

create_database_if_not_exists()

SQLALCHEMY_DATABASE_URL = f"postgresql://{DB_USER}:{DB_PASS}@{DB_HOST}:{DB_PORT}/{DB_NAME.lower()}"
engine = create_engine(SQLALCHEMY_DATABASE_URL, echo=True)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()
