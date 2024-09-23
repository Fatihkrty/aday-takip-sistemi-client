export default function getDirtyFields(dirtyFields: any, formValues: any): any {
  if (typeof dirtyFields !== 'object' || dirtyFields === null || !formValues) {
    return {};
  }

  return Object.keys(dirtyFields).reduce((accumulator: any, key) => {
    const isDirty = dirtyFields[key];
    const value = formValues[key];

    // If it's an array, apply the logic recursively to each item
    if (Array.isArray(isDirty)) {
      // eslint-disable-next-line no-underscore-dangle
      const _dirtyFields = isDirty.map((item, index) => getDirtyFields(item, value[index]));
      if (_dirtyFields.length > 0) {
        // eslint-disable-next-line no-param-reassign
        accumulator[key] = _dirtyFields;
      }
    }
    // If it's an object, apply the logic recursively
    else if (typeof isDirty === 'object' && isDirty !== null) {
      // eslint-disable-next-line no-param-reassign
      accumulator[key] = getDirtyFields(isDirty, value);
    }
    // If it's a dirty field, get the value from formValues
    else if (isDirty) {
      // eslint-disable-next-line no-param-reassign
      accumulator[key] = value;
    }

    return accumulator;
  }, {});
}