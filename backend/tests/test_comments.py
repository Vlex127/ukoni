import pytest
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session
from app.main import app
from app.db.database import Base, engine, get_db
from app.models.comment import Comment as CommentModel
from app.models.post import Post as PostModel
from app.models.user import User as UserModel
from app.core.security import get_password_hash

# Test database setup
@pytest.fixture(scope="module")
def test_db():
    # Create test database tables
    Base.metadata.create_all(bind=engine)
    db = Session(engine)
    
    # Create test data
    test_user = UserModel(
        email="test@example.com",
        hashed_password=get_password_hash("testpass123"),
        is_active=True,
        is_admin=False
    )
    db.add(test_user)
    
    test_post = PostModel(
        title="Test Post",
        content="Test Content",
        slug="test-post",
        author_id=1
    )
    db.add(test_post)
    db.commit()
    
    yield db
    
    # Cleanup
    db.rollback()
    Base.metadata.drop_all(bind=engine)

# Test client
@pytest.fixture(scope="module")
def client(test_db):
    def override_get_db():
        try:
            yield test_db
        finally:
            pass
    
    app.dependency_overrides[get_db] = override_get_db
    with TestClient(app) as test_client:
        yield test_client

def test_create_comment(client):
    """Test creating a new comment"""
    comment_data = {
        "post_id": 1,
        "author_name": "Test User",
        "author_email": "test@example.com",
        "content": "This is a test comment",
        "status": "pending"
    }
    
    response = client.post("/api/v1/comments/", json=comment_data)
    assert response.status_code == 201
    data = response.json()
    assert data["content"] == "This is a test comment"
    assert data["status"] == "pending"
    assert data["author_name"] == "Test User"


def test_get_comments(client):
    """Test getting a list of comments"""
    response = client.get("/api/v1/comments/?post_id=1")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) > 0
    assert data[0]["post_id"] == 1


def test_get_single_comment(client):
    """Test getting a single comment by ID"""
    # First, create a test comment
    comment_data = {
        "post_id": 1,
        "author_name": "Test User 2",
        "author_email": "test2@example.com",
        "content": "Another test comment",
        "status": "approved"
    }
    response = client.post("/api/v1/comments/", json=comment_data)
    comment_id = response.json()["id"]
    
    # Now test getting it
    response = client.get(f"/api/v1/comments/{comment_id}")
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == comment_id
    assert data["content"] == "Another test comment"


def test_update_comment(client):
    """Test updating a comment"""
    # First, create a test comment
    comment_data = {
        "post_id": 1,
        "author_name": "Updatable User",
        "author_email": "update@example.com",
        "content": "This comment will be updated",
        "status": "pending"
    }
    response = client.post("/api/v1/comments/", json=comment_data)
    comment_id = response.json()["id"]
    
    # Now update it
    update_data = {
        "content": "This comment has been updated",
        "status": "approved"
    }
    response = client.put(
        f"/api/v1/comments/{comment_id}",
        json=update_data,
        headers={"Authorization": "Bearer test_token"}  # In a real test, you'd use a valid token
    )
    assert response.status_code == 200
    data = response.json()
    assert data["content"] == "This comment has been updated"
    assert data["status"] == "approved"


def test_delete_comment(client):
    """Test deleting a comment"""
    # First, create a test comment
    comment_data = {
        "post_id": 1,
        "author_name": "Deletable User",
        "author_email": "delete@example.com",
        "content": "This comment will be deleted",
        "status": "pending"
    }
    response = client.post("/api/v1/comments/", json=comment_data)
    comment_id = response.json()["id"]
    
    # Now delete it
    response = client.delete(
        f"/api/v1/comments/{comment_id}",
        headers={"Authorization": "Bearer test_token"}  # In a real test, you'd use a valid token
    )
    assert response.status_code == 204
    
    # Verify it's gone
    response = client.get(f"/api/v1/comments/{comment_id}")
    assert response.status_code == 404
