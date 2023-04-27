const BackOptions = () => {
  return (
    <form>
      <label htmlFor="start-date">Start Date</label>
      <input type="date" id="start-date" name="backtest-start" />
      <label htmlFor="end-date">End Date</label>
      <input type="date" id="end-date" name="backtest-end" />
      <input type="checkbox" id="short" name="short" />
    </form>
  );
};

export default BackOptions;
