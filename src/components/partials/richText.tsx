import React from 'react';
import '@/styles/richText.scss';

const RichText = ({ text, className }: { text: string; className?: string }) => {
  return <div className={`${className} rich-text`} dangerouslySetInnerHTML={{ __html: text }} />;
};

export default RichText;
