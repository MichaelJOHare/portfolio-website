"use client";

import React from "react";
import { Skier, ChevronDown } from "./Icons";
import { Dropdown } from "@nextui-org/dropdown";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Link,
  Button,
  DropdownItem,
  DropdownTrigger,
  DropdownMenu,
} from "@nextui-org/react";

export default function NavigationBar() {
  const icons = {
    chevron: <ChevronDown fill="currentColor" size={16} />,
  };
  return (
    <Navbar>
      <NavbarBrand>
        <Skier />
        <p className="font-bold text-inherit">Michael J O'Hare</p>
      </NavbarBrand>
      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        <Link color="foreground" href="/">
          Home
        </Link>
        <Dropdown>
          <NavbarItem>
            <DropdownTrigger>
              <Button
                disableRipple
                className="p-0 bg-transparent data-[hover=true]:bg-transparent"
                endContent={icons.chevron}
                radius="sm"
                variant="light"
              >
                Projects
              </Button>
            </DropdownTrigger>
          </NavbarItem>
          <DropdownMenu
            aria-label="Projects"
            //className="w-[340px]"
            itemClasses={{
              base: "gap-4",
            }}
          >
            <DropdownItem>
              <Link href="/projects/chess">Play Chess (ft. Stockfish)</Link>
            </DropdownItem>
            <DropdownItem>
              <Link
                isExternal
                href="https://github.com/MichaelJOHare/chess-application2.0"
                showAnchorIcon
              >
                Java Chess Application
              </Link>
            </DropdownItem>
            <DropdownItem>
              <Link href="/projects/dino_game/">Dino Game</Link>
            </DropdownItem>
            <DropdownItem>
              <Link href="/projects/cube_threejs/">Cube</Link>
            </DropdownItem>
            <DropdownItem>
              <Link
                isExternal
                href="https://github.com/MichaelJOHare/number-guess-game"
                showAnchorIcon
              >
                Number Guessing Game
              </Link>
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </NavbarContent>
      <NavbarContent justify="end">
        <Link href="/assets/resume/Michael_O'Hare_Resume.pdf"></Link>
      </NavbarContent>
    </Navbar>
  );
}
