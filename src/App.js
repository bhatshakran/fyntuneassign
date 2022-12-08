import React from 'react';
import logo from './imgs/logo.png';
import { AiOutlineCloseCircle } from 'react-icons/ai';

import { useDispatch, useSelector } from 'react-redux';
import { addShop, shopsDataCount } from './features/shop/shopSlice';
import {
  AREAS,
  BTNCLASS,
  MAINWINDOW,
  FILTERBTN,
  FORMGROUPCLASS,
  INPUTCLASS,
  LABELCLASS,
  ERRORCLASS,
  CATEGORIES,
  ACTIVEBTN,
} from './app/lib/staticData';
import { ShopCard, showShopStatus } from './app/components/Shopcard';

function App() {
  const [conditionalState, setConditionalState] = React.useState('shops');

  let [errors, setErrors] = React.useState({});

  const [activeFilterWindow, setActiveFilterWindow] = React.useState(false);

  const nameRef = React.useRef('');
  const areaRef = React.useRef('');
  const categoryRef = React.useRef('');
  const openingdateRef = React.useRef('');
  const closingdateRef = React.useRef('');
  const dispatch = useDispatch();

  let SHOPS_DATA = useSelector(shopsDataCount);
  let reversedShopData = [...SHOPS_DATA].reverse();

  const initialState = React.useRef(reversedShopData);

  const [dataState, setDataState] = React.useState(reversedShopData);

  function runValidation() {
    const name = nameRef.current;
    const area = areaRef.current;
    const category = categoryRef.current;
    const openingdate = openingdateRef.current;
    const closingdate = closingdateRef.current;
    // check if name of the shop contains only alphabets
    let errors = {};

    const onlyAlphabetsPattern = /^[a-zA-Z]+$/;
    const isNameValid = onlyAlphabetsPattern.test(name);
    const isAreaValid = area.value === 'none' ? false : true;
    const isCategoryValid = category.value === 'none' ? false : true;
    const isOpeningDateValid = openingdate.length > 0 && true;
    let isClosingDateValid;

    if (closingdate.length > 0) {
      if (Date.parse(openingdate) < Date.parse(closingdate)) {
        isClosingDateValid = true;
      } else isClosingDateValid = false;
    } else isClosingDateValid = false;

    const validationArray = [
      { isNameValid: isNameValid },
      { isAreaValid: isAreaValid },
      { isCategoryValid: isCategoryValid },
      { isOpeningDateValid: isOpeningDateValid },
      { isClosingDateValid: isClosingDateValid },
    ];

    validationArray.map((item) =>
      Object.keys(item).forEach((objItem) => {
        errors[objItem] = item[objItem];
      })
    );

    setErrors(errors);

    return errors;
  }

  const createShop = () => {
    const name = nameRef.current;
    const area = areaRef.current;
    const category = categoryRef.current;
    const openingdate = openingdateRef.current;
    const closingdate = closingdateRef.current;
    // validate all the inputs

    const errors = runValidation();
    if (Object.values(errors).some((item) => item === false)) {
      return;
    } else {
      setDataState((state) => [shopDetails, ...state]);
      const shopDetails = {
        name,
        area,
        category,
        openingDate: new Date(openingdate).toLocaleDateString(),
        closingDate: new Date(closingdate).toLocaleDateString(),
        _id: Number(SHOPS_DATA.length + 1),
      };
      dispatch(addShop(shopDetails));
      setConditionalState('shops');
    }
  };

  const displayFilterModal = () => {
    setActiveFilterWindow(!activeFilterWindow);
  };

  const applyFilters = () => {
    console.log('apply filter ran');
    const filterGroup = document.getElementById('filterGroup');
    let selectedFilters = filterGroup.querySelectorAll(
      'input[type="checkbox"]:checked'
    );

    let allLabels = filterGroup.querySelectorAll('label');
    const allLabelsArray = Array.from(allLabels);

    selectedFilters = Array.from(selectedFilters);

    let areaFilters = [];
    let categoryFilters = [];
    let statusFilters = [];

    selectedFilters.forEach((filter) => {
      allLabelsArray.forEach((item) => {
        if (item.htmlFor === filter.id) {
          if (filter.name === 'area') {
            areaFilters.push(filter.id);
          } else if (filter.name === 'category') {
            categoryFilters.push(filter.id);
          } else {
            statusFilters.push(filter.id);
          }
        }
      });
    });

    // console.log(areaFilters, categoryFilters, statusFilters);

    let filteredList;
    // filter shoplist by area
    if (areaFilters.length > 0) {
      filteredList = reversedShopData.filter((item) =>
        areaFilters.some((itm) => itm === item.area)
      );
    }

    // filter shoplist by category
    if (categoryFilters.length > 0) {
      if (!filteredList) {
        filteredList = reversedShopData.filter((item) =>
          categoryFilters.some((itm) => itm === item.category)
        );
      } else {
        filteredList = filteredList.filter((item) =>
          categoryFilters.some((itm) => itm === item.category)
        );
      }
    }

    // filter shoplist by status
    if (statusFilters.length > 0) {
      if (!filteredList) {
        filteredList = reversedShopData.filter((item) => {
          return statusFilters.some((itm) => {
            const status = showShopStatus(item.openingDate, item.closingDate);
            //  true false
            if (status === true) {
              return itm === 'open';
            } else {
              return itm === 'closed';
            }
          });
        });
      } else {
        filteredList = filteredList.filter((item) => {
          return statusFilters.some((itm) => {
            const status = showShopStatus(item.openingDate, item.closingDate);
            //  true false
            if (status === true) {
              return itm === 'open';
            } else {
              return itm === 'closed';
            }
          });
        });
      }
    }

    // console.log(filteredList);

    if (filteredList && filteredList.length === 0) {
      console.log('no result found');
      setDataState([]);
    } else if (!filteredList) {
      setDataState([]);
    } else {
      setDataState(filteredList);
    }
    setActiveFilterWindow(false);
  };

  const clearFilters = () => {
    console.log(initialState);
    setDataState(initialState.current);
  };

  const deleteShopCallback = (id) => {
    const flushedState = dataState.filter((item) => item._id !== id);
    setDataState(flushedState);
  };

  function showFilteredOrActual() {
    if (dataState && dataState.length === 0) {
      return (
        <div className='text-gray-500 font-bold'>
          No data found for the selected filters!
          <br />
          You can clear the filters.
        </div>
      );
    } else {
      return (
        dataState &&
        dataState.map((item) => {
          return (
            <ShopCard
              data={item}
              key={item._id}
              deleteShopCb={deleteShopCallback}
            />
          );
        })
      );
    }
  }

  return (
    <main className='min-h-screen md:overflow-hidden md:h-screen flex justify-center relative '>
      {activeFilterWindow ? (
        <div className='bg-white w-full h-full md:h-2/3 md:w-2/3 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2  z-20 text-black overflow-scroll font-mono py-3 px-8 border border-blue-900 rounded-md '>
          <div className='w-full flex justify-between items-center text-blue-900'>
            <h2 className=' text-lg'>Filters</h2>
            <div
              className='text-2xl cursor-pointer'
              onClick={() => {
                setActiveFilterWindow(false);
              }}
            >
              <AiOutlineCloseCircle />
            </div>
          </div>
          <div
            className='mt-6 flex justify-between flex-wrap gap-y-6'
            id='filterGroup'
          >
            <div className='w-full md:w-auto flex flex-col gap-1'>
              <label>By Area:</label>
              {AREAS.map((area, idx) => {
                return (
                  <div className='flex gap-1' key={idx}>
                    <input type='checkbox' id={area} name='area' value={area} />
                    <label htmlFor={area}>{area}</label>
                  </div>
                );
              })}
            </div>
            <div className='w-full md:w-auto flex flex-col gap-1'>
              <label>By Category:</label>
              {CATEGORIES.map((category, idx) => {
                return (
                  <div className='flex gap-1' key={idx}>
                    <input
                      type='checkbox'
                      id={category}
                      name='category'
                      value={category}
                    />
                    <label htmlFor={category}>{category}</label>
                  </div>
                );
              })}
            </div>
            <div className='w-full md:w-auto flex flex-col gap-1'>
              <label>By Status:</label>
              <div className='flex gap-1'>
                <input type='checkbox' id='open' name='status' value='open' />
                <label htmlFor='open'>Open</label>
                <input
                  type='checkbox'
                  id='closed'
                  name='status'
                  value='closed'
                />
                <label htmlFor='closed'>Closed</label>
              </div>
            </div>
          </div>
          <div className='mt-4'>
            <button className={BTNCLASS} onClick={applyFilters}>
              Apply Filters
            </button>
          </div>
        </div>
      ) : (
        <div className={MAINWINDOW}>
          <div className='flex flex-col items-center w-full  md:1/3 justify-center mt-16 gap-1'>
            <img
              src={logo}
              alt='app-logo'
              height={80}
              width={80}
              className='h-20 w-20 md:h-40 md:w-40'
            />
            <h2 className='text-2xl lg:text-3xl font-mono tracking-wide  border-gray-300 p-3 text-blue-900 rounded-md text-opacity-80'>
              Shop-Stop
            </h2>

            <div className='mt-8 w-full flex justify-center gap-2 font-mono'>
              <button
                className={` ${
                  conditionalState === 'shops' ? ACTIVEBTN : BTNCLASS
                }`}
                onClick={() => {
                  setErrors({});
                  setConditionalState('shops');
                }}
              >
                All Shops
              </button>
              <button
                className={` ${
                  conditionalState === 'newshop' ? ACTIVEBTN : BTNCLASS
                }`}
                onClick={() => {
                  setErrors({});
                  setConditionalState('newshop');
                }}
              >
                Add New Shop
              </button>
            </div>
          </div>

          <div className='w-full md:2/3 retative'>
            {conditionalState === 'shops' ? (
              <>
                <div className='w-full flex justify-between items-center sticky top-0 bg-white py-3 z-10 md:static'>
                  <button className={FILTERBTN} onClick={displayFilterModal}>
                    Filter
                  </button>
                  <button className={FILTERBTN} onClick={clearFilters}>
                    Clear Filters & Reset
                  </button>
                </div>
                <p className='opacity-40 hidden md:block mt-4 text-xs italic '>
                  **Scroll down the list to view all the shops**
                </p>
                <div className=' mt-8 flex flex-col gap-2    md:overflow-y-scroll mb-4 border border-blue-900  border-opacity-60 p-3 shoplist rounded-md'>
                  {showFilteredOrActual()}
                </div>
              </>
            ) : (
              <div className='mt-16 md:mt-6'>
                <h2 className='font-mono text-3xl  text-blue-900 p-2'>
                  Create new shop
                </h2>
                <form className='mt-5 flex flex-col items-center gap-6 font-mono pb-12'>
                  <div className={FORMGROUPCLASS}>
                    <input
                      ref={nameRef}
                      type='text'
                      placeholder='name'
                      id='name'
                      required
                      onChange={(e) => {
                        nameRef.current = e.target.value;
                      }}
                      className='capitalize p-2 w-full border-b border-gray-300 focus:outline-none focus:border-blue-900 focus:border-b-2'
                    />

                    {Object.keys(errors).length > 0 && !errors.isNameValid ? (
                      <p className={ERRORCLASS}>Name is not valid</p>
                    ) : (
                      ''
                    )}
                  </div>
                  <div className={FORMGROUPCLASS}>
                    <label className={LABELCLASS}>Area</label>
                    <select
                      ref={areaRef}
                      name='area'
                      id='area'
                      className={`${INPUTCLASS} capitalize`}
                      required
                      onChange={(e) => {
                        areaRef.current = e.target.value;
                      }}
                    >
                      <option value={'none'}>none</option>

                      {AREAS.map((item, idx) => {
                        return (
                          <option value={item} key={idx}>
                            {item}
                          </option>
                        );
                      })}
                    </select>
                    {Object.keys(errors).length > 0 && !errors.isAreaValid ? (
                      <p className={ERRORCLASS}>Area is not valid</p>
                    ) : (
                      ''
                    )}
                  </div>
                  <div className={FORMGROUPCLASS}>
                    <label className={LABELCLASS}>Categories</label>
                    <select
                      ref={categoryRef}
                      name='category'
                      id='category'
                      required
                      className={`${INPUTCLASS} capitalize`}
                      onChange={(e) => {
                        categoryRef.current = e.target.value;
                      }}
                    >
                      <option value={'none'}>none</option>
                      {CATEGORIES.map((item, idx) => {
                        return (
                          <option value={item} key={idx}>
                            {item}
                          </option>
                        );
                      })}
                    </select>
                    {Object.keys(errors).length > 0 &&
                    !errors.isCategoryValid ? (
                      <p className={ERRORCLASS}>Category is not valid</p>
                    ) : (
                      ''
                    )}
                  </div>

                  <div className={FORMGROUPCLASS}>
                    <label className={LABELCLASS}>Opening Date</label>
                    <input
                      ref={openingdateRef}
                      type='date'
                      className={INPUTCLASS}
                      name='openingdate'
                      id='openingdate'
                      required
                      onChange={(e) => {
                        openingdateRef.current = e.target.value;
                      }}
                    />
                    {Object.keys(errors).length > 0 &&
                    !errors.isClosingDateValid ? (
                      <p className={ERRORCLASS}>Date is not valid</p>
                    ) : (
                      ''
                    )}
                  </div>
                  <div className={FORMGROUPCLASS}>
                    <label className={LABELCLASS}>Closing Date</label>
                    <input
                      ref={closingdateRef}
                      type='date'
                      className={INPUTCLASS}
                      name='closingdate'
                      id='closingdate'
                      required
                      onChange={(e) => {
                        closingdateRef.current = e.target.value;
                      }}
                    />
                    {Object.keys(errors).length > 0 &&
                    !errors.isOpeningDateValid ? (
                      <p className={ERRORCLASS}>Date is not valid</p>
                    ) : (
                      ''
                    )}
                  </div>

                  <div className={FORMGROUPCLASS}>
                    <button
                      type='button'
                      onClick={createShop}
                      className={`${BTNCLASS} bg-blue-900 text-white w-full`}
                    >
                      Add
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
}

export default App;
