import os
import pandas as pd
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import pickle

movies = pd.read_csv("data/movies.csv")
print(f"Chargement de {len(movies)} films.")

movies['combined_features'] = movies['genres'] + " " + movies['description']


tfidf = TfidfVectorizer(stop_words='english')
tfidf_matrix = tfidf.fit_transform(movies['combined_features'])
print("Vectorisation TF-IDF terminée.")


similarity_matrix = cosine_similarity(tfidf_matrix)
print("Matrice de similarité calculée.")


with open("similarity.pkl", "wb") as similarity_file:
    pickle.dump(similarity_matrix, similarity_file)
    print("Matrice de similarité sauvegardée dans similarity.pkl.")

movies_metadata = movies[['id', 'title', 'genres', 'description']]
with open("movies_list.pkl", "wb") as movies_file:
    pickle.dump(movies_metadata, movies_file)
    print("Métadonnées des films sauvegardées dans movies_list.pkl.")
