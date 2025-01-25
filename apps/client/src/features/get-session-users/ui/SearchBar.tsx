import { IoClose } from 'react-icons/io5';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

function SearchBar({ value, onChange }: Readonly<SearchBarProps>) {
  return (
    <div className='relative w-full'>
      <input
        type='text'
        value={value}
        placeholder='유저 이름을 검색하세요'
        className='w-full rounded border-gray-500 p-2 pr-8 text-sm font-medium text-gray-500 focus:outline-none'
        onChange={(e) => onChange(e.target.value)}
      />
      {value && (
        <IoClose
          size={20}
          className='absolute right-2 top-2 cursor-pointer text-gray-500 transition-all duration-100 hover:scale-110 hover:text-gray-700'
          onClick={() => onChange('')}
        />
      )}
    </div>
  );
}

export default SearchBar;
