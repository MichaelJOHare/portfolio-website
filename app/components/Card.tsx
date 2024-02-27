import Image from "next/image";
import Link from "next/link";

interface CardProps {
  title: string;
  description: string;
  imgSrc: string | undefined;
  href: string | undefined;
  playable?: boolean;
}

export const Card = ({
  title,
  description,
  imgSrc,
  href,
  playable,
}: CardProps) => (
  <div className="md max-w-[544px] p-4 md:w-1/2">
    <div
      className={`${
        imgSrc && "h-full"
      }  overflow-hidden rounded-md border-2 border-gray-200 border-opacity-60 dark:border-gray-700 hover:bg-slate-100 dark:hover:bg-zinc-800`}
    >
      {imgSrc &&
        (href ? (
          <Link href={href} aria-label={`Link to ${title}`}>
            <Image
              alt={title}
              src={imgSrc}
              className="object-cover md:h-36 lg:h-48"
              style={{ objectPosition: "50% 5%" }}
              width={544}
              height={306}
            />
          </Link>
        ) : (
          <Image
            alt={title}
            src={imgSrc}
            className="object-cover md:h-36 lg:h-48"
            style={{ objectPosition: "50% 5%" }}
            width={544}
            height={306}
          />
        ))}
      <div className="p-6">
        <h2 className="mb-3 text-2xl font-bold leading-8 tracking-tight">
          {href ? (
            <Link href={href} aria-label={`Link to ${title}`}>
              {title}
            </Link>
          ) : (
            title
          )}
        </h2>
        <p className="prose mb-3 max-w-none text-gray-500 dark:text-gray-400">
          {description}
        </p>
        {href && (
          <Link
            href={href}
            className="text-base font-medium leading-6 text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
            aria-label={`Link to ${title}`}
          >
            {playable ? "Play now" : "Learn more"} &rarr;
          </Link>
        )}
      </div>
    </div>
  </div>
);
