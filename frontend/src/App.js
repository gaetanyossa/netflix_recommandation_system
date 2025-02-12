import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import MovieDetailsModal from "./components/MovieDetailsModal";
import "./App.css";

function App() {
  const [search, setSearch] = useState("");
  const [topMovies, setTopMovies] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [allTitles, setAllTitles] = useState([]);
  const [filteredTitles, setFilteredTitles] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLoadingRecommendations, setIsLoadingRecommendations] = useState(false);

  const searchRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const moviesResponse = await axios.get("http://localhost:5000/random_movies");
        setTopMovies(moviesResponse.data);

        const titlesResponse = await axios.get("http://localhost:5000/movies_titles");
        setAllTitles(titlesResponse.data);
      } catch (error) {
        console.error("Erreur lors de la récupération des données :", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const fetchRecommendations = async (query) => {
    setIsLoadingRecommendations(true);
    try {
      const response = await axios.post("http://localhost:5000/recommend", { query });
      setRecommendations(response.data);
    } catch (error) {
      console.error("Erreur lors de la récupération des recommandations :", error);
    } finally {
      setIsLoadingRecommendations(false);
    }
  };

  const handleInputChange = (value) => {
    setSearch(value);
    setFilteredTitles(
      allTitles.filter((title) =>
        title.toLowerCase().includes(value.toLowerCase())
      )
    );
  };

  const handleButtonClick = () => {
    if (search.trim() !== "") {
      setFilteredTitles([]); // Masque les suggestions
      fetchRecommendations(search);
    } else {
      alert("Veuillez entrer un titre de film.");
    }
  };

  const handleSuggestionClick = (title) => {
    setSearch(title);
    setFilteredTitles([]);
    fetchRecommendations(title);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target) &&
        !event.target.classList.contains("recommendation-button")
      ) {
        setFilteredTitles([]);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="App">
      <div className="content">
        <h1>Films recommandés pour vous</h1>

        <div className="top-films-title">Top Films du Moment</div>
        {loading ? (
          <div className="loader">Chargement des films populaires...</div>
        ) : (
          <div className="recommendations">
            {topMovies.map((movie, index) => (
              <div
                key={index}
                className="recommendation-item"
                onClick={() => setSelectedMovie(movie)}
              >
                <img src={movie.poster} alt={movie.title} />
                <h3>{movie.title}</h3>
              </div>
            ))}
          </div>
        )}

        <div className="search-form" ref={searchRef}>
          <div className="search-container">
            <input
              type="text"
              value={search}
              onChange={(e) => handleInputChange(e.target.value)}
              placeholder="Recherchez un film..."
              className="search-input"
            />
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
          <button
            className="recommendation-button"
            onClick={handleButtonClick}
          >
            Rechercher
          </button>
        </div>

        <h2>Recommandations</h2>
        <div className="recommendations">
          {isLoadingRecommendations ? (
            <div className="loader">Chargement des recommandations...</div>
          ) : recommendations.length > 0 ? (
            recommendations.map((movie, index) => (
              <div
                key={index}
                className="recommendation-item"
                onClick={() => setSelectedMovie(movie)}
              >
                <img src={movie.poster} alt={movie.title} />
                <h3>{movie.title}</h3>
              </div>
            ))
          ) : (
            <p>
              Aucune recommandation pour l'instant. Recherchez un film pour
              commencer.
            </p>
          )}
        </div>

        {selectedMovie && (
          <MovieDetailsModal
            movie={selectedMovie}
            onClose={() => setSelectedMovie(null)}
          />
        )}
      </div>
    </div>
  );
}

export default App;
