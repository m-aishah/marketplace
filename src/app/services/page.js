import listings from "../homePageData";
import ListingPage from "../../components/ListingPage";

export default function ServicesPage() {
  const filters = [
    ...new Set(listings.services.map((listing) => listing.type)),
  ];

  return (
    <ListingPage
      listings={listings.services}
      category="services"
      title="Services"
      filters={filters}
    />
  );
}
