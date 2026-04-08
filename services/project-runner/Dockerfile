FROM python:3.12-alpine

WORKDIR /app

RUN apk add --no-cache \
	git \
	bash \
	make \
	gcc \
	g++ \
	musl-dev \
	wget

COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

COPY manage.py ./
COPY runner_service ./runner_service

ENV PORT=8080
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
EXPOSE 8080

CMD ["sh", "-c", "gunicorn runner_service.wsgi:application --bind 0.0.0.0:${PORT}"]
