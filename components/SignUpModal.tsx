import SignUpForm from './SignUpForm';

export default function SignUpModal({ handleIsSignUp }: { handleIsSignUp: () => void }) {
  return (
    <div className="fixed top-0 left-0 flex justify-center items-center w-full h-full">
      <div className='flex flex-col border w-full max-w-xs text-sm bg-black rounded z-10'>
        <div className="flex justify-between items-center border-b">
          <h5 className="m-4 text-xl font-bold">Sign Up</h5>
          <button
            type="button"
            onClick={handleIsSignUp}
            className="m-4"
            aria-label="Close"
          >
            <span className="text-xl font-bold" aria-hidden="true">&times;</span>
          </button>
        </div>
        <SignUpForm />
      </div>
      <div className="fixed top-0 bottom-0 left-0 right-0 w-full h-full bg-black opacity-50"></div>
    </div>
  )
}