import sanityClient from "@sanity/client";

export default sanityClient({
  projectId: import.meta.env.VITE_SANITY_PROJECT_ID,
  dataset: import.meta.env.VITE_SANITY_PROJECT_DATASET,
  apiVersion: "2021-03-25",
  useCdn: true,
  token:"sk6VGiZfk3cYiZD8zn4AJznfCXXF7R8w5qF7G2jwczXxlBnC9FIhO2ezIbohkRWGvLOQpoqqAwY5oAucn49JOIdVxDZ4cidEoPcTcZyHEAQ5y4lOLVaZPt8n23Ln3ygl0cnnhtiUvBJJ3ErzZxzWChwPW8GrOIEVYL18ucfnHlzzFC0ccZJY"
});
