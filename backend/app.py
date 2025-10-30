# from flask import Flask, jsonify
# from flask_cors import CORS
# import mysql.connector

# app = Flask(__name__)
# CORS(app)  # allows all origins to access your API

# conn = mysql.connector.connect(
#     host="localhost",
#     user="mleal2",
#     password="Bepagy09_",
#     database="mleal2"
# )
# cursor = conn.cursor(dictionary=True)

# @app.route("/employees")
# def get_employees():
#     print("/employees endpoint hit")
#     cursor.execute("SELECT * FROM employees")
#     rows = cursor.fetchall()
#     return jsonify(rows)

# if __name__ == "__main__":
#     print("Flask app is starting up")
#     app.run(host="0.0.0.0", port=5000)

from flask import Flask, jsonify, request
from flask_cors import CORS
import mysql.connector
import bcrypt

app = Flask(__name__)
CORS(app)

conn = mysql.connector.connect(
    host="localhost",
    user="mleal2",
    password="Bepagy09_",
    database="mleal2"
)
cursor = conn.cursor(dictionary=True)
cursor.execute("SELECT * FROM employees")
rows = cursor.fetchall()
print("Initial employees data:", rows)

@app.route("/create-account", methods=["POST"])
def create_account():
    data = request.get_json()
    level = int(data.get("level"))

    hashed = bcrypt.hashpw(data.get("password").encode("utf-8"), bcrypt.gensalt())

    try:
        if level == 1:  # Employee
            first_name = data.get("first_name")
            last_name = data.get("last_name")
            email = data.get("email")

            cursor.execute("""
                INSERT INTO employees (level, first_name, last_name, email)
                VALUES (%s, %s, %s, %s)
            """, (level, first_name, last_name, email))
        elif level == 2:  # Organization
            name = data.get("name")
            email = data.get("email")
            phone_number = data.get("phone_number")

            cursor.execute("""
                INSERT INTO organizations (level, name, email, phone_number)
                VALUES (%s, %s, %s, %s)
            """, (level, name, email, phone_number))
        else:
            return jsonify({"error": "Invalid level"}), 400

        conn.commit()
        new_id = cursor.lastrowid

        cursor.execute("""
            INSERT INTO accounts (level, id, username, password)
            VALUES (%s, %s, %s, %s)
        """, (level, new_id, data.get("username"), hashed))
        conn.commit()

        return jsonify({"message": "Account created successfully", "id": new_id}), 201

    except Exception as e:
        print("Error:", e)
        conn.rollback()
        return jsonify({"error": str(e)}), 500


@app.route("/change-password", methods=["POST"])
def change_password():
    data = request.get_json()
    username = data.get("username")
    new_password = data.get("new_password")

    hashed = bcrypt.hashpw(new_password.encode("utf-8"), bcrypt.gensalt())

    try:
        cursor.execute("""
            UPDATE accounts
            SET password = %s
            WHERE username = %s
        """, (hashed, username))
        conn.commit()

        if cursor.rowcount == 0:
            return jsonify({"error": "Username not found"}), 404

        return jsonify({"message": "Password updated successfully"}), 200

    except Exception as e:
        print("Error:", e)
        conn.rollback()
        return jsonify({"error": str(e)}), 500
    

@app.route("/sign-in-authentication", methods=["POST"])
def sign_in_authentication():
    data = request.get_json()
    username = data.get("username")
    password = data.get("password")

    try:
        # Get both the hashed password and the level
        cursor.execute("""
            SELECT password, level FROM accounts WHERE username = %s
        """, (username,))
        result = cursor.fetchone()

        if result and bcrypt.checkpw(password.encode("utf-8"), result["password"].encode("utf-8")):
            # Successful login
            return jsonify({
                "message": "Authentication successful",
                "level": result["level"]
            }), 200
        else:
            # Invalid username or password
            return jsonify({"error": "Invalid username or password"}), 401

    except Exception as e:
        print("Error:", e)
        return jsonify({"error": str(e)}), 500
    

@app.route("/employees")
def get_employees():
    cursor.execute("SELECT * FROM employees")
    rows = cursor.fetchall()
    return jsonify(rows)


if __name__ == "__main__":
    print("Flask app is starting up")
    app.run(host="0.0.0.0", port=5000)

