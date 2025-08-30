import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="text-center bg-white p-8 shadow-lg rounded-lg max-w-md w-full">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Welcome to the Knowledge Hub</h1>
        <p className="text-gray-600 mb-6">
          Create, manage, and search your team’s documents in one place.
        </p>
        <div className="space-y-4">
          <button
            onClick={() => navigate("/register")}
            className="bg-blue-500 text-white px-6 py-3 rounded-lg w-full hover:bg-blue-600 transition duration-300"
          >
            Register
          </button>
          <button
            onClick={() => navigate("/login")}
            className="bg-green-500 text-white px-6 py-3 rounded-lg w-full hover:bg-green-600 transition duration-300"
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
}
