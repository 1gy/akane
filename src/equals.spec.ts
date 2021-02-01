import {shallowEquals} from './equals';

describe('shallowEquals', () => {
  it('shallow comparison', () => {
    expect(shallowEquals({ a:1, b:2 }, { a:1, b:2 })).toBeTruthy();
    expect(shallowEquals({ a:1, b:2 }, { a:1, b:3 })).toBeFalsy();
    expect(shallowEquals({ a:1, b:2 }, { a:1, b:2, c:3 })).toBeFalsy();
  });
  it('deep comparison', () => {
    expect(shallowEquals({ a: { b:2 } }, { a: { b:2 } })).toBeFalsy();
  });
});
