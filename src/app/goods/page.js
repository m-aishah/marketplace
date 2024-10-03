import listings from "../homePageData";
import ListingPage from "../../components/ListingPage";

export default function GoodsPage() {
  const filters = [...new Set(listings.goods.map((listing) => listing.type))];

  return (
    <ListingPage
      listings={listings.goods}
      category="goods"
      title="Goods"
      filters={filters}
    />
  );
}
