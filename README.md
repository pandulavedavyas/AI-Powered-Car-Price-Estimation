# AI-Powered Car Price Estimation

A Flask-based web application that uses machine learning to predict car prices based on various features like brand, model, year, fuel type, transmission, and kilometers driven.

## Features

- 🚗 Interactive car price prediction
- 🤖 Machine learning model using RandomForest
- 💾 SQLite database for car data
- 🎨 Beautiful responsive UI with animations
- 📱 Mobile-friendly design

## Project Structure

```
car_price_project/
├── app.py                 # Main Flask application
├── requirements.txt       # Python dependencies
├── train_model.py         # ML model training script
├── database/
│   ├── init_db.py        # Database initialization
│   └── cars.db           # SQLite database
├── model/
│   └── car_price_model.pkl # Trained ML model
├── static/
│   ├── css/              # Stylesheets
│   ├── js/               # JavaScript files
│   ├── images/           # Images
│   └── videos/
└── templates/            # HTML templates
```

## Local Setup

1. **Create Virtual Environment:**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

2. **Install Dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

3. **Train the Model (optional):**
   ```bash
   python car_price_project/train_model.py
   ```

4. **Run the Application:**
   ```bash
   python car_price_project/app.py
   ```

   The app will be available at `http://localhost:5000`

## Deployment on Render

### Step-by-Step Guide:

#### 1. **Push Code to GitHub**
   ```bash
   git push origin main
   ```
   
   If you haven't connected with GitHub yet, you might need to:
   - Generate a Personal Access Token on GitHub
   - Use `git push https://<username>:<token>@github.com/pandulavedavyas/AI-Powered-Car-Price-Estimation.git main`

#### 2. **Create a Render Account**
   - Go to [render.com](https://render.com)
   - Sign up (connect with GitHub for easier setup)

#### 3. **Deploy on Render**
   
   **Option A: Using Render Dashboard (Recommended)**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select the repo: `AI-Powered-Car-Price-Estimation`
   - Configure the service:
     - **Name:** `car-price-prediction` (or your choice)
     - **Environment:** Python 3
     - **Build Command:** `pip install -r requirements.txt`
     - **Start Command:** `gunicorn -w 4 -b 0.0.0.0:$PORT car_price_project.app:app`
     - **Instance Type:** Free ($0/month)
   - Click "Create Web Service"

   **Option B: Using render.yaml (Advanced)**
   - A `Procfile` is already configured for gunicorn

#### 4. **Environment Variables (if needed)**
   - In Render Dashboard → Environment → Environment Variables
   - Add any required variables (e.g., `FLASK_ENV=production`)

#### 5. **Verify Deployment**
   - Once deployed, Render will provide a URL like: `https://car-price-prediction.onrender.com`
   - Test the application by visiting the URL

### Troubleshooting Render Deployment:

1. **Build Fails with "ModuleNotFoundError"**
   - Ensure `requirements.txt` is in the root directory ✓
   - Check that all dependencies are listed in `requirements.txt`

2. **Port Issues**
   - Render automatically assigns the PORT environment variable
   - The `Procfile` already handles this: `$PORT`

3. **Database Issues**
   - SQLite databases may not persist across Render restarts
   - Consider migrating to PostgreSQL for production:
     ```python
     # Install postgres support
     pip install psycopg2
     # Update DATABASE connection string in app.py
     ```

4. **Model Loading Issues**
   - Ensure `car_price_project/model/car_price_model.pkl` is in the repository
   - Large files might need Git LFS (Large File Storage)

5. **Logs on Render**
   - Check deployment logs in Render Dashboard → Logs
   - This helps debug startup issues

### Important Files for Deployment:

- ✅ `Procfile` - Tells Render how to start the app
- ✅ `requirements.txt` - Python dependencies
- ✅ `runtime.txt` - Python version specification
- ✅ `.gitignore` - Prevents uploading unnecessary files

## Technologies Used

- **Backend:** Python, Flask
- **ML:** scikit-learn, RandomForest Regressor
- **Database:** SQLite
- **Frontend:** HTML, CSS, JavaScript
- **Deployment:** Gunicorn, Render

## API Endpoints

- `GET /` - Home page
- `GET/POST /predict` - Car price prediction form and results
- `POST /predict` - Submit car details for price prediction

## Future Enhancements

- [ ] Add more ML features (XGBoost, neural networks)
- [ ] User authentication
- [ ] Data persistence with PostgreSQL
- [ ] API endpoints (JSON responses)
- [ ] Model versioning and A/B testing
- [ ] Docker containerization

## License

MIT License - feel free to use this project for learning and development.

---

**Need Help?**
- [Render Documentation](https://render.com/docs)
- [Flask Documentation](https://flask.palletsprojects.com)
- [Scikit-learn Documentation](https://scikit-learn.org)
