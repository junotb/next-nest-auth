type Props = {
  message: string;
};

export default function LoginAlert({ message }: Props) {
  return (
    <div
      className='relative bottom-0 p-4 w-80 bg-white rounded'
      role='alert'
    >
      <p className='text-black'>{message}</p>
    </div>
  );
}