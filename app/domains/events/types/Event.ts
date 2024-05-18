export interface Event {
  id: string;
  name: string;
  description: string;
  start_at: string;
  end_at: string;
  type: string; // TODO: add union
  tags: string[] | null; // TODO: add uninon for all known tags
}

export interface EventData {
  name: string;
  description: string;
  start_at: string;
  end_at: string;
  type: string;
  tags: string[] | null;
}
