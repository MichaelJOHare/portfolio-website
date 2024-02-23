import React from "react";
import Link from "next/link";

const HeroSection: React.FC = () => {
  return (
    <div
      className="relative bg-cover bg-center bg-no-repeat py-20"
      style={{ backgroundImage: "url('/assets/images/hero.png')" }}
    >
      <div className="container mx-auto text-center">
        <h1 className="text-4xl text-white font-bold">Michael J O'Hare</h1>
        <h2 className="text-2xl text-white mt-2 mb-4">Full Stack Developer</h2>
        <Link href="/Resume/Michael_O'Hare_Resume.pdf">
          <button className="inline-block bg-black text-white py-2 px-4 rounded hover:bg-gray-800 transition duration-300">
            Resume
          </button>
        </Link>
      </div>
      <nav>
        <Link href="/" passHref>
          <strong>Home</strong>
        </Link>
        <details>
          <summary>Side Projects</summary>
          <ul>
            <li>
              <Link href="/projects/chess" passHref>
                Play Chess (ft. Stockfish)
              </Link>
            </li>
            <li>
              <a href="https://github.com/MichaelJOHare/chess-application2.0">
                Java Chess Application
              </a>
            </li>
            <li>
              <Link href="/projects/dino_game/" passHref>
                Dino Game
              </Link>
            </li>
            <li>
              <Link href="/projects/cube_threejs/" passHref>
                Cube
              </Link>
            </li>
            <li>
              <a href="https://github.com/MichaelJOHare/number-guess-game">
                Number Guessing Game
              </a>
            </li>
          </ul>
        </details>
      </nav>
    </div>
  );
};

export default HeroSection;
