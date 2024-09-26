import Image from "next/image";
import Link from "next/link";
import React from "react";

interface JumboProps {
  title: string;
  description: string;
  image: { url: string; width?: number; height?: number };
}

const Jumbo = ({ title, description, image }: JumboProps) => {
  return (
    <section className="w-screen h-screen max-h-[200vw] xl:h-[80vh] -mt-16 xl:mt-8 2xl:mt-10 xl:container mx-auto">
      <div className="w-full h-full bg-cover bg-center relative overflow-hidden ">
        <div className="h-full w-full absolute z-10 flex flex-col justify-end items-center xl:items-end text-center bg-gradient-to-t from-10% from-background to-30% to-transparent ">
          <div className="w-full -mb-2 px-8 pt-4 pb-8 flex flex-col items-center justify-center drop-shadow bg-white dark:bg-background bg-opacity-70 dark:bg-opacity-70">
            <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-tr from-primary-900 to-primary-600 dark:from-primary-600 dark:to-primary-300 mb-4">
              {title}
            </h1>
            <h2 className="text-2xl font-semibold mb-8">{description}</h2>
            <Link
              className="btn btn-primary btn-wide text-xl font-semibold text-background transition focus-visible:outline-focus"
              href="solutions/ttv"
            >
              Learn more
            </Link>
          </div>
        </div>
        <Image
          alt="card background"
          className="z-0 w-full h-full rounded-none xl:rounded-xl object-cover"
          height={image.height}
          src={image.url}
          width={image.width}
        />
      </div>
    </section>
  );
};

export default Jumbo;
