from pydantic import BaseModel


class SlangPredictionRequest(BaseModel):
    input: str

    class Config:
        json_schema_extra = {
            "example": {
                "input": "X같네",
            }
        }


class PredictionRequest(BaseModel):
    input: str
    output: str

    class Config:
        json_schema_extra = {
            "example": {
                "input": "원본 텍스트",
                "output": "개선 텍스트",
            }
        }


class PredictionResponse(BaseModel):
    predicted: str

    class Config:
        json_schema_extra = {"example": {"predicted": "좋음"}}
