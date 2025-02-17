from fastapi import FastAPI
from schemas import SlangPredictionRequest, PredictionRequest, PredictionResponse
from model import predict

app = FastAPI()


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


@app.post("/slang-predict", response_model=PredictionResponse)
async def slang_predict(data: SlangPredictionRequest):
    text = data.input
    predicted = predict(text, type="slang")
    return {"predicted": predicted}
