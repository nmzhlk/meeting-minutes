from enum import StrEnum


class MeetingStatus(StrEnum):
    SCHEDULED = "SCHEDULED"
    RECORDED = "RECORDED"
    PROCESSED = "PROCESSED"
    COMPLETED = "COMPLETED"


class ActionItemStatus(StrEnum):
    TODO = "TODO"
    IN_PROGRESS = "IN_PROGRESS"
    DONE = "DONE"


class Priority(StrEnum):
    LOW = "LOW"
    MEDIUM = "MEDIUM"
    HIGH = "HIGH"
