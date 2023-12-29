const formatDate = (date) => {
  const options = {
    day: "numeric",
    month: "long",
    year: "numeric",
  };
  return new Intl.DateTimeFormat("id-ID", options).format(date);
};

const formatTime = (time) => {
  const options = {
    hour: "numeric",
    minute: "numeric",
  };
  return new Intl.DateTimeFormat("id-ID", options).format(time);
};

module.exports = {
  formatDate,
  formatTime,
};
