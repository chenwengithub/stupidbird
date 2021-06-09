import React, { useState } from 'react';

import Instore from './instore';
import Outstore from './outstore';

const Index = (props) => {
  const [type, setType] = useState('instore');
  return type === 'instore' ? <Instore setType={setType} /> : <Outstore setType={setType} />;
};
export default Index;
