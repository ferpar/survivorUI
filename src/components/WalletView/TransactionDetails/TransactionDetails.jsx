import React from "react";
import styled, { css, keyframes } from "styled-components";

const TransactionDetails = ({ transactionsByDate }) => {
  console.log(transactionsByDate);
  // open states: null, true or false
  const [open, setOpen] = React.useState(null);
  const [selectedDate, setSelectedDate] = React.useState(null);
  return (
    <DrawerWrapper open={open}>
      <Handle onClick={() => setOpen((openInt) => !openInt)}>
        {open ? ">>" : "<<"}
      </Handle>
      <h3>test</h3>
      <p>test</p>
    </DrawerWrapper>
  );
};

const slideIn = keyframes`
  from {
    transform: translate(100%, 0);
  }
  to {
    transform: translate(0, 0);
  }
`;

const slideOut = keyframes`
  from {
    transform: translate(0, 0);
  }
  to {
    transform: translate(100%, 0);
  }
`;

const slideInAnim = css`
  animation: ${slideIn} 0.5s ease-out both;
`;

const slideOutAnim = css`
  animation: ${slideOut} 0.5s ease-in both;
`;

const DrawerWrapper = styled.div`
  position: absolute;
  background-color: white;
  top: 0;
  right: 0;
  width: 30%;
  height: 60%;
  border: 1px solid black;
  transform: translate(100%, 0);
  ${(props) =>
    props.open === null ? "" : props.open ? slideInAnim : slideOutAnim}
`;

const Handle = styled.div`
  background: #aaa;
  border-radius: 5px 0 0 5px;
  position: absolute;
  top: 0;
  left: 0;
  padding: 0.5rem;
  transform: translate(-100%, 0);
  cursor: pointer;
`;

export default TransactionDetails;
