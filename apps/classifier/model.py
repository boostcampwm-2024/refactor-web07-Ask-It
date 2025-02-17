import torch
from transformers import BertTokenizerFast, BertForSequenceClassification

tokenizer = BertTokenizerFast.from_pretrained("kykim/bert-kor-base")
reply_classifier_model = BertForSequenceClassification.from_pretrained(
    "./reply-classifier-model"
)
reply_classifier_model.eval()
question_classifier_model = BertForSequenceClassification.from_pretrained(
    "./question-classifier-model"
)

reply_inv_label_map = {0: "나쁨", 1: "좋음"}
question_inv_label_map = {
    5: "매우 좋음",
    4: "좋음",
    3: "미묘한 개선",
    2: "변경 없음",
    1: "과도한 변경",
    0: "매우 나쁨",
}


def predict(text: str, type: str) -> str:
    inputs = tokenizer(
        text, return_tensors="pt", truncation=True, padding="max_length", max_length=512
    )

    model = reply_classifier_model if type == "reply" else question_classifier_model
    inv_label_map = reply_inv_label_map if type == "reply" else question_inv_label_map

    with torch.no_grad():
        outputs = model(**inputs)

    logits = outputs.logits
    probabilities = torch.softmax(logits, dim=-1)
    predicted_label = torch.argmax(probabilities, dim=-1).item()

    return inv_label_map[predicted_label]
