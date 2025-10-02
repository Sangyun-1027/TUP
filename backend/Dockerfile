# ---- backend only ----
FROM python:3.12-slim
WORKDIR /app

# 시스템 의존성
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl ca-certificates git build-essential supervisor \
  && rm -rf /var/lib/apt/lists/*

# Python 패키지
COPY backend/requirements.txt /app/backend/requirements.txt
RUN pip install -r /app/backend/requirements.txt

# supervisord.conf 있으면 복사
COPY supervisord.conf /app/supervisord.conf

EXPOSE 8000
CMD ["python", "backend/manage.py", "runserver", "0.0.0.0:8000"]