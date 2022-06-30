import sanityClient from "@sanity/client";

export default sanityClient({
  projectId: import.meta.env.VITE_SANITY_PROJECT_ID,
  dataset: import.meta.env.VITE_SANITY_PROJECT_DATASET,
  apiVersion: "2021-03-25",
  useCdn: true,
});
