import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const ForgotPassword = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 text-center">
        <div className="flex items-center justify-center mb-8">
          <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
            <span className="text-white font-bold text-xl">B</span>
          </div>
          <span className="ml-3 text-2xl font-bold text-gray-800">bylogin</span>
        </div>

        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          Forgot Password
        </h1>
        <p className="text-gray-600 mb-8">
          Password recovery form coming soon! This is a placeholder page.
        </p>

        <Link to="/">
          <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
            Back to Login
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default ForgotPassword;
