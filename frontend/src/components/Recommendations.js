import React from 'react';
import './Recommendations.css';

function Recommendations({ movies, onMovieClick }) {
    return (
        <div className="recommendations">
            <div className="recommendation-list">
                {movies.map((movie, index) => (
                    <div key={index} className="recommendation-item" onClick={() => onMovieClick(movie)}>
                        <img src={movie.poster} alt={movie.title} />
                        <p>{movie.title}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Recommendations;
