import io
from pathlib import Path
import shutil
from typing import BinaryIO

upload_path = Path("./uploads")
upload_path.mkdir(exist_ok=True)

async def save_file(path: str, data:  bytes):
    with open(upload_path / path, "wb+") as f:
        if isinstance(data, bytes):
            f.write(data)


async def load_file(path: str) -> bytes:
    f = open(upload_path / path, "rb")
    return f.read()
