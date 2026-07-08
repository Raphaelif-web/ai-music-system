import type { Track } from "@/types";
import { MOCK_AUDIO_URL } from "./constants";

import imgSynthwave from "@/assets/figma/97e074a98bd267b7e793590cf7916ed3199aac5e.png";
import imgAISerenade from "@/assets/figma/2b9669d4caae7e0131df172e452df996b054e84b.png";
import imgWhispers from "@/assets/figma/a5fb4564c109688e9da55ace27c2a57ec585d299.png";
import imgDigital from "@/assets/figma/88af55817e06e5beb26b97b8b37558d42203bf97.png";
import imgNeon from "@/assets/figma/ce2dd23a0f452a4c221c69234eca8c8131a0c05f.png";
import imgHarmony from "@/assets/figma/29b52570151c1055b78e8e5043802cd321b71944.png";
import imgElectric from "@/assets/figma/7a1a7f8b9a7226c2a844698d749a32cccada90ef.png";
import imgSynthwave2 from "@/assets/figma/f62715eb368a05e886636fc759986135921e464c.png";
import imgAISerenade2 from "@/assets/figma/51e24026833e73d23a99e5a06db5cc02e7cd5bf4.png";
import imgWhispers2 from "@/assets/figma/718dc7fe8ba681a3ad6c3a7945ac9998226d79a9.png";
import imgDigital2 from "@/assets/figma/d1080ae086a5197e54916eaed69aefa821db4ca8.png";
import imgNeon2 from "@/assets/figma/065a523c405e679bd35be6ccc6f70c9e126f4630.png";
import imgHarmony2 from "@/assets/figma/c3f9d43223fb6fdb376bb5b0aef8de0386c02dcc.png";
import imgElectric2 from "@/assets/figma/b6fa0d201f9ec64c5f0a983eee403861c850233c.png";
import imgExtra1 from "@/assets/figma/48a6e9ae994c060da347e19294ad8e9f9fa5358c.png";
import imgExtra2 from "@/assets/figma/58706e9400e2c6ab2574b5c5631507b7456c209e.png";
import imgExtra3 from "@/assets/figma/e281a7b5e725da91a450f9b1f019eff8fc39c941.png";
import imgExtra4 from "@/assets/figma/7972b3bd4358bcce33ff27707690626714be9283.png";
import imgExtra5 from "@/assets/figma/f256cdc56e3a87dafde6b39922b2b63d32b719af.png";

export type DiscoverTrack = Track & { category: string };

export const MOCK_DISCOVER_TRACKS: DiscoverTrack[] = [
  { id: "d1", title: "Synthwave Dreams", artist: "@SynthMasterAI", image: imgSynthwave, audioUrl: MOCK_AUDIO_URL, category: "Eletrônica", genre: "Eletrônica" },
  { id: "d2", title: "AI Serenade", artist: "@MelodyMaker", image: imgAISerenade, audioUrl: MOCK_AUDIO_URL, category: "Rock", genre: "Rock" },
  { id: "d3", title: "Whispers of the Future", artist: "@FutureSound", image: imgWhispers, audioUrl: MOCK_AUDIO_URL, category: "Gospel", genre: "Gospel" },
  { id: "d4", title: "Digital Echo", artist: "@EchoAI", image: imgDigital, audioUrl: MOCK_AUDIO_URL, category: "Eletrônica", genre: "Eletrônica" },
  { id: "d5", title: "Neon Nights", artist: "@NeonCreator", image: imgNeon, audioUrl: MOCK_AUDIO_URL, category: "Samba", genre: "Samba" },
  { id: "d6", title: "Harmony of Ones and Zeros", artist: "@CodeComposer", image: imgHarmony, audioUrl: MOCK_AUDIO_URL, category: "Pagode", genre: "Pagode" },
  { id: "d7", title: "Electric Emotions", artist: "@EmotionEngine", image: imgElectric, audioUrl: MOCK_AUDIO_URL, category: "MPB", genre: "MPB" },
  { id: "d8", title: "Cosmic Journey", artist: "@SynthMasterAI", image: imgSynthwave2, audioUrl: MOCK_AUDIO_URL, category: "Eletrônica", genre: "Eletrônica" },
  { id: "d9", title: "Neon Dreams", artist: "@MelodyMaker", image: imgAISerenade2, audioUrl: MOCK_AUDIO_URL, category: "Rock", genre: "Rock" },
  { id: "d10", title: "Future Whispers", artist: "@FutureSound", image: imgWhispers2, audioUrl: MOCK_AUDIO_URL, category: "Gospel", genre: "Gospel" },
  { id: "d11", title: "Digital Horizon", artist: "@EchoAI", image: imgDigital2, audioUrl: MOCK_AUDIO_URL, category: "Eletrônica", genre: "Eletrônica" },
  { id: "d12", title: "Night Glow", artist: "@NeonCreator", image: imgNeon2, audioUrl: MOCK_AUDIO_URL, category: "Samba", genre: "Samba" },
  { id: "d13", title: "Binary Symphony", artist: "@CodeComposer", image: imgHarmony2, audioUrl: MOCK_AUDIO_URL, category: "Clássico", genre: "Clássico" },
  { id: "d14", title: "Voltage Vibes", artist: "@EmotionEngine", image: imgElectric2, audioUrl: MOCK_AUDIO_URL, category: "Emo", genre: "Emo" },
  { id: "d15", title: "Stellar Sounds", artist: "@SynthMasterAI", image: imgExtra1, audioUrl: MOCK_AUDIO_URL, category: "Eletrônica", genre: "Eletrônica" },
  { id: "d16", title: "AI Ballad", artist: "@MelodyMaker", image: imgExtra2, audioUrl: MOCK_AUDIO_URL, category: "Rock", genre: "Rock" },
  { id: "d17", title: "Quantum Beat", artist: "@FutureSound", image: imgExtra3, audioUrl: MOCK_AUDIO_URL, category: "Gospel", genre: "Gospel" },
  { id: "d18", title: "Cyber Pulse", artist: "@EchoAI", image: imgExtra4, audioUrl: MOCK_AUDIO_URL, category: "Eletrônica", genre: "Eletrônica" },
  { id: "d19", title: "Neon Paradise", artist: "@NeonCreator", image: imgExtra5, audioUrl: MOCK_AUDIO_URL, category: "Samba", genre: "Samba" },
  { id: "d20", title: "Code Symphony", artist: "@CodeComposer", image: imgSynthwave, audioUrl: MOCK_AUDIO_URL, category: "Clássico", genre: "Clássico" },
  { id: "d21", title: "Electric Dream", artist: "@EmotionEngine", image: imgAISerenade, audioUrl: MOCK_AUDIO_URL, category: "Eletrônica", genre: "Eletrônica" },
  { id: "d22", title: "Cosmic Melody", artist: "@SynthMasterAI", image: imgWhispers, audioUrl: MOCK_AUDIO_URL, category: "Rock", genre: "Rock" },
  { id: "d23", title: "Future Echo", artist: "@MelodyMaker", image: imgDigital, audioUrl: MOCK_AUDIO_URL, category: "Gospel", genre: "Gospel" },
  { id: "d24", title: "Digital Paradise", artist: "@FutureSound", image: imgNeon, audioUrl: MOCK_AUDIO_URL, category: "Eletrônica", genre: "Eletrônica" },
  { id: "d25", title: "Night Symphony", artist: "@EchoAI", image: imgHarmony, audioUrl: MOCK_AUDIO_URL, category: "Samba", genre: "Samba" },
  { id: "d26", title: "Binary Dreams", artist: "@NeonCreator", image: imgElectric, audioUrl: MOCK_AUDIO_URL, category: "Pagode", genre: "Pagode" },
  { id: "d27", title: "Voltage Nights", artist: "@CodeComposer", image: imgSynthwave2, audioUrl: MOCK_AUDIO_URL, category: "MPB", genre: "MPB" },
  { id: "d28", title: "Stellar Journey", artist: "@EmotionEngine", image: imgAISerenade2, audioUrl: MOCK_AUDIO_URL, category: "Clássico", genre: "Clássico" },
  { id: "d29", title: "AI Dreams", artist: "@SynthMasterAI", image: imgWhispers2, audioUrl: MOCK_AUDIO_URL, category: "Emo", genre: "Emo" },
  { id: "d30", title: "Quantum Symphony", artist: "@MelodyMaker", image: imgDigital2, audioUrl: MOCK_AUDIO_URL, category: "Eletrônica", genre: "Eletrônica" },
  { id: "d31", title: "Cyber Dreams", artist: "@FutureSound", image: imgNeon2, audioUrl: MOCK_AUDIO_URL, category: "Rock", genre: "Rock" },
  { id: "d32", title: "Neon Journey", artist: "@EchoAI", image: imgHarmony2, audioUrl: MOCK_AUDIO_URL, category: "Gospel", genre: "Gospel" },
];

export const DISCOVER_CATEGORIES = [
  "Todos", "Rock", "Gospel", "Eletrônica", "Samba", "Pagode", "MPB", "Clássico", "Emo",
];
