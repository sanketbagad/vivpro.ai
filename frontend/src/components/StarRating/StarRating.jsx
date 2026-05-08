function StarRating({ rating = 0, onRate, readonly = false }) {
  return (
    <span className="star-rating">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={`star ${star <= rating ? 'filled' : 'empty'} ${readonly ? '' : 'clickable'}`}
          onClick={() => !readonly && onRate && onRate(star)}
          title={readonly ? '' : `Rate ${star}`}
        >
          {star <= rating ? '★' : '☆'}
        </span>
      ))}
    </span>
  )
}

export default StarRating
