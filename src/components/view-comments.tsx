import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const ViewComments = ({ viewDialogOpen, setViewDialogOpen, data, loading }) => {
  return (
    <div>
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-auto">
          <DialogHeader>
            <DialogTitle>View Comments</DialogTitle>
          </DialogHeader>
          
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <div className="w-8 h-8 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
              <span className="ml-2">Loading comments...</span>
            </div>
          ) : (
            <div className="text-xs border rounded-md overflow-hidden mb-4">
              <div className="flex bg-gray-100 font-medium border-b">
                <span className="w-1/6 p-1 border-r">IMEI</span>
                <span className="w-1/6 p-1 border-r">Vehicle</span>
                <span className="w-1/6 p-1 border-r">Alert Type</span>
                <span className="w-2/6 p-1 border-r">Comments</span>
                <span className="w-1/6 p-1">Date Time</span>
              </div>

              <div className="max-h-64 overflow-y-auto">
                {Array.isArray(data) && data?.length > 0 ? (
                  data?.map((item, index) => (
                    <div key={index} className="flex border-b last:border-b-0 hover:bg-gray-50">
                      <span className="w-1/6 p-1 border-r truncate" title={item.imei}>
                        {item.imei}
                      </span>
                      <span className="w-1/6 p-1 border-r truncate" title={item.vehicle}>
                        {item.vehicle}
                      </span>
                      <span className="w-1/6 p-1 border-r truncate" title={item.alerttype}>
                        {item.alerttype}
                      </span>
                      <span className="w-2/6 p-1 border-r truncate" title={item.comments}>
                        {item.comments}
                      </span>
                      <span className="w-1/6 p-1 truncate" title={item.DateTime}>
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
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ViewComments;