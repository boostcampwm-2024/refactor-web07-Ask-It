from pydantic import BaseModel
from typing import List


class SlangPredictionRequest(BaseModel):
    inputs: List[str]

    class Config:
        json_schema_extra = {
            "example": {
                "inputs": ["X같네"],
            }
        }


class SlangPredictionItem(BaseModel):
    predicted: str
    probability: float


class SlangPredictionResponse(BaseModel):
    predictions: List[SlangPredictionItem]

    class Config:
        json_schema_extra = {
            "example": {"predictions": [{"predicted": "욕설", "probability": 0.99}]}
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
