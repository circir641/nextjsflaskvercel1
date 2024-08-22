import unittest
from server import app, items_store, item_id_counter  
from flask import jsonify


class FlaskTestCase(unittest.TestCase):
    
    @classmethod
    def setUpClass(cls):
        cls.app = app
        cls.client = cls.app.test_client()
        cls.app.testing = True

    def setUp(self):
        # Reset the in-memory data before each test
        global items_store, item_id_counter
        items_store = {}
        item_id_counter = 1

    def test_login(self):
        response = self.client.post('/api/login', json={'username': 'user', 'password': 'user'})
        self.assertEqual(response.status_code, 200)
        self.assertIn('access_token', response.json)

    def test_create_item(self):
        # First login to get the token
        login_response = self.client.post('/api/login', json={'username': 'user', 'password': 'user'})
        token = login_response.json['access_token']
        headers = {'Authorization': f'Bearer {token}'}
        
        response = self.client.post('/api/items', json={'name': 'Item1', 'description': 'Description1', 'price': 10.0}, headers=headers)
        self.assertEqual(response.status_code, 201)
        self.assertIn('id', response.json)

    def test_get_items(self):
        # Add an item first
        login_response = self.client.post('/api/login', json={'username': 'user', 'password': 'user'})
        token = login_response.json['access_token']
        headers = {'Authorization': f'Bearer {token}'}
        
        self.client.post('/api/items', json={'name': 'Item1', 'description': 'Description1', 'price': 10.0}, headers=headers)
        response = self.client.get('/api/items', headers=headers)
        self.assertEqual(response.status_code, 200)
        self.assertGreater(len(response.json), 0)

    def test_get_item(self):
        # Add an item first
        login_response = self.client.post('/api/login', json={'username': 'user', 'password': 'user'})
        token = login_response.json['access_token']
        headers = {'Authorization': f'Bearer {token}'}
        
        post_response = self.client.post('/api/items', json={'name': 'Item1', 'description': 'Description1', 'price': 10.0}, headers=headers)
        item_id = post_response.json['id']
        
        response = self.client.get(f'/api/items/{item_id}', headers=headers)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json['name'], 'Item1')

    def test_update_item(self):
        # Add an item first
        login_response = self.client.post('/api/login', json={'username': 'user', 'password': 'user'})
        token = login_response.json['access_token']
        headers = {'Authorization': f'Bearer {token}'}
        
        post_response = self.client.post('/api/items', json={'name': 'Item1', 'description': 'Description1', 'price': 10.0}, headers=headers)
        item_id = post_response.json['id']
        
        response = self.client.put(f'/api/items/{item_id}', json={'name': 'Updated Item', 'description': 'Updated Description', 'price': 15.0}, headers=headers)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json['name'], 'Updated Item')

    def test_delete_item(self):
        # Add an item first
        login_response = self.client.post('/api/login', json={'username': 'user', 'password': 'user'})
        token = login_response.json['access_token']
        headers = {'Authorization': f'Bearer {token}'}
        
        post_response = self.client.post('/api/items', json={'name': 'Item1', 'description': 'Description1', 'price': 10.0}, headers=headers)
        item_id = post_response.json['id']
        
        response = self.client.delete(f'/api/items/{item_id}', headers=headers)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json['result'], 'Item deleted')

if __name__ == '__main__':
    unittest.main()
