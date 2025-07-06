from pydantic import BaseModel


class CreateSolutionSchema(BaseModel):
    bounty_id: int
    description: str
    solution_file: str | None = None
    solution_link: str | None = None
