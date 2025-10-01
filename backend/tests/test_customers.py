import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.main import app
from app.core.database import Base, get_db

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


@pytest.fixture
def auth_token():
    """
    Cria usuário e retorna token de autenticação
    """
    client.post(
        "/api/v1/auth/register",
        json={
            "email": "testuser@example.com",
            "full_name": "Test User",
            "password": "password123"
        }
    )
    
    response = client.post(
        "/api/v1/auth/login",
        data={
            "username": "testuser@example.com",
            "password": "password123"
        }
    )
    return response.json()["access_token"]


def test_create_customer(auth_token):
    """
    Testa criação de cliente
    """
    response = client.post(
        "/api/v1/customers/",
        json={
            "name": "João Silva",
            "phone": "27999999999",
            "address": "Rua Teste, 123",
            "consumption_pattern_days": 30
        },
        headers={"Authorization": f"Bearer {auth_token}"}
    )
    assert response.status_code == 201
    data = response.json()
    assert data["name"] == "João Silva"
    assert data["phone"] == "27999999999"


def test_list_customers(auth_token):
    """
    Testa listagem de clientes
    """
    # Cria alguns clientes
    client.post(
        "/api/v1/customers/",
        json={
            "name": "Cliente 1",
            "phone": "27999999991",
            "address": "Endereço 1",
            "consumption_pattern_days": 30
        },
        headers={"Authorization": f"Bearer {auth_token}"}
    )
    
    client.post(
        "/api/v1/customers/",
        json={
            "name": "Cliente 2",
            "phone": "27999999992",
            "address": "Endereço 2",
            "consumption_pattern_days": 45
        },
        headers={"Authorization": f"Bearer {auth_token}"}
    )
    
    response = client.get(
        "/api/v1/customers/",
        headers={"Authorization": f"Bearer {auth_token}"}
    )
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 2


def test_update_customer(auth_token):
    """
    Testa atualização de cliente
    """
    # Cria cliente
    create_response = client.post(
        "/api/v1/customers/",
        json={
            "name": "Cliente Original",
            "phone": "27999999993",
            "address": "Endereço Original",
            "consumption_pattern_days": 30
        },
        headers={"Authorization": f"Bearer {auth_token}"}
    )
    customer_id = create_response.json()["id"]
    
    # Atualiza cliente
    response = client.put(
        f"/api/v1/customers/{customer_id}",
        json={
            "name": "Cliente Atualizado",
            "consumption_pattern_days": 40
        },
        headers={"Authorization": f"Bearer {auth_token}"}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "Cliente Atualizado"
    assert data["consumption_pattern_days"] == 40