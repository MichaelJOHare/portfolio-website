import { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

export default function AboutSection({ children }: Props) {
  return (
    // about section where children are passed in
    <section className="mx-auto max-w-3xl px-4 sm:px-6 xl:max-w-5xl xl:px-0">
      {children}
    </section>
  );
}
