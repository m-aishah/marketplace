export const getFormConfig = (listingType) => {
  switch (listingType) {
    case "apartments":
      return {
        title: "Apartment",
        namePlaceholder: "e.g. Cozy Studio in Downtown",
        descriptionPlaceholder:
          "Describe the apartment, its features, and location",
        pricePlaceholder: "Rent amount",
        priceLabel: "Rent*",
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
        namePlaceholder: "e.g. Vintage Watch",
        descriptionPlaceholder:
          "Describe the item, its condition, and any unique features",
        pricePlaceholder: "Price",
        priceLabel: "Price*",
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
        priceLabel: "Budget*",
        additionalFields: [],
      };
  }
};

// const getFormConfig = () => {
//   switch (listingType) {
//     case "apartments":
//       return {
//         title: "Apartment",
//         namePlaceholder: "e.g. Cozy Studio in Downtown",
//         descriptionPlaceholder:
//           "Describe the apartment, its features, and location",
//         pricePlaceholder: "Rent amount",
//         priceLabel: "Rent*",
//         additionalFields: [
//           {
//             ref: paymentTypeRef,
//             label: "Payment type*",
//             type: "text",
//             placeholder: "e.g Daily, Weekly, Monthly, ...",
//             required: true,
//           },
//           {
//             ref: bedroomsRef,
//             label: "Bedrooms*",
//             type: "number",
//             placeholder: "Number of bedrooms",
//             required: true,
//           },
//           {
//             ref: bathroomsRef,
//             label: "Bathrooms*",
//             type: "number",
//             placeholder: "Number of bathrooms",
//             required: true,
//           },
//         ],
//       };
//     case "products":
//       return {
//         title: "Product",
//         namePlaceholder: "e.g. Vintage Watch",
//         descriptionPlaceholder:
//           "Describe the item, its condition, and any unique features",
//         pricePlaceholder: "Price",
//         priceLabel: "Price*",
//         additionalFields: [
//           {
//             ref: conditionRef,
//             label: "Condition*",
//             type: "text",
//             placeholder: "e.g. New, Used, Like New",
//             required: true,
//           },
//           {
//             ref: brandRef,
//             label: "Brand",
//             type: "text",
//             placeholder: "e.g Apple, Samsung",
//             required: false,
//           },
//         ],
//       };
//     case "services":
//       return {
//         title: "Service",
//         namePlaceholder: "e.g. Web Development",
//         descriptionPlaceholder: "Describe your service and experience",

//         pricePlaceholder: "Hourly rate or fixed price",
//         priceLabel: "Price*",
//         additionalFields: [
//           {
//             ref: servicePaymentTypeRef,
//             label: "Payment Type*",
//             type: "text",
//             placeholder: "e.g one-time, hourly, ...",
//             required: true,
//           },
//         ],
//       };
//     default:
//       return {
//         title: "Request",
//         namePlaceholder: "e.g. Laptop, Tutor",
//         descriptionPlaceholder: "Describe what you're looking for in detail",
//         pricePlaceholder: "Your budget",
//         priceLabel: "Budget*",
//         additionalFields: [],
//       };
//   }
// };
// const formConfig = getFormConfig();
