import json
import sys

# Ensure UTF-8 output in Windows terminals
if sys.stdout.encoding != "utf-8":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
    except Exception:
        pass

def decompile_questions(json_file_path):
    """
    Reads the extracted JSON file and decompiles the questions into
    a formatted, readable structure (and optionally exports to text/markdown).
    """
    with open(json_file_path, "r", encoding="utf-8") as file:
        questions = json.load(file)

    print(f"Successfully loaded {len(questions)} questions.\n")
    print("=" * 60)

    for idx, item in enumerate(questions, start=1):
        q_text = item.get("question", "")
        q_type = item.get("type", "single correct")
        options = item.get("options", {})
        answer = item.get("answer", "")

        print(f"Q{idx}. [{q_type.upper()}]")
        print(f"{q_text}\n")

        for opt_key, opt_val in options.items():
            print(f"   ({opt_key}) {opt_val}")

        print(f"\nCorrect Answer: ({answer})")
        print("-" * 60)

if __name__ == "__main__":
    decompile_questions("questions.json")
