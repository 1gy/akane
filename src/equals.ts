export const shallowEquals = (object1: any, object2: any): boolean => {
  if (object1 === object2) {
    return true;
  }
  if (
    object1 === null ||
    typeof object1 !== 'object' ||
    object2 === null ||
    typeof object2 !== 'object'
  ) {
    return false;
  }
  const keys1 = Object.keys(object1);
  const keys2 = Object.keys(object2);
  if (keys1.length !== keys2.length) {
    return false;
  }
  for (const key of keys1) {
    if (!Object.prototype.hasOwnProperty.call(object2, key)) {
      return false;
    }
    if (!Object.is(object1[key], object2[key])) {
      return false;
    }
  }
  return true;
};
