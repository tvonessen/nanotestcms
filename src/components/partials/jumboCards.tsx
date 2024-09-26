import { ProductProps } from '@/types';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

export const JumboCard = ({ card }: { card: ProductProps }) => {
  return (
    <div className="group card bg-gradient-to-tl from-primary-900 to-primary-300 before:dark:!bg-background before:!bg-foreground image-full shadow-xl hover:scale-105 focus-within:scale-105 transition hover:z-20 focus-visible:z-20">
      <figure className="object-cover z-10">
        <Image
          alt="Shoes"
          className="min-h-full min-w-full group-hover:scale-110 group-hover:opacity-5 group-hover:blur-[1px] group-focus-within:blur-[1px] group-focus-within:scale-110 group-focus-within:opacity-5 transition duration-1000 ease-out"
          height={card.image.height}
          src={card.image.url}
          width={card.image.width}
        />
      </figure>
      <div className="card-body gap-0 opacity-0 hover:opacity-100 group-focus-within:opacity-100 transition z-20">
        <h2 className="text-2xl font-semibold text-white">{card.title}</h2>
        <small className="pb-3 text-primary-300">{card.subtitle}</small>
        <p className="text-default-200 dark:text-default-800">{card.description}</p>

        <div className="card-actions justify-end">
          <Link
            aria-label={`Learn more about ${card.title}`}
            className="mt-6 btn btn-primary btn-md focus-visible:outline-focus"
            href={card.href}
          >
            More about {card.title}
          </Link>
        </div>
      </div>
    </div>
  );
};

const JumboCards = ({ cards }: { cards: ProductProps[] }) => {
  return (
    <section className="container mx-auto px-6 sm:px-2 mt-12">
      <div className="flex flex-col gap-6 my-12">
        <h2 className="text-3xl text-center font-extrabold bg-clip-text text-transparent bg-gradient-to-tr from-secondary-700 to-secondary-400">
          Highlight Solutions
        </h2>
        <p className="px-6 md:px-8 lg:px-12 text-lg font-medium">
          We offer a variety of solutions to meet your needs. Explore our products below. Lorem
          ipsum dolor sit amet consectetur adipisicing elit. Distinctio asperiores fugiat expedita
          repellat vel optio ut. Laboriosam voluptatum molestiae iste maxime unde alias eius odio
          corrupti, eos facilis quis veritatis?
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-8 sm:gap-6">
        {cards.map((card, index) => (
          <JumboCard key={index} card={card} />
        ))}
      </div>
    </section>
  );
};

export default JumboCards;
