from datetime import datetime, timedelta, timezone
from sqlalchemy import select
from app.db.base import Base
from app.db.session import engine, SessionLocal
import app.models
from app.models.participant import Participant
from app.models.meeting import Meeting, MeetingAgendaItem, MeetingDecision
from app.models.action_item import ActionItem


def create_tables():
    Base.metadata.create_all(bind=engine)


def seed_data():
    with SessionLocal() as db:
        existing_participant = db.scalar(select(Participant).limit(1))
        if existing_participant:
            print("Database already contains data, skipping seeding.")
            return

        now = datetime.now(timezone.utc)

        john = Participant(
            name="John Doe",
            email="john@example.com",
            role="Team Lead",
        )
        alice = Participant(
            name="Alice Smith",
            email="alice@example.com",
            role="Developer",
        )
        db.add_all([john, alice])
        db.flush()

        meeting = Meeting(
            title="Sprint Planning",
            description="Planning tasks and feature priorities for the upcoming sprint",
            meeting_date=now,
            duration_minutes=60,
            status="PROCESSED",
            summary="Agreed on sprint scope and main deliverables. Next sync scheduled for Friday",
            participants=[john, alice],
        )

        agenda_items = [
            "Review backlog",
            "Estimate tasks",
            "Assign action items",
        ]
        for idx, item_text in enumerate(agenda_items):
            meeting.agenda_items.append(
                MeetingAgendaItem(item=item_text, order_index=idx)
            )

        decisions = [
            "Focus on frontend UI for the first milestone",
            "Backend integration scheduled for the next sprint",
        ]
        for idx, decision_text in enumerate(decisions):
            meeting.decisions.append(
                MeetingDecision(decision=decision_text, order_index=idx)
            )

        db.add(meeting)
        db.flush()

        action1 = ActionItem(
            meeting_id=meeting.id,
            assignee_id=john.id,
            title="Setup repository and base layout",
            due_date=now + timedelta(days=2),
            status="DONE",
            priority="HIGH",
        )
        action2 = ActionItem(
            meeting_id=meeting.id,
            assignee_id=alice.id,
            title="Implement dashboard and navigation",
            due_date=now + timedelta(days=5),
            status="IN_PROGRESS",
            priority="MEDIUM",
        )
        db.add_all([action1, action2])

        db.commit()
        print("Initial demo data successfully seeded into database!")


def init_db():
    create_tables()
    seed_data()


if __name__ == "__main__":
    init_db()
