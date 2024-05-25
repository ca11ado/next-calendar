import React from "react";
import { Event } from "@/domains/events/types/Event";
import { getColorByType } from "@/domains/events/utils/getColorByType";
import { uniq } from "lodash";

type Props = {
  events: Event[];
};

const ColorsAgenda: React.FC<Props> = (props) => {
  const { events } = props;
  return (
    <div style={{ marginBottom: "20px" }}>
      {uniq(events.map(({ type }) => type)).map((type) => (
        <div key={type} style={{ backgroundColor: getColorByType(type) }}>
          {type}: {getColorByType(type)};
        </div>
      ))}
    </div>
  );
};

export default ColorsAgenda;
