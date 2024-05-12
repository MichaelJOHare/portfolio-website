import Image from "next/image";
import Backpacking from "@/public/assets/images/backpacking.jpg";
import Backflip from "@/public/assets/images/backflip.jpg";
import PicOfMe from "@/public/assets/images/me.png";

export default function AboutSection() {
  return (
    <div>
      <section className="pt-10 overflow-hidden md:pt-0 sm:pt-16 2xl:pt-16">
        <div className="px-4 mx-auto sm:px-6 lg:px-8 max-w-7xl">
          <div className="grid items-center grid-cols-1 md:grid-cols-2">
            <div className="px-4 pb-2 lg:pb-0">
              <h2 className="text-3xl font-bold leading-tight text-black dark:text-white sm:text-4xl lg:text-5xl">
                Hi 👋 I am <br className="block sm:hidden" />
                Michael O'Hare
              </h2>
              <p className="max-w-lg mt-3 text-xl leading-relaxed text-black dark:text-gray-300 md:mt-8">
                Welcome to my website, it's still a work in progress so new
                things will keep on being added. I'm Michael (or Mike, whichever
                you prefer) and I'm in the process of transitioning from the
                healthcare field into software development through a full stack
                coding bootcamp called Tech Elevator. I love spending time
                outdoors doing things like backpacking, skiing, and fishing and
                having lived in Colorado for 10 years I was able to enjoy all of
                those quite a lot.
              </p>
            </div>

            <div className="relative">
              <Image
                src={PicOfMe}
                alt="picture of me"
                className="relative w-full xl:max-w-lg xl:mx-auto 2xl:origin-bottom 2xl:scale-110"
                width={565}
                height={665}
                placeholder="blur"
              ></Image>
            </div>
          </div>
        </div>
      </section>
      <section className="pt-10 overflow-hidden sm:pt-16 2xl:pt-16">
        <div className=" mx-auto sm:px-6 lg:px-8 max-w-7xl">
          <div className="grid items-center grid-cols-1 md:grid-cols-2">
            <div className="relative">
              <Image
                src={Backflip}
                alt="picture of me"
                className="relative px-4 w-full xl:max-w-lg xl:mx-auto 2xl:origin-bottom 2xl:scale-110"
                width={565}
                height={665}
                placeholder="blur"
              ></Image>
            </div>
            <div className="px-4">
              <h2 className="text-3xl font-bold leading-tight text-black dark:text-white sm:text-4xl lg:text-5xl">
                Why software development?
              </h2>
              <p className="max-w-lg mt-3 text-xl leading-relaxed text-black dark:text-gray-300 md:mt-8">
                Throughout my life I've always had a deep appreciation for
                learning how things work, how they break and most importantly -
                how to fix them. From cars or dirt bikes to computer hardware or
                software, I've used this strength to break down large problems
                into the individual parts that make the whole. Over the years, I
                have gained valuable experience in a multitude of roles and
                industries but one thing that always felt like it was missing
                was the sort of mental stimulation that I've found with coding.
                The process of figuring something out, from step one all the way
                through to a finished product is something I've always loved and
                to be able to do it for a career would be a dream come true.
              </p>
            </div>
          </div>
        </div>
      </section>
      <section className="pt-10 overflow-hidden md:pt-0 sm:pt-16 2xl:pt-16">
        <div className="px-4 mx-auto sm:px-6 lg:px-8 max-w-7xl">
          <div className="grid items-center grid-cols-1 md:grid-cols-2">
            <div className="px-4 pb-2 lg:pb-0">
              <h2 className="text-3xl font-bold leading-tight text-black dark:text-white sm:text-4xl lg:text-5xl">
                Where I'm at and where I'm going
              </h2>
              <p className="max-w-lg mt-3 text-xl leading-relaxed text-black dark:text-gray-300 md:mt-8">
                <p>
                  As of 8/18/2023 I'm excited to share that I've graduated from
                  Tech Elevator's rigorous Java coding bootcamp. With hundreds
                  of hours spent learning vital software engineering skills, I
                  hope to find a job at a company that's looking for someone who
                  runs towards the difficult problems that no one else wants to
                  touch. I'm a quick learner with a talent for solving complex
                  problems efficiently. Having spent years in healthcare, I
                  understand the importance of precision, attention to detail,
                  and delivering high-quality work.
                </p>
                <p>
                  If you, or someone you know, is looking to hire someone with
                  those traits as well as a proven track record of dependability
                  and strong work ethic you can get in touch with me through the
                  contact info listed on my resume. Just click the blue resume
                  button at the top of the page. I look forward to hearing from
                  you!
                </p>
              </p>
            </div>

            <div className="relative">
              <Image
                src={Backpacking}
                alt="Picture of backpacking"
                className="relative px-4 w-full xl:max-w-lg xl:mx-auto 2xl:origin-bottom 2xl:scale-110"
                width={565}
                height={665}
                placeholder="blur"
              ></Image>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
