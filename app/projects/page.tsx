import projectsData from "@/data/projectsData";
import { Card } from "@/app/components/Card";

export default function Projects() {
  return (
    <div className="divide-y divide-gray-200 dark:divide-gray-700">
      <div className="space-y-2 pb-8 pt-6 md:space-y-5">
        <h1 className="text-3xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl sm:leading-10 md:text-6xl md:leading-14">
          Projects
        </h1>
      </div>
      <div className="container py-12 2xl:max-w-none">
        <div className="-m-4 flex flex-wrap 3xl:justify-center">
          {projectsData.map((d) => (
            <Card
              key={d.title}
              title={d.title}
              description={d.description}
              imgSrc={d.imgSrc}
              href={d.href}
              playable={d.playable}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
