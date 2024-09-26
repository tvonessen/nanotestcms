import { Media, Solution } from '@/payload-types';
import React from 'react';
import Text from './Text';
import TextImage from './TextImage';

interface ContentProps {
  item: Solution['details']['content'][0];
}

const Content = ({ item }: ContentProps) => {
  switch (item.contentType) {
    case 'text':
      return <Text text={item.text_html as string} />;
    case 'textImage':
      return <TextImage text={item.text_html as string} image={item.image as Media} />;
    default:
      return null;
  }
};

export default Content;
