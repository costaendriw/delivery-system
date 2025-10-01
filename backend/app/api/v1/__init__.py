from fastapi import APIRouter
from app.api.v1 import auth, customers, products, orders, users

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["Autenticação"])
api_router.include_router(users.router, prefix="/users", tags=["Usuários"])
api_router.include_router(customers.router, prefix="/customers", tags=["Clientes"])
api_router.include_router(products.router, prefix="/products", tags=["Produtos"])
api_router.include_router(orders.router, prefix="/orders", tags=["Pedidos"])