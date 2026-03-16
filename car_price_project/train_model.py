import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import LabelEncoder
import pickle
import os

def train():
    # Load the CSV
    csv_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'cars_price_prediction.csv')
    df = pd.read_csv(csv_path, header=None)
    
    # Adding headers since original csv didn't have them
    df.columns = ['Name', 'Year', 'Price', 'Kms_Driven', 'Fuel_Type', 'Seller_Type', 'Transmission', 'Owner']
    
    # Drop Name and Owner for simplicity
    X = df[['Year', 'Kms_Driven', 'Fuel_Type', 'Seller_Type', 'Transmission']]
    y = df['Price']
    
    # Label encode categorical
    le_fuel = LabelEncoder()
    le_seller = LabelEncoder()
    le_trans = LabelEncoder()
    
    X['Fuel_Type'] = le_fuel.fit_transform(X['Fuel_Type'])
    X['Seller_Type'] = le_seller.fit_transform(X['Seller_Type'])
    X['Transmission'] = le_trans.fit_transform(X['Transmission'])
    
    model = RandomForestRegressor(n_estimators=100, random_state=42)
    model.fit(X, y)
    
    # Save the model and encoders
    project_dir = os.path.dirname(__file__)
    model_path = os.path.join(project_dir, 'model.pkl')
    
    with open(model_path, 'wb') as f:
        pickle.dump({
            'model': model,
            'le_fuel': le_fuel,
            'le_seller': le_seller,
            'le_trans': le_trans
        }, f)
        
    print("Model trained and saved to", model_path)

if __name__ == '__main__':
    train()
