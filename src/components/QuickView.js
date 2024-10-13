const QuickView = ({ quickViewData }) => {
  return (
    <div className="mt-6">
      <div className="text-xl font-semibold mb-4">Quick View</div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 p-4 rounded-lg">
        {/* Left Column */}
        <div className="space-y-2">
          <div className="flex">
            <div className="col-5 font-medium">Listing Type</div>
            <div className="col-7 pl-4"><strong>{quickViewData?.listingType || 'N/A'}</strong></div>
          </div>
          <div className="flex">
            <div className="col-5 font-medium">Location</div>
            <div className="col-7 pl-4"><strong>{quickViewData?.location || 'N/A'}</strong></div>
          </div>
          <div className="flex">
            <div className="col-5 font-medium">Category</div>
            <div className="col-7 pl-4"><strong>{quickViewData?.category || 'N/A'}</strong></div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-2">
          <div className="flex">
            <div className="col-5 font-medium">Posted On</div>
            <div className="col-7 pl-4"><strong>{new Date(quickViewData?.createdAt).toLocaleDateString() || 'N/A'}</strong></div>
          </div>
          <div className="flex">
            <div className="col-5 font-medium">Price</div>
            <div className="col-7 pl-4"><strong>${quickViewData?.price || 'N/A'}</strong></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickView;
