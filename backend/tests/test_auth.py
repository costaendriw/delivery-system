import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.main import app
from app.core.database import Base, get_db

# Banco de dados de teste em memória
SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()


app.dependency_overrides[get_db] = override_get_db

client = TestClient(app)


@pytest.fixture(autouse=True)
def setup_database():
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)


def test_register_user():
    """
    Testa registro de novo usuário
    """
    response = client.post(
        "/api/v1/auth/register",
        json={
            "email": "test@example.com",
            "full_name": "Test User",
            "password": "testpassword123"
        }
    )
    assert response.status_code == 201
    data = response.json()
    assert data["email"] == "test@example.com"
    assert data["full_name"] == "Test User"
    assert "id" in data


def test_register_duplicate_email():
    """
    Testa registro com email duplicado
    """
    # Registra primeiro usuário
    client.post(
        "/api/v1/auth/register",
        json={
            "email": "duplicate@example.com",
            "full_name": "User One",
            "password": "password123"
        }
    )
    
    # Tenta registrar com mesmo email
    response = client.post(
        "/api/v1/auth/register",
        json={
            "email": "duplicate@example.com",
            "full_name": "User Two",
            "password": "password456"
        }
    )
    assert response.status_code == 400


def test_login_success():
    """
    Testa login com credenciais válidas
    """
    # Registra usuário
    client.post(
        "/api/v1/auth/register",
        json={
            "email": "login@example.com",
            "full_name": "Login User",
            "password": "loginpass123"
        }
    )
    
    # Faz login
    response = client.post(
        "/api/v1/auth/login",
        data={
            "username": "login@example.com",
            "password": "loginpass123"
        }
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"


def test_login_invalid_credentials():
    """
    Testa login com credenciais inválidas
    """
    response = client.post(
        "/api/v1/auth/login",
        data={
            "username": "nonexistent@example.com",
            "password": "wrongpassword"
        }
    )
    assert response.status_code == 401