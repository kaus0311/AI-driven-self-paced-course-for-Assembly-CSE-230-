from app.services.db import SessionLocal
from app.models.domain_models import StudentActivity

# Create a session
db = SessionLocal()

# Mock data — feel free to adjust these values
mock_data = [
    {"student_id": 1, "module_id": 1, "assignment_id": 1, "score": 85, "completed": True},
    {"student_id": 1, "module_id": 1, "assignment_id": 2, "score": 90, "completed": True},
    {"student_id": 2, "module_id": 1, "assignment_id": 1, "score": 70, "completed": True},
    {"student_id": 2, "module_id": 1, "assignment_id": 2, "score": 75, "completed": False},
    {"student_id": 3, "module_id": 2, "assignment_id": 3, "score": 88, "completed": True},
    {"student_id": 3, "module_id": 2, "assignment_id": 4, "score": 92, "completed": True},
    {"student_id": 4, "module_id": 2, "assignment_id": 3, "score": 60, "completed": False},
    {"student_id": 4, "module_id": 3, "assignment_id": 5, "score": 95, "completed": True},
]

# Insert mock data
for entry in mock_data:
    activity = StudentActivity(**entry)
    db.add(activity)

db.commit()
db.close()

print("Mock student activity data seeded successfully!")
