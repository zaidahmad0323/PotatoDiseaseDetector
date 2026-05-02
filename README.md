# 🥔 Potato Disease Detector

> An AI-powered web application that identifies diseases in potato plants from leaf images — built with a TensorFlow/Keras model, FastAPI backend, Docker, and a React frontend.

![Python](https://img.shields.io/badge/Python-3.9+-3776AB?style=flat&logo=python&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-009688?style=flat&logo=fastapi&logoColor=white)
![React](https://img.shields.io/badge/React-18-61DAFB?style=flat&logo=react&logoColor=black)
![Docker](https://img.shields.io/badge/Docker-ready-2496ED?style=flat&logo=docker&logoColor=white)
![TensorFlow](https://img.shields.io/badge/TensorFlow-Keras-FF6F00?style=flat&logo=tensorflow&logoColor=white)

---

## 🌿 What It Detects

| Class | Severity | Description |
|---|---|---|
| 🟠 **Early Blight** | Moderate | Fungal disease caused by *Alternaria solani* — dark spots with concentric ring patterns on older leaves |
| 🔴 **Late Blight** | Severe | Caused by *Phytophthora infestans* — water-soaked lesions that turn brown/black; responsible for the Irish Potato Famine |
| 🟢 **Healthy** | None | No disease detected — plant appears normal and vibrant |

---

## 📁 Project Structure

```
PotatoDiseaseDetector/
├── api/
│   └── main.py              # FastAPI app — prediction endpoint
├── frontend/
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── src/
│       ├── main.jsx
│       └── App.jsx          # Main React UI
├── models/
│   └── 1.keras              # Trained Keras model
├── Dockerfile
└── requirements.txt
```

---

## 🚀 Getting Started

### Prerequisites

- [Docker](https://www.docker.com/get-started) installed
- [Node.js](https://nodejs.org/) v18+ installed
- [Git](https://git-scm.com/) installed

---

### 1. Clone the Repository

```bash
git clone https://github.com/zaidahmad0323/PotatoDiseaseDetector.git
cd PotatoDiseaseDetector
```

---

### 2. Run the Backend (FastAPI + Docker)

Build and start the Docker container:

```bash
docker build -t potato-disease-api .
docker run -p 8000:8000 potato-disease-api
```

The API will be live at `http://localhost:8000`

Verify it's working: `http://localhost:8000/docs`

---

### 3. Run the Frontend (React)

```bash
cd frontend
npm install
npm run dev
```

Open your browser at `http://localhost:3000`

---

## 🔌 API Reference

### `POST /predict`

Accepts a potato leaf image and returns the predicted disease class with confidence scores.

**Request**

```
Content-Type: multipart/form-data
Body: file=<image file>
```

**Response**

```json
{
  "class": "Potato___Early_blight",
  "confidence": 0.97,
  "all_predictions": {
    "Potato___Early_blight": 0.97,
    "Potato___Late_blight": 0.02,
    "Potato___healthy": 0.01
  }
}
```

---

## ⚙️ CORS Configuration

Ensure your `api/main.py` includes this middleware so the frontend can communicate with the backend:

```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)
```

---

## 🧠 Model Details

| Property | Value |
|---|---|
| Framework | TensorFlow / Keras |
| Input | RGB potato leaf image |
| Output | Softmax over 3 disease classes |
| Model file | `models/1.keras` |
| Dataset | [PlantVillage](https://www.kaggle.com/datasets/arjuntejaswi/plant-village) |

---

## 🖥️ Frontend Features

- Drag-and-drop or click-to-upload leaf image
- Live image preview with clear/reset option
- Confidence score with animated progress bar
- Disease diagnosis with treatment recommendations
- Full probability breakdown for all 3 classes

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Machine Learning | TensorFlow / Keras |
| Backend API | FastAPI |
| Containerization | Docker |
| Frontend | React 18 + Vite |

---

## 👤 Author

**Zaid Ahmad**
- GitHub: [@zaidahmad0323](https://github.com/zaidahmad0323)

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

## 🙌 Acknowledgements

- [PlantVillage Dataset](https://www.kaggle.com/datasets/arjuntejaswi/plant-village) for the training data
- [FastAPI](https://fastapi.tiangolo.com/) for the high-performance API framework
- [TensorFlow](https://www.tensorflow.org/) for the deep learning backbone
