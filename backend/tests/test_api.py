"""Backend API tests for Wonji landing page.

Covers: root, contact submission (valid, invalid email, short message),
MongoDB persistence verification.
"""
import os
import pytest
import requests
from pymongo import MongoClient

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', 'https://forge-sound.preview.emergentagent.com').rstrip('/')
MONGO_URL = os.environ.get('MONGO_URL', 'mongodb://localhost:27017')
DB_NAME = os.environ.get('DB_NAME', 'test_database')


@pytest.fixture(scope="module")
def api():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


@pytest.fixture(scope="module")
def mongo_db():
    c = MongoClient(MONGO_URL)
    yield c[DB_NAME]
    c.close()


# ---------- Root endpoint ----------
class TestRoot:
    def test_root_returns_hello_world(self, api):
        r = api.get(f"{BASE_URL}/api/")
        assert r.status_code == 200
        assert r.json() == {"message": "Hello World"}


# ---------- Contact endpoint ----------
class TestContact:
    def test_contact_valid_payload_stored(self, api, mongo_db):
        payload = {
            "name": "TEST_Wonji Tester",
            "email": "test.wonji@example.com",
            "subject": "TEST subject line",
            "message": "Hello, this is a valid test message over ten characters.",
        }
        r = api.post(f"{BASE_URL}/api/contact", json=payload)
        assert r.status_code == 200, r.text
        data = r.json()
        assert "id" in data and isinstance(data["id"], str) and len(data["id"]) > 0
        # Since RESEND_API_KEY is empty by design, status should be 'stored'
        assert data["status"] == "stored", f"Expected 'stored', got {data}"

        # Verify persistence in MongoDB
        doc = mongo_db.contact_submissions.find_one({"id": data["id"]})
        assert doc is not None, "Submission was not persisted to MongoDB"
        assert doc["name"] == payload["name"]
        assert doc["email"] == payload["email"]
        assert doc["subject"] == payload["subject"]
        assert doc["message"] == payload["message"]
        assert doc["email_status"] == "skipped_not_configured"

        # cleanup
        mongo_db.contact_submissions.delete_one({"id": data["id"]})

    def test_contact_invalid_email_returns_422(self, api):
        r = api.post(f"{BASE_URL}/api/contact", json={
            "name": "TEST Bad Email",
            "email": "not-an-email",
            "subject": "X",
            "message": "Long enough message here.",
        })
        assert r.status_code == 422, r.text

    def test_contact_short_message_returns_422(self, api):
        r = api.post(f"{BASE_URL}/api/contact", json={
            "name": "TEST Short Msg",
            "email": "short@example.com",
            "subject": "X",
            "message": "too short",  # 9 chars
        })
        assert r.status_code == 422, r.text

    def test_contact_missing_name_returns_422(self, api):
        r = api.post(f"{BASE_URL}/api/contact", json={
            "email": "noname@example.com",
            "message": "A long enough message for validation",
        })
        assert r.status_code == 422, r.text
