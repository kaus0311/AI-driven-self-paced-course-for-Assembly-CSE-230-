from sqlalchemy.orm import Session
from sqlalchemy import func
from app.models.domain_models import Student, Score

# --------------------------
# Core Analytics Functions
# --------------------------

def get_average_scores(db: Session):
    """Return average score per module."""
    results = (
        db.query(
            Score.module,
            func.avg(Score.score).label("average_score")
        )
        .group_by(Score.module)
        .all()
    )

    return [
        {
            "module": r.module,
            "average_score": round(r.average_score or 0, 2)
        }
        for r in results
    ]


def get_completion_rates(db: Session):
    """Return completion rate per module (completed / total * 100)."""
    total_counts = (
        db.query(Score.module, func.count().label("total"))
        .group_by(Score.module)
        .subquery()
    )

    completed_counts = (
        db.query(Score.module, func.count().label("completed"))
        .filter(Score.completed.is_(True))
        .group_by(Score.module)
        .subquery()
    )

    results = (
        db.query(
            total_counts.c.module,
            func.coalesce(completed_counts.c.completed, 0).label("completed"),
            total_counts.c.total
        )
        .outerjoin(
            completed_counts,
            total_counts.c.module == completed_counts.c.module
        )
        .all()
    )

    return [
        {
            "module": r.module,
            "completion_rate": round((r.completed / r.total) * 100, 2)
            if r.total else 0
        }
        for r in results
    ]

def get_top_and_bottom_students(db: Session, limit=3):
    """Identify top and bottom performing students by average score."""
    results = (
        db.query(
            Student.first_name.label("first"),
            Student.last_name.label("last"),
            func.avg(Score.score).label("average_score")
        )
        .join(Score, Student.id == Score.student_id)
        .group_by(Student.first_name, Student.last_name)
        .order_by(func.avg(Score.score).desc())
        .all()
    )

    if not results:
        return {"top_students": [], "bottom_students": []}

    # Convert query results to clean JSON
    top_students = [
         {"student": f"{r.first} {r.last}", "average_score": round(r.average_score or 0, 2)}
        for r in results[:limit]
    ]
    bottom_students = [
        {"student": f"{r.first} {r.last}", "average_score": round(r.average_score or 0, 2)}
        for r in results[-limit:]
    ]

    return {"top_students": top_students, "bottom_students": bottom_students}

def get_combined_analytics(db):
    from app.services.analytics_service import (
        get_average_scores,
        get_completion_rates,
        get_top_and_bottom_students
    )

    averages = get_average_scores(db)
    completion = get_completion_rates(db)
    leaders = get_top_and_bottom_students(db)

    return {
        "averages": averages,
        "completion_rates": completion,
        "top_students": leaders["top_students"],
        "bottom_students": leaders["bottom_students"]
    }

