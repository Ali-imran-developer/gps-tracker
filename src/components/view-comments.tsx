import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

const ViewComments = ({
  page,
  totalPages,
  handlePrevious,
  handleNext,
  viewDialogOpen,
  setViewDialogOpen,
  data,
  loading,
}) => {
  return (
    <div>
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[calc(100vh-100px)]">
          <DialogHeader>
            <DialogTitle>View Comments</DialogTitle>
          </DialogHeader>

          {loading ? (
            <div className="flex justify-center items-center py-8">
              <div className="w-8 h-8 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
              <span className="ml-2">Loading comments...</span>
            </div>
          ) : (
            <div className="text-xs border rounded-md mb-4 overflow-x-auto">
              <div className="flex bg-gray-100 font-medium border-b">
                <span className="w-1/6 p-1 border-r">IMEI</span>
                <span className="w-1/6 p-1 border-r">Vehicle</span>
                <span className="w-1/6 p-1 border-r">Alert Type</span>
                <span className="w-2/6 p-1 border-r">Comments</span>
                <span className="w-1/6 p-1">Date Time</span>
              </div>

              <div className="overflow-x-auto">
                <div className="min-w-[900px]">
                  {Array.isArray(data) && data?.length > 0 ? ( data?.map((item, index) => (
                    <div key={index} className="flex border-b last:border-b-0 hover:bg-gray-50">
                        <span className="w-1/6 pe-1.5 py-1 border-r" title={item.imei}>
                          {item.imei}
                        </span>
                        <span className="w-1/6 p-1 border-r" title={item.vehicle}>
                          {item.vehicle}
                        </span>
                        <span className="w-1/6 p-1 border-r" title={item.alerttype}>
                          {item.alerttype}
                        </span>
                        <span className="w-2/6 p-1 border-r" title={item.comments}>
                          {item.comments}
                        </span>
                        <span className="w-1/6 p-1" title={item.DateTime}>
                          {item.DateTime}
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="flex justify-center items-center p-4 text-gray-500">
                      No comments available
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="flex items-center justify-end gap-2">
            <Button
              variant="outline"
              className="h-7 px-2 text-[10px] rounded-none"
              onClick={handlePrevious}
              disabled={page === 1}
            >
              <ChevronLeft className="w-3 h-3" />
              Previous
            </Button>

            <Button
              className="h-7 px-2 text-[10px] bg-[#04003A] hover:bg-blue-950 rounded-none"
              onClick={handleNext}
              disabled={page === totalPages}
            >
              Next
              <ChevronRight className="w-3 h-3" />
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ViewComments;