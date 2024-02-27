import AboutSection from "../components/AboutSection";

export default function Page() {
  return (
    <div className="divide-y divide-gray-200 dark:divide-gray-700">
      <div className="space-y-2 pb-8 pt-6 md:space-y-5">
        <h1 className="text-3xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl sm:leading-10 md:text-6xl md:leading-14">
          About Me
        </h1>
      </div>
      <div className="container py-12 max-w-none">
        <div className="-m-4 flex flex-wrap justify-center">
          <AboutSection />
        </div>
      </div>
    </div>
  );
}
