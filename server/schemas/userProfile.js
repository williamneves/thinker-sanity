export default {
	title: 'UserProfile',
	name: 'userProfile',
	type: 'document',
	fields: [
		{
			// this is a hidden field that is used to store the user's id
			title: 'AuthUserID',
			name: 'authUID',
			type: 'string',
			validation: (Rule) => Rule.required(),
		},
		{
			title: 'Name',
			name: 'name',
			type: 'string',
			validation: (Rule) => [
				Rule.required().error('Name is required'),
				Rule.min(3).error('Name is required and must be at least 3 characters long'),
			],
		},
		{
			title: 'Email',
			name: 'email',
			type: 'string',
			validation: (Rule) => [
				Rule.required().error('Email is required'),
				Rule.email().error('Email is required and must be a valid email address'),
			],
		},
		{
			title: 'Profile Image',
			name: 'profileImage',
			type: 'string',
		},
		{
			title: 'Profile Image 2',
			name: 'profileImage2',
			type: 'image',
		},

		{
			title: 'Role',
			name: 'role',
      type: 'string',
			// Initial value for the role field
			// List options for the user's role
		},
	],
};
