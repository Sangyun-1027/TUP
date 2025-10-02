# settings.py
import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent

# --- 보안/디버그 ---
SECRET_KEY = os.getenv("DJANGO_SECRET_KEY", "dev-secret")
DEBUG = os.getenv("DEBUG", "True").lower() in ("1", "true", "yes", "y")
ALLOWED_HOSTS = [h for h in os.getenv("ALLOWED_HOSTS", "localhost,127.0.0.1").split(",") if h]

# --- 앱 등록 ---
INSTALLED_APPS = [
    # Django 기본
    "django.contrib.admin","django.contrib.auth","django.contrib.contenttypes",
    "django.contrib.sessions","django.contrib.messages","django.contrib.staticfiles",

    # 3rd party
    "rest_framework","corsheaders",

    # local apps
    "api",                      # ← 추가
    "TeamMatching1.apps.TeamMatching1Config",
    "TeamMatching2.apps.TeamMatching2Config",           # apps.py 있으면 그대로 OK, 없다면 .apps.경로로 통일 권장
]

# --- 미들웨어 ---
MIDDLEWARE = [
    "corsheaders.middleware.CorsMiddleware",         # ← CORS는 CommonMiddleware보다 위
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

ROOT_URLCONF = "config.urls"
WSGI_APPLICATION = "config.wsgi.application"

# --- 템플릿 ---
TEMPLATES = [{
    "BACKEND": "django.template.backends.django.DjangoTemplates",
    "DIRS": [BASE_DIR / "templates"],
    "APP_DIRS": True,
    "OPTIONS": {"context_processors": [
        "django.template.context_processors.request",
        "django.contrib.auth.context_processors.auth",
        "django.contrib.messages.context_processors.messages",
    ]},
}]

# --- DB: sqlite 기본, 필요 시 mysql 전환 ---
DB_ENGINE = os.getenv("DB_ENGINE", "sqlite")  # sqlite | mysql

if DB_ENGINE == "sqlite":
    DATABASES = {
        "default": {
            "ENGINE": "django.db.backends.sqlite3",
            "NAME": os.getenv("SQLITE_PATH", str(BASE_DIR / "db" / "db.sqlite3")),
        }
    }
else:
    DATABASES = {
        "default": {
            "ENGINE": "django.db.backends.mysql",
            "NAME": os.getenv("DB_NAME", "tup_db"),
            "USER": os.getenv("DB_USER", "root"),
            "PASSWORD": os.getenv("DB_PASSWORD", ""),
            "HOST": os.getenv("DB_HOST", "db"),
            "PORT": os.getenv("DB_PORT", "3306"),
            "OPTIONS": {
                "charset": "utf8mb4",
                "init_command": "SET sql_mode='STRICT_TRANS_TABLES'",
            },
        }
    }

# --- 인증 정책(기본 오픈) ---
REST_FRAMEWORK = {
    "DEFAULT_PERMISSION_CLASSES": ["rest_framework.permissions.AllowAny"],
}

# --- 국제화/타임존 ---
LANGUAGE_CODE = "ko-kr"
TIME_ZONE = "Asia/Seoul"
USE_I18N = True
USE_TZ = True

# --- 정적/미디어 ---
STATIC_URL = "/static/"
MEDIA_URL  = "/media/"
STATIC_ROOT = BASE_DIR / "staticfiles"   # ← compose: static_volume
MEDIA_ROOT  = BASE_DIR / "media"         # ← compose: media_volume

# --- CORS/CSRF (CRA 3000 / Vite 5173 지원) ---
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000","http://127.0.0.1:3000",
    "http://localhost:5173","http://127.0.0.1:5173",
]
CORS_ALLOW_CREDENTIALS = True
CSRF_TRUSTED_ORIGINS = [
    "http://localhost:3000","http://127.0.0.1:3000",
    "http://localhost:5173","http://127.0.0.1:5173",
]

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"
