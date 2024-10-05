import { Media, Solution } from '@/payload-types';
import React from 'react';
import Text from './Text';
import TextImage from './TextImage';
import Highlight from './Highlight';
import TextVideo from './TextVideo';

interface ContentProps {
  item: NonNullable<Solution['details']['content']>[number];
}

const Content = ({ item }: ContentProps) => {
  switch (item.blockType) {
    case 'text':
      return <Text text={item.text_html as string} />;
    case 'text-image':
      return <TextImage text={item.text_html as string} image={item.image as Media} />;
    case 'highlight':
      return (
        <Highlight title={item.title} text={item.text} link={item.link} variant={item.variant} />
      );
    case 'text-video':
      return <TextVideo text={item.text_html as string} videoId={item.videoId as string} />;
    default:
      return null;
  }
};

export default Content;
