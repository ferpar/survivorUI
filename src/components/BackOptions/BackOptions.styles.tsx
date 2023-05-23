import styled, { keyframes } from "styled-components";

export const Form = styled.form`
  align-items: baseline;
  display: flex;
  flex-direction: row;
  justify-content: center;
  margin-bottom: 1rem;
`;

export const FieldSet = styled.fieldset`
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
