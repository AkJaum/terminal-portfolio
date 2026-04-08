from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent

SECRET_KEY = "runner-service-secret-key"
DEBUG = False
ALLOWED_HOSTS = ["*"]
APPEND_SLASH = False

ROOT_URLCONF = "runner_service.urls"
WSGI_APPLICATION = "runner_service.wsgi.application"

INSTALLED_APPS = []
MIDDLEWARE = []
TEMPLATES = []

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.sqlite3",
        "NAME": BASE_DIR / "db.sqlite3",
    }
}

LANGUAGE_CODE = "en-us"
TIME_ZONE = "UTC"
USE_I18N = True
USE_TZ = True
