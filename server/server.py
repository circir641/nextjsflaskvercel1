from flask import Flask, jsonify, request, abort
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token, jwt_required
from werkzeug.security import generate_password_hash, check_password_hash

app = Flask(__name__)
CORS(app)

app.config['JWT_SECRET_KEY'] = '75e4bc355e117c6a3d07e7fa19ab024241fd156558f63dce080f6db726efe95b'
jwt = JWTManager(app)

items_store = {}
item_id_counter = 1
users_store = {
    'user': generate_password_hash('user')  
}

@app.route("/api/login", methods=["POST"])
def login():
    username = request.json.get('username', None)
    password = request.json.get('password', None)

    user_password_hash = users_store.get(username, None)
    if user_password_hash is None or not check_password_hash(user_password_hash, password):
        return jsonify({"error": "Invalid username or password"}), 401

    access_token = create_access_token(identity=username)
    return jsonify(access_token=access_token)

@app.route("/api/home", methods=["GET"])
@jwt_required()
def return_home():
    return jsonify({'message': "hello"})

@app.route("/api/items", methods=["GET"])
@jwt_required()
def get_items():
    return jsonify(list(items_store.values()))

@app.route("/api/items", methods=["POST"])
@jwt_required()
def create_item():
    global item_id_counter
    item_data = request.json

    if 'name' not in item_data or 'description' not in item_data or 'price' not in item_data:
        return jsonify({"error": "Missing required fields"}), 400

    if not item_data['name'].strip() or not item_data['description'].strip():
        return jsonify({"error": "Name and Description cannot be empty"}), 400

    try:
        price = float(item_data['price'])
    except ValueError:
        return jsonify({"error": "Price must be a number"}), 400

    if price <= 0:
        return jsonify({"error": "Price must be greater than zero"}), 400

    item = {
        'id': item_id_counter,
        'name': item_data['name'],
        'description': item_data['description'],
        'price': price
    }

    items_store[item_id_counter] = item
    item_id_counter += 1

    return jsonify(item), 201

@app.route("/api/items/<int:item_id>", methods=["GET"])
@jwt_required()
def get_item(item_id):
    item = items_store.get(item_id)
    if item is None:
        abort(404, description="Item not found")
    return jsonify(item)

@app.route("/api/items/<int:item_id>", methods=["PUT"])
@jwt_required()
def update_item(item_id):
    item = items_store.get(item_id)
    if item is None:
        abort(404, description="Item not found")

    item_data = request.json

    if 'name' not in item_data or 'description' not in item_data or 'price' not in item_data:
        return jsonify({"error": "Missing required fields"}), 400

    if not item_data['name'].strip() or not item_data['description'].strip():
        return jsonify({"error": "Name and Description cannot be empty"}), 400

    try:
        price = float(item_data['price'])
    except ValueError:
        return jsonify({"error": "Price must be a number"}), 400

    if price <= 0:
        return jsonify({"error": "Price must be greater than zero"}), 400

    item['name'] = item_data['name']
    item['description'] = item_data['description']
    item['price'] = price

    return jsonify(item)

@app.route("/api/items/<int:item_id>", methods=["DELETE"])
@jwt_required()
def delete_item(item_id):
    item = items_store.pop(item_id, None)
    if item is None:
        abort(404, description="Item not found")
    return jsonify({'result': 'Item deleted'})

if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0', port=5000)
