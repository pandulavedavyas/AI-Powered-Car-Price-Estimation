import sqlite3
import os

db_path = os.path.join(os.path.dirname(__file__), 'cars.db')

def init_db():
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()

    # Drop existing to reset data
    cursor.execute('DROP TABLE IF EXISTS Cars')
    cursor.execute('DROP TABLE IF EXISTS Owners')
    cursor.execute('DROP TABLE IF EXISTS Users')
    cursor.execute('DROP TABLE IF EXISTS Messages')

    # Users Table
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS Users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE,
        phone TEXT,
        location TEXT,
        login_method TEXT
    )
    ''')

    # Owners Table
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS Owners (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        contact TEXT,
        city TEXT
    )
    ''')

    # Cars Table
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS Cars (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        brand TEXT NOT NULL,
        year INTEGER,
        engine_type TEXT,
        transmission TEXT,
        price INTEGER,
        mileage INTEGER,
        fuel_efficiency TEXT,
        image_url TEXT,
        owner_id INTEGER,
        FOREIGN KEY (owner_id) REFERENCES Owners (id)
    )
    ''')

    # Messages Table
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS Messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT,
        message TEXT,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    )
    ''')

    # Insert sample Owners
    cursor.execute("INSERT INTO Owners (name, contact, city) VALUES ('John Doe', '1234567890', 'New York')")
    cursor.execute("INSERT INTO Owners (name, contact, city) VALUES ('Jane Smith', '0987654321', 'Los Angeles')")
        
    # Insert sample Cars with accurate Unsplash images
    cars_data = [
        ('BMW M2', 'BMW', 2021, 'Petrol', 'Automatic', 6000000, 15000, '12 kmpl', 'https://images.unsplash.com/photo-1555353540-64580b51c258?auto=format&fit=crop&q=80', 1),
        ('Ford Mustang', 'Ford', 2020, 'Petrol', 'Automatic', 7500000, 20000, '8 kmpl', 'https://images.unsplash.com/photo-1584345611124-28b3ce3c32e1?auto=format&fit=crop&q=80', 2),
        ('Audi A4', 'Audi', 2019, 'Diesel', 'Automatic', 4500000, 35000, '18 kmpl', 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&q=80', 1),
        ('Honda Accord', 'Honda', 2022, 'Petrol', 'Automatic', 3200000, 10000, '14 kmpl', 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&q=80', 2),
        ('Toyota Corolla', 'Toyota', 2021, 'Hybrid', 'Automatic', 2500000, 5000, '23 kmpl', 'https://images.unsplash.com/photo-1590362891991-f776e747a588?auto=format&fit=crop&q=80', 1),
        ('Mercedes-Benz C-Class', 'Mercedes', 2020, 'Diesel', 'Automatic', 5000000, 22000, '16 kmpl', 'https://images.unsplash.com/photo-1618761714954-0b8cd0026356?auto=format&fit=crop&q=80', 1),
        ('Porsche 911', 'Porsche', 2022, 'Petrol', 'Automatic', 15000000, 8000, '9 kmpl', 'https://images.unsplash.com/photo-1503376712351-1c2a51fa1974?auto=format&fit=crop&q=80', 2)
    ]
    cursor.executemany("INSERT INTO Cars (name, brand, year, engine_type, transmission, price, mileage, fuel_efficiency, image_url, owner_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", cars_data)

    conn.commit()
    conn.close()

if __name__ == '__main__':
    init_db()
    print("Database initialized successfully with accurate car images.")
