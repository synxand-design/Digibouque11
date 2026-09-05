export type OccasionId =
  | "bouquet"
  | "love-letter"
  | "birthday"
  | "valentine"
  | "mothers-day"
  | "fathers-day"
  | "teachers-day"
  | "friendship"
  | "anniversary"
  | "thank-you"
  | "surprise"
  | "diwali";

export type ItemKind = "flower" | "greenery" | "sticker";

export interface PlacedItem {
  id: string;
  asset: string; // catalog asset id
  kind: ItemKind;
  x: number; // center x, percentage of canvas width (0-100)
  y: number; // center y, percentage of canvas height (0-100)
  scale: number; // width as fraction of canvas width (e.g. 0.3)
  rotation: number; // degrees
  z: number;
  flip?: boolean;
}

export interface CreationData {
  occasion: OccasionId;
  title: string;
  recipient: string;
  sender: string;
  message: string;
  background: string;
  wrap: string;
  ribbon: string;
  items: PlacedItem[];
  photos: string[]; // data URLs (max 3)
  music: string | null; // data URL
  musicName?: string | null;
}

export interface SavedCreation extends CreationData {
  id: string;
  createdAt: string;
}
