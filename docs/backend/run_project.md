# 🚀 Running the Backend Project

This guide will help you set up and run the **Django Backend** for the project.
Make sure you have **Python 3.10+** and **pip** installed on your system before starting.

---

## 📁 1. Move to the Backend Directory

In the base project folder (where both `frontend` and `backend` are located), open your terminal and navigate to the **backend** folder:

```bash
cd backend
```

---

## 🧰 2. Create and Activate a Virtual Environment

It’s recommended to use a virtual environment to isolate project dependencies.

### 🪟 On Windows:

```bash
python -m venv .venv
.venv\Scripts\activate
```

### 🐧 On Linux / macOS:

```bash
python3 -m venv .venv
source .venv/bin/activate
```

---

## 📦 3. Install Dependencies

Once the environment is activated, install all required dependencies from the `requirements.txt` file:

```bash
pip install -r requirements.txt
```

---

## ⚙️ 4. Environment Configuration (`.env`)

Create a `.env` file in the root of your **backend** directory.
This file contains environment variables required for your Django project (such as `SECRET_KEY`, `DEBUG`, `DATABASE_URL`, etc.).

You can use the sample provided in:

```
/backend/.env-example
```

Simply copy it and update the values according to your environment:

```bash
cp .env-example .env
```

---

## 🗄️ 5. Run Database Migrations

To create and apply database tables, run the following commands:

```bash
python manage.py makemigrations
python manage.py migrate
```

---

## 👤 6. Create a Superuser (Admin Account)

If you need admin access to the Django Admin Panel, create a superuser:

```bash
python manage.py createsuperuser
```

You will be asked to provide:

* **Username**
* **Email (optional)**
* **Password**

---

## ▶️ 7. Run the Development Server

Start the Django development server:

```bash
python manage.py runserver
```

By default, it will be available at:

👉 [http://127.0.0.1:8000/](http://127.0.0.1:8000/)

---

## 🔑 8. Access the Admin Panel

Once the server is running, you can log into the Django admin interface:

👉 [http://127.0.0.1:8000/admin/](http://127.0.0.1:8000/admin/)

Use the credentials you created earlier with the `createsuperuser` command.

---

## 🧹 9. Optional — Deactivate the Environment

When you’re done working, deactivate your virtual environment with:

```bash
deactivate
```

---

## ✅ Summary

| Step | Description                               |
| ---- | ----------------------------------------- |
| 1    | Go to the backend directory               |
| 2    | Create and activate a virtual environment |
| 3    | Install dependencies                      |
| 4    | Configure environment variables           |
| 5    | Apply migrations                          |
| 6    | Create a superuser                        |
| 7    | Run the server                            |
| 8    | Access the admin panel                    |

---
