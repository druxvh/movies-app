export interface Movie {
  id?: number;
  title?: string;
  poster_path?: string;
  vote_average?: number;
  release_date?: string;
  adult?: boolean;
  original_language?: string;
}

interface Props {
  movie: Movie;
}

const MovieCard = ({
  movie: { title, poster_path, vote_average, release_date, original_language },
}: Props) => {
  return (
    <div className="movie-card">
      <img
        src={
          poster_path
            ? `https://image.tmdb.org/t/p/w500/${poster_path}`
            : "public/no-img.jpg"
        }
        alt={title}
        loading="lazy"
      />
      <div className="mt-4">
        <h3 className="text-white">{title}</h3>

        <div className="content">
          <div className="flex gap-2 items-center font-dm-sans">
            <span className="text-gray-100 font-bold">R: </span>
            <p className="text-white text-[13px] font-semibold">
              {vote_average ? vote_average.toFixed(1) : "N/A"}
            </p>
          </div>

          <span>•</span>
          <p className="lang">{original_language}</p>
          <span>•</span>
          <p className="year">
            {release_date ? release_date.split("-")[0] : "N/A"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;
