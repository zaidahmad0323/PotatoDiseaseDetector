from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import tensorflow as tf
from PIL import Image
import numpy as np
from io import BytesIO
import os
import uvicorn

app = FastAPI(title="Potato Disease Prediction API")

# ✅ CORS (for React/Vite frontend)
origins = [
    "http://localhost:5173",  # Vite frontend
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ Load model safely (works locally + Docker)
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
model_path = os.path.join(BASE_DIR, "../models/1.keras")

model = tf.keras.models.load_model(model_path)

classes = ['Potato___Early_blight', 'Potato___Late_blight', 'Potato___healthy']

def read_file_as_image(data):
    image = np.array(Image.open(BytesIO(data)))

    return image

@app.get('/hello')
async def hello():
    return 'I Am Alive'

@app.post('/predict')
async def predict(file:UploadFile=File(...)):
    image  = read_file_as_image(await file.read())
    image = np.expand_dims(image,0)
    prediction = model.predict(image)
    predicted_class = classes[np.argmax(prediction[0])]
    confidence = float(np.max(prediction[0]))

    output = {'class':predicted_class,'confidence':confidence}

    return output

if __name__ == '__main__':
    uvicorn.run(app,host='0.0.0.0',port=8000)




# # ✅ Class labels
# CLASSES = [
#     "Potato___Early_blight",
#     "Potato___Late_blight",
#     "Potato___healthy"
# ]

# # ✅ Image config (adjust if needed)
# IMAGE_SIZE = 256

# # ✅ Image preprocessing
# def read_image(data) -> np.ndarray:
#     image = Image.open(BytesIO(data)).convert("RGB")
#     image = image.resize((IMAGE_SIZE, IMAGE_SIZE))
#     image = np.array(image) / 255.0  # normalize
#     return image

# # ✅ Health check
# @app.get("/")
# def home():
#     return {"message": "Potato Disease API is running"}

# # ✅ Prediction endpoint
# @app.post("/predict")
# async def predict(file: UploadFile = File(...)):
#     try:
#         # Read and preprocess image
#         image = read_image(await file.read())
#         image_batch = np.expand_dims(image, axis=0)

#         # Predict
#         predictions = model.predict(image_batch)

#         predicted_index = int(np.argmax(predictions[0]))
#         predicted_class = CLASSES[predicted_index]
#         confidence = float(np.max(predictions[0]))

#         # Optional: top-3 predictions
#         top_indices = np.argsort(predictions[0])[-3:][::-1]
#         top_predictions = [
#             {
#                 "class": CLASSES[i],
#                 "confidence": float(predictions[0][i])
#             }
#             for i in top_indices
#         ]

#         return {
#             "predicted_class": predicted_class,
#             "confidence": confidence,
#             "top_3": top_predictions
#         }

#     except Exception as e:
#         return {"error": str(e)}