import listings from "../homePageData";
import ListingPage from "../../components/ListingPage";

export default function ApartmentsPage() {
  const filters = [
    ...new Set(listings.apartments.map((listing) => listing.type)),
  ];

  return (
    <ListingPage
      listings={listings.apartments}
      category="apartments"
      title="Apartments"
      filters={filters}
    />
  );
}
