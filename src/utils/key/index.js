let apiKey;
if (process.env.NODE_ENV !== "production") {
  apiKey = process.env.REACT_APP_MOVIE_KEY;
} else {
  apiKey = process.env.MOVIE_KEY;
}

export default apiKey;
