# OptListing Backend

FastAPI backend for OptListing SaaS application.

## Setup

1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Run the server:
```bash
python main.py
```

Or with uvicorn:
```bash
uvicorn main:app --reload
```

The API will be available at `http://localhost:8000`

## API Endpoints

- `GET /` - Health check
- `GET /api/listings` - Get all listings
- `POST /api/listings/detect-source` - Detect source for a listing
- `GET /api/analyze` - Analyze zombie listings
- `POST /api/export` - Export CSV for listing tools
- `POST /api/dummy-data` - Generate dummy data

## Database

### Supabase (Production)

1. Create a `.env` file in the `backend` directory:
```bash
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.lmgghdbsxycgddptvwtn.supabase.co:5432/postgres
```

2. Get your database password from [Supabase Dashboard](https://supabase.com/dashboard/project/lmgghdbsxycgddptvwtn/settings/database)

3. Replace `[YOUR-PASSWORD]` with your actual database password

### SQLite (Local Development)

If `DATABASE_URL` is not set, the app will fall back to SQLite:
- Database file: `optlisting.db`

