import Image from "next/image";
import Backpacking from "@/public/assets/images/backpacking.jpg";
import Backflip from "@/public/assets/images/backflip.jpg";

export default function AboutSection() {
  return (
    <div className="mx-3">
      <div className="mx-auto overflow-hidden md:max-w-3xl">
        <div className="md:flex">
          <div className="md:pr-6">
            <h2 className="text-2xl tracking-wide pb-2">Welcome!</h2>
            <p className="pb-7">
              Welcome to my website, it's still a work in progress so new things
              will keep on being added. I'm Michael (or Mike, whichever you
              prefer) and I'm in the process of transitioning from the
              healthcare field into software development through a full stack
              coding bootcamp called Tech Elevator. I love spending time
              outdoors doing things like backpacking, skiing, and fishing and
              having lived in Colorado for 10 years I was able to enjoy all of
              those quite a lot.
            </p>
          </div>
          <div className="md:shrink-0">
            <Image
              src={Backpacking}
              alt="Picture of backpacking"
              className="h-48 w-full object-cover md:h-full md:w-72"
              width={565}
              height={665}
              placeholder="blur"
            ></Image>
          </div>
        </div>
      </div>
      <div className="pt-7">
        <div className="mx-auto overflow-hidden md:max-w-3xl">
          <div className="flex flex-col md:flex-row-reverse">
            <div className="md:pl-6">
              <h2 className="text-2xl tracking-wide pb-2">
                Why software development?
              </h2>
              <p className="pb-7">
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
            <div className="md:shrink-0">
              <Image
                src={Backflip}
                alt="Picture of skier backflipping"
                className="h-48 w-full object-cover md:h-full md:w-72"
                style={{ objectPosition: "50% 25%" }}
                width={565}
                height={665}
                placeholder="blur"
              ></Image>
            </div>
          </div>
        </div>
      </div>
      <div className="pt-7">
        <div className="mx-auto overflow-hidden md:max-w-3xl">
          <h2 className="text-2xl tracking-wide pb-2">
            Where I'm at and where I'm going
          </h2>
          <p>
            As of 8/18/2023 I'm excited to share that I've graduated from Tech
            Elevator's rigorous Java coding bootcamp. With hundreds of hours
            spent learning vital software engineering skills, I hope to find a
            job at a company that's looking for someone who runs towards the
            difficult problems that no one else wants to touch. I'm a quick
            learner with a talent for solving complex problems efficiently.
            Having spent years in healthcare, I understand the importance of
            precision, attention to detail, and delivering high-quality work.
          </p>
          <p>
            If you, or someone you know, is looking to hire someone with those
            traits as well as a proven track record of dependability and strong
            work ethic you can get in touch with me through the contact info
            listed on my resume. Just click the blue resume button at the top of
            the page. I look forward to hearing from you!
          </p>
        </div>
      </div>
    </div>
  );
}
