interface Project {
  title: string;
  description: string;
  href?: string;
  imgSrc?: string;
  playable?: boolean;
}

const projectsData: Project[] = [
  {
    title: "Chess Game",
    description: `A chess game designed for both mobile and desktop browsers, written completely from scratch with React, TypeScript, 
    and TailwindCSS. Incorporates Stockfish AI, allowing players to either challenge the AI across various difficulty levels or 
    utilize it for in-depth, continuous game analysis.`,
    imgSrc: "/assets/images/chess.png",
    href: "/projects/chess",
    playable: true,
  },
];

export default projectsData;
