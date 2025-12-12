from ultralytics import YOLO
from fastapi import FastAPI, UploadFile, File
from io import BytesIO
from PIL import Image
from pathlib import Path
from app.services.nutrition_service import analyze_food
import os

app = FastAPI()

# Resolve model path relative to this file
BASE_DIR = Path(__file__).resolve().parent
MODEL_PATH = BASE_DIR / "ml_models" / "yolo" / "best.onnx"

# Attempt to load the YOLO model if present; otherwise, raise a clear error on first use
_model = None

def get_model():
    global _model
    if _model is None:
        if not MODEL_PATH.exists():
            # Provide a helpful message including the expected location
            raise FileNotFoundError(f"YOLO model not found at {MODEL_PATH}. Place your ONNX weights there or update the path.")
        _model = YOLO(str(MODEL_PATH))
    return _model

@app.get("/")
def root():
    return {"message": "NutriSense API", "endpoints": ["/health", "/scan-food/"]}

@app.post("/scan-food/")
async def scan_food(file: UploadFile = File(...)):
    img = Image.open(BytesIO(await file.read()))
    model = get_model()
    results = model.predict(img)
    detections = [
        {"class": r.boxes.cls[0].item(), "confidence": r.boxes.conf[0].item()}
        for r in results
    ]
    nutrition_results = analyze_food(detections)
    return {
        "detections": detections,
        "nutrition": nutrition_results
}


@app.get("/health")
def health():
    return {"status": "ok", "model_path": str(MODEL_PATH), "model_loaded": bool(_model is not None)} 