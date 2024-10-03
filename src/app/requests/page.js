import listings from "../homePageData";
import ListingPage from "../../components/ListingPage";

export default function RequestsPage() {
  const filters = [
    ...new Set(listings.apartments.map((listing) => listing.type)),
  ];

  return (
    <ListingPage
      listings={listings.requests}
      category="requests"
      title="Requests"
      filters={filters}
    />
  );
}
