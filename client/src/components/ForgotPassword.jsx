
export default function PasswordRecoveryDialog({ onClose }) {

  return (
    <>
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-50"
      />
      <div
        className="fixed inset-0 flex items-center justify-center z-50"
      >
        <div className="bg-white p-8 rounded-lg max-w-md w-full relative">
          <button
            onClick={onClose}
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold mb-2">Password Recovery</h2>
            <p className="text-gray-600">
              Enter your email address and we&#x27;ll send you a code to reset your password.
            </p>
          </div>
          <form className="space-y-4">
            <input
              type="email"
              placeholder="Enter your email"
              aria-label="Email"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="w-full px-4 py-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600"
            >
              Reset Password
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
