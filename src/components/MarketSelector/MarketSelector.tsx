import React from "react";
import styled from "styled-components";
import { MarketsContext } from "../../core/Providers/MarketsProvider";

interface IMarketData {
  symbol_id: string;
  exchange_id: string;
  symbol_type: string;
  period_id: string;
  asset_id_base: string;
  asset_id_quote: string;
  data_start?: string;
  data_end?: string;
}

const MarketSelector = () => {
  const { availableMarkets } = React.useContext(MarketsContext);
  console.log(availableMarkets);

  const symbolIds = availableMarkets
    ? new Set<string>(
        availableMarkets.map((market: IMarketData) => market.symbol_id)
      )
    : [];

  const periodIds = availableMarkets
    ? new Set<string>(
        availableMarkets.map((market: IMarketData) => market.period_id)
      )
    : [];

  return (
    <Form>
      <FieldSet>
        <Legend>Market Selection</Legend>
        <label>
          <span>Market</span>
          <select name="symbol_id" id="symbol_id">
            {symbolIds &&
              Array.from(symbolIds).map((symbolId: string) => (
                <option key={symbolId} value={symbolId}>
                  {symbolId}
                </option>
              ))}
          </select>
        </label>
        <label>
          <span>Period</span>
          <select name="period_id" id="period_id">
            {periodIds &&
              Array.from(periodIds).map((periodId: string) => (
                <option key={periodId} value={periodId}>
                  {periodId}
                </option>
              ))}
          </select>
        </label>
      </FieldSet>
    </Form>
  );
};
export default MarketSelector;

const Form = styled.form`
  ailign-items: center;
  display: flex;
  flex-direction: row;
  justify-content: center;
  margin-bottom: 1rem;
`;
const FieldSet = styled.fieldset`
  border: none;
  display: flex;
  flex-direction: row;
  flex: 1;
  gap: 32px;
  & label > span {
    margin-right: 8px;
  }
  padding: 0;
  margin-left: 8px; /*indent*/
`;

const Legend = styled.legend`
  font-size: calc(14 / 16 * 1rem);
  font-weight: 400;
  padding-left: 0;
  margin-left: -8px; /*-indent*/
`;