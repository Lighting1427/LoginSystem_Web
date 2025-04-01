from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from fastapi.middleware.cors import CORSMiddleware
from typing import List
from sqlalchemy.orm import Session

from passlib.context import CryptContext

from .database import engine, Base, SessionLocal
from . import auth, crud, models, schemas

Base.metadata.create_all(bind=engine)

app = FastAPI(title="User Management API (Auto-Create DB)")

origins = ["http://localhost:3000", "http://127.0.0.1:3000"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

@app.on_event("startup")
def seed_admin_user():
    db = SessionLocal()
    admin_user = db.query(models.User).filter(models.User.id == 999).first()
    if not admin_user:
        print("Seeding admin user (id=999)...")
        hashed_pw = pwd_context.hash("admin123")
        new_admin = models.User(
            id=999,
            username="admin",
            email="admin@gmail.com",
            full_name="admin",
            hashed_password=hashed_pw
        )
        db.add(new_admin)
        db.commit()
    db.close()

@app.post("/token", response_model=schemas.Token)
def login_for_access_token(
    db: Session = Depends(auth.get_db),
    form_data: OAuth2PasswordRequestForm = Depends()
):
    user = auth.authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = auth.timedelta(minutes=auth.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = auth.create_access_token(
        data={"sub": user.username},
        expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/users", response_model=List[schemas.UserOut])
def read_users(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(auth.get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    return crud.get_users(db, skip=skip, limit=limit)

@app.get("/users/{user_id}", response_model=schemas.UserOut)
def read_user(
    user_id: int,
    db: Session = Depends(auth.get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    user = crud.get_user_by_id(db, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@app.post("/users", response_model=schemas.UserOut)
def create_new_user(
    user: schemas.UserCreate,
    db: Session = Depends(auth.get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    existing_user = crud.get_user_by_username(db, user.username)
    if existing_user:
        raise HTTPException(status_code=400, detail="Username already registered")
    return crud.create_user(db, user)

@app.put("/users/{user_id}", response_model=schemas.UserOut)
def update_existing_user(
    user_id: int,
    user_update: schemas.UserUpdate,
    db: Session = Depends(auth.get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    user_db = crud.get_user_by_id(db, user_id)
    if not user_db:
        raise HTTPException(status_code=404, detail="User not found")
    return crud.update_user(db, user_db, user_update)

@app.delete("/users/{user_id}")
def delete_existing_user(
    user_id: int,
    db: Session = Depends(auth.get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    user_db = crud.get_user_by_id(db, user_id)
    if not user_db:
        raise HTTPException(status_code=404, detail="User not found")
    crud.delete_user(db, user_db)
    return {"detail": "User deleted successfully"}
