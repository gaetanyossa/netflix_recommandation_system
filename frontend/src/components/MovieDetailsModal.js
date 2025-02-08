import React from 'react';
import Modal from 'react-modal';
import './MovieDetailsModal.css';

Modal.setAppElement('#root');

function MovieDetailsModal({ movie, onClose }) {
    return (
        <div className="movie-modal-overlay">
            <Modal
                isOpen={true}
                onRequestClose={onClose}
                contentLabel="Movie Details"
                className="movie-modal"
                overlayClassName="movie-modal-overlay" // Utilise l'overlay pour le fond sombre
            >
                <button onClick={onClose} className="close-button">X</button>
                <h2>{movie.title || "Titre indisponible"}</h2>
                {movie.poster && <img src={movie.poster} alt={movie.title} />}
                <p><strong>Date de sortie :</strong> {movie.release_date || "Date inconnue"}</p>
                <p><strong>Genres :</strong> {movie.genres ? movie.genres.join(', ') : "Genres non disponibles"}</p>
                <p><strong>Description :</strong> {movie.description || "Aucune description disponible"}</p>
                {movie.cast && <p><strong>Acteurs principaux :</strong> {movie.cast.join(', ')}</p>}
            </Modal>
        </div>
    );
}

export default MovieDetailsModal;
