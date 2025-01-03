import React from 'react';

interface HighlightProps {
  variant?: 'primary' | 'secondary';
}

const Highlight = ({ variant = 'primary' }: HighlightProps) => {
  const gradient =
    variant === 'primary'
      ? 'from-primary-600 to-primary-900 dark:from-primary-200 dark:to-primary'
      : 'from-secondary-600 to-secondary-900 dark:from-secondary-200 dark:to-secondary';

  const textGradient =
    variant === 'primary'
      ? 'from-primary-200 to-white dark:to-primary-700 dark:from-black'
      : 'from-secondary-200 to-white dark:to-secondary-700 dark:from-black';

  return (
    <div className={`w-full my-16 py-12 shadow-inner bg-fixed bg-gradient-to-t ${gradient}`}>
      <div className="container mx-auto px-8 text-background font-medium">
        <h2
          className={`text-3xl font-extrabold bg-clip-text bg-gradient-to-t text-transparent mb-4 ${textGradient}`}
        >
          We are thermal experts
        </h2>
        <p className="text-lg">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Amet facere odit exercitationem
          asperiores nesciunt laudantium corrupti dolor voluptatum omnis velit. Accusamus quaerat
          saepe corrupti dolore non architecto culpa, animi nesciunt.
        </p>
      </div>
    </div>
  );
};

export default Highlight;
