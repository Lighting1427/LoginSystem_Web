# Solidithai (FastAPI + React + PostgreSQL)

## 1. คำแนะนำในการติดตั้ง

### สิ่งที่ต้องมี

- Python 3.8+
- Node.js + npm
- PostgreSQL

### Backend Setup

1. เข้าไปที่โฟลเดอร์ `backend` และพิมคำสั่งใน `cmd`:

   ```bash
   python -m venv venv
   source venv/bin/activate
   ```

   ```
   pip install annotated-types anyio bcrypt cffi click colorama cryptography ecdsa fastapi greenlet h11 idna passlib psycopg2-binary pyasn1 pycparser pydantic pydantic_core python-jose python-multipart rsa six sniffio SQLAlchemy starlette typing_extensions typing-inspection uvicorn
   ```

   ```
   uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   ```

2. ถ้าต้องการเข้า `Swagger` เปิด http://localhost:8000/docs

### Frontend Setup

1. เข้าไปในโฟลเดอร์ `frontend` และพิมคำสั่งใน `cmd`:
   ```
   npm install
   npm start
   ```
2. เปิดเว็บ http://localhost:3000
3. สามารถ `Login` ได้โดยใช้ Username: `admin` Password: `admin123`

## 2. คำอธิบายแนวทางการออกแบบ

### Backend:

- ใช้ FastAPI + SQLAlchemy เก็บข้อมูลใน PostgreSQL

- ใช้ JWT (OAuth2PasswordBearer) ตรวจสอบสิทธิ์ในทุกอัน

- โครงสร้างไฟล์แยก auth.py, crud.py, database.py, main.py, models.py, schemas.py

- มี CORS Middleware ให้ React เรียกได้

### Frontend:

- ใช้ React + React Router แบ่งหน้า login กับ app

- เก็บ JWT ใน localStorage เพื่อเรียก API ภายหลัง

- มีหน้า UserList, UserForm, UpdateUserForm ที่เรียก API ผ่าน userApi.js

- Responsive UI พื้นฐานด้วย styled-components

## เอกสาร API

เมื่อรัน Backend แล้ว ดู API ทั้งหมดได้ที่ http://localhost:8000/docs

### Endpoints หลัก:

- POST `/token` : รับ username/password ไปให้ return JSON {"access_token": "...", "token_type": "bearer"}

- GET `/users` : ต้องแนบ Authorization: Bearer <token> ไปให้ return list of users

- GET `/users/{user_id}` : ดูข้อมูลผู้ใช้ ID นั้น

- POST `/users` : สร้างผู้ใช้ใหม่

- PUT `/users/{user_id}` : แก้ไขผู้ใช้

- DELETE `/users/{user_id}` : ลบผู้ใช้

#### Response Format: JSON ตาม Pydantic Schema

#### Error Handling: ถ้า token ผิด หรือไม่มี token จะเป็น 401 Unauthorized

#

#### Made By Watcharapong Rodpong
