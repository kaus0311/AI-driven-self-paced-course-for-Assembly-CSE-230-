"""
Initiatye database script
Create table and put initial data
"""
from app.services.db import init_db, drop_db, get_db_context
from app.models.domain_models import User, Course, Module, Assignment, UserRole
from app.services.auth_service import hash_password
from datetime import datetime, timedelta


def create_sample_data():
    """Create sample data"""
    with get_db_context() as db:
        # Create user
        instructor = User(
            email="instructor@example.com",
            username="instructor1",
            hashed_password=hash_password("password123"),
            role=UserRole.INSTRUCTOR
        )
        db.add(instructor)
        db.flush()
        
        student1 = User(
            email="student1@example.com",
            username="student1",
            hashed_password=hash_password("password123"),
            role=UserRole.STUDENT
        )
        db.add(student1)
        
        student2 = User(
            email="student2@example.com",
            username="student2",
            hashed_password=hash_password("password123"),
            role=UserRole.STUDENT
        )
        db.add(student2)
        db.flush()
        
        # Create course
        course = Course(
            title="CSE 230 - AI-Driven Learning Management System",
            description="Developing 'Learning Management System' with using OpenAI API",
            instructor_id=instructor.id
        )
        db.add(course)
        db.flush()
        
        # Create module
        module1 = Module(
            course_id=course.id,
            title="Module 1: Introduction to Python",
            description="Learning the basic of python",
            order=1
        )
        db.add(module1)
        
        module2 = Module(
            course_id=course.id,
            title="Module 2: Data Structures",
            description="Learning Data structur of list, set",
            order=2
        )
        db.add(module2)
        
        module3 = Module(
            course_id=course.id,
            title="Module 3: Object-Oriented Programming",
            description="Learning thesis of opject-oriented programming",
            order=3
        )
        db.add(module3)
        db.flush()
        
        # Create assignment
        assignment1 = Assignment(
            module_id=module1.id,
            title="Assignment 1: Hello World",
            instructions="Create 'Hello World' program in Python.\n\nRequirement:\n- use print()\n- includes the comment",
            deadline=datetime.utcnow() + timedelta(days=7),
            max_points=10,
            allow_file_upload=True,
            allow_text_submission=True
        )
        db.add(assignment1)
        
        assignment2 = Assignment(
            module_id=module1.id,
            title="Assignment 2: Variables and Data Types",
            instructions = "Create a program that uses various data types.\n\nRequirements:\n- Use integers, floating-point numbers, strings, and booleans\n- Display the type of each variable",
            deadline=datetime.utcnow() + timedelta(days=14),
            max_points=20
        )
        db.add(assignment2)
        
        assignment3 = Assignment(
            module_id=module2.id,
            title="Assignment 3: Working with Lists",
            instructions = "Create a program that processes data using a list.\n\nRequirements:\n- Create, add, delete, and slice elements in a list\n- Use list comprehension",
            deadline=datetime.utcnow() + timedelta(days=21),
            max_points=30
        )
        db.add(assignment3)
        
        assignment4 = Assignment(
            module_id=module2.id,
            title="Assignment 4: Dictionaries and Sets",
            instructions = "Create a program that uses dictionaries and sets.\n\nRequirements:\n- Create and manipulate a dictionary\n- Perform union, intersection, and difference operations on sets",
            deadline=datetime.utcnow() + timedelta(days=28),
            max_points=30
        )
        db.add(assignment4)
        
        assignment5 = Assignment(
            module_id=module3.id,
            title="Assignment 5: Creating Classes",
            instructions = "Define a class and create an object.\n\nRequirements:\n- The class must have at least three methods\n- Implement a constructor (__init__)\n- Use class inheritance",
            deadline=datetime.utcnow() + timedelta(days=35),
            max_points=50
        )
        db.add(assignment5)
        
        print("Creating sample data is completed!")
        print("\n--- Created user ---")
        print(f"Instructor: {instructor.username} (email: {instructor.email})")
        print(f"Student1: {student1.username} (email: {student1.email})")
        print(f"Student2: {student2.username} (email: {student2.email})")
        print(f"Password (common for everyone: password123")
        print("\n--- Created course ---")
        print(f"{course.title}")
        print(f"The number of modules: 3")
        print(f"The number of Assignments: 5")


def main():
    """Main function"""
    print("=== Initiate database ===\n")
    
    # Delete exisiting table (development enviorment only)
    response = input("do you want to delete the exisiting database (yes/no): ")
    if response.lower() == 'yes':
        print("Deleting database...")
        drop_db()
        print("Deletion completed")
    
    # Create table
    print("\nCreateing table...")
    init_db()
    print("table created")
    
    # Create sample data
    response = input("\ndo you want to create sample data? (yes/no): ")
    if response.lower() == 'yes':
        create_sample_data()
    
    print("\n=== Initiation completed ===")


if __name__ == "__main__":
    main()