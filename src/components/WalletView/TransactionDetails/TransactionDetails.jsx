import React from "react";
import styled, { css, keyframes } from "styled-components";

const precision = 4;

const TransactionDetails = ({ selectedDate, transactionsByDate }) => {
  if (!transactionsByDate) return null;
  // open states: null, true or false
  const [open, setOpen] = React.useState(null);
  const transactionsSelectedDate = selectedDate
    ? transactionsByDate[new Date(selectedDate).toISOString()]
    : [];
  return (
    <DrawerWrapper open={open}>
      <Handle onClick={() => setOpen((openInt) => !openInt)}>
        {open ? ">>" : "<<"}
      </Handle>
      <Contents>
        <h3>
          <span>
            {selectedDate && transactionsSelectedDate.length > 0
              ? new Date(selectedDate).toLocaleDateString()
              : "no date selected"}
          </span>{" "}
        </h3>
        {transactionsSelectedDate.map((transaction, idx) => (
          <Transaction key={idx}>
            <h4>Transaction {idx + 1}</h4>
            <p>
              Type: <span>{transaction.type}</span>
            </p>
            <p>
              Base Amount: <span>{parseInt(transaction.baseAmount)}</span>
            </p>
            {transaction.quoteAmount && (
              <p>
                Quote: <span>{parseInt(transaction.quoteAmount)}</span>
              </p>
            )}
            <p>
              Transaction Price:{" "}
              <span>{transaction.price.toPrecision(precision)}</span>
            </p>
            {transaction.entryPrice && (
              <p>
                Entry Price: &nbsp;
                <span>{transaction.entryPrice.toPrecision(precision)}</span>
              </p>
            )}
          </Transaction>
        ))}
      </Contents>
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

const Contents = styled.div`
  padding: 1rem;
  overflow-y: scroll;
  height: 100%;
`;

const Transaction = styled.div`
  margin-top: 1rem;
  &: not(: last-child) {
    border-bottom: 1px solid black;
    padding-bottom: 1rem;
  }
`;

export default TransactionDetails;
