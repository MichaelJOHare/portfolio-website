import siteMetadata from "@/data/siteMetadata";
import headerNavLinks from "@/data/headerNavLinks";
import Logo from "@/data/logo.svg";
import SocialIcon from "./social-icons";
import Link from "next/link";
import MobileNav from "./MobileNav";
import ThemeSwitcher from "./ThemeSwitcher";

const Header = () => {
  return (
    <header className="flex items-center justify-between pb-5 pt-5">
      <div>
        <Link href="/" aria-label={siteMetadata.headerTitle}>
          <div className="flex items-center justify-between">
            <div className="mr-3 mt-1">
              <Logo />
            </div>
            {typeof siteMetadata.headerTitle === "string" ? (
              <div className="hidden mb-2 h-6 text-2xl font-semibold xs:block">
                {siteMetadata.headerTitle}
              </div>
            ) : (
              siteMetadata.headerTitle
            )}
          </div>
        </Link>
      </div>
      <div className="flex items-center space-x-4 leading-5 sm:space-x-6">
        {headerNavLinks
          .filter((link) => link.href !== "/")
          .map((link) => (
            <Link
              key={link.title}
              href={link.href}
              className="hidden font-medium text-gray-900 dark:text-gray-100 xs:block"
            >
              {link.title}
            </Link>
          ))}
        <div className="group relative">
          <SocialIcon
            kind="pdf"
            href="/assets/resume/Michael_O'Hare_Resume.pdf"
            size={8}
          />
          <span
            role="tooltip"
            className="pointer-events-none absolute px-2 py-2 -top-7 -left-4 w-max opacity-0 transition-opacity group-hover:opacity-100 text-sm font-medium text-white duration-300 bg-gray-900 rounded-lg shadow-sm dark:bg-gray-800"
          >
            Resume
          </span>
        </div>
        <ThemeSwitcher />
        <MobileNav />
      </div>
    </header>
  );
};

export default Header;
