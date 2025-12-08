from flask import Flask, request, jsonify, Response
from flask_cors import CORS
import mysql.connector
import bcrypt
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt, JWTManager
from flask_jwt_extended import create_access_token


app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}}, supports_credentials=True)
# CORS(app, resources={r"/*": {"origins": "*"}}, supports_credentials=True)
# CORS(app)

app.config["JWT_SECRET_KEY"] = "lealdiaztallmadge"  #use a secure random string in production
app.config["JWT_TOKEN_LOCATION"] = ["headers"]
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = 3600 #1 hr exp

@app.before_request
def handle_options():
    if request.method == "OPTIONS":
        return jsonify({}), 200
jwt = JWTManager(app)
# conn = mysql.connector.connect(
#     host="localhost",
#     user="mleal2",
#     password="Bepagy09_",
#     database="mleal2"
# )
# cursor = conn.cursor(dictionary=True)
# cursor.execute("SELECT * FROM employees")
# rows = cursor.fetchall()
# print("Initial employees data:", rows)

def get_db_connection():
    return mysql.connector.connect(
        host="localhost",
        user="mleal2",
        password="Bepagy09_",
        database="mleal2"
    )

@app.route("/create-account", methods=["POST"])
def create_account():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    data = request.get_json()
    level = int(data.get("level"))

    hashed = bcrypt.hashpw(data.get("password").encode("utf-8"), bcrypt.gensalt())
    hashed_str = hashed.decode("utf-8")
    print("current level:", level)
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
        elif level == 3:  # Customer
            first_name = data.get("first_name")
            last_name = data.get("last_name")
            email = data.get("email")
            phone_number = data.get("phone_number")

            cursor.execute("""
                INSERT INTO customers (level, first_name, last_name, email, phone_number)
                VALUES (%s, %s, %s, %s, %s)
            """, (level, first_name, last_name, email, phone_number))   
        else:
            return jsonify({"error": "Invalid level"}), 400

        conn.commit()
        new_id = cursor.lastrowid

        cursor.execute("""
            INSERT INTO accounts (level, id, username, password)
            VALUES (%s, %s, %s, %s)
        """, (level, new_id, data.get("username"), hashed_str))
        conn.commit()

        return jsonify({"message": "Account created successfully", "id": new_id}), 201

    except Exception as e:
        print("Error:", e)
        conn.rollback()
        return jsonify({"error": str(e)}), 500


@app.route("/change-password", methods=["POST"])
def change_password():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
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
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    data = request.get_json()
    username = data.get("username")
    password = data.get("password")

    try:
        # Get both the hashed password and the level
        cursor.execute("""
            SELECT password, level, id FROM accounts WHERE username = %s
        """, (username,))
        result = cursor.fetchone()
        passd = result["password"].encode("utf-8")
        if result and bcrypt.checkpw(password.encode("utf-8"), result["password"].encode("utf-8")):
            access_token = create_access_token(
                identity=str(result['id']),
                additional_claims={"role": result["level"]}
            )
            # Successful login
            return jsonify({
                "message": "Authentication successful",
                "access_token": access_token,
                "level": result["level"]
            }), 200
        else:
            # Invalid username or password
            return jsonify({"error": "Invalid username or password"}), 401

    except Exception as e:
        print("Error:", e)
        return jsonify({"error": str(e)}), 500
    

@app.route("/employees")
@jwt_required()
def get_employees():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM employees")
    rows = cursor.fetchall()
    return jsonify(rows)

@jwt_required()
@app.route("/employees/<int:employee_id>")
def get_employee_by_id(employee_id):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("Select * FROM employees where id = %s", (employee_id,))
    row = cursor.fetchone()
    if not row:
        return jsonify({"error": "Employee not found"}), 404
    return jsonify(row)


@app.route("/employees/<int:id>", methods=["PUT"])
def update_employee(id):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    data = request.get_json()
    required_fields = ["first_name", "last_name", "email"]
    for field in required_fields:
        if field not in data or not data[field]:
            return jsonify({"error": f"missing required field: {field}"}, 400)
    cursor.execute("UPDATE employees set first_name = %s, last_name = %s, email = %s where id = %s", (data["first_name"], data["last_name"], data["email"], id))
    conn.commit()
    return jsonify({"message": "Employee updated successfully"}), 200

@app.route("/employees/<int:id>", methods=["DELETE"])
@jwt_required()
def delete_employee(id):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    current_user = get_jwt_identity()
    claims = get_jwt()
    level = claims.get("level", 0)
    if level != 1:
        return jsonify({"Error": 'Not authorized'}), 403
    try:
        cursor.execute("Delete from employees where id = %s", (id,))
        conn.commit()
        
        if cursor.rowcount == 0:
            return jsonify({"error":"Employee not found"}), 404
        return jsonify({"message": "Employee Deleted successfully"}), 200
    except Exception as e:
        print("Error:", e)
        return jsonify({"error": str(e)}), 500

# @app.route("/organizations", methods = ["GET"])
# @jwt_required()
# def get_organizations():
#     """Return all organizations."""
#     conn = get_db_connection()
#     cursor = conn.cursor(dictionary=True)
#     print("/organizations endpoint hit")
#     current_user = get_jwt_identity()  
#     claims = get_jwt()

#     # if claims.get("role") != 1:
#     #     return jsonify({"error": "Access denied: insufficient permissions"}), 403

#     try:
#         cursor.execute("SELECT * FROM organizations")
#         rows = cursor.fetchall()
#         print("Organizations data retrieved:", rows)
#         return jsonify(rows), 200

#     except Exception as e:
#         print("Database error:", e)
#         return jsonify({"error": str(e)}), 500

@app.route("/organizations", methods=["GET"])
@jwt_required()
def get_organizations():
    """Return all organizations."""
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    print("/organizations endpoint hit")
    current_user = get_jwt_identity()  
    claims = get_jwt()

    try:
        # Don't select the image BLOB - just indicate if it exists
        cursor.execute("""
            SELECT 
                id, 
                level, 
                name, 
                email, 
                phone_number
            FROM organizations
        """)
        rows = cursor.fetchall()
        print("Organizations data retrieved:", rows)
        return jsonify(rows), 200

    except Exception as e:
        print("Database error:", e)
        return jsonify({"error": str(e)}), 500
    finally:
        cursor.close()
        conn.close()

@app.route("/organizations/<int:org_id>", methods=["GET"])
@jwt_required()
def get_organization(org_id):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    """Return one organization by ID."""
    try:
        claims = get_jwt()
        user_level = claims.get("role")
        user_id = get_jwt_identity()
        # Don't select the image BLOB
        cursor.execute("""
            SELECT 
                id, 
                level, 
                name, 
                email, 
                phone_number
            FROM organizations 
            WHERE id = %s
        """, (org_id,))
        row = cursor.fetchone()
        if not row:
            return jsonify({"error": "Organization not found"}), 404

        return jsonify(row), 200

    except Exception as e:
        print("Error:", e)
        return jsonify({"error": str(e)}), 500
@app.route("/organizations/<int:org_id>/orders", methods=["GET"])
def get_orders_by_org(org_id):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    try:
        cursor.execute("SELECT orders.id, orders.first_name, orders.last_name, orders.grade, orders.listing_id, orders.event_name, orders.date_purchased, orders.size, orders.qty, orders.paid, orders.picture FROM orders, listings, organizations WHERE organizations.id = %s and listings.organization_id = %s and orders.listing_id = listings.id", (org_id,org_id,))
        rows = cursor.fetchall()
        return jsonify(rows), 200
    except Exception as e:
        print("Error:", e)
        return jsonify({"error": str(e)}), 500

@app.route("/organizations/<int:org_id>/listings", methods=["GET"])
@jwt_required()
def get_listings_by_org(org_id):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    try:
        cursor.execute("SELECT * FROM listings WHERE organization_id = %s", (org_id,))
        rows = cursor.fetchall()
        return jsonify(rows), 200
    except Exception as e:
        print("Error:", e)
        return jsonify({"error": str(e)}), 500

@app.route("/organizations/listings/<int:listing_id>/orders", methods=["GET"])
@jwt_required()
def get_orders_by_listing(listing_id):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    try:
        cursor.execute("SELECT orders.* FROM listings, orders WHERE listings.id = %s and orders.listing_id = listings.id", (listing_id,))
        rows = cursor.fetchall()
        return jsonify(rows), 200
    except Exception as e:
        print("Error:", e)
        return jsonify({"error": str(e)}), 500


@app.route("/organizations", methods=["POST"])
@jwt_required()
def create_organization():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    """Create a new organization (restricted to role == 1)."""
    claims = get_jwt()
    role = claims.get("role", 0)

    if role != 1:
        return jsonify({"error": "Unauthorized"}), 403

    try:
        data = request.get_json()
        name = data.get("name")
        description = data.get("description", "")

        if not name:
            return jsonify({"error": "Organization name is required"}), 400

        cursor.execute(
            "INSERT INTO organizations (name, description) VALUES (%s, %s)",
            (name, description)
        )
        conn.commit()

        return jsonify({"message": "Organization created successfully"}), 201

    except Exception as e:
        print("Error:", e)
        return jsonify({"error": str(e)}), 500
@app.route("/sales/by-month", methods=["GET"])
@jwt_required()
def sales_by_month():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    claims = get_jwt()

    if claims.get("role", 0) != 1:
        return jsonify({"error": "Unauthorized"}), 403

    start = request.args.get("start")
    end = request.args.get("end")

    try:
        query = """
    SELECT 
        DATE_FORMAT(o.date_purchased, '%Y-%m') AS month,
        SUM(l.price * o.qty) AS totalSales
    FROM orders o
    JOIN listings l ON o.listing_id = l.id
    WHERE o.date_purchased >= %s
      AND o.date_purchased < %s
    GROUP BY month
    ORDER BY month
"""

        cursor.execute(query, (start, end))
        results = cursor.fetchall()

        # Convert Decimal to float
        for row in results:
            row["totalSales"] = float(row["totalSales"])

       
        return jsonify(results)

    except Exception as e:
        print("Error:", e)
        return jsonify({"error": str(e)}), 500

@app.route("/sales/by-org", methods=["GET"])
@jwt_required()
def sales_by_org_dates():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    claims = get_jwt()
    role = claims.get("role", 0)

    if role != 1:
        return jsonify({"error": "Unauthorized"}), 403
    start = request.args.get("start")
    end = request.args.get("end")
    if not start or not end:
        return jsonify({"error": "Missing start or end date"})
    try:
        cursor.execute("SELECT org.id AS organization_id, org.name AS organization_name, SUM(l.price * o.qty) AS totalSales FROM organizations AS org JOIN listings AS l ON org.id = l.organization_id JOIN orders AS o ON o.listing_id = l.id WHERE o.date_purchased BETWEEN %s AND %s GROUP BY org.id, org.name ORDER BY totalSales DESC", (start, end))
        
        results = cursor.fetchall()
        for row in results:
            row["totalSales"] = float(row["totalSales"])

        print(results)
        return jsonify(results), 200
    except Exception as e:
        print("Error:", e)
        return jsonify({"error": str(e)}), 500
    

@app.route("/organizations/<int:org_id>", methods=["PUT"])
@jwt_required()
def update_organization(org_id):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    """Update organization (restricted to role == 1)."""
    claims = get_jwt()
    role = claims.get("role", 0)

    if role != 1:
        return jsonify({"error": "Unauthorized"}), 403

    try:
        data = request.get_json()
        name = data.get("name")
        description = data.get("description")

        cursor.execute("SELECT id FROM organizations WHERE id = %s", (org_id,))
        if cursor.fetchone() is None:
            return jsonify({"error": "Organization not found"}), 404

        cursor.execute(
            "UPDATE organizations SET name = %s, description = %s WHERE id = %s",
            (name, description, org_id)
        )
        conn.commit()

        return jsonify({"message": "Organization updated successfully"}), 200
        

    except Exception as e:
        print("Error:", e)
        return jsonify({"error": str(e)}), 500

@app.route("/organizations/<int:org_id>/listings", methods=["POST"])
@jwt_required()
def create_listing(org_id):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    try:
        data = request.get_json()
        event_name = data.get("event_name")
        description = data.get("description")
        price = data.get("price")
        qty = data.get("qty")
        date_closure = data.get("date_closure")

        if not event_name or not description or price is None:
            return jsonify({"error": "Missing required fields"}), 400

        # Insert into MySQL
        cursor.execute(
            """
            INSERT INTO listings
            (event_name, description, price, qty, date_closure, organization_id, state, date_created)
            VALUES (%s, %s, %s, %s, %s, %s, 'pending', NOW())
            """,
            (event_name, description, price, qty, date_closure, org_id)
        )
        conn.commit()

        return jsonify({"message": "Listing created successfully"}), 201

    except Exception as e:
        print("Error creating listing:", e)
        return jsonify({"error": str(e)}), 500
    
@app.route("/organizations/listings/<int:listing_id>", methods=["DELETE"])
@jwt_required()
def delete_listing(listing_id):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    print("Delete listing endpoint hit")
    print("Listing ID to delete:", listing_id)
    try:
        # cursor.execute("DELETE FROM listings WHERE id = %s", (listing_id,))
        # conn.commit()
        cursor.execute("""
            UPDATE listings
            SET state = 'closed', date_closure = NOW()
            WHERE id = %s
        """, (listing_id,))
        conn.commit()

        if cursor.rowcount == 0:
            return jsonify({"error": "Listing not found"}), 404

        return jsonify({"message": "Listing deleted successfully"}), 200

    except Exception as e:
        print("Error deleting listing:", e)
        return jsonify({"error": str(e)}), 500
    

@app.route("/organizations/listings/<int:listing_id>", methods=["PUT"])
@jwt_required()
def update_listing(listing_id):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    print("Update listing endpoint hit")
    try:
        data = request.get_json()
        event_name = data.get("event_name")
        description = data.get("description")
        price = data.get("price")
        # qty = data.get("qty")
        qty = data.get("qty")
        if qty == "" or qty is None:
            qty = None
        else:
            qty = int(qty)
        date_closure = data.get("date")
        state = "pending"  # or derive from data if needed
        cursor.execute(
            """
            UPDATE listings
            SET event_name=%s,
                `state`=%s,
                description=%s,
                price=%s,
                qty=%s,
                date_closure=%s
            WHERE id=%s
            """,
            (event_name, "pending", description, price, qty, date_closure, listing_id)
        )
        conn.commit()

        if cursor.rowcount == 0:
            return jsonify({"error": "Listing not found"}), 404

        return jsonify({"message": "Listing updated successfully"}), 200

    except Exception as e:
        print("Error updating listing:", e)
        return jsonify({"error": str(e)}), 500

@app.route("/organizations/<int:org_id>", methods=["DELETE"])
@jwt_required()
def delete_organization(org_id):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    """Delete organization (restricted to role == 1)."""
    claims = get_jwt()
    role = claims.get("role", 0)

    if role != 1:
        return jsonify({"error": "Unauthorized"}), 403

    try:
        cursor.execute("SELECT id FROM organizations WHERE id = %s", (org_id,))
        if cursor.fetchone() is None:
            return jsonify({"error": "Organization not found"}), 404

        cursor.execute("DELETE FROM organizations WHERE id = %s", (org_id,))
        conn.commit()

        return jsonify({"message": "Organization deleted successfully"}), 200

    except Exception as e:
        print("Error:", e)
        return jsonify({"error": str(e)}), 500
    

@app.route("/customer/<int:customer_id>", methods=["GET"])
@jwt_required()
def get_customer_by_id(customer_id):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    print("Get customer by ID endpoint hit")
    try:
        cursor.execute("SELECT * FROM customers WHERE id = %s", (customer_id,))
        row = cursor.fetchone()
        if not row:
            return jsonify({"error": "Customer not found"}), 404

        print(jsonify(row))
        print("Customer data retrieved:", row)
        return jsonify(row), 200

    except Exception as e:
        print("Error:", e)
        return jsonify({"error": str(e)}), 500
    
@app.route("/api/organizations/<int:org_id>/image", methods=["GET"])
def get_organization_image(org_id):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    # org_id = 9
    try:
        cursor.execute("""
            SELECT image FROM organizations WHERE id = %s
        """, (org_id,))
        
        result = cursor.fetchone()
        
        if result and result['image']:
            return result['image'], 200
        else:
            return jsonify({"error": "Image not found"}), 404
            
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        cursor.close()
        conn.close()


# export function getAllListings(token) {
#   return apiRequest(`/listings`, "GET", null, token);
# }
@app.route("/customer-all-listings", methods=["GET"])
def get_all_listings():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    print("Get all listings endpoint hit")
    try:
        cursor.execute("SELECT * FROM listings WHERE state = 'pending'")
        rows = cursor.fetchall()
        print("Listings data retrieved:", rows)
        return jsonify(rows), 200

    except Exception as e:
        print("Error:", e)
        return jsonify({"error": str(e)}), 500

@app.route("/add_order", methods=["POST"])
def create_order():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    try:
        data = request.get_json()
        first_name = data.get("first_name")
        last_name = data.get("last_name")
        grade = data.get("grade")
        size = data.get("size", "none")
        qty = data.get("qty", 1)
        listing_id = data.get("listing_id")
        event_name = data.get("event_name")
        paid = data.get("price")
        picture = data.get("picture", "")
        status = data.get("status")
        owner_id = data.get("owner_id")

        if not first_name or not last_name or not grade or not listing_id or not event_name or paid is None:
            return jsonify({"error": "Missing required fields"}), 400

        cursor.execute(
            """
            INSERT INTO orders
            (first_name, last_name, grade, size, qty, listing_id, event_name, paid, picture, status, owner_id, date_purchased)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, NOW())
            """,
            (first_name, last_name, grade, size, qty, listing_id, event_name, paid, picture, status, owner_id)
        )

        if size:
            cursor.execute(
                "UPDATE listings SET qty = qty - %s WHERE id = %s AND qty IS NOT NULL",
                (qty, listing_id)
            )
        conn.commit()

        return jsonify({"message": "Order created successfully"}), 201

    except Exception as e:
        print("Error creating order:", e)
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    print("Flask app is starting up")
    app.run(host="0.0.0.0", port=5000)

