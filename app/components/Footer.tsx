import Link from "next/link";
import siteMetadata from "@/data/siteMetadata";
import SocialIcon from "@/app/components/social-icons";

export default function Footer() {
  return (
    <footer>
      <div className="mt-16 flex flex-col items-center">
        <div className="mb-3 flex space-x-4 items-center">
          <SocialIcon
            kind="mail"
            href={`mailto:${siteMetadata.email}`}
            size={8}
          />
          <SocialIcon kind="github" href={siteMetadata.github} size={6} />
          <SocialIcon kind="linkedin" href={siteMetadata.linkedin} size={6} />
        </div>
        <div className="mb-2 flex space-x-2 text-sm text-gray-500 dark:text-gray-400">
          <div>{siteMetadata.author}</div>
          <div>{` • `}</div>
          <div>{`© ${new Date().getFullYear()}`}</div>
        </div>
        <div className="mb-8 text-sm text-gray-500 dark:text-gray-400">
          <Link href="https://github.com/MichaelJOHare/portfolio-website">
            Personal Portfolio Website
          </Link>
        </div>
      </div>
    </footer>
  );
}
