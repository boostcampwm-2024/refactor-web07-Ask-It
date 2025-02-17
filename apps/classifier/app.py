from fastapi import FastAPI
from schemas import PredictionRequest, PredictionResponse
from model import predict

app = FastAPI(
    title="Improve Reply Prediction API",
    description="입력된 질문과 답변에 대해 '좋음' 또는 '나쁨'을 예측하는 API",
    version="1.0.0",
)


@app.post("/improve-question-predict", response_model=PredictionResponse)
async def improve_question_predict(data: PredictionRequest):
    text = f" [Sep] {data.input} [Sep] {data.output}"
    predicted = predict(text, type="question")
    return {"predicted": predicted}


@app.post("/improve-reply-predict", response_model=PredictionResponse)
async def improve_reply_predict(data: PredictionRequest):
    text = f"질문: {data.input} 답변: {data.output}"
    predicted = predict(text, type="reply")
    return {"predicted": predicted}
