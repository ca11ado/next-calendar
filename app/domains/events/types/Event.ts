export interface Event {
  id: string;
  name: string;
  description: string;
  start_at: string;
  end_at: string;
  type: string;
  tags: string[] | null;
}

export interface EventData {
  date: string;
  name: string;
  description: string;
}
