import type { User } from "@/types";
import imgAvatar from "@/assets/figma/58706e9400e2c6ab2574b5c5631507b7456c209e.png";

/** Logged-in user mock — replace with Supabase Auth session. */
export const MOCK_CURRENT_USER: User = {
  id: "u-lucas",
  name: "Lucas Martins",
  username: "lucasmarteux",
  email: "lucas@gmail.com",
  bio: "Criador de músicas geradas por IA. Explorando sons do futuro.",
  avatar: imgAvatar,
  isPublic: true,
  favoriteGenres: ["Pop", "Rock", "Eletrônica"],
  favoriteMoods: ["Energético", "Calmo"],
  totalTracks: 36,
  totalPlays: 36900,
  followers: 150,
  following: 45,
};
