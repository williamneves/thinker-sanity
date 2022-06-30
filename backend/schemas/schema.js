// First, we must import the schema creator
import createSchema from "part:@sanity/base/schema-creator";

// Then import schema types from any plugins that might expose them
import schemaTypes from "all:part:@sanity/base/schema-type";

// Then we give our schema to the builder and provide the result to Sanity
export default createSchema({
  // We name our schema
  name: "userProfile",
  // Then proceed to concatenate our document type
  // to the ones provided by any plugins that are installed
  types: schemaTypes.concat([
    /* Your types here! */
    {
      title: "UserProfile",
      name: "userProfile",
      type: "document",
      fields: [
        {
          // this is a hidden field that is used to store the user's id
          title: "AuthUserID",
          name: "authUID",
          type: "string",
          hidden: true,
          initialValue: "123456789",
          validation: (Rule) => Rule.required(),
        },
        {
          title: "Name",
          name: "name",
          type: "string",
          validation: (Rule) => [
            Rule.required().error("Name is required"),
            Rule.min(3).error(
              "Name is required and must be at least 3 characters long"
            ),
          ],
        },
        {
          title: "Email",
          name: "email",
          type: "string",
          validation: (Rule) => [
            Rule.required().error("Email is required"),
            Rule.email().error(
              "Email is required and must be a valid email address"
            ),
          ],
        },
        {
          title: "Profile Image",
          name: "profileImage",
          type: "image",
        },
        {
          title: "Role",
          name: "role",
          type: "string",
          // Initial value for the role field
          initialValue: "user",
          hidden: true,
          // List options for the user's role
        },
      ],
    },
  ]),
});
