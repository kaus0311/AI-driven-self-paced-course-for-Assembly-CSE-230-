from sqlalchemy.orm import Session
from sqlalchemy import func
from app.models.domain_models import StudentActivity

# --------------------------
# Core Analytics Functions
# --------------------------

def get_average_scores(db: Session):
    """Return average score per module and assignment."""
    results = (
        db.query(
            StudentActivity.module_id,
            StudentActivity.assignment_id,
            func.avg(StudentActivity.score).label("average_score")
        )
        .group_by(StudentActivity.module_id, StudentActivity.assignment_id)
        .all()
    )

    return [
        {
            "module_id": r.module_id,
            "assignment_id": r.assignment_id,
            "average_score": round(r.average_score or 0, 2)
        }
        for r in results
    ]


def get_completion_rates(db: Session):
    """Return completion rate per module."""
    total_counts = (
        db.query(StudentActivity.module_id, func.count().label("total"))
        .group_by(StudentActivity.module_id)
        .subquery()
    )

    completed_counts = (
        db.query(StudentActivity.module_id, func.count().label("completed"))
        .filter(StudentActivity.completed.is_(True))
        .group_by(StudentActivity.module_id)
        .subquery()
    )

    results = (
        db.query(
            total_counts.c.module_id,
            func.coalesce(completed_counts.c.completed, 0).label("completed"),
            total_counts.c.total
        )
        .outerjoin(completed_counts, total_counts.c.module_id == completed_counts.c.module_id)
        .all()
    )

    return [
        {
            "module_id": r.module_id,
            "completion_rate": round((r.completed / r.total) * 100, 2) if r.total else 0
        }
        for r in results
    ]


def get_top_and_bottom_students(db: Session, limit=3):
    """Identify top and bottom performing students by average score."""
    results = (
        db.query(
            StudentActivity.student_id,
            func.avg(StudentActivity.score).label("average_score")
        )
        .group_by(StudentActivity.student_id)
        .order_by(func.avg(StudentActivity.score).desc())
        .all()
    )

    if not results:
        return {"top_students": [], "bottom_students": []}

    # Convert each SQLAlchemy Row into a dict
    top_students = [
        {"student_id": r.student_id, "average_score": round(r.average_score or 0, 2)}
        for r in results[:limit]
    ]
    bottom_students = [
        {"student_id": r.student_id, "average_score": round(r.average_score or 0, 2)}
        for r in results[-limit:]
    ]

    return {"top_students": top_students, "bottom_students": bottom_students}

