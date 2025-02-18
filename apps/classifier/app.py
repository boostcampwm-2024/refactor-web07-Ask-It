from fastapi import FastAPI
from schemas import (
    SlangPredictionRequest,
    SlangPredictionResponse,
    PredictionRequest,
    PredictionResponse,
)
from model import predict, predict_batch

app = FastAPI()


@app.post("/improve-question-predict", response_model=PredictionResponse)
async def improve_question_predict(data: PredictionRequest):
    text = f" [Sep] {data.input} [Sep] {data.output}"
    predicted = predict(text, type="question")
    return {"predicted": predicted[0]}


@app.post("/improve-reply-predict", response_model=PredictionResponse)
async def improve_reply_predict(data: PredictionRequest):
    text = f"질문: {data.input} 답변: {data.output}"
    predicted = predict(text, type="reply")
    return {"predicted": predicted[0]}


@app.post("/slang-predict", response_model=SlangPredictionResponse)
async def slang_predict(data: SlangPredictionRequest):
    text = data.inputs
    predicted = predict_batch(text, type="slang")
    return {
        "predictions": [{"predicted": p[0], "probability": p[1]} for p in predicted]
    }
