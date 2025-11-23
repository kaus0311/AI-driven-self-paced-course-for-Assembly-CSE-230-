from app.services.rag_service import retrieve_relevant_docs
from app.utils.llm_client import call_llm
from app.services.analytics_service import record_interaction

async def ask(user_id, course_id, prompt, convo_id=None):
    docs = await retrieve_relevant_docs(course_id, prompt)
    context = build_prompt_context(docs, prompt)
    response = await call_llm(context)
    response = apply_guardrails(response)
    await record_interaction(user_id, course_id, prompt, response)
    return response
