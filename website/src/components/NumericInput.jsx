import { Input } from 'antd';
import { useState } from 'react';

const NumericInput = (props) => {
  const [value, setValue] = useState('');
  const {onValuesChange,..._props}=props
  const onChange = (e) => {
    const { value } = e.target;
    const reg = /^-?\d*(\.\d*)?$/;
    if ((!isNaN(value) && reg.test(value)) || value === '' || value === '-') {
      setValue(value);
      onValuesChange()
    }
  };

  return <Input {..._props} value={value} onChange={onChange} maxLength={5} />;
};

export default NumericInput;
