from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.services.db import get_session
from app.models.domain_models import Student, Score
import random

router = APIRouter()

@router.post("/seed-data")
def seed_student_scores(db: Session = Depends(get_session)):
    try:
        # -------------------------------
        # 20 Demo Students
        # -------------------------------
        students = [
            Student(first_name="Alice", last_name="Johnson", email="alice@example.com"),
            Student(first_name="Bob", last_name="Smith", email="bob@example.com"),
            Student(first_name="Charlie", last_name="Brown", email="charlie@example.com"),
            Student(first_name="David", last_name="Miller", email="david@example.com"),
            Student(first_name="Emma", last_name="Davis", email="emma@example.com"),
            Student(first_name="Frank", last_name="Wilson", email="frank@example.com"),
            Student(first_name="Grace", last_name="Taylor", email="grace@example.com"),
            Student(first_name="Henry", last_name="Moore", email="henry@example.com"),
            Student(first_name="Isabella", last_name="Anderson", email="isabella@example.com"),
            Student(first_name="Jack", last_name="Thomas", email="jack@example.com"),
            Student(first_name="Katelyn", last_name="Martin", email="katelyn@example.com"),
            Student(first_name="Liam", last_name="White", email="liam@example.com"),
            Student(first_name="Mia", last_name="Harris", email="mia@example.com"),
            Student(first_name="Noah", last_name="Clark", email="noah@example.com"),
            Student(first_name="Olivia", last_name="Lewis", email="olivia@example.com"),
            Student(first_name="Parker", last_name="Young", email="parker@example.com"),
            Student(first_name="Quinn", last_name="Hall", email="quinn@example.com"),
            Student(first_name="Ryan", last_name="King", email="ryan@example.com"),
            Student(first_name="Sophia", last_name="Wright", email="sophia@example.com"),
            Student(first_name="Tyler", last_name="Scott", email="tyler@example.com"),
        ]

        db.add_all(students)
        db.commit()

        # Fetch IDs after commit
        student_ids = [s.id for s in db.query(Student).all()]

        # -------------------------------
        # 6 Modules
        # -------------------------------
        modules = [
            "Intro to Assembly",
            "Branch Instructions",
            "Data Transfer",
            "Stack & Memory",
            "Arithmetic & Logic",
            "Loops & Conditions",
        ]

        # -------------------------------
        # Generate Scores (20 students × 6 modules = 120 rows)
        # Random score range: 60–100
        # completed: 80% chance
        # -------------------------------
        scores = []
        for sid in student_ids:
            for module in modules:
                score_value = random.randint(60, 100)
                completed_flag = score_value >= 70  # completed if score is decent

                scores.append(
                    Score(
                        student_id=sid,
                        module=module,
                        score=score_value,
                        completed=completed_flag,
                    )
                )

        db.add_all(scores)
        db.commit()

        return {"message": "20 students and full module scores added successfully!"}

    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error seeding data: {str(e)}")
