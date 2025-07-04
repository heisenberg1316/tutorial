import { atom, selector } from 'recoil';

export const countState = atom({
  key: 'countState', // unique ID (with respect to other atoms/selectors)
  default: 0,        // default value (aka initial value)
});


export const evenSelector = selector({
  key : "evenSelector",
  get : (props) => {
      const count = props.get(countAtom);
      return count % 2;
  }
})