import React from "react";
import Layout from "@/components/Layout";
import EventForm from "@/domains/events/features/dashboard/components/EventForm";
import List from "@/domains/events/features/dashboard/components/List";
import { Event } from "@/domains/events/types/Event";
import Card from "@/domains/events/features/calendar/components/Card";

interface DashboardPageProps {
  events: Array<Event>;
}

const DashboardPage: React.FC<DashboardPageProps> = ({ events }) => {
  return (
    <Layout>
      <h1>Add event</h1>
      <EventForm />
      <List>
        <h1>Events list</h1>
        {events.map((event) => (
          <Card key={event.id}>{event.name}</Card>
        ))}
      </List>
    </Layout>
  );
};

export default DashboardPage;
