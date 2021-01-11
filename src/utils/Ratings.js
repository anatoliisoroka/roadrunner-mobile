export default class Ratings {
  static format(totalRating) {
    if (totalRating >= 100) {
      return '(99+)'
    }

    return '(' + totalRating + ')'
  }

  static round(averageRating) {
    return averageRating.toFixed(1)
  }
}
