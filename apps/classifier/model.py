import torch
from transformers import BertTokenizerFast, BertForSequenceClassification

tokenizer = BertTokenizerFast.from_pretrained("kykim/bert-kor-base")

models = {
    "reply": BertForSequenceClassification.from_pretrained("./reply-classifier-model"),
    "question": BertForSequenceClassification.from_pretrained(
        "./question-classifier-model"
    ),
    "slang": BertForSequenceClassification.from_pretrained("./slang-classifier-model"),
}

models["reply"].eval()
models["question"].eval()
models["slang"].eval()

inv_label_maps = {
    "reply": {0: "나쁨", 1: "좋음"},
    "question": {
        5: "매우 좋음",
        4: "좋음",
        3: "미묘한 개선",
        2: "변경 없음",
        1: "과도한 변경",
        0: "매우 나쁨",
    },
    "slang": {
        0: "일반어",
        1: "욕설",
    },
}


def predict(text: str, type: str) -> tuple[str, float]:
    inputs = tokenizer(
        text, return_tensors="pt", truncation=True, padding="max_length", max_length=512
    )

    model = models[type]
    inv_label_map = inv_label_maps[type]

    with torch.no_grad():
        outputs = model(**inputs)

    logits = outputs.logits
    probabilities = torch.softmax(logits, dim=-1)
    predicted_label = torch.argmax(probabilities, dim=-1).item()
    predicted_probability = probabilities[0, predicted_label].item()

    return inv_label_map[predicted_label], predicted_probability
