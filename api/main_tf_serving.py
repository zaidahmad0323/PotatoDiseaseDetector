from fastapi import FastAPI , File,UploadFile
import uvicorn
import numpy as np
from io import BytesIO
from PIL import Image
import tensorflow as tf


app = FastAPI()

model = tf.keras.models.load_model('../models/1.keras')
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
    uvicorn.run(app,host='localhost',port=8200)

