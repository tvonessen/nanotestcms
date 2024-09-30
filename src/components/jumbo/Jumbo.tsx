import { getPayload } from 'payload';
import React from 'react';
import config from '@payload-config';
import JumboElements from './JumboElements';

const Jumbo = async () => {
  const payload = await getPayload({ config });
  const highlights = await payload
    .find({ collection: 'jumbotron', pagination: false })
    .then((res) => res.docs);

  return <JumboElements jumbos={highlights} />;
};

export default Jumbo;
