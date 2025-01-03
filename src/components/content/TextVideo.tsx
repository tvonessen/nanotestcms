import React from 'react';
import RichText from '../partials/richText';

interface TextVideoProps {
  text: string;
  videoId: string;
}

const TextVideo = ({ text, videoId }: TextVideoProps) => {
  return (
    <>
      <aside className="container mx-auto col-span-12 lg:col-span-5 xl:col-span-4 mt-4">
        <iframe
          title={text}
          src={`https://www.youtube-nocookie.com/embed/${videoId}?enablejsapi=1&rel=0&cc_load_policy=1&color=white`}
          className="w-full aspect-video rounded-lg shadow-md"
          allowFullScreen
        />
      </aside>
      <section className="col-span-12 lg:col-span-7 lg:col-start-6 xl:col-span-8 xl:col-start-5">
        <RichText text={text} />
      </section>
    </>
  );
};

export default TextVideo;
