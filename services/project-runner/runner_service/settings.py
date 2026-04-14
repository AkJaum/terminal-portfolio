import os
from pathlib import Path
from urllib.parse import urlparse

BASE_DIR = Path(__file__).resolve().parent.parent


def _normalize_allowed_host(raw_value: str) -> str:
    value = (raw_value or "").strip()
    if not value:
        return ""

    if value.startswith("."):
        return value

    if "://" in value:
        parsed = urlparse(value)
        return (parsed.hostname or "").strip()

    value = value.split("/", 1)[0].strip()
    if value.count(":") == 1:
        value = value.split(":", 1)[0].strip()

    return value


SECRET_KEY = os.getenv(
    "DJANGO_SECRET_KEY",
    "change-me-runner-service-secret-key",
)
DEBUG = False
ALLOWED_HOSTS = [
    host
    for host in (
        _normalize_allowed_host(item)
        for item in os.getenv(
            "DJANGO_ALLOWED_HOSTS",
            "localhost,127.0.0.1,project-runner",
        ).split(",")
    )
    if host
]
APPEND_SLASH = False

ROOT_URLCONF = "runner_service.urls"
WSGI_APPLICATION = "runner_service.wsgi.application"

INSTALLED_APPS = []
MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "django.middleware.common.CommonMiddleware",
]
TEMPLATES = []

SECURE_CONTENT_TYPE_NOSNIFF = True
SECURE_REFERRER_POLICY = "same-origin"
X_FRAME_OPTIONS = "DENY"
DATA_UPLOAD_MAX_MEMORY_SIZE = int(
    os.getenv("DATA_UPLOAD_MAX_MEMORY_SIZE", str(256 * 1024))
)

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
