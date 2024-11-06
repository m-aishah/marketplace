export const getFormConfig = (listingType) => {
  switch (listingType) {
    case "apartments":
      return {
        title: "Apartment",
        namePlaceholder: "e.g. Cozy Studio in Girne",
        descriptionPlaceholder:
          "Describe the apartment, its features, and location",
        pricePlaceholder: "Rent amount",
        priceLabel: "Rent*",
        locationPlaceholder: "e.g. Girne, Lefkoşa",
        additionalFields: [
          {
            refName: "paymentTypeRef",
            title: "paymentType",
            label: "Payment type*",
            type: "text",
            placeholder: "e.g. Daily, Weekly, Monthly, ...",
            required: true,
          },
          {
            refName: "bedroomsRef",
            title: "bedrooms",
            label: "Bedrooms*",
            type: "number",
            placeholder: "Number of bedrooms",
            required: true,
          },
          {
            refName: "bathroomsRef",
            title: "bathrooms",
            label: "Bathrooms*",
            type: "number",
            placeholder: "Number of bathrooms",
            required: true,
          },
        ],
      };
    case "products":
      return {
        title: "Product",
        namePlaceholder: "e.g. Smartphone",
        descriptionPlaceholder:
          "Describe the item, its condition, and any unique features",
        pricePlaceholder: "Price",
        priceLabel: "Price*",
        locationPlaceholder: "e.g. Girne, Lefkoşa",
        additionalFields: [
          {
            refName: "conditionRef",
            title: "condition",
            label: "Condition",
            type: "text",
            placeholder: "e.g. New, Used, Like New",
            required: true,
          },
          {
            refName: "brandRef",
            title: "brand",
            label: "Brand",
            type: "text",
            placeholder: "e.g. Apple, Samsung",
            required: false,
          },
        ],
      };
    case "services":
      return {
        title: "Service",
        namePlaceholder: "e.g. Freelance Graphic Designer",
        descriptionPlaceholder: "Describe your service and experience",
        pricePlaceholder: "Hourly rate or fixed price",
        priceLabel: "Price*",
        locationPlaceholder: "e.g. Girne, Lefkoşa",
        additionalFields: [
          {
            refName: "servicePaymentTypeRef",
            title: "paymentType",
            label: "Payment Type*",
            type: "text",
            placeholder: "e.g. one-time, hourly, ...",
            required: true,
          },
        ],
      };
    default:
      return {
        title: "Request",
        namePlaceholder: "e.g. Laptop, Tutor",
        descriptionPlaceholder: "Describe what you're looking for in detail",
        pricePlaceholder: "Your budget",
        locationPlaceholder: "e.g. Girne, Lefkoşa",
        priceLabel: "Budget*",
        additionalFields: [],
      };
  }
};
