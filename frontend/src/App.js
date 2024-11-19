import React, { useState, useEffect } from 'react';
import axios from 'axios';
import MovieDetailsModal from './components/MovieDetailsModal';
import './App.css';

function App() {
    const [search, setSearch] = useState("");
    const [topMovies, setTopMovies] = useState([]);
    const [recommendations, setRecommendations] = useState([]);
    const [allTitles, setAllTitles] = useState([]);
    const [filteredTitles, setFilteredTitles] = useState([]);
    const [selectedMovie, setSelectedMovie] = useState(null);
    const [loading, setLoading] = useState(true); // Chargement des films populaires
    const [isLoadingRecommendations, setIsLoadingRecommendations] = useState(false); // Chargement des recommandations

    useEffect(() => {
        // Chargement des films populaires au démarrage
        axios.get('http://127.0.0.1:5000/random_movies')
            .then(response => {
                setTopMovies(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error("Erreur lors de la récupération des top films :", error);
                setLoading(false);
            });

        // Chargement des titres pour l'autocomplétion
        axios.get('http://127.0.0.1:5000/movies_titles')
            .then(response => setAllTitles(response.data))
            .catch(error => console.error("Erreur lors de la récupération des titres de films :", error));
    }, []);

    const fetchRecommendations = (query) => {
        setIsLoadingRecommendations(true); // Active l'état de chargement
        axios.post('http://127.0.0.1:5000/recommend', { query })
            .then(response => {
                setRecommendations(response.data); // Met à jour les recommandations
            })
            .catch(error => console.error("Erreur lors de la récupération des recommandations :", error))
            .finally(() => setIsLoadingRecommendations(false)); // Désactive l'état de chargement
    };

    const handleInputChange = (value) => {
        setSearch(value);
        // Filtrer les titres pour l'autocomplétion
        setFilteredTitles(
            allTitles.filter((title) =>
                title.toLowerCase().includes(value.toLowerCase())
            )
        );
    };

    const handleButtonClick = () => {
        if (search.trim() !== "") {
            fetchRecommendations(search); // Recherche les recommandations
        } else {
            alert("Veuillez entrer un titre de film.");
        }
    };

    const handleSuggestionClick = (title) => {
        setSearch(title); // Remplit le champ de recherche
        setFilteredTitles([]); // Masque les suggestions
        fetchRecommendations(title); // Recherche les recommandations
    };

    return (
        <div className="App">
            <div className="content">
                <h1>Films recommandés pour vous</h1>

                {/* Section des films populaires */}
                <div className="top-films-title">Top Films du Moment</div>
                {loading ? (
                    <div className="loader">Chargement des films populaires...</div>
                ) : (
                    <div className="recommendations">
                        {topMovies.map((movie, index) => (
                            <div key={index} className="recommendation-item" onClick={() => setSelectedMovie(movie)}>
                                <img src={movie.poster} alt={movie.title} />
                                <h3>{movie.title}</h3>
                            </div>
                        ))}
                    </div>
                )}

                {/* Barre de recherche avec autocomplétion */}
                <div className="search-form">
                    <div className="search-container">
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => handleInputChange(e.target.value)}
                            placeholder="Recherchez un film..."
                            className="search-input"
                        />
                        {/* Suggestions dynamiques */}
                        {filteredTitles.length > 0 && (
                            <ul className="suggestions-list">
                                {filteredTitles.map((title, index) => (
                                    <li key={index} onClick={() => handleSuggestionClick(title)}>
                                        {title}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                    <button className="recommendation-button" onClick={handleButtonClick}>
                        Rechercher
                    </button>
                </div>

                {/* Section des recommandations */}
                <h2>Recommandations</h2>
                <div className="recommendations">
                    {isLoadingRecommendations ? (
                        <div className="loader">Chargement des recommandations...</div> // Affichage du loader
                    ) : recommendations.length > 0 ? (
                        recommendations.map((movie, index) => (
                            <div key={index} className="recommendation-item" onClick={() => setSelectedMovie(movie)}>
                                <img src={movie.poster} alt={movie.title} />
                                <h3>{movie.title}</h3>
                            </div>
                        ))
                    ) : (
                        <p>Aucune recommandation pour l'instant. Recherchez un film pour commencer.</p>
                    )}
                </div>

                {/* Modal pour les détails du film */}
                {selectedMovie && (
                    <MovieDetailsModal movie={selectedMovie} onClose={() => setSelectedMovie(null)} />
                )}
            </div>
        </div>
    );
}

export default App;
