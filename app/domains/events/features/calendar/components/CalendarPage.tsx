import React from "react";
import { LayoutTwoColumns } from "@/components/Layout";
import SquaresGrid from "@/domains/events/features/calendar/components/SquaresGrid";
import { Event } from "@/domains/events/types/Event";
import Events from "./Events";
import { getFirstEvent } from "@/domains/events/utils/events";
import { getColorsByType } from "@/domains/events/utils/getColorByType";

interface CalendarPageProps {
  periods: number;
  events: Event[];
  rateInDays: number;
}

const CalendarPage: React.FC<CalendarPageProps> = (props) => {
  const { periods, events } = props;
  const firstEvent = getFirstEvent(events);
  const colorsByType = getColorsByType(events);
  return (
    <LayoutTwoColumns>
      <div>
        <div style={{ marginBottom: "20px" }}>
          {Object.keys(colorsByType).map((k) => (
            <div style={{ backgroundColor: colorsByType[k] }}>
              {k}: {colorsByType[k]};
            </div>
          ))}
        </div>
        <SquaresGrid
          count={periods}
          startCalendarDate={new Date(firstEvent.start_at)}
          events={events}
          colorsByType={colorsByType}
        />
      </div>
      <Events events={events} colorsByType={colorsByType} />
    </LayoutTwoColumns>
  );
};

export default CalendarPage;
