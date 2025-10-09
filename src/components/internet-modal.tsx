import { Button } from "@/components/ui/button";

export const NoInternetModal = ({ onRefresh }: { onRefresh: () => void }) => (
  <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[9999]">
    <div className="bg-white rounded-xl shadow-xl p-6 max-w-sm w-full text-center">
      <h2 className="text-xl font-bold text-red-600 mb-3">No Internet Connection</h2>
      <p className="text-gray-700 mb-4">
        Please check your internet connection. The app will reconnect automatically once you're online.
      </p>
      <Button onClick={onRefresh} className="bg-blue-600 hover:bg-blue-700 text-white w-full">
        Refresh
      </Button>
    </div>
  </div>
);
