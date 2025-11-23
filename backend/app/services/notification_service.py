from typing import List
from datetime import datetime
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os

# simple storage for in-app notification
in_app_notifications = {}


class Notification:
    """Notification model"""
    def __init__(self, user_id: int, title: str, message: str, notification_type: str):
        self.user_id = user_id
        self.title = title
        self.message = message
        self.notification_type = notification_type
        self.created_at = datetime.utcnow()
        self.read = False


def send_email_notification(to_email: str, subject: str, body: str) -> bool:
    """
    send email notification
    
    Args:
        to_email: destination email address
        subject: subject
        body: body
    
    Returns:
        True when sending successes, False when it's failed
    """
    # SMTP setting（get from environment variable）
    smtp_server = os.getenv("SMTP_SERVER", "smtp.gmail.com")
    smtp_port = int(os.getenv("SMTP_PORT", "587"))
    smtp_username = os.getenv("SMTP_USERNAME", "")
    smtp_password = os.getenv("SMTP_PASSWORD", "")
    from_email = os.getenv("FROM_EMAIL", smtp_username)
    
    # skip if SMTP setting is not incompleted
    if not smtp_username or not smtp_password:
        print(f"Email notification skipped (SMTP not configured): {to_email}")
        return False
    
    try:
        # create message
        msg = MIMEMultipart()
        msg['From'] = from_email
        msg['To'] = to_email
        msg['Subject'] = subject
        msg.attach(MIMEText(body, 'plain'))
        
        # sending email
        with smtplib.SMTP(smtp_server, smtp_port) as server:
            server.starttls()
            server.login(smtp_username, smtp_password)
            server.send_message(msg)
        
        print(f"Email sent to {to_email}")
        return True
    except Exception as e:
        print(f"Failed to send email to {to_email}: {str(e)}")
        return False


def send_in_app_notification(user_id: int, title: str, message: str, notification_type: str = "info"):
    """
    send in-app notification
    
    Args:
        user_id: userID
        title: notification title
        message: notification message
        notification_type: notification type (info, success, warning, error)
    """
    if user_id not in in_app_notifications:
        in_app_notifications[user_id] = []
    
    notification = Notification(user_id, title, message, notification_type)
    in_app_notifications[user_id].append(notification)
    print(f"In-app notification sent to user {user_id}: {title}")


def get_user_notifications(user_id: int) -> List[Notification]:
    """
    Get user notification
    
    
    Args:
        user_id: userID
    
    Returns:
        Notifiction list
    """
    return in_app_notifications.get(user_id, [])


def mark_notification_as_read(user_id: int, notification_index: int):
    """
    mark as read on notifications
    
    Args:
        user_id: userID
        notification_index: notification index
    """
    if user_id in in_app_notifications:
        notifications = in_app_notifications[user_id]
        if 0 <= notification_index < len(notifications):
            notifications[notification_index].read = True


def notify_assignment_created(student_email: str, assignment_title: str, deadline: datetime):
    """notification when new assignment is created"""
    subject = f"new assignment: {assignment_title}"
    body = f"""
    New assignment is created.
    
    Assignment title: {assignment_title}
    Deadline: {deadline.strftime('%Y/%m/%d %H:%M')} (Moutain standard time)
    
    Please login and check the details.
    """
    send_email_notification(student_email, subject, body)


def notify_submission_graded(student_email: str, assignment_title: str, grade: int, feedback: str):
    """notification when submission is graded"""
    subject = f"assignment is graded: {assignment_title}"
    body = f"""
    Your submission is graded
    
    Assignment title: {assignment_title}
    Score: {grade}
    
    Feedback:
    {feedback}
    
    Please login and check the details.
    """
    send_email_notification(student_email, subject, body)


def notify_deadline_approaching(student_email: str, assignment_title: str, deadline: datetime):
    """Notification when the deadline is getting closer"""
    subject = f"Deadline is soon: {assignment_title}"
    body = f"""
    The deadline of assignment is soon
    
    Assignment title: {assignment_title}
    Deadline: {deadline.strftime('%Y/%m/%d %H:%M')} (Mountains Standard Time)
    
    Please submitted soon if you did not submit
    """
    send_email_notification(student_email, subject, body)