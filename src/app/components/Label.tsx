import { type FC } from "react";
import _ from "lodash";

interface Props {
  name: string;
  required?: boolean;
  isLoading?: boolean;
}

const Label: FC<Props> = ({ name, isLoading = false, required = false }) => {
  return (
    <label
      className="text-secondary my-1 flex justify-between gap-1"
      htmlFor={name}
    >
      <span>
        {_.startCase(_.last(name.split("."))) + (required ? "*" : "")}
      </span>
    </label>
  );
};

export default Label;
