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
    imgSrc: "/assets/images/js_chess.png",
    href: "/projects/chess",
    playable: true,
  },
  {
    title: "Chrome Dino Game Clone",
    description: `A clone of the classic Chrome Dino Game, written using HTML5 Canvas and JavaScript.  Built to better learn how to use canvas 
    as well as to experiment with browser-based game development.`,
    imgSrc: "/assets/images/dino_game.png",
    href: "/projects/dino_game",
    playable: true,
  },
  {
    title: "Java Chess",
    description: `A chess game designed for desktop use, written in Java.  Utilizes the Swing library for the GUI and incorporates Stockfish 
    AI.  Built during my time in Tech Elevator's coding bootcamp to better understand Java and object-oriented programming.`,
    imgSrc: "/assets/images/java_chess.png",
    href: "https://github.com/MichaelJOHare/chess-application2.0",
    playable: false,
  },
];

export default projectsData;
