import { createSlice } from '@reduxjs/toolkit';

const SHOPS_DATA = [
  {
    area: 'Thane',
    category: 'Grocery',
    name: 'Jain Grocery',
    _id: '1',
    openingDate: '12/07/2022',
    closingDate: '12/09/2022',
  },
  {
    area: 'Pune',
    category: 'Butcher',
    name: 'Meat & Treat ',
    _id: '2',
    openingDate: '01/07/2022',
    closingDate: '01/09/2022',
  },
  {
    area: 'Mumbai Suburban',
    category: 'Baker',
    name: 'Jon Bakers',
    _id: '3',
    openingDate: '12/05/2022',
    closingDate: '12/29/2022',
  },
  {
    area: 'Nashik',
    category: 'Chemist',
    name: 'Khandani Dawakhana',
    _id: '4',
    openingDate: '12/09/2022',
    closingDate: '12/22/2022',
  },
  {
    area: 'Nagpur',
    category: 'Stationary ',
    name: 'Pens & Pals',
    _id: '5',
    openingDate: '04/05/2022',
    closingDate: '05/06/2022',
  },
  {
    area: 'Ahmednagar',
    category: 'Icecream',
    name: 'Crème Glacée',
    _id: '6',
    openingDate: '06/07/2022',
    closingDate: '06/18/2022',
  },
  {
    area: 'Solapur',
    category: 'Clothing',
    name: 'Fashion Fiesta',
    _id: '7',
    openingDate: '12/05/2022',
    closingDate: '12/29/2022',
  },
];

const initialState = {
  shops: SHOPS_DATA,
  status: 'idle',
};

export const shopSlice = createSlice({
  name: 'shops',
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    setLocalStorage: (state) => {
      localStorage.setItem('shops', JSON.stringify(initialState.shops));
      return state;
    },

    getAllShops: () => {
      return localStorage.getItem('shops')
        ? JSON.parse(localStorage.getItem('shops'))
        : 'No shops available. Add some shops';
    },
    addShop: (state, action) => {
      let shopsFromStorage = JSON.parse(localStorage.getItem('shops'));
      let updatedShops = [...shopsFromStorage, action.payload];
      localStorage.setItem('shops', JSON.stringify(updatedShops));
      state.shops = updatedShops;
    },
    deleteShop: (state, action) => {
      const shopsFromStorage = JSON.parse(localStorage.getItem('shops'));
      const updatedShops = shopsFromStorage.filter(
        (shop) => shop._id !== action.payload
      );

      localStorage.setItem('shops', JSON.stringify(updatedShops));

      state.shops = updatedShops;
    },
  },
  // The `extraReducers` field lets the slice handle actions defined elsewhere,
  // including actions generated by createAsyncThunk or in other slices.
  extraReducers: () => {},
});

export const { setLocalStorage, getAllShops, addShop, deleteShop } =
  shopSlice.actions;

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.counter.value)`
export const shopsDataCount = (state) => {
  if (state.shops.shops) {
    return state.shops.shops;
  } else {
    return null;
  }
};

export default shopSlice.reducer;