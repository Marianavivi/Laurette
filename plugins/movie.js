const fetch = require('node-fetch');

module.exports = {
  handleMovieInfo: async (sock, msg) => {
    const from = msg.key.remoteJid;
    const message = msg.message.conversation;

    // Respond to "movie" command
    if (message.toLowerCase().startsWith('movie ')) {
      const movieTitle = message.substring(6); // Extract the movie title
      try {
        const response = await fetch(`http://www.omdbapi.com/?t=${encodeURIComponent(movieTitle)}&apikey=YOUR_API_KEY`); // Replace with your actual API key
        const data = await response.json();
        if (data.Response === 'True') {
          const movieInfo = `
          *Title:* ${data.Title}
          *Year:* ${data.Year}
          *Rated:* ${data.Rated}
          *Released:* ${data.Released}
          *Runtime:* ${data.Runtime}
          *Genre:* ${data.Genre}
          *Director:* ${data.Director}
          *Writer:* ${data.Writer}
          *Actors:* ${data.Actors}
          *Plot:* ${data.Plot}
          *Language:* ${data.Language}
          *Country:* ${data.Country}
          *Awards:* ${data.Awards}
          *Poster:* ${data.Poster}
          *IMDb Rating:* ${data.imdbRating}
          *IMDb Votes:* ${data.imdbVotes}
          `;
          await sock.sendMessage(from, { text: movieInfo });
        } else {
          await sock.sendMessage(from, { text: 'Movie not found.' });
        }
      } catch (error) {
        console.error('Error fetching movie info:', error);
        await sock.sendMessage(from, { text: 'Oops, I couldn\'t find information about that movie. Try again later!' });
      }
    }
  }
};
