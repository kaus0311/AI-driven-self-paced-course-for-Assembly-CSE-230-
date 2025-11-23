from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.services.analytics_service import (
    get_average_scores,
    get_completion_rates,
    get_top_and_bottom_students,
)
from app.services.db import get_session
from fastapi.responses import StreamingResponse
import io
import csv

from reportlab.lib.pagesizes import letter 
from reportlab.pdfgen import canvas
from io import StringIO, BytesIO



router = APIRouter(prefix="/analytics", tags=["Analytics"])

@router.get("/averages")
def analytics_average_scores(db: Session = Depends(get_session)):
    return get_average_scores(db)

@router.get("/completion")
def analytics_completion_rates(db: Session = Depends(get_session)):
    return get_completion_rates(db)

@router.get("/leaders")
def analytics_top_bottom(db: Session = Depends(get_session)):
    return get_top_and_bottom_students(db)

@router.get("/export/csv")
def export_all_analytics_csv(db: Session = Depends(get_session)):
    averages = get_average_scores(db)
    completion = get_completion_rates(db)
    leaders = get_top_and_bottom_students(db)

    output = StringIO()
    writer = csv.writer(output)

    writer.writerow(["=== Average Scores ==="])
    writer.writerow(["Module", "Average Score"])
    for row in averages:
        writer.writerow([row["module"], row["average_score"]])

    writer.writerow([])
    writer.writerow(["=== Completion Rates ==="])
    writer.writerow(["Module", "Completion Rate (%)"])
    for row in completion:
        writer.writerow([row["module"], row["completion_rate"]])

    writer.writerow([])
    writer.writerow(["=== Top Students (First, Last) ==="])
    writer.writerow(["Student", "Average Score"])
    for row in leaders["top_students"]:
        writer.writerow([row["student"], row["average_score"]])

    writer.writerow([])
    writer.writerow(["=== Bottom Students (First, Last) ==="])
    writer.writerow(["Student", "Average Score"])
    for row in leaders["bottom_students"]:
        writer.writerow([row["student"], row["average_score"]])

    output.seek(0)

    return StreamingResponse(
        output,
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=analytics.csv"}
    )


@router.get("/export/pdf")
def export_all_analytics_pdf(db: Session = Depends(get_session)):
    averages = get_average_scores(db)
    completion = get_completion_rates(db)
    leaders = get_top_and_bottom_students(db)

    pdf_buffer = BytesIO()
    c = canvas.Canvas(pdf_buffer, pagesize=letter)

    y = 750

    def write(text):
        nonlocal y
        c.drawString(50, y, text)
        y -= 20

    write("=== Average Scores ===")
    for row in averages:
        write(f"Module: {row['module']} | Avg Score: {row['average_score']}")

    y -= 20
    write("=== Completion Rates ===")
    for row in completion:
        write(f"Module: {row['module']} | Completion: {row['completion_rate']}%")

    y -= 20
    write("=== Top Students (First, Last) ===")
    for row in leaders["top_students"]:
        write(f"Student: {row['student']} | Avg {row['average_score']}")

    y -= 20
    write("=== Bottom Students (First, Last) ===")
    for row in leaders["bottom_students"]:
        write(f"Student: {row['student']} | Avg {row['average_score']}")

    c.save()
    pdf_buffer.seek(0)

    return StreamingResponse(
        pdf_buffer,
        media_type="application/pdf",
        headers={"Content-Disposition": "attachment; filename=analytics.pdf"}
    )




