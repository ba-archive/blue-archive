from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

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
app.include_router(__import__("app.api", fromlist=["router"]).router)
app.mount("/uploads", StaticFiles(directory="./uploads"))

if __name__ == "__main__":
    from uvicorn import run

    run("app.main:app", reload=True)
