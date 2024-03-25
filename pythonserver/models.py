import re
import uuid
from datetime import datetime

from sqlalchemy import ForeignKey, Text
from sqlalchemy.dialects.sqlite import BLOB
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.ext.hybrid import hybrid_property
from sqlalchemy.orm import relationship, validates
from sqlalchemy_serializer import SerializerMixin

from config import bcrypt, db

Base = declarative_base()


class UserAuth(Base, db.Model, SerializerMixin):
    __tablename__ = "user_auth"

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)
    is_admin = db.Column(db.Boolean, default=False)
    can_view_all_accounts = db.Column(db.Boolean, default=False)
    mfa_enabled = db.Column(db.Boolean, default=False)

    chat_messages = relationship("ChatMessage", back_populates="user")
    sessions = relationship("UserSession", back_populates="user")
    financial_profiles = relationship("FinancialProfile", back_populates="user")
    family_id = db.Column(db.Integer, db.ForeignKey("family.id"))
    family = db.relationship("Family", back_populates="members")

    @validates("email", "username")
    def validate_field(self, key, value):
        if key == "email":
            assert len(value) >= 3, "Email must be at least 3 characters long"
            assert re.match(
                r"\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b", value
            ), "Invalid email format"
        elif key == "username":
            assert len(value) >= 3, "Username must be at least 3 characters long"
        return value

    @hybrid_property
    def password(self):
        raise AttributeError("password is not a readable attribute")

    @password.setter
    def password(self, password):
        self.password_hash = bcrypt.generate_password_hash(password).decode("utf-8")

    def check_password(self, password):
        return bcrypt.check_password_hash(self.password_hash, password)

    serialize_rules = ("-password_hash",)


class UserSession(Base, db.Model, SerializerMixin):
    __tablename__ = "user_sessions"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("user_auth.id"), nullable=False)
    started_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    ended_at = db.Column(db.DateTime, nullable=True)

    user = relationship("UserAuth", back_populates="sessions")


class ChatMessage(Base, db.Model, SerializerMixin):
    __tablename__ = "chat_messages"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("user_auth.id"), nullable=False)
    message = db.Column(Text, nullable=False)
    response = db.Column(Text, nullable=True)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

    user = relationship("UserAuth", back_populates="chat_messages")


class Family(Base, db.Model, SerializerMixin):
    __tablename__ = "family"
    id = db.Column(db.Integer, primary_key=True)
    family_name = db.Column(db.String(255), nullable=False)
    members = db.relationship("UserAuth", back_populates="family")


class BankAccount(Base, db.Model, SerializerMixin):
    __tablename__ = "bank_accounts"

    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    account_number = db.Column(db.String(20))
    account_name = db.Column(db.String(255))
    available_balance = db.Column(db.Float)
    debt = db.Column(db.Float)

    family_bank_accounts = relationship(
        "FamilyBankAccount", back_populates="bank_account"
    )
    user_bank_accounts = relationship("UserBankAccount", back_populates="bank_account")
    transactions = relationship("Transaction", back_populates="bank_account")


class FamilyBankAccount(Base, db.Model, SerializerMixin):
    __tablename__ = "family_bank_accounts"

    family_id = db.Column(db.String(36), ForeignKey("family.id"), primary_key=True)
    account_id = db.Column(
        db.String(36), ForeignKey("bank_accounts.id"), primary_key=True
    )

    family = relationship("Family", back_populates="family_bank_accounts")
    bank_account = relationship("BankAccount", back_populates="family_bank_accounts")


class UserBankAccount(Base, db.Model, SerializerMixin):
    __tablename__ = "user_bank_accounts"

    user_id = db.Column(db.String(36), ForeignKey("users.id"), primary_key=True)
    account_id = db.Column(
        db.String(36), ForeignKey("bank_accounts.id"), primary_key=True
    )

    user = relationship("UserAuth", back_populates="user_bank_accounts")
    bank_account = relationship("BankAccount", back_populates="user_bank_accounts")


class Transaction(Base, db.Model, SerializerMixin):
    __tablename__ = "transactions"

    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    account_id = db.Column(db.String(36), ForeignKey("bank_accounts.id"))
    amount = db.Column(db.Float)
    transaction_type = db.Column(db.String(50))
    category_id = db.Column(db.String(36), ForeignKey("categories.id"))
    description = db.Column(Text)
    transaction_date = db.Column(db.DateTime)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    bank_account = relationship("BankAccount", back_populates="transactions")
    category = relationship("Category", back_populates="transactions")


class Category(Base, db.Model, SerializerMixin):
    __tablename__ = "categories"

    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name = db.Column(db.String(255))
    description = db.Column(Text)

    transactions = relationship("Transaction", back_populates="category")


class UserGoal(Base, db.Model, SerializerMixin):
    __tablename__ = "user_goals"

    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = db.Column(db.String(36), ForeignKey("users.id"))
    goal_name = db.Column(db.String(255))
    goal_amount = db.Column(db.Float)
    current_amount = db.Column(db.Float)
    deadline = db.Column(db.DateTime)

    user = relationship("UserAuth", back_populates="user_goals")


class FamilyInvitation(Base, db.Model, SerializerMixin):
    __tablename__ = "family_invitations"

    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    family_id = db.Column(db.String(36), ForeignKey("families.id"))
    invited_email = db.Column(db.String(255), nullable=False)
    token = db.Column(db.String(255))
    accepted = db.Column(db.Boolean, default=False)
    sent_at = db.Column(db.DateTime)
    accepted_at = db.Column(db.DateTime)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(
        db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow
    )

    family = relationship("Family", back_populates="family_invitations")


class AccountIntegration(Base, db.Model, SerializerMixin):
    __tablename__ = "account_integrations"

    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = db.Column(db.String(36), ForeignKey("users.id"))
    provider_name = db.Column(db.String(255))
    access_token = db.Column(db.String(255))
    refresh_token = db.Column(db.String(255))
    expires_in = db.Column(db.BigInteger)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(
        db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow
    )

    user = relationship("UserAuth", back_populates="account_integrations")


class FinancialProfile(Base, db.Model, SerializerMixin):
    __tablename__ = "financial_profiles"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("user_auth.id"), nullable=False)
    annual_income = db.Column(db.Float)
    monthly_income = db.Column(db.Float)
    monthly_expenses = db.Column(db.JSON)
    savings_goal = db.Column(db.Float)
    current_savings = db.Column(db.Float)
    savings_goal_deadline = db.Column(db.DateTime)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(
        db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow
    )

    user = relationship("UserAuth", back_populates="financial_profiles")
