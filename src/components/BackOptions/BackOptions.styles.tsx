import styled, { keyframes } from "styled-components";

export const Form = styled.form`
  align-items: baseline;
  display: flex;
  flex-direction: row;
  justify-content: center;
  margin-bottom: 1rem;
`;

export const FieldSet = styled.fieldset`
  position: relative;
  border: none;
  display: flex;
  flex-direction: row;
  flex: 1;
  gap: 32px;
  & label > span {
    display: block;
  }
  padding: 0;
  margin-left: 8px; /* indent */
`;

export const Legend = styled.legend`
  font-size: calc(14 / 16 * 1rem);
  font-weight: 400;
  padding-left: 0;
  margin-left: -8px; /* -indent */
`;

export const slideInFromRight = keyframes`
    0% {
      transform: translateX(150%);
      opacity: 0;
    }
    100% {
      transform: translateX(0);
      opacity: 1;
    }
`;

export const FieldSetAnimated = styled(FieldSet)`
  transform: translateX(150%);
  animation: ${slideInFromRight} 0.7s ease-out both;
`;

export const QuoteAmountWrapper = styled.div`
  position: relative;
`;
export const RatioCheck = styled.div`
  position: absolute;
  right: 24px;
  top: 0;
  bottom: 0;
  height: 100%;
  display: flex;
  align-items: center;
  gap: 4px;
  & > input {
    margin-bottom: -1px;
  }
`;

export const ShortInput = styled.input`
  max-width: 100px;
`;

export const IntervalModes = styled.div`
  display: flex;
  border-radius: 4px;
  position: absolute;
  top: -40%;
  left: 20%;
  margin-bottom: -100%;
  box-shadow: 0 0 4px 0 rgba(0, 0, 0, 0.2);
`;

export const IntervalMode = styled.button`
  & {
    display: inline-block;
    border: none;
    background: none;
    padding: 0.1rem 0.5rem;
    font-size: inherit;
    font-family: inherit;
    cursor: pointer;
    font-size: calc(12 / 16 * 1rem);
    &:hover {
      background: #eee;
    }
  }
  &:first-child {
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
  }
  &:last-child {
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
  }
  &:not(:last-child) {
    border-right: 1px solid #ccc;
  }
  &:not(:first-child) {
    border-left: 1px solid #ccc;
  }
  &:hover {
    background: #eee;
  }
`;
