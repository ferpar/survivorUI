import { Form } from "./BackOptions.styles";
import IntervalSelector from "./IntervalSelector";
import SquadParameters from "./SquadParameters";

const BackOptions = () => {
  return (
    <Form>
      <IntervalSelector />
      <SquadParameters />
    </Form>
  );
};

export default BackOptions;
