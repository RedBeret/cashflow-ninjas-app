import json
import logging
import time
from datetime import datetime

import openai
from dotenv import find_dotenv, load_dotenv

load_dotenv()

client = openai.OpenAI()
model = "gpt-3.5-turbo-16k"
userData = {
    "persona": {
        "demographics": "Young working professional aged 25–35",
        "income_annual": 55000,
        "family_status": "Single with one child",
        "goals": ["homeownership", "child's education"],
        "motivation": "Seeking AI-driven financial assistance for budgeting and saving towards homeownership and child's education",
    },
    "financial_data": {
        "monthly_income": 4583,
        "monthly_expenses": {
            "rent": 1200,
            "groceries": 500,
            "dining_out": 300,
            "entertainment": 200,
            "childcare": 600,
            "utilities": 400,
            "transportation": 250,
            "miscellaneous": 150,
        },
        "savings": {"current": 2000, "goal": 5000, "goal_deadline": "2025-12-31"},
    },
}
userData_json = json.dumps(userData)

thread = client.beta.threads.create(
    messages=[
        {
            "role": "user",
            "content": userData_json,
        }
    ]
)
thread_id = thread.id
print(thread_id)

assistant_id = "asst_UBOdxaOqP1DIyXIdWtyObmXs"

message_content = "What is your analysis of my financial data?"
client.beta.threads.messages.create(
    thread_id=thread_id, role="user", content=message_content
)

run = client.beta.threads.runs.create(
    thread_id=thread_id,
    assistant_id=assistant_id,
    instructions="Please address the user as {persona.demographics} and provide financial analysis based on the user's financial data.",
)


def wait_for_run_completion(client, thread_id, run_id, sleep_interval=5):
    start_time = datetime.now()
    while True:
        try:
            run = client.beta.threads.runs.retrieve(thread_id=thread_id, run_id=run_id)
            if run.completed_at:
                completed_at_datetime = datetime.utcfromtimestamp(run.completed_at)
                elapsed_time = completed_at_datetime - start_time
                formatted_elapsed_time = str(elapsed_time)
                print(f"Run completed in {formatted_elapsed_time}")
                logging.info(f"Run completed in {formatted_elapsed_time}")

                messages = client.beta.threads.messages.list(thread_id=thread_id)
                assistant_response = None
                for message in messages.data:
                    if message.role == "assistant":
                        assistant_response = message.content
                        break

                if assistant_response:
                    response_text = assistant_response[0].text.value
                    print(f"Assistant Response: {response_text}")
                else:
                    print("No valid assistant response found.")
                break
        except Exception as e:
            logging.error(f"An error occurred while retrieving the run: {e}")
            break
        logging.info("Waiting for run to complete...")
        time.sleep(sleep_interval)


wait_for_run_completion(client=client, thread_id=thread_id, run_id=run.id)
