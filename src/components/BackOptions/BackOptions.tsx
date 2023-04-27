import styled from "styled-components";

const BackOptions = () => {
  return (
    <Form>
      <label htmlFor="start-date">
        <span>Start Date</span>
        <input type="date" id="start-date" name="backtest-start" />
      </label>
      <label htmlFor="end-date">
        <span>End Date</span>
        <input type="date" id="end-date" name="backtest-end" />
      </label>
      <label htmlFor="short-check">
        <span>Short</span>
        <input type="checkbox" id="short-check" name="short" />
      </label>
    </Form>
  );
};

const Form = styled.form`
  align-items: baseline;
  display: flex;
  flex-direction: row;
  justify-content: center;
  gap: 32px;
  & label span {
    margin-right: 16px;
  }
  margin-bottom: 1rem;
`;

export default BackOptions;
