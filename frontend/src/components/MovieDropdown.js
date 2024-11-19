import React from 'react';

function MovieDropdown({ movies, onSelectMovie }) {
    return (
        <div className="dropdown">
            <label>Sélectionnez un film :</label>
            <select onChange={(e) => onSelectMovie(e.target.value)} defaultValue="">
                <option value="" disabled>-- Choisissez un film --</option>
                {movies.map((movie, index) => (
                    <option key={index} value={movie}>{movie}</option>
                ))}
            </select>
        </div>
    );
}

export default MovieDropdown;
