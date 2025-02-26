import { useEffect, useState } from "react";
import Search from "./components/Search";
import Spinner from "./components/Spinner";
import MovieCard from "./components/MovieCard";
import { useDebounce } from "react-use";
import { getTrendingMovies, updateSearchCount } from "./appwrite";
import { Movie, SearchTermMovie } from "./types";

const App = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [movieList, setMovieList] = useState<Movie[]>([]);
  const [trendingMovies, setTrendingMovies] = useState<SearchTermMovie[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState<string>("");

  // debounce search term
  useDebounce(
    () => {
      setDebouncedSearchTerm(searchTerm);
    },
    1000,
    [searchTerm]
  );

  // fetch movies fn
  const fetchMovies = async (query: string) => {
    setIsLoading(true);
    try {
      const url = query
        ? `${import.meta.env.VITE_TMDB_BASE_URL
        }/search/movie?query=${encodeURIComponent(query)}`
        : `${import.meta.env.VITE_TMDB_BASE_URL
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

      if (query && data.results.length > 0) {
        await updateSearchCount(query, data.results[0])
      }

    } catch (err) {
      console.error(err);
      setErrorMessage("Error fetching movies. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  // fetch trending movies fn
  const loadTrendingMovies = async () => {
    try {
      const movies = await getTrendingMovies()

      setTrendingMovies(movies)
    } catch (error) {
      console.error(error)

    }
  }

  // fetch call on first load
  useEffect(() => {
    loadTrendingMovies()
  }, [])

  // fetch call everytime search term is changed
  useEffect(() => {
    fetchMovies(debouncedSearchTerm);
  }, [debouncedSearchTerm]);

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

        {trendingMovies.length > 0 && (
          <section className="trending">
            <h2>Trending Movies</h2>
            <ul>
              {trendingMovies.map((movie, index) => (
                <li key={movie.$id}>
                  <p>{index + 1}</p>
                  <img src={movie.poster_url} alt={movie.searchTerm} />
                </li>
              ))}
            </ul>
          </section>
        )}

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
