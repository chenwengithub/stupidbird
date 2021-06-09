const rules = {
  required: {
    required: true,
    message: '必填',
  },

  int: {
    pattern: new RegExp(/^(0|([1-9]\d*))$/, 'g'),
    message: '输入有误',
  },

  float: {
    pattern: new RegExp(/^((0.(\d*[1-9]))|(([1-9]\d*).(\d*[1-9]))|([1-9]\d*)|0)$/, 'g'),
    message: '输入有误',
  },
};

export default rules;
