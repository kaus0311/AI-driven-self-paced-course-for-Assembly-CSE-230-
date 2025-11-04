def preview_pushback_payload(course_id, assignment_id, student_id, grade, comment):
    # produce the API payload that would be sent to Canvas
    return {"submission": {"posted_grade": grade, "text_comment": comment}}

def push_grade(course_id, assignment_id, student_id, grade, comment, instructor_token):
    payload = preview_pushback_payload(course_id, assignment_id, student_id, grade, comment)
    # call Canvas submissions endpoint with instructor_token
    return canvas_post_submission(course_id, assignment_id, student_id, payload, instructor_token)