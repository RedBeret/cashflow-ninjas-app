import logging
import os
import time
from datetime import datetime
from pathlib import Path

import bcrypt
import openai
from dotenv import find_dotenv, load_dotenv
from flask import jsonify, make_response, render_template, request, session
from flask_bcrypt import Bcrypt
from flask_marshmallow import fields
from flask_restful import Resource
from marshmallow import fields, validate
from models import (
    ChatMessage,
    Family,
    FinancialProfile,
    Transaction,
    UserAuth,
    UserSession,
    db,
)

from config import api, app, db, ma

#!/usr/bin/env python3


BASE_DIR = os.path.abspath(os.path.dirname(__file__))
DATABASE = os.environ.get(
    "DATABASE_URI", f"sqlite:///{os.path.join(BASE_DIR, 'instance', 'app.db')}"
)

app.config.update(
    SECRET_KEY=os.getenv("SECRET_KEY", "default_secret_key"),
    SESSION_TYPE="filesystem",
    SQLALCHEMY_DATABASE_URI=os.getenv("DATABASE_URI"),
    SQLALCHEMY_TRACK_MODIFICATIONS=False,
)

bcrypt = Bcrypt(app)

script_dir = Path(__file__).parent
file_path = script_dir / "data" / "support_guide.txt"
client = openai.OpenAI()
model = "gpt-3.5-turbo-16k"


@app.route("/")
def index():
    return render_template("index.html")


@app.errorhandler(404)
def not_found(e):
    return render_template("index.html")


# User Authentication Resources
# ------------------------------
class FamilySchema(ma.SQLAlchemyAutoSchema):
    members = fields.Nested(
        "UserAuthSchema", many=True, exclude=("family", "family_id")
    )

    class Meta:
        model = Family
        load_instance = True


class UserAuthSchema(ma.SQLAlchemyAutoSchema):
    family = fields.Nested(FamilySchema, exclude=("members",))

    class Meta:
        model = UserAuth
        load_instance = True
        exclude = ("password_hash",)

    password = fields.Str(
        load_only=True, required=True, validate=validate.Length(min=6)
    )


class UserAuthResource(Resource):
    """
    RESTful resource for managing UserAuth entities, supporting operations like retrieval, creation, and deletion of user accounts.
    """

    def get(self):
        """Fetches and returns all user accounts, excluding sensitive password hashes."""
        users = UserAuth.query.all()
        user_schema = UserAuthSchema(many=True, only=["id", "username", "email"])
        return make_response(jsonify(user_schema.dump(users)), 200)


class UserAuthResource(Resource):
    """
    RESTful resource for managing UserAuth entities, supporting operations like retrieval, creation, and deletion of user accounts.
    """

    def post(self):
        """Creates a new user account with provided username, email, and password."""
        user_data = request.get_json()

        if not user_data:
            return make_response(jsonify({"error": "No input data provided"}), 400)

        username = user_data.get("username").lower()
        email = user_data.get("email")
        password = user_data.get("password")

        if not all([username, email, password]):
            return make_response(
                jsonify({"error": "Missing username, email, or password"}), 400
            )

        if len(password) < 6:
            return make_response(
                jsonify({"error": "Password must be at least 6 characters long"}), 400
            )

        if UserAuth.query.filter_by(username=username).first():
            return make_response(jsonify({"error": "Username already exists"}), 409)

        if UserAuth.query.filter_by(email=email).first():
            return make_response(jsonify({"error": "Email already exists"}), 409)

        hashed_password = bcrypt.generate_password_hash(password).decode("utf-8")

        # Include default values for is_admin, can_view_all_accounts, and mfa_enabled
        new_user = UserAuth(
            username=username,
            email=email,
            password_hash=hashed_password,
            is_admin=False,
            can_view_all_accounts=False,
            mfa_enabled=False,
        )
        db.session.add(new_user)
        db.session.commit()

        new_user_session = UserSession(
            user_id=new_user.id, started_at=datetime.utcnow()
        )
        db.session.add(new_user_session)
        db.session.commit()

        session["user_id"] = new_user.id
        session["username"] = new_user.username
        session["logged_in"] = True
        session["session_id"] = new_user_session.id

        return make_response(
            jsonify(
                {
                    "message": "User created successfully and logged in",
                    "id": new_user.id,
                    "username": new_user.username,
                    "email": new_user.email,
                    "session_id": new_user_session.id,
                    "is_admin": new_user.is_admin,
                    "can_view_all_accounts": new_user.can_view_all_accounts,
                    "mfa_enabled": new_user.mfa_enabled,
                }
            ),
            201,
        )

    def delete(self):
        """Deletes a user account after verifying provided credentials."""
        try:
            data = request.get_json()
            if not all(key in data for key in ("username", "password")):
                return make_response(
                    {"error": "Username and password are required"}, 400
                )

            username = data["username"].lower()
            password = data["password"]

            user = UserAuth.query.filter_by(username=username).first()

            if user and bcrypt.check_password_hash(user.password_hash, password):
                db.session.delete(user)
                db.session.commit()
                session.clear()
                return make_response({"message": "User deleted successfully"}, 200)
            elif user:
                return make_response({"error": "Incorrect password"}, 401)
            else:
                return make_response({"error": "User not found"}, 404)
        except Exception as error:
            return make_response({"error": str(error)}, 500)

    def patch(self):
        """Updates a user's password after verifying the current password."""
        data = request.get_json()
        username = data["username"].lower()
        user = UserAuth.query.filter_by(username=username).first()
        if user and bcrypt.check_password_hash(user.password_hash, data["password"]):
            user.password_hash = bcrypt.generate_password_hash(
                data["newPassword"]
            ).decode("utf-8")
            db.session.commit()
            return make_response({"message": "Password updated successfully"}, 200)
        else:
            return make_response({"error": "Invalid credentials"}, 401)


class UserLoginResource(Resource):
    """
    Handles user login requests by validating provided credentials.
    Successful login creates a user session.
    """

    def post(self):
        """Authenticates user with provided username and password, creating a session on success."""

        data = request.get_json()
        if not data or "username" not in data or "password" not in data:
            return make_response(
                jsonify({"error": "Username and password are required"}), 400
            )

        user = UserAuth.query.filter_by(username=data["username"].lower()).first()
        if user and user.check_password(data["password"]):
            session["user_id"] = user.id
            session["username"] = user.username
            session["logged_in"] = True

            new_user_session = UserSession(
                user_id=user.id, started_at=datetime.utcnow()
            )
            db.session.add(new_user_session)
            db.session.commit()

            session["session_id"] = new_user_session.id

            response_data = {
                "message": "Login successful",
                "user_id": user.id,
                "username": user.username,
                "email": user.email,
                "session_id": new_user_session.id,
                "is_admin": user.is_admin,
                "can_view_all_accounts": user.can_view_all_accounts,
                "mfa_enabled": user.mfa_enabled,
            }

            return make_response(jsonify(response_data), 200)
        else:
            return make_response(
                jsonify({"error": "Invalid username or password"}), 401
            )


class UserLogoutResource(Resource):
    def post(self):
        user_id = session.get("user_id")

        if user_id:
            current_session = (
                UserSession.query.filter_by(user_id=user_id, ended_at=None)
                .order_by(UserSession.started_at.desc())
                .first()
            )
            if current_session:
                current_session.ended_at = datetime.utcnow()
                db.session.commit()

        session.clear()

        response = make_response(jsonify({"message": "Logout successful"}), 200)
        response.set_cookie("session", "", expires=0)
        return response


class SessionCheckResource(Resource):
    def get(self):
        user_id = session.get("user_id")
        if user_id:
            user = UserAuth.query.get(user_id)
            if user:
                return (
                    jsonify(
                        {
                            "authenticated": True,
                            "id": user.id,
                            "username": user.username,
                            "email": user.email,
                        }
                    ),
                    200,
                )
            else:
                return (
                    jsonify({"authenticated": False, "message": "User not found"}),
                    404,
                )
        else:
            return jsonify({"authenticated": False}), 200


class ChatMessageSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = ChatMessage
        load_instance = True
        fields = (
            "id",
            "user_id",
            "message",
            "response",
            "request_data",
            "response_data",
            "timestamp",
        )


chat_message_schema = ChatMessageSchema()


def read_support_guide(file_path=file_path):
    try:
        with open(file_path, "r", encoding="utf-8") as file:
            support_guide = file.read()
        return support_guide
    except FileNotFoundError:
        print(f"The file {file_path} was not found.")
    except Exception as e:
        print(f"An error occurred while reading the file: {e}")
    return ""


def get_completion(
    user_id, user_message, model="gpt-3.5-turbo", temperature=0.7, max_tokens=150
):
    last_messages = (
        ChatMessage.query.filter_by(user_id=user_id)
        .order_by(ChatMessage.timestamp.desc())
        .limit(3)
        .all()
    )
    support_guide = read_support_guide()

    messages = (
        [
            {"role": "system", "content": support_guide},
        ]
        + [
            {
                "role": "user" if msg.user_id == user_id else "assistant",
                "content": msg.message or msg.response,
            }
            for msg in reversed(last_messages)
        ]
        + [
            {"role": "user", "content": user_message},
        ]
    )

    try:
        response = client.chat.completions.create(
            model=model,
            messages=messages,
            temperature=temperature,
            max_tokens=max_tokens,
        )
        if response.choices and response.choices[0].message:
            return response.choices[0].message.content.strip()
    except Exception as e:
        print(f"Error: {e}")
    return None


@app.route("/api/chat_messages", methods=["POST"])
def chat():
    user_id = session.get("user_id")
    if not user_id:
        return jsonify({"error": "You must be signed in to send messages."}), 403

    current_session = (
        UserSession.query.filter_by(user_id=user_id, ended_at=None)
        .order_by(UserSession.started_at.desc())
        .first()
    )
    session_id = current_session.id if current_session else None

    data = request.json
    user_message = data.get("message")
    if not user_message:
        return jsonify({"error": "No message provided."}), 400

    ai_response = get_completion(user_id, user_message)

    if ai_response:
        new_chat_message = ChatMessage(
            user_id=user_id,
            session_id=session_id,
            message=user_message,
            response=ai_response,
        )

        db.session.add(new_chat_message)
        db.session.commit()

        result = chat_message_schema.dump(new_chat_message)
        return jsonify(result), 200
    else:
        return jsonify({"error": "Failed to get response from AI"}), 500


@app.route("/api/continue_last_conversation", methods=["GET"])
def continue_last_conversation():
    user_id = session.get("user_id")
    if not user_id:
        return jsonify({"error": "User not logged in."}), 401

    last_session_id = (
        db.session.query(ChatMessage.session_id)
        .filter(ChatMessage.user_id == user_id)
        .order_by(ChatMessage.timestamp.desc())
        .first()
    )

    if not last_session_id:
        return jsonify({"error": "No previous session found."}), 404

    last_session_id = last_session_id[0]
    last_session = UserSession.query.get(last_session_id)

    if not last_session:
        return jsonify({"error": "No previous session found."}), 404

    chat_messages = (
        ChatMessage.query.filter_by(session_id=last_session_id)
        .order_by(ChatMessage.timestamp.asc())
        .all()
    )

    if not chat_messages:
        return jsonify({"message": "No messages found in the last session."}), 200

    messages = []
    for chat_message in chat_messages:
        user_message = {"sender": "user", "text": chat_message.message}
        ai_response = {"sender": "bot", "text": chat_message.response}
        messages.extend([user_message, ai_response])

    return jsonify({"session_id": last_session.id, "messages": messages}), 200


@app.route("/api/families", methods=["GET", "POST"])
def handle_families():
    if request.method == "GET":
        families = Family.query.all()
        families_data = [
            {"id": family.id, "family_name": family.family_name} for family in families
        ]
        return jsonify(families_data)

    if request.method == "POST":
        data = request.get_json()
        family_name = data.get("family_name")

        if not family_name:
            return jsonify({"error": "Missing family name"}), 400

        new_family = Family(family_name=family_name)
        db.session.add(new_family)
        db.session.commit()

        return (
            jsonify({"id": new_family.id, "family_name": new_family.family_name}),
            201,
        )


@app.route("/api/transactions", methods=["GET", "POST"])
def handle_transactions():
    if request.method == "GET":
        transactions = Transaction.query.all()
        transactions_data = [
            {
                "id": transaction.id,
                "account_id": transaction.account_id,
                "amount": transaction.amount,
                "transaction_type": transaction.transaction_type,
                "category_id": transaction.category_id,
                "description": transaction.description,
                "transaction_date": transaction.transaction_date.isoformat(),
            }
            for transaction in transactions
        ]
        return jsonify(transactions_data)

    if request.method == "POST":
        data = request.get_json()
        account_id = data.get("account_id")
        amount = data.get("amount")
        transaction_type = data.get("transaction_type")
        category_id = data.get("category_id")
        description = data.get("description")
        transaction_date = data.get("transaction_date", datetime.utcnow())

        if not all([account_id, amount, transaction_type, category_id, description]):
            return jsonify({"error": "Missing required transaction details"}), 400

        new_transaction = Transaction(
            account_id=account_id,
            amount=amount,
            transaction_type=transaction_type,
            category_id=category_id,
            description=description,
            transaction_date=datetime.strptime(transaction_date, "%Y-%m-%dT%H:%M:%S"),
        )
        db.session.add(new_transaction)
        db.session.commit()

        return (
            jsonify(
                {
                    "id": new_transaction.id,
                    "account_id": new_transaction.account_id,
                    "amount": new_transaction.amount,
                    "transaction_type": new_transaction.transaction_type,
                    "category_id": new_transaction.category_id,
                    "description": new_transaction.description,
                    "transaction_date": new_transaction.transaction_date.isoformat(),
                }
            ),
            201,
        )


@app.route("/api/financial_profiles", methods=["GET"])
def get_financial_profile():
    if "user_id" not in session:
        return jsonify({"error": "Authentication required"}), 401

    user_id = session["user_id"]
    financial_profile = FinancialProfile.query.filter_by(user_id=user_id).first()
    if not financial_profile:
        return jsonify({"error": "Financial profile not found"}), 404

    profile_data = {
        "annual_income": financial_profile.annual_income,
        "monthly_income": financial_profile.monthly_income,
        "savings_goal": financial_profile.savings_goal,
        "current_savings": financial_profile.current_savings,
        "savings_goal_deadline": financial_profile.savings_goal_deadline.strftime(
            "%Y-%m-%d"
        ),
    }

    return jsonify(profile_data)


@app.route("/api/financial_profiles", methods=["POST"])
def create_financial_profile():
    if "user_id" not in session:
        return jsonify({"error": "Authentication required"}), 401

    data = request.json
    required_fields = [
        "annual_income",
        "monthly_income",
        "savings_goal",
        "current_savings",
        "savings_goal_deadline",
    ]
    if not all(field in data for field in required_fields):
        return jsonify({"error": "Missing required financial profile details"}), 400

    user_id = session["user_id"]
    financial_profile = FinancialProfile(
        user_id=user_id,
        annual_income=data["annual_income"],
        monthly_income=data["monthly_income"],
        savings_goal=data["savings_goal"],
        current_savings=data["current_savings"],
        savings_goal_deadline=datetime.strptime(
            data["savings_goal_deadline"], "%Y-%m-%d"
        ),
    )
    db.session.add(financial_profile)
    db.session.commit()

    return jsonify({"message": "Financial profile created successfully"}), 201


api.add_resource(UserLoginResource, "/api/login")
api.add_resource(UserLogoutResource, "/api/logout")
api.add_resource(UserAuthResource, "/api/user_auth")
api.add_resource(SessionCheckResource, "/api/check_session")


if __name__ == "__main__":
    app.run(port=5555, debug=True)
