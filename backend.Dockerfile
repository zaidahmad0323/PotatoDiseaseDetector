FROM python:3.11-slim

WORKDIR /app

# System deps
RUN apt-get update && apt-get install -y \
    gcc \
    libglib2.0-0 \
    libsm6 \
    libxext6 \
    libxrender-dev \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .

# Upgrade pip + increase timeout
RUN pip install --upgrade pip
RUN pip install --no-cache-dir --default-timeout=1000 --retries=10 -r requirements.txt

COPY api/ /app/api/
COPY models/ /app/models/

CMD ["uvicorn", "api.main:app", "--host", "0.0.0.0", "--port", "8000"]