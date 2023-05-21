"use client";
import React from "react";
import Layout from "@/app/components/Layout";
import EventForm from "@/components/EventForm";

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
