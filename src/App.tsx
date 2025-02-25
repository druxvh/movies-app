import { useEffect, useState } from "react";
import Search from "./components/Search";
import Spinner from "./components/Spinner";
import MovieCard, { Movie } from "./components/MovieCard";

const App = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [movieList, setMovieList] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // fetch movies func
  const fetchMovies = async () => {
    setIsLoading(true);
    try {
      const url = `${
        import.meta.env.VITE_TMDB_BASE_URL
      }/discover/movie?sort_by=popularity.desc`;

      const options = {
        method: "GET",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_TMDB_API_KEY}`,
        },
      };

      const response = await fetch(url, options);

      if (!response.ok) {
        throw new Error("failed to fetch movies.");
      }

      const data = await response.json();

      if (data.Response === "False") {
        setErrorMessage(data.Error || "failed to fetch movies.");
        setMovieList([]);
        return;
      }

      setMovieList(data.results || []);

      console.log(data);
    } catch (err) {
      console.error(err);
      setErrorMessage("Error fetching movies. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  // fetch call on first load
  useEffect(() => {
    fetchMovies();
  }, []);

  return (
    <main>
      <div className="pattern" />

      <div className="wrapper">
        <header>
          <h1>
            Find <span className="text-gradient">Movies</span> You'll Enjoy
            Without the Hassle
          </h1>
          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </header>

        <section className="all-movies">
          <h2 className="mt-[40px]">All Movies</h2>

          {/* loading state spinner & error handle */}
          {isLoading ? (
            <Spinner />
          ) : errorMessage ? (
            <p className="text-red-500"> {errorMessage} </p>
          ) : (
            <ul>
              {/* populates movies */}
              {movieList.map((movie: Movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  );
};

export default App;
