"use client";
import React from "react";
import Layout from "@/components/Layout";
import EventForm from "@/domains/dashboard/features/add-event/components/EventForm";

interface DashboardPageProps {}

const DashboardPage: React.FC<DashboardPageProps> = () => {
  return (
    <Layout>
      <div>Dashboard page</div>
      <EventForm />
    </Layout>
  );
};

export default DashboardPage;
