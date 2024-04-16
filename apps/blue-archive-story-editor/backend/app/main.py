from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(debug=True)

# register middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# register routers
app.include_router(__import__("app.services", fromlist=["router"]).router)
# app.mount("/uploads", StaticFiles(directory="./uploads"))

if __name__ == "__main__":
    import os
    from pathlib import Path
    from uvicorn import run

    os.chdir(Path(__file__) / '..')
    run("app.main:app", reload=True)
