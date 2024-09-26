import React from 'react';
import RichText from '../partials/richText';

const Text = ({ text }: { text: string }) => {
  return (
    <section className="col-span-12 lg:col-start-6 lg:col-span-7 xl:col-start-5 xl:col-span-8">
      <RichText text={text} />
    </section>
  );
};

export default Text;
