from flask import Flask, request, jsonify
from flask_cors import CORS
import pickle
import requests
import random
import numpy as np

app = Flask(__name__)
CORS(app)

# Charger les données des films
with open("movies_list.pkl", "rb") as f:
    movies = pickle.load(f)
with open("similarity.pkl", "rb") as f:
    similarity = pickle.load(f)

API_KEY = "c7ec19ffdd3279641fb606d19ceb9bb1"

# Fonction pour obtenir les détails d'un film
def fetch_movie_details(movie_id):
    url = f"https://api.themoviedb.org/3/movie/{movie_id}?api_key={API_KEY}&language=fr-FR"
    data = requests.get(url).json()
    return {
        "id": int(movie_id),  # conversion en int natif
        "title": data.get("title", "Titre inconnu"),
        "poster": f"https://image.tmdb.org/t/p/w500/{data.get('poster_path')}" if data.get('poster_path') else None,
        "description": data.get("overview", "Aucune description disponible"),
        "release_date": data.get("release_date", "Date inconnue"),
        "genres": [genre["name"] for genre in data.get("genres", [])]
    }

# Endpoint pour obtenir des films aléatoires au lancement
@app.route('/random_movies', methods=['GET'])
def get_random_movies():
    random_movies = random.sample(list(movies['id']), 5)  # 5 films aléatoires
    movies_details = [fetch_movie_details(int(movie_id)) for movie_id in random_movies]
    return jsonify(movies_details)

# Endpoint pour obtenir la liste des titres de films
@app.route('/movies_titles', methods=['GET'])
def get_movies_titles():
    titles = movies['title'].tolist()
    return jsonify(titles)

# Endpoint pour obtenir des recommandations basées sur un titre de film
@app.route('/recommend', methods=['POST'])
def recommend_movies():
    data = request.json
    movie_title = data.get("query", "")
    
    try:
        movie_index = movies[movies['title'] == movie_title].index[0]
    except IndexError:
        return jsonify({"error": "Film non trouvé"}), 404
    
    similar_movies = sorted(list(enumerate(similarity[movie_index])), key=lambda x: x[1], reverse=True)[1:6]
    
    # Récupérer les détails des films similaires en vérifiant le type
    recommendations = [
        fetch_movie_details(int(movies.iloc[i[0]].id)) if isinstance(movies.iloc[i[0]].id, np.int64) else fetch_movie_details(movies.iloc[i[0]].id)
        for i in similar_movies
    ]
    
    return jsonify(recommendations)

if __name__ == "__main__":
    app.run(debug=True)
