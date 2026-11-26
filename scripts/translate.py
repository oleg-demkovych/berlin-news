"""Перекладає заголовки й описи українською (відкрита модель NLLB-200, без ключів)."""
import json, os, time
from pathlib import Path

import torch
from transformers import AutoModelForSeq2SeqLM, AutoTokenizer

PATH = Path(__file__).resolve().parent.parent / "public/data/news.json"
ENGLISH = {"The Local Berlin", "The Berlin Spectator", "iHeartBerlin"}
BUDGET = 20 * 60  # секунд на один запуск; решта перекладеться наступного разу
BATCH = 8
MODEL = "facebook/nllb-200-distilled-600M"
VERSION = 2  # збільшити, щоб перекласти все заново


def save(data):
    tmp = PATH.with_suffix(".tmp")
    tmp.write_text(json.dumps(data, ensure_ascii=False), encoding="utf-8")
    os.replace(tmp, PATH)


def main():
    data = json.loads(PATH.read_text(encoding="utf-8"))
    todo = [i for i in data["items"] if i["cat"] != "Українською" and i.get("trV") != VERSION]
    print(f"Перекласти: {len(todo)}")
    start, done = time.time(), 0
    model = AutoModelForSeq2SeqLM.from_pretrained(MODEL).eval() if todo else None
    for lang in ("de", "en"):
        group = [i for i in todo if (i["source"] in ENGLISH) == (lang == "en")]
        if not group:
            continue
        tok = AutoTokenizer.from_pretrained(MODEL, src_lang="deu_Latn" if lang == "de" else "eng_Latn")
        target = tok.convert_tokens_to_ids("ukr_Cyrl")
        for n in range(0, len(group), BATCH):
            if time.time() - start > BUDGET:
                break
            chunk = group[n:n + BATCH]
            texts = [i["title"] for i in chunk] + [i.get("text") or "-" for i in chunk]
            enc = tok(texts, return_tensors="pt", padding=True, truncation=True, max_length=256)
            with torch.inference_mode():
                out = model.generate(**enc, forced_bos_token_id=target, num_beams=4, max_new_tokens=256, no_repeat_ngram_size=4)
            result = tok.batch_decode(out, skip_special_tokens=True)
            for k, item in enumerate(chunk):
                item["trV"] = VERSION
                item["titleUk"] = result[k]
                item["textUk"] = result[len(chunk) + k] if item.get("text") else ""
            done += len(chunk)
            save(data)
    print(f"Перекладено: {done} з {len(todo)} за {time.time() - start:.0f} с")
    if todo:
        for i in [x for x in todo if x.get("trV") == VERSION][:8]:
            print(f"  {i['title']}  →  {i['titleUk']}")


if __name__ == "__main__":
    main()
