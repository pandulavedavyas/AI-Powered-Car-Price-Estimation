import os
import sqlite3
import pickle
from flask import Flask, render_template, request, jsonify, redirect, url_for

app = Flask(__name__)
app.secret_key = 'cinematic_automotive_key'

DATABASE = os.path.join(os.path.dirname(__file__), 'database', 'cars.db')

def get_db():
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row
    return conn

# Load ML Model
model_path = os.path.join(os.path.dirname(__file__), 'model', 'car_price_model.pkl')
ml_data = None
try:
    with open(model_path, 'rb') as f:
        ml_data = pickle.load(f)
except Exception as e:
    print("Model not loaded. Ensure it is at model/car_price_model.pkl. Error:", e)

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/predict', methods=['GET', 'POST'])
def predict():
    if request.method == 'POST':
        if not ml_data:
            return render_template('result.html', error="Model not loaded. Try again later.")
            
        try:
            brand = request.form.get('brand')
            model_name = request.form.get('model')
            year = int(request.form.get('year'))
            fuel = request.form.get('fuel')
            transmission = request.form.get('transmission')
            kms = int(request.form.get('kms'))
            seller = request.form.get('owner_type', 'Dealer')
            
            # Label encoding transforming
            def safe_transform(le, val):
                if val in le.classes_:
                    return le.transform([val])[0]
                return le.transform([le.classes_[0]])[0]
                
            fuel_enc = safe_transform(ml_data['le_fuel'], fuel)
            seller_enc = safe_transform(ml_data['le_seller'], seller)
            trans_enc = safe_transform(ml_data['le_trans'], transmission)
            
            # Predict
            X_pred = [[year, kms, fuel_enc, seller_enc, trans_enc]]
            
            model = ml_data['model']
            predicted_price = model.predict(X_pred)[0]
            predicted_price = round(predicted_price, 2)
            
            car_name = f"{brand} {model_name}"
            
            return render_template('result.html', 
                                   predicted_price=predicted_price,
                                   car_name=car_name)
                                   
        except Exception as e:
            print("Prediction error:", e)
            return render_template('result.html', error="An error occurred during prediction.")
            
    return render_template('predict.html')

if __name__ == '__main__':
    debug_mode = os.environ.get('FLASK_ENV') == 'development'
    port = int(os.environ.get('PORT', 5000))
    
    if debug_mode:
        print("Starting Flask app in DEBUG mode on http://localhost:5000")
        print("Press CTRL+C to stop the server")
        app.run(debug=True, port=port, host='127.0.0.1')
    else:
        print(f"Starting Flask app in PRODUCTION mode on port {port}")
        app.run(debug=False, port=port, host='0.0.0.0')
