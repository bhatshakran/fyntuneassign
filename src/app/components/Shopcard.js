import { useDispatch } from 'react-redux';
import { deleteShop } from '../../features/shop/shopSlice';
import { CiLocationArrow1 } from 'react-icons/ci';
import { MdOutlineCategory, MdOutlineDelete } from 'react-icons/md';
import { AiOutlineEdit } from 'react-icons/ai';
import { CARDICON } from '../lib/staticData';

export function showShopStatus(openingDate, closingDate) {
  const currentDate = Date.parse(new Date().toLocaleDateString());

  // console.log(currentDate, name);
  // console.log(Date.parse(openingDate));
  // console.log(Date.parse(closingDate));
  if (
    currentDate > Date.parse(openingDate) &&
    currentDate < Date.parse(closingDate)
  ) {
    return true;
  } else {
    return false;
  }
}

export const ShopCard = ({ data, deleteShopCb }) => {
  const dispatch = useDispatch();
  const { name, area, category, _id, openingDate, closingDate } = data;

  const deleteShopFromStore = () => {
    deleteShopCb();
    dispatch(deleteShop(_id));
  };

  return (
    <div className='border border-blue-900 border-opacity-50 w-full py-3 px-6 text-black rounded-md text-sm '>
      <div className='flex justify-between   gap-3 items-center'>
        <div className='flex flex-col gap-2'>
          <h3 className='font-mono tracking-tighter text-blue-900 font-semibold'>
            {name}
          </h3>

          <div className='opacity-70 flex items-center gap-1 '>
            <MdOutlineCategory className='' />
            <h3>{category}</h3>
          </div>
          <div className='opacity-60 flex items-center gap-1'>
            <CiLocationArrow1 />
            <h3>{area}</h3>
          </div>
          <div className='opacity-60 flex items-center gap-1'>
            Status:
            {showShopStatus(openingDate, closingDate) ? 'Open' : 'Closed'}
          </div>
        </div>
        <div className=' gap-4 flex items-center'>
          <div className={CARDICON}>
            <AiOutlineEdit />
          </div>
          {/*    <div className={CARDICON}>
            <AiOutlineInfoCircle />
          </div> */}

          <div className={CARDICON} onClick={deleteShopFromStore}>
            <MdOutlineDelete />
          </div>
        </div>
      </div>
    </div>
  );
};
