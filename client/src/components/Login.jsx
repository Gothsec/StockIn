import Banner from '../assets/login-banner.png';

export default function Component() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Sección de la imagen */}
          <div className="hidden md:block">
            <img
              src={Banner} 
              alt="Login illustration"
              className="w-full h-full object-cover"
            />
          </div>
          
          {/* Sección de inicio de sesión */}
          <div className="p-8 flex flex-col justify-center">
            <div className="text-center mb-6">
              <h1 className="text-3xl font-bold text-gray-800">Welcome to StockIn</h1>
              <p className="text-gray-600">Sign in to your account</p>
            </div>
            <form className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="example@email.com"
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-700 focus:border-blue-700 sm:text-sm"
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Sign In
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
