const QuickView = ({ quickViewData }) => {
    return (
      <div className="mt-6">
        <div className="text-xl font-semibold mb-4">Quick View</div>
        <div className="grid grid-cols-2 gap-6 bg-gray-50 p-4 rounded-lg">
          {/* Left Column */}
          <div className="space-y-2">
            <div className="flex">
              <div className="col-5 font-medium">Ad No</div>
              <div className="col-7 pl-4"><strong>{quickViewData.adNo}</strong></div>
            </div>
            <div className="flex">
              <div className="col-5 font-medium">Status</div>
              <div className="col-7 pl-4"><strong>{quickViewData.status}</strong></div>
            </div>
            <div className="flex">
              <div className="col-5 font-medium">Title Type</div>
              <div className="col-7 pl-4"><strong>{quickViewData.titleType}</strong></div>
            </div>
            <div className="flex">
              <div className="col-5 font-medium">Swap</div>
              <div className="col-7 pl-4"><strong>{quickViewData.swap}</strong></div>
            </div>
          </div>
  
          {/* Right Column */}
          <div className="space-y-2">
            <div className="flex">
              <div className="col-5 font-medium">Building Age</div>
              <div className="col-7 pl-4"><strong>{quickViewData.buildingAge} years</strong></div>
            </div>
            {/* <div className="flex">
              <div className="col-5 font-medium">Furnished</div>
              <div className="col-7 pl-4"><strong>{quickViewData.furnished}</strong></div>
            </div> */}
            <div className="flex">
              <div className="col-5 font-medium">Min. Rental Period</div>
              <div className="col-7 pl-4"><strong>{quickViewData.minRentalPeriod}</strong></div>
            </div>
            <div className="flex">
              <div className="col-5 font-medium">Published On</div>
              <div className="col-7 pl-4"><strong>{quickViewData.publishedOn}</strong></div>
            </div>
            <div className="flex">
              <div className="col-5 font-medium">Last Updated</div>
              <div className="col-7 pl-4"><strong>{quickViewData.lastUpdated}</strong></div>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  export default QuickView;
  