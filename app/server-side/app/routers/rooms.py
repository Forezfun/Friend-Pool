from fastapi import APIRouter, Request, Response
from app.models import room
router = APIRouter(
    tags=['rooms'],
    prefix='/rooms'
)

@router.get('', response_model=list[room.roomScreenInformation])
async def get_account_rooms(request:Request,response:Response):
    print(request.state.googleId)
    return [
        room.roomScreenInformation(name="Test 1", id=1),
        room.roomScreenInformation(name="Test 2", id=2)
    ]
